-- Lexora Academy: per-user learning progress
-- Run this once in Supabase Dashboard > SQL Editor.

create table if not exists public.lexora_user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  achievements jsonb not null default '{"unlocked": {}}'::jsonb,
  last_mode text not null default 'english' check (last_mode in ('english', 'mandarin', 'japanese', 'german')),
  updated_at timestamptz not null default now()
);

alter table public.lexora_user_data enable row level security;

-- Recreate policies safely.
drop policy if exists "lexora_select_own_data" on public.lexora_user_data;
drop policy if exists "lexora_insert_own_data" on public.lexora_user_data;
drop policy if exists "lexora_update_own_data" on public.lexora_user_data;
drop policy if exists "lexora_delete_own_data" on public.lexora_user_data;

create policy "lexora_select_own_data"
on public.lexora_user_data
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "lexora_insert_own_data"
on public.lexora_user_data
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "lexora_update_own_data"
on public.lexora_user_data
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "lexora_delete_own_data"
on public.lexora_user_data
for delete
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists lexora_user_data_updated_at_idx
on public.lexora_user_data (updated_at desc);


-- Visible per-user saved vocabulary rows.
create table if not exists public.lexora_saved_words (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null,
  mode text not null check (mode in ('english', 'mandarin', 'japanese', 'german')),
  word_text text not null,
  word_sub text not null default '',
  saved_at timestamptz not null default now(),
  primary key (user_id, word_id)
);
alter table public.lexora_saved_words enable row level security;
drop policy if exists "lexora_saved_words_select_own" on public.lexora_saved_words;
drop policy if exists "lexora_saved_words_insert_own" on public.lexora_saved_words;
drop policy if exists "lexora_saved_words_update_own" on public.lexora_saved_words;
drop policy if exists "lexora_saved_words_delete_own" on public.lexora_saved_words;
create policy "lexora_saved_words_select_own" on public.lexora_saved_words for select to authenticated using ((select auth.uid()) = user_id);
create policy "lexora_saved_words_insert_own" on public.lexora_saved_words for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "lexora_saved_words_update_own" on public.lexora_saved_words for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "lexora_saved_words_delete_own" on public.lexora_saved_words for delete to authenticated using ((select auth.uid()) = user_id);
create index if not exists lexora_saved_words_user_saved_idx on public.lexora_saved_words (user_id, saved_at desc);

-- One visible row per unlocked achievement.
create table if not exists public.lexora_user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  title text not null,
  icon text not null default '🏅',
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);
alter table public.lexora_user_achievements enable row level security;
drop policy if exists "lexora_achievements_select_own" on public.lexora_user_achievements;
drop policy if exists "lexora_achievements_insert_own" on public.lexora_user_achievements;
drop policy if exists "lexora_achievements_update_own" on public.lexora_user_achievements;
drop policy if exists "lexora_achievements_delete_own" on public.lexora_user_achievements;
create policy "lexora_achievements_select_own" on public.lexora_user_achievements for select to authenticated using ((select auth.uid()) = user_id);
create policy "lexora_achievements_insert_own" on public.lexora_user_achievements for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "lexora_achievements_update_own" on public.lexora_user_achievements for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "lexora_achievements_delete_own" on public.lexora_user_achievements for delete to authenticated using ((select auth.uid()) = user_id);
create index if not exists lexora_user_achievements_unlocked_idx on public.lexora_user_achievements (user_id, unlocked_at desc);

-- Saved writing/sentences per account.
create table if not exists public.lexora_saved_writing (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check (mode in ('english', 'mandarin', 'japanese', 'german')),
  task_type text not null default 'Writing',
  prompt text not null default '',
  answer text not null,
  ai_feedback text not null default '',
  unit_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.lexora_saved_writing enable row level security;
drop policy if exists "lexora_writing_select_own" on public.lexora_saved_writing;
drop policy if exists "lexora_writing_insert_own" on public.lexora_saved_writing;
drop policy if exists "lexora_writing_update_own" on public.lexora_saved_writing;
drop policy if exists "lexora_writing_delete_own" on public.lexora_saved_writing;
create policy "lexora_writing_select_own" on public.lexora_saved_writing for select to authenticated using ((select auth.uid()) = user_id);
create policy "lexora_writing_insert_own" on public.lexora_saved_writing for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "lexora_writing_update_own" on public.lexora_saved_writing for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "lexora_writing_delete_own" on public.lexora_saved_writing for delete to authenticated using ((select auth.uid()) = user_id);
create index if not exists lexora_saved_writing_user_created_idx on public.lexora_saved_writing (user_id, created_at desc);

-- ============================================================
-- Lexora account blocking + global popup announcements
-- Admin writes these tables later from a secure server/service role.
-- The learner website can only read its own block state and active notices.
-- ============================================================

create table if not exists public.lexora_user_controls (
  user_id uuid primary key references auth.users(id) on delete cascade,
  blocked boolean not null default false,
  block_reason text not null default '',
  blocked_at timestamptz,
  blocked_until timestamptz,
  updated_at timestamptz not null default now()
);

-- Manual free-trial access controlled by Lexora Admin.
alter table public.lexora_user_controls add column if not exists access_type text not null default 'full';
alter table public.lexora_user_controls add column if not exists trial_started_at timestamptz;
alter table public.lexora_user_controls add column if not exists trial_ends_at timestamptz;
alter table public.lexora_user_controls add column if not exists trial_note text not null default '';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'lexora_user_controls_access_type_check') then
    alter table public.lexora_user_controls add constraint lexora_user_controls_access_type_check check (access_type in ('full','trial'));
  end if;
end $$;

alter table public.lexora_user_controls enable row level security;
drop policy if exists "lexora_controls_select_own" on public.lexora_user_controls;
create policy "lexora_controls_select_own"
on public.lexora_user_controls
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Existing users receive an unlocked control row.
insert into public.lexora_user_controls (user_id)
select id from auth.users
on conflict (user_id) do nothing;

-- Every new auth user automatically receives an unlocked control row.
create or replace function public.lexora_create_user_control()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.lexora_user_controls (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists lexora_on_auth_user_created_control on auth.users;
create trigger lexora_on_auth_user_created_control
after insert on auth.users
for each row execute procedure public.lexora_create_user_control();

create table if not exists public.lexora_announcements (
  id bigint generated by default as identity primary key,
  title text not null,
  message text not null,
  kind text not null default 'info' check (kind in ('info', 'update', 'maintenance', 'warning')),
  priority integer not null default 0,
  active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lexora_announcements enable row level security;
drop policy if exists "lexora_announcements_read_active" on public.lexora_announcements;
create policy "lexora_announcements_read_active"
on public.lexora_announcements
for select
to authenticated
using (active = true);

create table if not exists public.lexora_announcement_dismissals (
  user_id uuid not null references auth.users(id) on delete cascade,
  announcement_id bigint not null references public.lexora_announcements(id) on delete cascade,
  dismissed_at timestamptz not null default now(),
  primary key (user_id, announcement_id)
);

alter table public.lexora_announcement_dismissals enable row level security;
drop policy if exists "lexora_dismissals_select_own" on public.lexora_announcement_dismissals;
drop policy if exists "lexora_dismissals_insert_own" on public.lexora_announcement_dismissals;
drop policy if exists "lexora_dismissals_delete_own" on public.lexora_announcement_dismissals;
create policy "lexora_dismissals_select_own"
on public.lexora_announcement_dismissals
for select
to authenticated
using ((select auth.uid()) = user_id);
create policy "lexora_dismissals_insert_own"
on public.lexora_announcement_dismissals
for insert
to authenticated
with check ((select auth.uid()) = user_id);
create policy "lexora_dismissals_delete_own"
on public.lexora_announcement_dismissals
for delete
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists lexora_user_controls_blocked_idx
on public.lexora_user_controls (blocked, updated_at desc);
create index if not exists lexora_announcements_active_priority_idx
on public.lexora_announcements (active, priority desc, created_at desc);
create index if not exists lexora_dismissals_user_idx
on public.lexora_announcement_dismissals (user_id, dismissed_at desc);

-- Realtime makes block/unblock and announcements update without reloading.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'lexora_user_controls'
  ) then
    alter publication supabase_realtime add table public.lexora_user_controls;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'lexora_announcements'
  ) then
    alter publication supabase_realtime add table public.lexora_announcements;
  end if;
end $$;

-- QUICK MANUAL TESTS (run only the statement you need in SQL Editor):
-- Block a user:
-- update public.lexora_user_controls
-- set blocked = true, block_reason = 'Akun dinonaktifkan sementara.', blocked_at = now(), blocked_until = null, updated_at = now()
-- where user_id = 'USER_UUID_HERE';
--
-- Unblock a user:
-- update public.lexora_user_controls
-- set blocked = false, block_reason = '', blocked_at = null, blocked_until = null, updated_at = now()
-- where user_id = 'USER_UUID_HERE';
--
-- Show an update popup to all logged-in users:
-- insert into public.lexora_announcements (title, message, kind, priority)
-- values ('Update Lexora', 'Kami baru saja menambahkan fitur baru. Terima kasih sudah belajar di Lexora!', 'update', 10);
--
-- Hide an announcement globally:
-- update public.lexora_announcements set active = false, updated_at = now() where id = 1;


-- Refresh language-mode check constraints for existing Lexora projects.
alter table public.lexora_user_data drop constraint if exists lexora_user_data_last_mode_check;
alter table public.lexora_user_data add constraint lexora_user_data_last_mode_check check (last_mode in ('english', 'mandarin', 'japanese', 'german'));
alter table public.lexora_saved_words drop constraint if exists lexora_saved_words_mode_check;
alter table public.lexora_saved_words add constraint lexora_saved_words_mode_check check (mode in ('english', 'mandarin', 'japanese', 'german'));
alter table public.lexora_saved_writing drop constraint if exists lexora_saved_writing_mode_check;
alter table public.lexora_saved_writing add constraint lexora_saved_writing_mode_check check (mode in ('english', 'mandarin', 'japanese', 'german'));

-- ============================================================
-- Block appeal system + private evidence images
-- User can insert/read only their own appeals. Admin service_role can review all.
-- ============================================================

create table if not exists public.lexora_block_appeals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  image_path text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'approved', 'rejected')),
  admin_note text not null default '',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lexora_block_appeals enable row level security;
drop policy if exists "lexora_appeals_select_own" on public.lexora_block_appeals;
drop policy if exists "lexora_appeals_insert_own" on public.lexora_block_appeals;
create policy "lexora_appeals_select_own"
on public.lexora_block_appeals
for select
to authenticated
using ((select auth.uid()) = user_id);
create policy "lexora_appeals_insert_own"
on public.lexora_block_appeals
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create index if not exists lexora_block_appeals_status_created_idx
on public.lexora_block_appeals (status, created_at desc);
create index if not exists lexora_block_appeals_user_created_idx
on public.lexora_block_appeals (user_id, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lexora-block-appeals',
  'lexora-block-appeals',
  false,
  5242880,
  array['image/png','image/jpeg','image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "lexora_appeal_images_insert_own" on storage.objects;
drop policy if exists "lexora_appeal_images_select_own" on storage.objects;
drop policy if exists "lexora_appeal_images_delete_own" on storage.objects;
create policy "lexora_appeal_images_insert_own"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'lexora-block-appeals'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "lexora_appeal_images_select_own"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'lexora-block-appeals'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "lexora_appeal_images_delete_own"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'lexora-block-appeals'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- ============================================================
-- STATIC ADMIN PANEL + BUG INBOX
-- Admin runs entirely as HTML/JS with the normal Supabase anon key.
-- Security is enforced by Supabase Auth + Row Level Security.
-- ============================================================

create table if not exists public.lexora_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.lexora_admins enable row level security;
drop policy if exists "lexora_admins_select_self" on public.lexora_admins;
create policy "lexora_admins_select_self"
on public.lexora_admins
for select
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.lexora_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.lexora_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.lexora_is_admin() from public;
grant execute on function public.lexora_is_admin() to authenticated;

-- Safe profile mirror so the browser admin can show user emails without service_role.
create table if not exists public.lexora_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  display_name text not null default '',
  created_at timestamptz not null default now(),
  last_sign_in_at timestamptz,
  last_seen_at timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.lexora_profiles (user_id, email, display_name, created_at, last_sign_in_at, updated_at)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(coalesce(email,''), '@', 1), ''),
  coalesce(created_at, now()),
  last_sign_in_at,
  now()
from auth.users
on conflict (user_id) do update set
  email = excluded.email,
  display_name = excluded.display_name,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = now();

create or replace function public.lexora_sync_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.lexora_profiles (user_id, email, display_name, created_at, last_sign_in_at, updated_at)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(coalesce(new.email,''), '@', 1), ''),
    coalesce(new.created_at, now()),
    new.last_sign_in_at,
    now()
  )
  on conflict (user_id) do update set
    email = excluded.email,
    display_name = excluded.display_name,
    last_sign_in_at = excluded.last_sign_in_at,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists lexora_on_auth_user_profile_sync on auth.users;
create trigger lexora_on_auth_user_profile_sync
after insert or update of email, raw_user_meta_data, last_sign_in_at on auth.users
for each row execute procedure public.lexora_sync_profile();

alter table public.lexora_profiles enable row level security;
drop policy if exists "lexora_profiles_admin_select" on public.lexora_profiles;
create policy "lexora_profiles_admin_select"
on public.lexora_profiles
for select
to authenticated
using (public.lexora_is_admin());

-- Bug inbox used by the learner website and the static admin panel.
create table if not exists public.lexora_bug_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'Lainnya',
  title text not null,
  message text not null,
  contact text not null default '',
  page text not null default '',
  mode text not null default 'english',
  device text not null default '',
  url text not null default '',
  user_agent text not null default '',
  image_path text,
  status text not null default 'new' check (status in ('new','reviewing','resolved','closed')),
  admin_note text not null default '',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lexora_bug_reports enable row level security;
drop policy if exists "lexora_bug_insert_own" on public.lexora_bug_reports;
drop policy if exists "lexora_bug_select_own" on public.lexora_bug_reports;
drop policy if exists "lexora_bug_admin_select" on public.lexora_bug_reports;
drop policy if exists "lexora_bug_admin_update" on public.lexora_bug_reports;
drop policy if exists "lexora_bug_admin_delete" on public.lexora_bug_reports;
create policy "lexora_bug_insert_own"
on public.lexora_bug_reports for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "lexora_bug_select_own"
on public.lexora_bug_reports for select to authenticated
using ((select auth.uid()) = user_id);
create policy "lexora_bug_admin_select"
on public.lexora_bug_reports for select to authenticated
using (public.lexora_is_admin());
create policy "lexora_bug_admin_update"
on public.lexora_bug_reports for update to authenticated
using (public.lexora_is_admin())
with check (public.lexora_is_admin());
create policy "lexora_bug_admin_delete"
on public.lexora_bug_reports for delete to authenticated
using (public.lexora_is_admin());

create index if not exists lexora_bug_reports_status_created_idx
on public.lexora_bug_reports (status, created_at desc);
create index if not exists lexora_bug_reports_user_created_idx
on public.lexora_bug_reports (user_id, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lexora-bug-reports',
  'lexora-bug-reports',
  false,
  5242880,
  array['image/png','image/jpeg','image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "lexora_bug_images_insert_own" on storage.objects;
drop policy if exists "lexora_bug_images_select_own" on storage.objects;
drop policy if exists "lexora_bug_images_delete_own" on storage.objects;
drop policy if exists "lexora_bug_images_admin_select" on storage.objects;
drop policy if exists "lexora_bug_images_admin_delete" on storage.objects;
create policy "lexora_bug_images_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'lexora-bug-reports'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "lexora_bug_images_select_own"
on storage.objects for select to authenticated
using (
  bucket_id = 'lexora-bug-reports'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "lexora_bug_images_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'lexora-bug-reports'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "lexora_bug_images_admin_select"
on storage.objects for select to authenticated
using (bucket_id = 'lexora-bug-reports' and public.lexora_is_admin());
create policy "lexora_bug_images_admin_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'lexora-bug-reports' and public.lexora_is_admin());

-- Static admin permissions for the existing Lexora tables.
drop policy if exists "lexora_controls_admin_select" on public.lexora_user_controls;
drop policy if exists "lexora_controls_admin_insert" on public.lexora_user_controls;
drop policy if exists "lexora_controls_admin_update" on public.lexora_user_controls;
drop policy if exists "lexora_controls_admin_delete" on public.lexora_user_controls;
create policy "lexora_controls_admin_select" on public.lexora_user_controls for select to authenticated using (public.lexora_is_admin());
create policy "lexora_controls_admin_insert" on public.lexora_user_controls for insert to authenticated with check (public.lexora_is_admin());
create policy "lexora_controls_admin_update" on public.lexora_user_controls for update to authenticated using (public.lexora_is_admin()) with check (public.lexora_is_admin());
create policy "lexora_controls_admin_delete" on public.lexora_user_controls for delete to authenticated using (public.lexora_is_admin());

drop policy if exists "lexora_announcements_admin_all" on public.lexora_announcements;
create policy "lexora_announcements_admin_all"
on public.lexora_announcements for all to authenticated
using (public.lexora_is_admin())
with check (public.lexora_is_admin());

drop policy if exists "lexora_appeals_admin_select" on public.lexora_block_appeals;
drop policy if exists "lexora_appeals_admin_update" on public.lexora_block_appeals;
drop policy if exists "lexora_appeals_admin_delete" on public.lexora_block_appeals;
create policy "lexora_appeals_admin_select" on public.lexora_block_appeals for select to authenticated using (public.lexora_is_admin());
create policy "lexora_appeals_admin_update" on public.lexora_block_appeals for update to authenticated using (public.lexora_is_admin()) with check (public.lexora_is_admin());
create policy "lexora_appeals_admin_delete" on public.lexora_block_appeals for delete to authenticated using (public.lexora_is_admin());

drop policy if exists "lexora_appeal_images_admin_select" on storage.objects;
drop policy if exists "lexora_appeal_images_admin_delete" on storage.objects;
create policy "lexora_appeal_images_admin_select"
on storage.objects for select to authenticated
using (bucket_id = 'lexora-block-appeals' and public.lexora_is_admin());
create policy "lexora_appeal_images_admin_delete"
on storage.objects for delete to authenticated
using (bucket_id = 'lexora-block-appeals' and public.lexora_is_admin());

-- Read/reset learning records from the static admin panel.
drop policy if exists "lexora_user_data_admin_all" on public.lexora_user_data;
create policy "lexora_user_data_admin_all" on public.lexora_user_data for all to authenticated using (public.lexora_is_admin()) with check (public.lexora_is_admin());
drop policy if exists "lexora_saved_words_admin_all" on public.lexora_saved_words;
create policy "lexora_saved_words_admin_all" on public.lexora_saved_words for all to authenticated using (public.lexora_is_admin()) with check (public.lexora_is_admin());
drop policy if exists "lexora_achievements_admin_all" on public.lexora_user_achievements;
create policy "lexora_achievements_admin_all" on public.lexora_user_achievements for all to authenticated using (public.lexora_is_admin()) with check (public.lexora_is_admin());
drop policy if exists "lexora_writing_admin_all" on public.lexora_saved_writing;
create policy "lexora_writing_admin_all" on public.lexora_saved_writing for all to authenticated using (public.lexora_is_admin()) with check (public.lexora_is_admin());
drop policy if exists "lexora_dismissals_admin_all" on public.lexora_announcement_dismissals;
create policy "lexora_dismissals_admin_all" on public.lexora_announcement_dismissals for all to authenticated using (public.lexora_is_admin()) with check (public.lexora_is_admin());

-- Optional realtime refresh for the admin inbox.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'lexora_bug_reports'
  ) then
    alter publication supabase_realtime add table public.lexora_bug_reports;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'lexora_block_appeals'
  ) then
    alter publication supabase_realtime add table public.lexora_block_appeals;
  end if;
end $$;

-- IMPORTANT — make your existing Lexora account an admin.
-- Replace the email below, remove the two leading dashes, then run once:
-- insert into public.lexora_admins (user_id)
-- select id from auth.users where lower(email) = lower('YOUR_ADMIN_EMAIL@gmail.com')
-- on conflict (user_id) do nothing;


-- ============================================================
-- LEARNING QUALITY WORKFLOW V4
-- Run safely even when the bug table already exists.
-- ============================================================
alter table if exists public.lexora_bug_reports add column if not exists expected_result text;
alter table if exists public.lexora_bug_reports add column if not exists actual_result text;
alter table if exists public.lexora_bug_reports add column if not exists severity text default 'medium';
alter table if exists public.lexora_bug_reports add column if not exists content_ref text;
alter table if exists public.lexora_bug_reports add column if not exists priority text default 'normal';
alter table if exists public.lexora_bug_reports add column if not exists admin_reply text;
alter table if exists public.lexora_bug_reports add column if not exists assigned_to text;
alter table if exists public.lexora_bug_reports add column if not exists fixed_version text;
alter table if exists public.lexora_bug_reports add column if not exists resolution_summary text;
alter table if exists public.lexora_bug_reports add column if not exists user_notified_at timestamptz;


-- V11: learner activity heartbeat used by the admin's "Terakhir online".
alter table public.lexora_profiles
  add column if not exists last_seen_at timestamptz;

update public.lexora_profiles
set last_seen_at = coalesce(last_seen_at, last_sign_in_at, updated_at, created_at)
where last_seen_at is null;

drop policy if exists "lexora_profiles_self_update" on public.lexora_profiles;
create policy "lexora_profiles_self_update"
on public.lexora_profiles
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "lexora_profiles_self_insert" on public.lexora_profiles;
create policy "lexora_profiles_self_insert"
on public.lexora_profiles
for insert
to authenticated
with check (user_id = (select auth.uid()));

grant select, insert, update on public.lexora_profiles to authenticated;
