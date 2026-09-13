-- ==============================================================================
-- NABD BLOOD BANK (بنك دم نبض) - SUPABASE DATABASE SCHEMA
-- Project ID: obaccodbtcaxjmkaxeye
-- Region: eu-west-1 (Ireland)
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABLE: donors (المتبرعون)
-- ------------------------------------------------------------------------------
create table if not exists public.donors (
  id text primary key,
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
-- 3. TABLE: blood_requests (طلبات الدم العاجلة)
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
-- 4. TABLE: blood_banks (بنوك ومراكز نقل الدم الإقليمية)
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
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
alter table public.donors enable row level security;
alter table public.blood_requests enable row level security;
alter table public.blood_banks enable row level security;

-- Donors policies: anyone can read available donors, anyone can insert/update their profile
create policy "Allow public read for donors" on public.donors
  for select using (true);

create policy "Allow public insert/upsert for donors" on public.donors
  for all using (true) with check (true);

-- Blood requests policies: public can read active requests and insert new ones
create policy "Allow public read for blood_requests" on public.blood_requests
  for select using (true);

create policy "Allow public insert for blood_requests" on public.blood_requests
  for insert with check (true);

-- Blood banks policies: public read-only
create policy "Allow public read for blood_banks" on public.blood_banks
  for select using (true);

-- ------------------------------------------------------------------------------
-- 6. SEED DATA: 10 Official Regional Blood Banks
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
-- 7. ENABLE REALTIME
-- ------------------------------------------------------------------------------
alter publication supabase_realtime add table public.blood_requests;
