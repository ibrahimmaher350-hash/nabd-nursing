/**
 * src/lib/google/calendar.ts
 * Google Calendar REST API Client for Nabd Clinic appointments.
 * Handles automatic Google Meet link generation and instant calendar updates.
 * 
 * ASSUMPTION: Timezone is 'Africa/Cairo'.
 * ASSUMPTION: Primary calendar is used.
 */

import { getValidAccessToken } from './sheets';

export interface CalendarEventParams {
  title: string;
  description: string;
  startAt: string; // ISO string
  endAt: string;   // ISO string
  patientEmail: string;
  patientName: string;
  location?: string;
  calendarId?: string;
  accessToken?: string;
}

export interface CalendarEventResult {
  eventId: string;
  meetLink?: string;
  htmlLink?: string;
}

/**
 * Creates a Google Calendar event with attendees and Meet link
 */
export async function createEvent(params: CalendarEventParams): Promise<CalendarEventResult> {
  const token = params.accessToken || (await getValidAccessToken());
  const calendarId = params.calendarId || process.env.GOOGLE_CALENDAR_ID || 'primary';

  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?conferenceDataVersion=1`;

  const attendees: Array<{ email: string; displayName?: string }> = [];
  if (params.patientEmail && params.patientEmail.includes('@')) {
    attendees.push({ email: params.patientEmail, displayName: params.patientName });
  }

  const ownerEmail = process.env.OWNER_EMAIL;
  if (ownerEmail && ownerEmail.includes('@') && ownerEmail !== params.patientEmail) {
    attendees.push({ email: ownerEmail, displayName: process.env.OWNER_NAME || 'نبض للتمريض' });
  }

  const body = {
    summary: `نبض: ${params.title}`,
    description: `${params.description}\n\nتم حجز هذا الموعد عبر منصة نبض للتمريض المنزلي (nabd-nursing.vercel.app)`,
    location: params.location || 'دمياط، مصر',
    start: {
      dateTime: params.startAt,
      timeZone: 'Africa/Cairo',
    },
    end: {
      dateTime: params.endAt,
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
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('[Google Calendar Error]', data);
    throw new Error(data.error?.message || 'Failed to create Google Calendar event');
  }

  const meetLink =
    data.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri ||
    data.hangoutLink ||
    undefined;

  return {
    eventId: data.id,
    meetLink,
    htmlLink: data.htmlLink,
  };
}

/**
 * Updates an existing Google Calendar event
 */
export async function updateEvent({
  eventId,
  startAt,
  endAt,
  title,
  description,
  calendarId = 'primary',
  accessToken,
}: {
  eventId: string;
  startAt?: string;
  endAt?: string;
  title?: string;
  description?: string;
  calendarId?: string;
  accessToken?: string;
}): Promise<void> {
  const token = accessToken || (await getValidAccessToken());
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

  const patchBody: any = {};
  if (title) patchBody.summary = `نبض: ${title}`;
  if (description) patchBody.description = description;
  if (startAt) patchBody.start = { dateTime: startAt, timeZone: 'Africa/Cairo' };
  if (endAt) patchBody.end = { dateTime: endAt, timeZone: 'Africa/Cairo' };

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
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
 * Deletes an event from Google Calendar (e.g. when an appointment is cancelled)
 */
export async function deleteEvent({
  eventId,
  calendarId = 'primary',
  accessToken,
}: {
  eventId: string;
  calendarId?: string;
  accessToken?: string;
}): Promise<void> {
  const token = accessToken || (await getValidAccessToken());
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

  await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
