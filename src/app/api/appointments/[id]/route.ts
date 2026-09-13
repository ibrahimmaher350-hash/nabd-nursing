import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { verifyManageToken } from '@/lib/tokens';
import { decryptToken } from '@/lib/crypto';
import {
  refreshGoogleAccessToken,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '@/lib/google/calendar-and-sheets';

interface Params {
  params: { id: string };
}

/**
 * GET /api/appointments/[id]
 * Fetch appointment details by ID (verifying signed manage token or public id)
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // If token provided, verify it matches
    if (token) {
      const payload = verifyManageToken(token);
      if (!payload || payload.appointmentId !== id) {
        return NextResponse.json({ error: 'رابط المتابعة غير صالح أو منتهي الصلاحية' }, { status: 403 });
      }
    }

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !appointment) {
      return NextResponse.json({ error: 'الموعد غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ appointment });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/appointments/[id]
 * Reschedule or Cancel an appointment
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, startAt, endAt, notes, token } = body;

    // Verify token if provided
    if (token) {
      const payload = verifyManageToken(token);
      if (!payload || payload.appointmentId !== id) {
        return NextResponse.json({ error: 'رابط إدارة الموعد غير صالح أو منتهي' }, { status: 403 });
      }
    }

    // 1. Fetch current appointment
    const { data: currentApp, error: fetchErr } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !currentApp) {
      return NextResponse.json({ error: 'الموعد غير موجود' }, { status: 404 });
    }

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) updatePayload.status = status;
    if (notes !== undefined) updatePayload.notes = notes;
    if (startAt) {
      updatePayload.start_at = startAt;
      const startDate = new Date(startAt);
      updatePayload.end_at = endAt || new Date(startDate.getTime() + 60 * 60 * 1000).toISOString();
      // Reset reminder sent flags on reschedule
      updatePayload.reminder_24h_sent = false;
      updatePayload.reminder_1h_sent = false;
    }

    // 2. Update Supabase
    const { data: updatedApp, error: updateErr } = await supabase
      .from('appointments')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // 3. Sync with Google Calendar if event ID exists
    if (currentApp.google_event_id) {
      try {
        const { data: adminProfile } = await supabase
          .from('profiles')
          .select('google_refresh_token')
          .eq('role', 'admin')
          .not('google_refresh_token', 'is', null)
          .limit(1)
          .single();

        if (adminProfile?.google_refresh_token) {
          const decryptedToken = decryptToken(adminProfile.google_refresh_token);
          const accessToken = await refreshGoogleAccessToken(decryptedToken);

          if (status === 'cancelled') {
            await deleteCalendarEvent({
              accessToken,
              eventId: currentApp.google_event_id,
            });
          } else if (startAt) {
            await updateCalendarEvent({
              accessToken,
              eventId: currentApp.google_event_id,
              startAt: updatePayload.start_at,
              endAt: updatePayload.end_at,
              title: `${currentApp.title} - ${currentApp.patient_name} (معدّل)`,
            });
          }
        }
      } catch (calErr) {
        console.warn('[Calendar Sync on Update Warning]', calErr);
      }
    }

    // 4. Update reminder_jobs if rescheduled
    if (startAt && status !== 'cancelled') {
      const rem24h = new Date(new Date(startAt).getTime() - 24 * 60 * 60 * 1000).toISOString();
      const rem1h = new Date(new Date(startAt).getTime() - 60 * 60 * 1000).toISOString();

      await supabase
        .from('reminder_jobs')
        .delete()
        .eq('appointment_id', id)
        .eq('sent', false);

      const newJobs = [];
      if (new Date(rem24h) > new Date()) {
        newJobs.push({ appointment_id: id, fire_at: rem24h, kind: '24h', sent: false, status: 'pending' });
      }
      if (new Date(rem1h) > new Date()) {
        newJobs.push({ appointment_id: id, fire_at: rem1h, kind: '1h', sent: false, status: 'pending' });
      }

      if (newJobs.length > 0) {
        await supabase.from('reminder_jobs').insert(newJobs);
      }
    }

    return NextResponse.json({
      success: true,
      message: status === 'cancelled' ? 'تم إلغاء الموعد بنجاح' : 'تم تحديث الموعد بنجاح',
      appointment: updatedApp,
    });
  } catch (err: any) {
    console.error('[Appointment Update Exception]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
