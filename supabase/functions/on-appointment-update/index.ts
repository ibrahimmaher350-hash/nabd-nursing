import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.116.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') || '';
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') || '';
const GOOGLE_CALENDAR_ID = Deno.env.get('GOOGLE_CALENDAR_ID') || 'primary';
const ENCRYPTION_KEY = Deno.env.get('ENCRYPTION_KEY') || 'nabd-secret-encryption-key-32-chars-min-length-safe!';

async function decryptToken(encryptedText: string, secret: string): Promise<string> {
  const parts = encryptedText.split(':');
  if (parts.length !== 3) throw new Error('Invalid encrypted format');
  const [ivHex, authTagHex, dataHex] = parts;
  const hexToBuf = (hex: string) => new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  const iv = hexToBuf(ivHex);
  const authTag = hexToBuf(authTagHex);
  const data = hexToBuf(dataHex);
  const cipherWithTag = new Uint8Array(data.length + authTag.length);
  cipherWithTag.set(data);
  cipherWithTag.set(authTag, data.length);

  const keyHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  const cryptoKey = await crypto.subtle.importKey('raw', keyHash, { name: 'AES-GCM' }, false, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, cipherWithTag);
  return new TextDecoder().decode(decrypted);
}

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record || payload.new;
    const oldRecord = payload.old_record || payload.old || {};

    if (!record || !record.id) {
      return new Response(JSON.stringify({ error: 'No appointment record in webhook' }), { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. If cancelled, cancel unsent reminder jobs
    if (record.status === 'cancelled' && oldRecord.status !== 'cancelled') {
      await supabase
        .from('reminder_jobs')
        .update({ status: 'cancelled', sent: true })
        .eq('appointment_id', record.id)
        .eq('sent', false);
    }

    // 2. Google Calendar sync if event ID exists
    if (record.google_event_id) {
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('google_refresh_token')
        .eq('role', 'admin')
        .not('google_refresh_token', 'is', null)
        .limit(1)
        .single();

      if (adminProfile?.google_refresh_token) {
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
        if (tokenData.access_token) {
          const accessToken = tokenData.access_token;

          if (record.status === 'cancelled') {
            // Delete calendar event
            await fetch(
              `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events/${encodeURIComponent(record.google_event_id)}`,
              {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` },
              }
            );
          } else if (record.start_at !== oldRecord.start_at) {
            // Update calendar event
            await fetch(
              `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events/${encodeURIComponent(record.google_event_id)}`,
              {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  start: { dateTime: record.start_at, timeZone: 'Africa/Cairo' },
                  end: { dateTime: record.end_at, timeZone: 'Africa/Cairo' },
                  summary: `نبض: ${record.title} - ${record.patient_name} (معدّل)`,
                }),
              }
            );
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
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
