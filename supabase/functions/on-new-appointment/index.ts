// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This code runs on Supabase Edge Functions (Deno runtime)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.116.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || '';
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || '';
const GOOGLE_CALENDAR_ID = Deno.env.get('GOOGLE_CALENDAR_ID') || 'primary';
const GOOGLE_SHEET_ID = Deno.env.get('GOOGLE_SHEET_ID') || '';
const ENCRYPTION_KEY = Deno.env.get('ENCRYPTION_KEY') || 'nabd-secret-encryption-key-32-chars-min-length-safe!';

// Helper: decrypt AES-256-GCM token in Web Crypto
async function decryptToken(encryptedText: string, secret: string): Promise<string> {
  const parts = encryptedText.split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted format');
  const [ivHex, authTagHex, dataHex] = parts;

  const hexToBuf = (hex: string) => new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  const iv = hexToBuf(ivHex);
  const authTag = hexToBuf(authTagHex);
  const data = hexToBuf(dataHex);

  // Concat ciphertext + tag for Web Crypto AES-GCM
  const cipherWithTag = new Uint8Array(data.length + authTag.length);
  cipherWithTag.set(data);
  cipherWithTag.set(authTag, data.length);

  // Hash key to 32 bytes
  const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyHash,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    cipherWithTag
  );

  return new TextDecoder().decode(decrypted);
}

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record || payload.new || payload;

    if (!record || !record.id) {
      return new Response(JSON.stringify({ error: 'No appointment record in webhook payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Idempotency: If Google event ID is already set, skip
    if (record.google_event_id) {
      return new Response(JSON.stringify({ message: 'Google event already created', skipped: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Fetch admin's google_refresh_token
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('google_refresh_token')
      .eq('role', 'admin')
      .not('google_refresh_token', 'is', null)
      .limit(1)
      .single();

    if (!adminProfile?.google_refresh_token) {
      return new Response(JSON.stringify({ message: 'No admin Google account connected. Skipping Google sync.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Decrypt refresh token & get Google access token
    const refreshToken = await decryptToken(adminProfile.google_refresh_token, ENCRYPTION_KEY);

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(`Google token error: ${tokenData.error_description || tokenData.error}`);
    }

    const accessToken = tokenData.access_token;

    // 3. Create Google Calendar Event
    const calUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?conferenceDataVersion=1`;
    const attendees = [];
    if (record.patient_email && record.patient_email.includes('@')) {
      attendees.push({ email: record.patient_email, displayName: record.patient_name });
    }

    const calRes = await fetch(calUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: `نبض: ${record.title} - ${record.patient_name}`,
        description: `المريض: ${record.patient_name}\nالهاتف: ${record.patient_phone}\nالخدمة: ${record.visit_type}\nالعنوان: ${record.location || ''}\nملاحظات: ${record.notes || ''}\n\nحجز إلكتروني نبض للتمريض (nabd-nursing.vercel.app)`,
        start: { dateTime: record.start_at, timeZone: 'Africa/Cairo' },
        end: { dateTime: record.end_at, timeZone: 'Africa/Cairo' },
        attendees,
        conferenceData: {
          createRequest: {
            requestId: `nabd-edge-${record.id}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      }),
    });

    const calData = await calRes.json();
    const googleEventId = calData.id;
    const meetLink = calData.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri || calData.hangoutLink;

    // 4. Update appointment with google_event_id & meet_link
    await supabase
      .from('appointments')
      .update({
        google_event_id: googleEventId,
        meet_link: meetLink || null,
      })
      .eq('id', record.id);

    // 5. Append row to Google Sheets
    if (GOOGLE_SHEET_ID) {
      const dateObj = new Date(record.start_at);
      const dateStr = dateObj.toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo' });
      const timeStr = dateObj.toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' });

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(GOOGLE_SHEET_ID)}/values/A1:append?valueInputOption=USER_ENTERED`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [[
            dateStr,
            timeStr,
            record.patient_name,
            record.patient_phone,
            record.visit_type,
            'مؤكد ومجدول',
            meetLink || `https://nabd-nursing.vercel.app/dashboard`,
            record.id,
          ]],
        }),
      });
    }

    return new Response(JSON.stringify({ success: true, googleEventId, meetLink }), {
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
