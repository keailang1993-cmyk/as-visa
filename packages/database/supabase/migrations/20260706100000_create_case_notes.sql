create table if not exists public.case_notes (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.visa_cases(id) on delete cascade,
  staff_name text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists case_notes_case_id_created_at_idx
on public.case_notes (case_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_case_notes_updated_at on public.case_notes;
create trigger set_case_notes_updated_at
before update on public.case_notes
for each row execute function public.set_updated_at();

alter table public.case_notes enable row level security;

drop policy if exists "service role can manage case notes"
on public.case_notes;

create policy "service role can manage case notes"
on public.case_notes
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
