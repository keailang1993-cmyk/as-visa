create table if not exists public.supplement_requests (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.visa_cases(id) on delete cascade,
  status text not null default 'active',
  message text not null,
  requested_documents jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz null
);

create index if not exists supplement_requests_case_id_status_idx
on public.supplement_requests (case_id, status);

alter table public.supplement_requests enable row level security;

drop policy if exists "service role can manage supplement requests"
on public.supplement_requests;

create policy "service role can manage supplement requests"
on public.supplement_requests
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
