import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { decryptToken } from '@/lib/crypto';
import {
  refreshGoogleAccessToken,
  createCalendarEvent,
  appendToGoogleSheet,
} from '@/lib/google/calendar-and-sheets';

/**
 * ASSUMPTION: Working hours are 09:00 - 21:00 Cairo time.
 * ASSUMPTION: Appointment default duration is 60 minutes.
 */
function isWithinWorkingHours(dateIso: string): { valid: boolean; reason?: string } {
  const d = new Date(dateIso);
  // Format hour in Cairo timezone
  const hourStr = d.toLocaleTimeString('en-US', { timeZone: 'Africa/Cairo', hour12: false, hour: '2-digit' });
  const hour = parseInt(hourStr, 10);
  if (hour < 9 || hour >= 21) {
    return {
      valid: false,
      reason: 'مواعيد العمل المتاحة في نبض هي من 9:00 صباحاً حتى 9:00 مساءً بتوقيت القاهرة',
    };
  }
  return { valid: true };
}

/**
 * GET /api/appointments
 * List appointments with optional status/date filter
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let query = supabase
      .from('appointments')
      .select('*')
      .order('start_at', { ascending: false })
      .limit(limit);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointments: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/appointments
 * Creates a new booking, triggers calendar sync & google sheet record
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      patientName,
      patientPhone,
      patientEmail,
      title = 'زيارة تمريضية منزلية',
      visitType = 'home_visit',
      startAt,
      endAt,
      location = '',
      notes = '',
      patientId = null,
    } = body;

    // 1. Validate required fields
    if (!patientName || !patientPhone || !patientEmail || !startAt) {
      return NextResponse.json(
        { error: 'يرجى إكمال جميع الحقول المطلوبة (الاسم، الهاتف، البريد، والموعد)' },
        { status: 400 }
      );
    }

    // 2. Validate Cairo working hours (09:00 - 21:00)
    const hoursCheck = isWithinWorkingHours(startAt);
    if (!hoursCheck.valid) {
      return NextResponse.json({ error: hoursCheck.reason }, { status: 400 });
    }

    // Calculate endAt (default 60 minutes after start)
    const startDate = new Date(startAt);
    const calculatedEndAt = endAt || new Date(startDate.getTime() + 60 * 60 * 1000).toISOString();

    // 3. Insert appointment into Supabase
    const { data: appointment, error: insertError } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: patientId,
          patient_name: patientName.trim(),
          patient_phone: patientPhone.trim(),
          patient_email: patientEmail.trim().toLowerCase(),
          title: title.trim(),
          visit_type: visitType,
          start_at: startAt,
          end_at: calculatedEndAt,
          location: location.trim(),
          notes: notes.trim(),
          status: 'scheduled',
        },
      ])
      .select()
      .single();

    if (insertError || !appointment) {
      console.error('[Supabase Appointment Insert Error]', insertError);
      return NextResponse.json(
        { error: insertError?.message || 'تعذر حفظ الموعد في قاعدة البيانات' },
        { status: 500 }
      );
    }

    // 4. Background Sync: Google Calendar & Google Sheets
    // Fetch admin's google_refresh_token if available
    let googleEventId: string | undefined;
    let meetLink: string | undefined;

    try {
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('google_refresh_token')
        .eq('role', 'admin')
        .not('google_refresh_token', 'is', null)
        .limit(1)
        .single();

      if (adminProfile?.google_refresh_token) {
        const decryptedRefreshToken = decryptToken(adminProfile.google_refresh_token);
        const accessToken = await refreshGoogleAccessToken(decryptedRefreshToken);

        // Create Google Calendar event
        const calResult = await createCalendarEvent({
          accessToken,
          title: `${title} - ${patientName}`,
          description: `المريض: ${patientName}\nالهاتف: ${patientPhone}\nالخدمة: ${visitType}\nالعنوان: ${location}\nملاحظات: ${notes}`,
          startAt,
          endAt: calculatedEndAt,
          patientEmail,
          patientName,
        });

        googleEventId = calResult.eventId;
        meetLink = calResult.meetLink;

        // Update appointment with googleEventId and meetLink
        await supabase
          .from('appointments')
          .update({
            google_event_id: googleEventId,
            meet_link: meetLink,
          })
          .eq('id', appointment.id);

        // Append row to Google Sheet
        await appendToGoogleSheet({
          accessToken,
          appointment: {
            id: appointment.id,
            patientName,
            patientPhone,
            visitType,
            startAt,
            status: 'scheduled',
            meetLink,
          },
        });
      } else {
        // Fallback: Append via Google Apps Script Webhook
        await appendToGoogleSheet({
          appointment: {
            id: appointment.id,
            patientName,
            patientPhone,
            visitType,
            startAt,
            status: 'scheduled',
          },
        });
      }
    } catch (syncErr) {
      console.warn('[Appointment Google Sync Warning]', syncErr);
      // Even if Google sync encounters an error, the database appointment is saved
    }

    return NextResponse.json({
      success: true,
      message: 'تم حجز موعدك بنجاح ✅ ستصلك رسالة تأكيد وتذكير قبل الموعد',
      appointment: {
        ...appointment,
        google_event_id: googleEventId,
        meet_link: meetLink,
      },
    });
  } catch (err: any) {
    console.error('[Appointment Creation Exception]', err);
    return NextResponse.json(
      { error: err?.message || 'حدث خطأ غير متوقع أثناء معالجة الحجز' },
      { status: 500 }
    );
  }
}
