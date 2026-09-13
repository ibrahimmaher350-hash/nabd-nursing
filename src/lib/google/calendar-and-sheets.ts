/**
 * src/lib/google/calendar-and-sheets.ts
 * Unified Google Calendar & Google Sheets integration module.
 * Direct REST API implementation using OAuth tokens (No bulky external packages needed).
 * 
 * ASSUMPTION: Timezone is 'Africa/Cairo'.
 * ASSUMPTION: Google Calendar ID defaults to 'primary'.
 * ASSUMPTION: Google Sheet columns: [التاريخ, الوقت, اسم المريض, الهاتف, نوع الزيارة, الحالة, رابط الموعد, معرف الحجز]
 */

export interface GoogleTokens {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type?: string;
}

export interface CalendarEventResult {
  eventId: string;
  meetLink?: string;
  htmlLink?: string;
}

/**
 * Exchanges a Google refresh token for a fresh short-lived access token
 */
export async function refreshGoogleAccessToken(refreshToken: string): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth Client ID or Client Secret is missing from environment variables');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Failed to refresh Google access token');
  }

  return data.access_token;
}

/**
 * Creates a Google Calendar event with attendees and automatic Google Meet link
 */
export async function createCalendarEvent({
  accessToken,
  title,
  description,
  startAt,
  endAt,
  patientEmail,
  patientName,
  calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary',
}: {
  accessToken: string;
  title: string;
  description: string;
  startAt: string; // ISO String
  endAt: string;   // ISO String
  patientEmail: string;
  patientName: string;
  calendarId?: string;
}): Promise<CalendarEventResult> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1`;

  const attendees: Array<{ email: string; displayName?: string }> = [];
  if (patientEmail && patientEmail.includes('@')) {
    attendees.push({ email: patientEmail, displayName: patientName });
  }
  const ownerEmail = process.env.OWNER_EMAIL;
  if (ownerEmail && ownerEmail.includes('@')) {
    attendees.push({ email: ownerEmail, displayName: process.env.OWNER_NAME || 'نبض للتمريض' });
  }

  const body = {
    summary: `نبض: ${title}`,
    description: `${description}\n\nتم الحجز عبر منصة نبض للتمريض المنزلي (nabd-nursing.vercel.app)`,
    start: {
      dateTime: startAt,
      timeZone: 'Africa/Cairo',
    },
    end: {
      dateTime: endAt,
      timeZone: 'Africa/Cairo',
    },
    attendees,
    conferenceData: {
      createRequest: {
        requestId: `nabd-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 60 },
      ],
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Google Calendar Error]', data);
    throw new Error(data.error?.message || 'Failed to create Google Calendar event');
  }

  const meetLink = data.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri;

  return {
    eventId: data.id,
    meetLink: meetLink || data.hangoutLink || undefined,
    htmlLink: data.htmlLink,
  };
}

/**
 * Updates an existing Google Calendar event (for rescheduling or title change)
 */
export async function updateCalendarEvent({
  accessToken,
  eventId,
  startAt,
  endAt,
  title,
  calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary',
}: {
  accessToken: string;
  eventId: string;
  startAt?: string;
  endAt?: string;
  title?: string;
  calendarId?: string;
}): Promise<void> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

  const patchBody: any = {};
  if (title) patchBody.summary = `نبض: ${title}`;
  if (startAt) patchBody.start = { dateTime: startAt, timeZone: 'Africa/Cairo' };
  if (endAt) patchBody.end = { dateTime: endAt, timeZone: 'Africa/Cairo' };

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patchBody),
  });

  if (!response.ok) {
    const data = await response.json();
    console.error('[Google Calendar Update Error]', data);
  }
}

/**
 * Deletes a Google Calendar event (e.g. on appointment cancellation)
 */
export async function deleteCalendarEvent({
  accessToken,
  eventId,
  calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary',
}: {
  accessToken: string;
  eventId: string;
  calendarId?: string;
}): Promise<void> {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

  await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
}

/**
 * Appends a booking row into Google Sheets
 * Columns: [التاريخ, الوقت, اسم المريض, الهاتف, نوع الزيارة, الحالة, رابط الموعد, معرف الحجز]
 */
export async function appendToGoogleSheet({
  accessToken,
  sheetId = process.env.GOOGLE_SHEET_ID,
  appointment,
}: {
  accessToken?: string;
  sheetId?: string;
  appointment: {
    id: string;
    patientName: string;
    patientPhone: string;
    visitType: string;
    startAt: string;
    status: string;
    meetLink?: string | null;
  };
}): Promise<boolean> {
  const dateObj = new Date(appointment.startAt);
  const dateStr = dateObj.toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' });
  const timeStr = dateObj.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app';
  const manageUrl = `${siteUrl}/dashboard`;

  const rowValues = [
    dateStr,
    timeStr,
    appointment.patientName,
    appointment.patientPhone,
    appointment.visitType,
    appointment.status === 'scheduled' ? 'مؤكد ومجدول' : appointment.status,
    appointment.meetLink || manageUrl,
    appointment.id,
  ];

  // Method 1: Google Sheets REST API if sheetId & accessToken are present
  if (sheetId && accessToken) {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/A1:append?valueInputOption=USER_ENTERED`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      });

      if (res.ok) return true;
      const err = await res.json();
      console.warn('[Google Sheets API Error]', err);
    } catch (e) {
      console.warn('[Google Sheets API Exception]', e);
    }
  }

  // Method 2: Fallback to existing Google Apps Script Webhook if configured
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_visit',
          data: {
            patient_id: appointment.id,
            patient_name: appointment.patientName,
            date: appointment.startAt.split('T')[0],
            time: timeStr,
            service: appointment.visitType,
            nurse: 'طاقم نبض للتمريض',
            status: appointment.status === 'scheduled' ? 'مؤكدة ومجدولة' : appointment.status,
            notes: `الهاتف: ${appointment.patientPhone} | حجز مؤكد عبر منصة نبض`,
          },
        }),
      });
      return res.ok;
    } catch (e) {
      console.warn('[Google Sheets Webhook Fallback Exception]', e);
    }
  }

  return false;
}
