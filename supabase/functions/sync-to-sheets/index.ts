// supabase/functions/sync-to-sheets/index.ts
// Triggered by Supabase DB Webhook on INSERT / UPDATE of appointments, patients, blood_requests

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { table, record, type } = payload;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const sheetId = Deno.env.get('GOOGLE_SHEET_ID')!;
    const siteUrl = Deno.env.get('SITE_URL') || 'https://nabd-nursing.vercel.app';

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch Google OAuth Access Token
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('google_refresh_token')
      .eq('role', 'admin')
      .not('google_refresh_token', 'is', null)
      .limit(1)
      .single();

    if (!adminProfile?.google_refresh_token) {
      return new Response(JSON.stringify({ message: 'No Google refresh token found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call Next.js internal sync helper or Google Sheets directly
    const syncRes = await fetch(`${siteUrl}/api/sync/sheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        action: 'db_webhook',
        table,
        record,
        type,
      }),
    });

    const resJson = await syncRes.json();

    return new Response(JSON.stringify({ success: true, result: resJson }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
