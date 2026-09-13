import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.116.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || 'نبض للتمريض المنزلي <onboarding@resend.dev>';
const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'nabd-clinic-super-secret-jwt-key-2026-cairo';
const SITE_URL = Deno.env.get('NEXT_PUBLIC_SITE_URL') || 'https://nabd-nursing.vercel.app';

// Helper: HMAC-SHA256 URL-safe token signing in Deno
async function signManageToken(appointmentId: string, email: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 30 * 86400;
  const payload = JSON.stringify({ appointmentId, email, exp });
  const payloadB64 = btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  const sigArray = Array.from(new Uint8Array(sigBuf));
  const sigB64 = btoa(String.fromCharCode.apply(null, sigArray)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return `${payloadB64}.${sigB64}`;
}

serve(async (_req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const nowIso = new Date().toISOString();

    // 1. Fetch pending reminder jobs due now
    const { data: jobs, error: jobsErr } = await supabase
      .from('reminder_jobs')
      .select('*, appointments(*)')
      .lte('fire_at', nowIso)
      .eq('sent', false)
      .eq('status', 'pending')
      .limit(20);

    if (jobsErr) {
      return new Response(JSON.stringify({ error: jobsErr.message }), { status: 500 });
    }

    if (!jobs || jobs.length === 0) {
      return new Response(JSON.stringify({ message: 'No pending reminders due', count: 0 }), { status: 200 });
    }

    const processed = [];

    for (const job of jobs) {
      const app = job.appointments;
      if (!app || app.status !== 'scheduled') {
        await supabase.from('reminder_jobs').update({ status: 'cancelled', sent: true }).eq('id', job.id);
        continue;
      }

      const token = await signManageToken(app.id, app.patient_email);
      const manageUrl = `${SITE_URL}/appointments/${app.id}/manage?token=${encodeURIComponent(token)}`;

      const dateObj = new Date(app.start_at);
      const dateStr = dateObj.toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const timeStr = dateObj.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hour12: true });

      const is24h = job.kind === '24h';
      const subject = is24h
        ? `تذكير بموعدك غداً مع نبض: ${app.visit_type || 'زيارة تمريضية'}`
        : `تنبيه: موعدك مع فريق نبض بعد ساعة واحدة (${timeStr})`;

      const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<body style="font-family: 'Cairo', Arial, sans-serif; background-color: #F8FAFC; padding: 20px; direction: rtl;">
  <div style="max-width: 580px; margin: 0 auto; background: #FFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden;">
    <div style="background: #07132B; padding: 24px; text-align: center; color: #FFF;">
      <h2 style="margin: 0; color: #D4AF37;">نبض للتمريض المنزلي 🩺</h2>
      <p style="margin: 4px 0 0 0; color: #94A3B8; font-size: 14px;">${subject}</p>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 16px; font-weight: bold;">أهلاً بك أ/ ${app.patient_name}،</p>
      <p>نذكرك بموعد زيارتك التمريضية القادمة المجدولة في <strong>${dateStr}</strong> الساعة <strong>${timeStr}</strong>.</p>
      <div style="background: #F1F5F9; padding: 16px; border-radius: 8px; margin: 16px 0; border-right: 4px solid #D4AF37;">
        <p style="margin: 4px 0;"><strong>الخدمة:</strong> ${app.visit_type}</p>
        <p style="margin: 4px 0;"><strong>العنوان:</strong> ${app.location || 'مسجل لدى نبض'}</p>
      </div>
      ${app.meet_link ? `<p><a href="${app.meet_link}" style="display:inline-block; background:#059669; color:#FFF; padding:10px 20px; border-radius:6px; text-decoration:none;">رابط اللقاء (Google Meet) 📹</a></p>` : ''}
      <p><a href="${manageUrl}" style="display:inline-block; background:#07132B; color:#FFF; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">تعديل أو إلغاء الموعد ⚙️</a></p>
    </div>
    <div style="background: #F8FAFC; padding: 14px; text-align: center; font-size: 12px; color: #64748B;">
      نبض للتمريض المنزلي — محافظة دمياط | 01099667065
    </div>
  </div>
</body>
</html>
      `.trim();

      // Dispatch via Resend
      if (RESEND_API_KEY) {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: [app.patient_email],
            subject,
            html,
          }),
        });

        if (resendRes.ok) {
          await supabase.from('reminder_jobs').update({ sent: true, status: 'sent' }).eq('id', job.id);
          await supabase.from('notification_log').insert([{
            appointment_id: app.id,
            user_id: app.patient_id,
            recipient_email: app.patient_email,
            subject,
            status: 'sent',
          }]);
          processed.push({ id: job.id, status: 'sent' });
        } else {
          const errData = await resendRes.json();
          await supabase.from('reminder_jobs').update({
            retry_count: (job.retry_count || 0) + 1,
            status: (job.retry_count || 0) >= 2 ? 'failed' : 'pending',
            error_message: JSON.stringify(errData),
          }).eq('id', job.id);
          processed.push({ id: job.id, status: 'retry', error: errData });
        }
      } else {
        // Simulated mode
        await supabase.from('reminder_jobs').update({ sent: true, status: 'sent' }).eq('id', job.id);
        processed.push({ id: job.id, status: 'simulated' });
      }
    }

    return new Response(JSON.stringify({ success: true, processed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
