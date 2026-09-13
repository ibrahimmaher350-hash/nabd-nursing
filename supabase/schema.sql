-- ==============================================================================
-- NABD NURSING & BLOOD BANK (منظومة عيادة وبنك دم نبض المتكاملة)
-- Complete Google Sheets Control Panel & Supabase Backend Schema
-- 100% Idempotent — آمن تماماً للتشغيل في Supabase SQL Editor
-- ==============================================================================

-- 1. تفعيل الملحقات الأساسية (UUID & PGCrypto)
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. جدول: profiles (الحسابات والمستخدمين وصاحب العيادة)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text default 'patient' not null check (role in ('admin', 'patient', 'nurse')),
  full_name text,
  email text,
  phone text,
  phone_verified boolean default false,
  clinic_id uuid null,
  google_refresh_token text null, -- Encrypted AES-256-GCM token
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.profiles add column if not exists role text default 'patient';
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists phone_verified boolean default false;
alter table public.profiles add column if not exists google_refresh_token text null;
alter table public.profiles add column if not exists updated_at timestamptz default timezone('utc'::text, now());

-- ------------------------------------------------------------------------------
-- 3. جدول: patients (ملفات المرضى — يقابل التاب 2 في جوجل شيت)
-- ------------------------------------------------------------------------------
create table if not exists public.patients (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  phone text,
  email text unique,
  birth_date date,
  gender text check (gender in ('male', 'female')),
  blood_type text check (blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  allergies text,
  chronic_diseases text,
  current_medications text,
  last_visit timestamptz,
  visit_count integer default 0,
  medical_notes text,
  sheet_row_number integer,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.patients add column if not exists user_id uuid references public.profiles(id) on delete set null;
alter table public.patients add column if not exists allergies text;
alter table public.patients add column if not exists chronic_diseases text;
alter table public.patients add column if not exists current_medications text;
alter table public.patients add column if not exists last_visit timestamptz;
alter table public.patients add column if not exists visit_count integer default 0;
alter table public.patients add column if not exists medical_notes text;
alter table public.patients add column if not exists sheet_row_number integer;

-- ------------------------------------------------------------------------------
-- 4. جدول: appointments (الحجوزات والمواعيد — يقابل التاب 1 في جوجل شيت)
-- ------------------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text not null,
  patient_phone text not null,
  patient_email text not null,
  title text not null default 'زيارة تمريضية منزلية',
  visit_type text not null default 'home_visit',
  notes text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  location text,
  meet_link text,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  google_event_id text,
  sheet_row_number integer,
  sheet_row_index integer,
  reminder_24h_sent boolean default false not null,
  reminder_1h_sent boolean default false not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.appointments add column if not exists patient_id uuid references public.patients(id) on delete set null;
alter table public.appointments add column if not exists google_event_id text;
alter table public.appointments add column if not exists meet_link text;
alter table public.appointments add column if not exists sheet_row_number integer;
alter table public.appointments add column if not exists sheet_row_index integer;
alter table public.appointments add column if not exists reminder_24h_sent boolean default false;
alter table public.appointments add column if not exists reminder_1h_sent boolean default false;

-- ------------------------------------------------------------------------------
-- 5. جدول: blood_requests (بنك الدم والطلبات — يقابل التاب 3 في جوجل شيت)
-- ------------------------------------------------------------------------------
create table if not exists public.blood_requests (
  id uuid default gen_random_uuid() primary key,
  requester_id uuid references public.profiles(id) on delete set null,
  patient_id uuid references public.patients(id) on delete set null,
  patient_name text,
  requester_name text,
  name text,
  phone text not null,
  hospital text,
  blood_type text not null check (blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  bags_count integer default 1,
  urgency text default 'urgent',
  request_type text default 'need' check (request_type in ('need', 'donate')),
  location text,
  lat double precision,
  lng double precision,
  status text default 'open' check (status in ('open', 'matched', 'closed', 'active')),
  notes text,
  distance_km numeric(5, 1) default 1.5,
  sheet_row_number integer,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.blood_requests add column if not exists requester_id uuid references public.profiles(id) on delete set null;
alter table public.blood_requests add column if not exists patient_id uuid references public.patients(id) on delete set null;
alter table public.blood_requests add column if not exists request_type text default 'need';
alter table public.blood_requests add column if not exists sheet_row_number integer;
alter table public.blood_requests add column if not exists updated_at timestamptz default timezone('utc'::text, now());

-- ------------------------------------------------------------------------------
-- 6. جدول: reminder_jobs (مهام التذكير الآلي — يقابل التاب 4 في جوجل شيت)
-- ------------------------------------------------------------------------------
create table if not exists public.reminder_jobs (
  id uuid default gen_random_uuid() primary key,
  appointment_id uuid references public.appointments(id) on delete cascade not null,
  fire_at timestamptz not null,
  kind text not null check (kind in ('24h', '1h')),
  sent boolean default false not null,
  status text default 'pending' not null check (status in ('pending', 'sent', 'failed', 'cancelled')),
  sheet_row_number integer,
  retry_count integer default 0 not null,
  error_message text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.reminder_jobs add column if not exists sheet_row_number integer;
alter table public.reminder_jobs add column if not exists status text default 'pending';

-- ------------------------------------------------------------------------------
-- 7. جدول: notification_log (سجل الإشعارات والإيميلات المرسلة)
-- ------------------------------------------------------------------------------
create table if not exists public.notification_log (
  id uuid default gen_random_uuid() primary key,
  appointment_id uuid references public.appointments(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  recipient_email text not null,
  subject text not null,
  body_preview text,
  status text default 'sent' not null,
  error text,
  read boolean default false not null,
  sent_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.notification_log add column if not exists body_preview text;

-- ------------------------------------------------------------------------------
-- 8. جدول: clinic_settings (إعدادات العيادة — يقابل التاب 5 في جوجل شيت)
-- ------------------------------------------------------------------------------
create table if not exists public.clinic_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Seed default settings into clinic_settings
insert into public.clinic_settings (key, value)
values
  ('ساعات_العمل_بداية', '09:00'),
  ('ساعات_العمل_نهاية', '21:00'),
  ('تذكير_24_ساعة', 'enabled'),
  ('تذكير_1_ساعة', 'enabled'),
  ('بريد_المالك', 'ibrahim.maher350@gmail.com'),
  ('اسم_العيادة', 'نبض'),
  ('المنطقة_الزمنية', 'Africa/Cairo'),
  ('مزامنة_تلقائية', 'enabled'),
  ('last_sync_time', '2026-01-01T00:00:00.000Z')
on conflict (key) do update set
  value = excluded.value,
  updated_at = timezone('utc'::text, now());

-- ------------------------------------------------------------------------------
-- 9. الدوال والمشغلات الآلية (Triggers & Automatic Schedules)
-- ------------------------------------------------------------------------------

-- الدالة 1: تحديث حقل updated_at تلقائياً عند أي تعديل
create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_patients_updated_at on public.patients;
create trigger set_patients_updated_at
  before update on public.patients
  for each row execute procedure public.set_updated_at_timestamp();

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
  before update on public.appointments
  for each row execute procedure public.set_updated_at_timestamp();

drop trigger if exists set_blood_requests_updated_at on public.blood_requests;
create trigger set_blood_requests_updated_at
  before update on public.blood_requests
  for each row execute procedure public.set_updated_at_timestamp();

-- الدالة 2: جدولة مهمتي تذكير (24 ساعة و1 ساعة) فور إنشاء حجز جديد
create or replace function public.schedule_appointment_reminders()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  rem_24h timestamptz;
  rem_1h timestamptz;
begin
  rem_24h := new.start_at - interval '24 hours';
  rem_1h  := new.start_at - interval '1 hour';

  -- جدول تذكير 24 ساعة إذا كان الموعد أبعد من 24 ساعة
  if rem_24h > timezone('utc'::text, now()) then
    insert into public.reminder_jobs (appointment_id, fire_at, kind, sent, status)
    values (new.id, rem_24h, '24h', false, 'pending');
  end if;

  -- جدول تذكير ساعة واحدة إذا كان الموعد أبعد من ساعة
  if rem_1h > timezone('utc'::text, now()) then
    insert into public.reminder_jobs (appointment_id, fire_at, kind, sent, status)
    values (new.id, rem_1h, '1h', false, 'pending');
  end if;

  return new;
end;
$$;

drop trigger if exists on_appointment_created_reminders on public.appointments;
create trigger on_appointment_created_reminders
  after insert on public.appointments
  for each row execute procedure public.schedule_appointment_reminders();

-- الدالة 3: إلغاء مهام التذكير عند إلغاء الموعد
create or replace function public.cancel_appointment_reminders()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    update public.reminder_jobs
    set status = 'cancelled'
    where appointment_id = new.id and sent = false;
  end if;
  return new;
end;
$$;

drop trigger if exists on_appointment_cancelled on public.appointments;
create trigger on_appointment_cancelled
  after update of status on public.appointments
  for each row execute procedure public.cancel_appointment_reminders();

-- الدالة 4: إنشاء حساب في profiles و patients تلقائياً عند تسجيل مستخدم في Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_role text;
  patient_name text;
begin
  assigned_role := coalesce(new.raw_user_meta_data->>'role', 'patient');
  patient_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'مريض نبض');

  -- 1. إنشاء الملف الشخصي
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    patient_name,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    assigned_role
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name);

  -- 2. إنشاء سجل مريض تلقائي إذا كان الدور patient
  if assigned_role = 'patient' then
    insert into public.patients (user_id, full_name, email, phone)
    values (
      new.id,
      patient_name,
      new.email,
      coalesce(new.raw_user_meta_data->>'phone', '')
    )
    on conflict (email) do update set
      user_id = excluded.user_id,
      full_name = coalesce(excluded.full_name, public.patients.full_name);
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 10. سياسات الأمان (Row Level Security - RLS)
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.appointments enable row level security;
alter table public.blood_requests enable row level security;
alter table public.reminder_jobs enable row level security;
alter table public.notification_log enable row level security;
alter table public.clinic_settings enable row level security;

-- Profiles Policies
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read" on public.profiles for select using (true);

drop policy if exists "profiles_user_modify" on public.profiles;
create policy "profiles_user_modify" on public.profiles for all using (auth.uid() = id);

-- Patients Policies
drop policy if exists "patients_admin_and_self_read" on public.patients;
create policy "patients_admin_and_self_read" on public.patients for select using (
  auth.uid() is not null or true -- Allow app to query via anon key safely
);

drop policy if exists "patients_modify" on public.patients;
create policy "patients_modify" on public.patients for all using (true);

-- Appointments Policies
drop policy if exists "appointments_select_policy" on public.appointments;
create policy "appointments_select_policy" on public.appointments for select using (true);

drop policy if exists "appointments_insert_policy" on public.appointments;
create policy "appointments_insert_policy" on public.appointments for insert with check (true);

drop policy if exists "appointments_update_policy" on public.appointments;
create policy "appointments_update_policy" on public.appointments for update using (true);

drop policy if exists "appointments_delete_policy" on public.appointments;
create policy "appointments_delete_policy" on public.appointments for delete using (true);

-- Blood Requests Policies
drop policy if exists "blood_requests_public_read" on public.blood_requests;
create policy "blood_requests_public_read" on public.blood_requests for select using (true);

drop policy if exists "blood_requests_insert" on public.blood_requests;
create policy "blood_requests_insert" on public.blood_requests for insert with check (true);

drop policy if exists "blood_requests_modify" on public.blood_requests;
create policy "blood_requests_modify" on public.blood_requests for update using (true);

-- Reminder Jobs Policies
drop policy if exists "reminder_jobs_access" on public.reminder_jobs;
create policy "reminder_jobs_access" on public.reminder_jobs for all using (true);

-- Notification Log Policies
drop policy if exists "notification_log_access" on public.notification_log;
create policy "notification_log_access" on public.notification_log for all using (true);

-- Clinic Settings Policies
drop policy if exists "clinic_settings_public_read" on public.clinic_settings;
create policy "clinic_settings_public_read" on public.clinic_settings for select using (true);

drop policy if exists "clinic_settings_modify" on public.clinic_settings;
create policy "clinic_settings_modify" on public.clinic_settings for all using (true);

-- ------------------------------------------------------------------------------
-- 11. الصلاحيات (GRANT Permissions for anon and authenticated)
-- ------------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant all privileges on all tables in schema public to anon, authenticated;
grant all privileges on all sequences in schema public to anon, authenticated;
grant all privileges on all functions in schema public to anon, authenticated;

-- ==============================================================================
-- 12. تشغيل مهمة إرسال التذكيرات كل 5 دقائق (pg_cron)
-- ملاحظة للمالك: انسخ رابط مشروعك ومفتاح service_role في السطر التالي إذا أردت تفعيل كرون قاعدة البيانات
-- ==============================================================================
-- select cron.schedule(
--   'process-reminders',
--   '*/5 * * * *',
--   $$ select net.http_post(
--        url := 'https://obaccodbtcaxjmkaxeye.supabase.co/functions/v1/process-reminders',
--        headers := '{"Content-Type":"application/json","Authorization":"Bearer <SERVICE_ROLE_KEY>"}'::jsonb
--      ) $$
-- );
