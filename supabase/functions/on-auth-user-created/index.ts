// supabase/functions/on-auth-user-created/index.ts
// Triggered on auth.users insert to create profile and patient rows

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
    const { record } = payload;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const role = record.raw_user_meta_data?.role || 'patient';
    const fullName = record.raw_user_meta_data?.full_name || record.raw_user_meta_data?.name || 'مريض نبض';
    const phone = record.raw_user_meta_data?.phone || '';

    // Upsert into profiles
    await supabase.from('profiles').upsert({
      id: record.id,
      email: record.email,
      full_name: fullName,
      phone,
      role,
    });

    // Upsert into patients if role is patient
    if (role === 'patient') {
      await supabase.from('patients').upsert({
        user_id: record.id,
        email: record.email,
        full_name: fullName,
        phone,
      }, { onConflict: 'email' });
    }

    return new Response(JSON.stringify({ success: true }), {
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
