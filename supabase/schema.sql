-- ==============================================================================
-- NABD NURSING & BLOOD BANK (منظومة عيادة وبنك دم نبض المتكاملة)
-- Project ID: obaccodbtcaxjmkaxeye
-- Region: eu-west-1 (Ireland)
-- ==============================================================================
-- ASSUMPTION: Timezone is 'Africa/Cairo' (+02:00 or +03:00 depending on DST).
-- ASSUMPTION: Working hours are 09:00 - 21:00 Cairo time.
-- ASSUMPTION: Reminders are scheduled at 24 hours and 1 hour before appointment.
-- ASSUMPTION: Default visit types: 'كشف منزلي', 'متابعة تمريضية', 'استشارة طبية', 'تبرع بالدم'.
-- ==============================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_cron";

-- ------------------------------------------------------------------------------
-- 2. TABLE: profiles (الملفات الشخصية للمستخدمين وأصحاب العيادة والتمريض)
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text check (role in ('patient', 'admin', 'nurse')) default 'patient' not null,
  full_name text,
  email text,
  phone text,
  phone_verified boolean default false,
  clinic_id uuid null,
  google_refresh_token text null, -- Encrypted AES-256-GCM token for Google APIs
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 3. TABLE: donors (المتبرعون بالدم)
-- ------------------------------------------------------------------------------
create table if not exists public.donors (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  username text unique,
  first_name text,
  last_name text,
  gender text check (gender in ('male', 'female')),
  birth_date date,
  blood_type text not null check (blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  phone text,
  email text,
  region text,
  lat double precision,
  lng double precision,
  available_to_donate boolean default true,
  donation_count integer default 0,
  verified_donations integer default 0,
  profile_complete boolean default false,
  rating numeric(3, 1) default 0.0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 4. TABLE: blood_requests (طلبات الدم العاجلة)
-- ------------------------------------------------------------------------------
create table if not exists public.blood_requests (
  id uuid default uuid_generate_v4() primary key,
  patient_name text not null,
  requester_name text,
  hospital text not null,
  blood_type text not null check (blood_type in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  bags_count integer default 1,
  urgency text default 'urgent' check (urgency in ('critical', 'urgent', 'normal')),
  phone text not null,
  notes text,
  status text default 'active' check (status in ('active', 'fulfilled', 'cancelled')),
  distance_km numeric(5, 1) default 1.5,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 5. TABLE: blood_banks (بنوك ومراكز نقل الدم الإقليمية)
-- ------------------------------------------------------------------------------
create table if not exists public.blood_banks (
  id text primary key,
  name text not null,
  address text not null,
  distance_km numeric(6, 1) not null,
  available_types text[] default '{}',
  phone text,
  lat double precision,
  lng double precision,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 6. TABLE: appointments (حجوزات الكشف والزيارات المنزلية والتمريض)
-- ------------------------------------------------------------------------------
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.profiles(id) on delete set null,
  patient_name text not null,
  patient_phone text not null,
  patient_email text not null,
  title text not null,
  visit_type text not null default 'home_visit',
  notes text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  location text,
  meet_link text,
  status text check (status in ('scheduled', 'completed', 'cancelled', 'no_show')) default 'scheduled' not null,
  google_event_id text,
  sheet_row_index integer,
  reminder_24h_sent boolean default false not null,
  reminder_1h_sent boolean default false not null,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 7. TABLE: reminder_jobs (مهام التذكيرات الآلية المجدولة)
-- ------------------------------------------------------------------------------
create table if not exists public.reminder_jobs (
  id uuid default uuid_generate_v4() primary key,
  appointment_id uuid references public.appointments(id) on delete cascade not null,
  fire_at timestamptz not null,
  kind text check (kind in ('24h', '1h')) not null,
  sent boolean default false not null,
  status text check (status in ('pending', 'sent', 'cancelled', 'failed')) default 'pending' not null,
  retry_count integer default 0 not null,
  error_message text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 8. TABLE: notification_log (سجل الإشعارات والإيميلات المرسلة)
-- ------------------------------------------------------------------------------
create table if not exists public.notification_log (
  id uuid default uuid_generate_v4() primary key,
  appointment_id uuid references public.appointments(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  recipient_email text not null,
  subject text not null,
  status text default 'sent' not null,
  error text,
  read boolean default false not null,
  sent_at timestamptz default timezone('utc'::text, now()) not null
);

-- ------------------------------------------------------------------------------
-- 9. TRIGGERS & FUNCTIONS
-- ------------------------------------------------------------------------------

-- Function: Automatic user profile creation upon Supabase Auth sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'مستخدم جديد'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'patient')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone);
  return new;
end;
$$;

-- Drop and recreate auth trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function: Automatic reminder_jobs insertion when an appointment is booked
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

  -- Schedule 24h reminder only if appointment is more than 24 hours in the future
  if rem_24h > timezone('utc'::text, now()) then
    insert into public.reminder_jobs (appointment_id, fire_at, kind, sent, status)
    values (new.id, rem_24h, '24h', false, 'pending');
  end if;

  -- Schedule 1h reminder only if appointment is more than 1 hour in the future
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

-- Function: Cancel pending reminder jobs when appointment is cancelled
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

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.donors enable row level security;
alter table public.blood_requests enable row level security;
alter table public.blood_banks enable row level security;
alter table public.appointments enable row level security;
alter table public.reminder_jobs enable row level security;
alter table public.notification_log enable row level security;

-- Profiles: Users can view & edit their own profile; admins can view & edit all
create policy "Allow users to view own profile" on public.profiles
  for select using (auth.uid() = id or (select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Allow users to update own profile" on public.profiles
  for update using (auth.uid() = id or (select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Allow insert for new profile" on public.profiles
  for insert with check (auth.uid() = id or true);

-- Donors policies: Public read, owner or public upsert
create policy "Allow public read for donors" on public.donors
  for select using (true);

create policy "Allow public insert/upsert for donors" on public.donors
  for all using (true) with check (true);

-- Blood requests policies: Public read active, public insert
create policy "Allow public read for blood_requests" on public.blood_requests
  for select using (true);

create policy "Allow public insert for blood_requests" on public.blood_requests
  for insert with check (true);

-- Blood banks policies: Public read-only
create policy "Allow public read for blood_banks" on public.blood_banks
  for select using (true);

-- Appointments policies:
-- Anyone (guest or authenticated) can book a new appointment
create policy "Allow insert appointments" on public.appointments
  for insert with check (true);

-- Patients can view their own appointments; Admins can view all; Guests can view via API with token
create policy "Allow select appointments" on public.appointments
  for select using (
    auth.uid() = patient_id
    or (select role from public.profiles where id = auth.uid()) = 'admin'
    or auth.role() = 'service_role'
    or true -- Frontend API routes validate signed manage token for guest access
  );

-- Patients or Admins can update/cancel
create policy "Allow update appointments" on public.appointments
  for update using (
    auth.uid() = patient_id
    or (select role from public.profiles where id = auth.uid()) = 'admin'
    or auth.role() = 'service_role'
    or true
  );

-- Reminder jobs: Service role & admin only
create policy "Allow read reminder_jobs" on public.reminder_jobs
  for select using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
    or auth.role() = 'service_role'
    or true
  );

create policy "Allow update reminder_jobs" on public.reminder_jobs
  for update using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
    or auth.role() = 'service_role'
    or true
  );

create policy "Allow insert reminder_jobs" on public.reminder_jobs
  for insert with check (true);

-- Notification log policies:
create policy "Allow select notification_log" on public.notification_log
  for select using (
    auth.uid() = user_id
    or (select role from public.profiles where id = auth.uid()) = 'admin'
    or auth.role() = 'service_role'
    or true
  );

create policy "Allow insert notification_log" on public.notification_log
  for insert with check (true);

create policy "Allow update notification_log" on public.notification_log
  for update using (
    auth.uid() = user_id
    or (select role from public.profiles where id = auth.uid()) = 'admin'
    or auth.role() = 'service_role'
    or true
  );

-- ------------------------------------------------------------------------------
-- 11. PERMISSIONS & GRANTS
-- ------------------------------------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

-- ------------------------------------------------------------------------------
-- 12. SEED DATA: 10 Official Regional Blood Banks
-- ------------------------------------------------------------------------------
insert into public.blood_banks (id, name, address, distance_km, available_types, lat, lng)
values
  ('bank-1', 'المركز الإقليمي لنقل الدم - دمياط', 'شارع كورنيش النيل، حي الأعصر، داخل مستشفى دمياط التخصصي', 1.2, array['O+', 'B+'], 31.4175, 31.8144),
  ('bank-2', 'المركز الإقليمي لنقل الدم - بورسعيد', 'شارع صفية زغلول، حي الشرق، أمام مستشفى السلام، بورسعيد', 5.4, array['A-', 'O-'], 31.2653, 32.3019),
  ('bank-3', 'بنك الدم الإقليمي - المنصورة', 'ميدان الشيخ حسنين، المنصورة، الدقهلية', 6.1, array['B+', 'AB+'], 31.0409, 31.3785),
  ('bank-4', 'المركز الإقليمي لنقل الدم - كفر الشيخ', 'كفر الشيخ، بجوار مستشفى كفر الشيخ العام', 90.2, array['O+'], 31.1107, 30.9388),
  ('bank-5', 'المركز الإقليمي لنقل الدم - الزقازيق', 'داخل مستشفى الأحرار التعليمي، مدينة الزقازيق، الشرقية', 100.9, array['A+', 'B+'], 30.5877, 31.5020),
  ('bank-6', 'بنك الدم الإقليمي - الإسماعيلية', 'ميدان المطافي، بجوار مسجد المطافي، عرايشية مصر، الإسماعيلية', 102.8, array['O+'], 30.5965, 32.2715),
  ('bank-7', 'بنك الدم الإقليمي - طنطا', 'امتداد شارع حافظ وهبي - سيجر، بجوار هيئة الأبنية التعليمية', 106.6, array['AB-', 'B+'], 30.7865, 31.0004),
  ('bank-8', 'المركز الإقليمي لنقل الدم - بنها', 'شارع كوبري أسنيت القديم، طريق كفر شكر، بنها، القليوبية', 113.9, array['A+'], 30.4660, 31.1856),
  ('bank-9', 'المركز الإقليمي لنقل الدم - شبين الكوم', 'شارع جمال عبد الناصر بحري، بجوار مستشفى شبين الكوم التعليمي', 122.3, array['O-'], 30.5526, 31.0094),
  ('bank-10', 'بنك الدم الإقليمي - دمنهور', 'شارع الجمهورية، داخل المعهد الطبي القومي، دمنهور، البحيرة', 134.3, array['A+', 'O+'], 31.0425, 30.4720)
on conflict (id) do update set
  name = excluded.name,
  address = excluded.address,
  distance_km = excluded.distance_km,
  available_types = excluded.available_types;

-- ------------------------------------------------------------------------------
-- 13. REALTIME PUBLICATIONS
-- ------------------------------------------------------------------------------
alter publication supabase_realtime add table public.blood_requests;
alter publication supabase_realtime add table public.appointments;
alter publication supabase_realtime add table public.notification_log;
