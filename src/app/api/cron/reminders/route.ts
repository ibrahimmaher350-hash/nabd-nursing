import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import {
  sendEmail,
  render24hReminderEmail,
  render1hReminderEmail,
  AppointmentEmailData,
} from '@/lib/email/resend';

/**
 * GET or POST /api/cron/reminders
 * Processes due reminder jobs and dispatches Arabic emails via Resend
 */
export async function GET(request: Request) {
  return handleReminders(request);
}

export async function POST(request: Request) {
  return handleReminders(request);
}

async function handleReminders(request: Request) {
  try {
    const nowIso = new Date().toISOString();

    // 1. Fetch pending reminder jobs that are due
    const { data: jobs, error: jobsError } = await supabase
      .from('reminder_jobs')
      .select('*, appointments(*)')
      .lte('fire_at', nowIso)
      .eq('sent', false)
      .eq('status', 'pending')
      .limit(20);

    if (jobsError) {
      console.error('[Reminders Cron Error]', jobsError);
      return NextResponse.json({ error: jobsError.message }, { status: 500 });
    }

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ message: 'No pending reminders due at this time', processed: 0 });
    }

    const results = [];

    for (const job of jobs) {
      const app = job.appointments;
      if (!app || app.status !== 'scheduled') {
        // Mark job cancelled if appointment is cancelled or missing
        await supabase
          .from('reminder_jobs')
          .update({ status: 'cancelled', sent: true })
          .eq('id', job.id);
        continue;
      }

      const emailData: AppointmentEmailData = {
        id: app.id,
        patientName: app.patient_name,
        patientEmail: app.patient_email,
        patientPhone: app.patient_phone,
        title: app.title,
        visitType: app.visit_type,
        startAt: app.start_at,
        location: app.location,
        meetLink: app.meet_link,
        notes: app.notes,
      };

      const template =
        job.kind === '24h'
          ? render24hReminderEmail(emailData)
          : render1hReminderEmail(emailData);

      // Send email to patient
      const sendResult = await sendEmail({
        to: app.patient_email,
        subject: template.subject,
        html: template.html,
      });

      if (sendResult.success) {
        // Mark job as sent
        await supabase
          .from('reminder_jobs')
          .update({ sent: true, status: 'sent' })
          .eq('id', job.id);

        // Update appointment reminder flag
        const flagUpdate =
          job.kind === '24h'
            ? { reminder_24h_sent: true }
            : { reminder_1h_sent: true };

        await supabase.from('appointments').update(flagUpdate).eq('id', app.id);

        // Record in notification_log
        await supabase.from('notification_log').insert([
          {
            appointment_id: app.id,
            user_id: app.patient_id,
            recipient_email: app.patient_email,
            subject: template.subject,
            status: 'sent',
          },
        ]);

        results.push({ jobId: job.id, status: 'sent', recipient: app.patient_email });
      } else {
        // Increment retry count
        const newRetries = (job.retry_count || 0) + 1;
        const newStatus = newRetries >= 3 ? 'failed' : 'pending';

        await supabase
          .from('reminder_jobs')
          .update({
            retry_count: newRetries,
            status: newStatus,
            error_message: sendResult.error || 'Email dispatch failed',
          })
          .eq('id', job.id);

        await supabase.from('notification_log').insert([
          {
            appointment_id: app.id,
            user_id: app.patient_id,
            recipient_email: app.patient_email,
            subject: template.subject,
            status: 'failed',
            error: sendResult.error,
          },
        ]);

        results.push({ jobId: job.id, status: newStatus, error: sendResult.error });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      details: results,
    });
  } catch (err: any) {
    console.error('[Reminders Cron Exception]', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
