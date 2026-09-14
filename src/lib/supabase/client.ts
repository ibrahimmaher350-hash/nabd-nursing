import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obaccodbtcaxjmkaxeye.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iYWNjb2RidGNheGpta2F4ZXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyOTIwMjMsImV4cCI6MjEwNDg2ODAyM30.mLcN7KkfZ8l0StujzEeOS8cB90kU80Sxp4SvzkhPPwY';

export const isSupabaseConfigured = Boolean(
  supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE'
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

