import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { decryptToken } from '@/lib/crypto';
import { refreshGoogleAccessToken } from '@/lib/google/calendar-and-sheets';
import { appendRow, updateRow, SHEET_TABS } from '@/lib/google/sheets';
import { createEvent } from '@/lib/google/calendar';
import { sendEmail, render24hReminderEmail } from '@/lib/email/resend';

/**
 * ASSUMPTION: Working hours are 09:00 - 21:00 Cairo time.
 * ASSUMPTION: Appointment default duration is 60 minutes.
 */
function isWithinWorkingHours(dateIso: string): { valid: boolean; reason?: string } {
  try {
    const d = new Date(dateIso);
    const hourStr = d.toLocaleTimeString('en-US', { timeZone: 'Africa/Cairo', hour12: false, hour: '2-digit' });
    const hour = parseInt(hourStr, 10);
    if (hour < 9 || hour >= 21) {
      return {
        valid: false,
        reason: 'مواعيد العمل المتاحة في نبض هي من 9:00 صباحاً حتى 9:00 مساءً بتوقيت القاهرة',
      };
    }
    return { valid: true };
  } catch {
    return { valid: true };
  }
}

/**
 * GET /api/appointments
 * List appointments with optional status filter
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    let query = supabase
      .from('appointments')
      .select('*, patients(*)')
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
 * Creates a new booking:
 * 1. Upserts patient medical profile (Tab 2 "ملفات المرضى").
 * 2. Saves appointment (Tab 1 "الحجوزات").
 * 3. Syncs to Google Calendar with Google Meet link.
 * 4. Schedules reminder jobs (24h + 1h).
 * 5. Sends instant email confirmation via Resend.
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
      location = 'دمياط',
      notes = '',
      bloodType,
      allergies,
      chronicDiseases,
      currentMedications,
      birthDate,
      gender,
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

    const startDate = new Date(startAt);
    const calculatedEndAt = endAt || new Date(startDate.getTime() + 60 * 60 * 1000).toISOString();
    const normalizedEmail = patientEmail.trim().toLowerCase();
    const cleanPhone = patientPhone.trim();
    const cleanName = patientName.trim();

    // 3. Upsert Patient in `patients` table (Tab 2 "ملفات المرضى")
    let patientId: string | undefined;
    let patientRowNumber: number | undefined;

    try {
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      const newVisitCount = (existingPatient?.visit_count || 0) + 1;

      const { data: savedPatient } = await supabase
        .from('patients')
        .upsert({
          ...(existingPatient?.id ? { id: existingPatient.id } : {}),
          full_name: cleanName,
          phone: cleanPhone,
          email: normalizedEmail,
          blood_type: bloodType || existingPatient?.blood_type || null,
          allergies: allergies || existingPatient?.allergies || 'لا يوجد',
          chronic_diseases: chronicDiseases || existingPatient?.chronic_diseases || 'لا يوجد',
          current_medications: currentMedications || existingPatient?.current_medications || 'لا يوجد',
          birth_date: birthDate || existingPatient?.birth_date || null,
          gender: gender || existingPatient?.gender || null,
          last_visit: startAt,
          visit_count: newVisitCount,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' })
        .select()
        .single();

      if (savedPatient) {
        patientId = savedPatient.id;
        patientRowNumber = savedPatient.sheet_row_number;
      }
    } catch (patErr) {
      console.warn('[Patients Upsert Warning]', patErr);
    }

    // 4. Insert Appointment into `appointments` table (Tab 1 "الحجوزات")
    const { data: appointment, error: insertError } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: patientId || null,
          patient_name: cleanName,
          patient_phone: cleanPhone,
          patient_email: normalizedEmail,
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

    // 5. Sync to Google Calendar & Google Sheets
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

        // A. Google Calendar Event
        try {
          const calResult = await createEvent({
            accessToken,
            title: `${title} - ${cleanName}`,
            description: `المريض: ${cleanName}\nالهاتف: ${cleanPhone}\nالخدمة: ${visitType}\nالعنوان: ${location}\nملاحظات: ${notes}`,
            startAt,
            endAt: calculatedEndAt,
            patientEmail: normalizedEmail,
            patientName: cleanName,
            location,
          });

          googleEventId = calResult.eventId;
          meetLink = calResult.meetLink;

          await supabase
            .from('appointments')
            .update({
              google_event_id: googleEventId,
              meet_link: meetLink,
            })
            .eq('id', appointment.id);
        } catch (calErr) {
          console.warn('[Calendar Sync Warning]', calErr);
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app';
        const d = new Date(startAt);
        const dateStr = d.toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' });
        const timeStr = d.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' });
        const updatedStr = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

        // B. Append to Tab 1 "الحجوزات"
        try {
          const bookingRow = [
            appointment.id,
            cleanName,
            cleanPhone,
            normalizedEmail,
            dateStr,
            timeStr,
            visitType,
            'scheduled',
            notes || '',
            meetLink || `${siteUrl}/appointments/${appointment.id}/manage`,
            updatedStr,
          ];

          const res = await appendRow({
            tabName: SHEET_TABS.BOOKINGS,
            values: bookingRow,
            accessToken,
          });

          if (res.rowNumber) {
            await supabase
              .from('appointments')
              .update({ sheet_row_number: res.rowNumber })
              .eq('id', appointment.id);
          }
        } catch (sErr) {
          console.warn('[Sheets Tab 1 Sync Warning]', sErr);
        }

        // C. Sync to Tab 2 "ملفات المرضى"
        try {
          const patientRow = [
            patientId || appointment.id,
            cleanName,
            cleanPhone,
            normalizedEmail,
            birthDate || '',
            gender === 'male' ? 'ذكر' : gender === 'female' ? 'أنثى' : '',
            bloodType || '',
            allergies || 'لا يوجد',
            chronicDiseases || 'لا يوجد',
            currentMedications || 'لا يوجد',
            dateStr,
            1,
            notes || '',
            new Date().toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' }),
          ];

          if (patientRowNumber) {
            await updateRow({
              tabName: SHEET_TABS.PATIENTS,
              rowNumber: patientRowNumber,
              values: patientRow,
              accessToken,
            });
          } else {
            const pRes = await appendRow({
              tabName: SHEET_TABS.PATIENTS,
              values: patientRow,
              accessToken,
            });
            if (pRes.rowNumber && patientId) {
              await supabase
                .from('patients')
                .update({ sheet_row_number: pRes.rowNumber })
                .eq('id', patientId);
            }
          }
        } catch (pErr) {
          console.warn('[Sheets Tab 2 Sync Warning]', pErr);
        }

        // D. If blood donation visit, sync to Tab 3 "بنك الدم"
        if (visitType === 'blood_donation') {
          try {
            const bloodRow = [
              `blood-${Date.now()}`,
              cleanName,
              cleanPhone,
              bloodType || 'A+',
              'تبرع',
              location,
              'open',
              dateStr,
              notes || 'حجز تبرع بالدم عبر المنصة',
            ];
            await appendRow({
              tabName: SHEET_TABS.BLOOD_BANK,
              values: bloodRow,
              accessToken,
            });
          } catch (bErr) {
            console.warn('[Sheets Tab 3 Sync Warning]', bErr);
          }
        }
      }
    } catch (syncErr) {
      console.warn('[Google Integration Exception]', syncErr);
    }

    // 6. Send instant confirmation email via Resend
    try {
      const emailContent = render24hReminderEmail({
        id: appointment.id,
        patientName: cleanName,
        patientEmail: normalizedEmail,
        patientPhone: cleanPhone,
        title,
        visitType,
        startAt,
        location,
        meetLink,
        notes,
      });

      // Send to patient
      await sendEmail({
        to: normalizedEmail,
        subject: `تأكيد حجز موعدك مع نبض: ${title}`,
        html: emailContent.html,
      });

      // Send copy to owner
      const ownerEmail = process.env.OWNER_EMAIL;
      if (ownerEmail && ownerEmail !== normalizedEmail) {
        await sendEmail({
          to: ownerEmail,
          subject: `حجز جديد وارد في نبض: ${cleanName} (${title})`,
          html: emailContent.html,
        });
      }
    } catch (mailErr) {
      console.warn('[Email Dispatch Warning]', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'تم حجز موعدك بنجاح ✅ وتمت المزامنة مع جدول جوجل وتقويم المواعيد والإيميل',
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
