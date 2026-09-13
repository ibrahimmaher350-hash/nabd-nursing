/**
 * src/lib/email/resend.ts
 * Resend Email Integration & Branded Arabic RTL HTML Templates for Appointment Reminders.
 * 
 * ASSUMPTION: In development, sender is 'onboarding@resend.dev'.
 * ASSUMPTION: Owner receives a copy of critical booking updates.
 * ASSUMPTION: Timezone formatted for Cairo ('Africa/Cairo').
 */

import { signManageToken } from '@/lib/tokens';

export interface AppointmentEmailData {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  title: string;
  visitType: string;
  startAt: string; // ISO string
  location?: string | null;
  meetLink?: string | null;
  notes?: string | null;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

const VISIT_TYPE_LABELS: Record<string, string> = {
  home_visit: 'كشف وزيارة منزلية 🩺',
  nursing_care: 'متابعة وتمريض منزلي 💉',
  consultation: 'استشارة طبية وتوجيه 📋',
  blood_donation: 'موعد تبرع بالدم 🩸',
};

/**
 * Format ISO date string into Arabic Cairo localized string
 */
function formatArabicDateTime(isoString: string): { dateStr: string; timeStr: string } {
  try {
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString('ar-EG', {
      timeZone: 'Africa/Cairo',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = d.toLocaleTimeString('ar-EG', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return { dateStr, timeStr };
  } catch {
    return { dateStr: isoString, timeStr: '' };
  }
}

/**
 * Sends an email via Resend API
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'نبض للتمريض المنزلي <onboarding@resend.dev>';

  if (!apiKey) {
    console.warn('[Resend] RESEND_API_KEY is not set. Email dispatch simulated.');
    return { success: true, id: `mock-${Date.now()}` };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Resend Error]', data);
      return { success: false, error: data?.message || 'Failed to send email' };
    }

    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('[Resend Exception]', err);
    return { success: false, error: err?.message || 'Network error sending email' };
  }
}

/**
 * Generate 24-Hour Reminder HTML Template
 */
export function render24hReminderEmail(app: AppointmentEmailData): { subject: string; html: string } {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app';
  const token = signManageToken(app.id, app.patientEmail);
  const manageUrl = `${baseUrl}/appointments/${app.id}/manage?token=${encodeURIComponent(token)}`;
  const { dateStr, timeStr } = formatArabicDateTime(app.startAt);
  const visitLabel = VISIT_TYPE_LABELS[app.visitType] || app.visitType || 'خدمة تمريضية';

  const subject = `تذكير بموعدك غداً مع نبض: ${visitLabel}`;

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 0; color: #1E293B; direction: rtl; }
    .container { max-width: 600px; margin: 24px auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(7, 19, 43, 0.08); border: 1px solid #E2E8F0; }
    .header { background: linear-gradient(135deg, #07132B 0%, #0F2756 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
    .logo-badge { display: inline-block; background: #D4AF37; color: #07132B; padding: 4px 14px; border-radius: 9999px; font-weight: 800; font-size: 13px; margin-bottom: 12px; }
    .header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 900; color: #FFFFFF; }
    .header p { margin: 0; color: #94A3B8; font-size: 14px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 16px; font-weight: 700; color: #07132B; margin-bottom: 16px; }
    .card { background: #F1F5F9; border-radius: 12px; padding: 20px; margin-bottom: 24px; border-right: 4px solid #D4AF37; }
    .card-row { margin-bottom: 12px; font-size: 14px; line-height: 1.6; }
    .card-row:last-child { margin-bottom: 0; }
    .label { font-weight: 800; color: #475569; display: inline-block; width: 110px; }
    .val { font-weight: 700; color: #0F172A; }
    .btn-manage { display: block; text-align: center; background: #07132B; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 15px; margin: 24px 0 12px 0; }
    .btn-meet { display: block; text-align: center; background: #059669; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; margin-bottom: 12px; }
    .footer { background: #F8FAFC; padding: 20px 24px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #64748B; line-height: 1.6; }
    .emergency { color: #DC2626; font-weight: 800; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">نبض للتمريض المنزلي 🩺</div>
      <h1>تذكير بموعد الزيارة غداً</h1>
      <p>خدمات التمريض والرعاية المنزلية المعتمدة — دمياط</p>
    </div>
    <div class="content">
      <div class="greeting">أهلاً بك أ/ ${app.patientName}،</div>
      <p style="font-size: 14px; line-height: 1.7; color: #334155;">
        نود تذكيرك بأن موعد زيارتك التمريضية القادمة مع فريق نبض مجدول <strong>غداً</strong>. يرجى مراجعة التفاصيل أدناه للتأكد من جاهزيتكم:
      </p>

      <div class="card">
        <div class="card-row"><span class="label">نوع الخدمة:</span> <span class="val">${visitLabel}</span></div>
        <div class="card-row"><span class="label">اليوم والتاريخ:</span> <span class="val">${dateStr}</span></div>
        <div class="card-row"><span class="label">التوقيت التقريبي:</span> <span class="val">${timeStr} (بتوقيت القاهرة)</span></div>
        ${app.location ? `<div class="card-row"><span class="label">العنوان:</span> <span class="val">${app.location}</span></div>` : ''}
        ${app.notes ? `<div class="card-row"><span class="label">ملاحظات الحالة:</span> <span class="val">${app.notes}</span></div>` : ''}
      </div>

      ${app.meetLink ? `<a href="${app.meetLink}" class="btn-meet" target="_blank">رابط اللقاء المرئي (Google Meet) 📹</a>` : ''}

      <a href="${manageUrl}" class="btn-manage" target="_blank">إدارة أو تعديل أو إلغاء الموعد ⚙️</a>

      <p style="font-size: 12px; color: #64748B; text-align: center; margin-top: 16px;">
        يمكنك من خلال الرابط أعلاه تأكيد العنوان، أو تغيير الموعد، أو إلغائه بضغطة زر واحدة دون الحاجة لتسجيل الدخول.
      </p>
    </div>
    <div class="footer">
      <p>نبض للتمريض المنزلي — محافظة دمياط | للاستفسارات السريعة: <strong>01099667065</strong></p>
      <p class="emergency">في حالات الطوارئ القصوى والإنعاش، يرجى الاتصال بالإسعاف فوراً (123).</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}

/**
 * Generate 1-Hour Urgent Reminder HTML Template
 */
export function render1hReminderEmail(app: AppointmentEmailData): { subject: string; html: string } {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app';
  const token = signManageToken(app.id, app.patientEmail);
  const manageUrl = `${baseUrl}/appointments/${app.id}/manage?token=${encodeURIComponent(token)}`;
  const { dateStr, timeStr } = formatArabicDateTime(app.startAt);
  const visitLabel = VISIT_TYPE_LABELS[app.visitType] || app.visitType || 'خدمة تمريضية';

  const subject = `تنبيه: موعدك مع فريق نبض بعد ساعة واحدة (${timeStr})`;

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FEF2F2; margin: 0; padding: 0; color: #1E293B; direction: rtl; }
    .container { max-width: 600px; margin: 24px auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(185, 28, 28, 0.1); border: 1px solid #FECACA; }
    .header { background: linear-gradient(135deg, #991B1B 0%, #DC2626 100%); padding: 32px 24px; text-align: center; color: #FFFFFF; }
    .badge { display: inline-block; background: #FEF08A; color: #78350F; padding: 4px 14px; border-radius: 9999px; font-weight: 900; font-size: 13px; margin-bottom: 12px; }
    .header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 900; color: #FFFFFF; }
    .header p { margin: 0; color: #FEE2E2; font-size: 14px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 16px; font-weight: 700; color: #991B1B; margin-bottom: 16px; }
    .urgent-box { background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 12px; padding: 18px; margin-bottom: 20px; font-size: 14px; line-height: 1.6; color: #92400E; font-weight: 700; text-align: center; }
    .card { background: #F8FAFC; border-radius: 12px; padding: 20px; margin-bottom: 24px; border-right: 4px solid #DC2626; }
    .card-row { margin-bottom: 12px; font-size: 14px; line-height: 1.6; }
    .card-row:last-child { margin-bottom: 0; }
    .label { font-weight: 800; color: #64748B; display: inline-block; width: 110px; }
    .val { font-weight: 700; color: #0F172A; }
    .btn-manage { display: block; text-align: center; background: #07132B; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 15px; margin: 20px 0 12px 0; }
    .btn-meet { display: block; text-align: center; background: #059669; color: #FFFFFF !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; margin-bottom: 12px; }
    .footer { background: #F8FAFC; padding: 20px 24px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #64748B; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">تنبيه الموعد خلال ساعة ⏰</div>
      <h1>مقدم الخدمة في الطريق إليك قريباً</h1>
      <p>فريق نبض للتمريض المنزلي يستعد للزيارة</p>
    </div>
    <div class="content">
      <div class="greeting">مرحباً أ/ ${app.patientName}،</div>
      
      <div class="urgent-box">
        موعد زيارتكم محدد في تمام الساعة <strong>${timeStr}</strong> اليوم (${dateStr}).
      </div>

      <div class="card">
        <div class="card-row"><span class="label">الخدمة المطلوبة:</span> <span class="val">${visitLabel}</span></div>
        <div class="card-row"><span class="label">العنوان المحدد:</span> <span class="val">${app.location || 'العنوان المسجل لدى نبض'}</span></div>
        <div class="card-row"><span class="label">هاتف المريض:</span> <span class="val">${app.patientPhone}</span></div>
      </div>

      ${app.meetLink ? `<a href="${app.meetLink}" class="btn-meet" target="_blank">رابط اللقاء الطبي المباشر (Google Meet) 📹</a>` : ''}

      <a href="${manageUrl}" class="btn-manage" target="_blank">تعديل أو إلغاء الموعد أو تحديث العنوان ⚙️</a>
    </div>
    <div class="footer">
      <p>فريق نبض جاهز لخدمتكم | للتواصل الهاتفي الفوري: <strong>01099667065</strong></p>
      <p>إذا طرأ أي طارئ يستدعي تأجيل الزيارة، يرجى الضغط على زر التعديل أو الاتصال بنا فوراً.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}
