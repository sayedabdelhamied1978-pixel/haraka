-- شغّل هذا الملف مرة واحدة في Supabase: SQL Editor ← New query ← Run

create table if not exists public.haraka_entries (
  id          text primary key,
  data        jsonb not null,
  entry_date  date,
  updated_at  timestamptz not null default now()
);

alter table public.haraka_entries enable row level security;

-- المستخدمون المسجّلون فقط (الذين تنشئهم أنت) يقرؤون ويكتبون
drop policy if exists "authenticated full access" on public.haraka_entries;
create policy "authenticated full access" on public.haraka_entries
  for all to authenticated using (true) with check (true);

-- تفعيل التحديث اللحظي
alter publication supabase_realtime add table public.haraka_entries;
