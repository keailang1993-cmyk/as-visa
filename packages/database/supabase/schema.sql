create extension if not exists "pgcrypto";

create table if not exists public.visa_cases (
  id uuid primary key default gen_random_uuid(),
  case_code text unique not null,
  visa_type text not null,
  destination_country text not null,
  status text not null default 'submitted',
  applicant_name text not null,
  applicant_phone text not null,
  applicant_birth_date date null,
  passport_number text not null,
  travel_date date null,
  occupation_type text not null,
  source text not null default 'wechat_intake',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visa_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.visa_cases(id) on delete cascade,
  document_type text not null,
  document_name text not null,
  file_name text not null,
  file_path text not null,
  file_mime_type text null,
  file_size bigint null,
  status text not null default 'uploaded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.visa_cases(id) on delete cascade,
  event_type text not null,
  title text not null,
  description text null,
  created_at timestamptz not null default now()
);

create index if not exists visa_cases_created_at_idx on public.visa_cases (created_at desc);
create index if not exists visa_cases_status_idx on public.visa_cases (status);
create index if not exists visa_documents_case_id_idx on public.visa_documents (case_id);
create index if not exists case_events_case_id_created_at_idx on public.case_events (case_id, created_at desc);

comment on column public.visa_documents.file_path is 'Private Supabase Storage path in as-visa-documents bucket, for example cases/{case_id}/{document_type}/{timestamp}-{safe_file_name}.';

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_visa_cases_updated_at on public.visa_cases;
create trigger set_visa_cases_updated_at
before update on public.visa_cases
for each row execute function public.set_updated_at();

drop trigger if exists set_visa_documents_updated_at on public.visa_documents;
create trigger set_visa_documents_updated_at
before update on public.visa_documents
for each row execute function public.set_updated_at();

alter table public.visa_cases enable row level security;
alter table public.visa_documents enable row level security;
alter table public.case_events enable row level security;

drop policy if exists "service role can manage visa cases" on public.visa_cases;
create policy "service role can manage visa cases"
on public.visa_cases
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "anon can create intake visa cases" on public.visa_cases;

drop policy if exists "service role can manage visa documents" on public.visa_documents;
create policy "service role can manage visa documents"
on public.visa_documents
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "anon can create intake visa documents" on public.visa_documents;

drop policy if exists "service role can manage case events" on public.case_events;
create policy "service role can manage case events"
on public.case_events
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "anon can create intake case events" on public.case_events;
