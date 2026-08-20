-- Cruciate: initial schema for ACL prehab/rehab tracking
-- Run in the Supabase SQL editor (or via `supabase db push`) against a fresh project.

-- sessions: one row per day the user checks in
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  day_key text not null,
  cycle_week integer not null,
  red_flag boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists sessions_user_id_date_idx on sessions (user_id, date desc);

-- exercises_logged: one row per exercise performed within a session
create table if not exists exercises_logged (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  name text not null,
  done boolean not null default false,
  weight numeric,
  reps integer,
  rpe numeric
);

create index if not exists exercises_logged_session_id_idx on exercises_logged (session_id);

-- rom_readings: range-of-motion measurements taken within a session
create table if not exists rom_readings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  extension numeric,
  flexion numeric
);

create index if not exists rom_readings_session_id_idx on rom_readings (session_id);

-- clearance: one row per user, tracks clinician sign-off toggles
create table if not exists clearance (
  user_id uuid primary key references auth.users (id) on delete cascade,
  load_cleared boolean not null default false,
  run_cleared boolean not null default false
);

-- waiver_acceptances: records that the user accepted the legal/medical waiver,
-- versioned so a future waiver text change can force re-acceptance.
create table if not exists waiver_acceptances (
  user_id uuid primary key references auth.users (id) on delete cascade,
  version text not null,
  accepted_at timestamptz not null default now()
);

-- Row Level Security: every table is scoped to the owning user.
alter table sessions enable row level security;
alter table exercises_logged enable row level security;
alter table rom_readings enable row level security;
alter table clearance enable row level security;
alter table waiver_acceptances enable row level security;

-- With "Automatically expose new tables" left off, the authenticated role
-- needs explicit table-level grants before RLS policies even get evaluated.
-- No grants to anon: every table here requires a signed-in user.
grant select, insert, update, delete on sessions to authenticated;
grant select, insert, update, delete on exercises_logged to authenticated;
grant select, insert, update, delete on rom_readings to authenticated;
grant select, insert, update, delete on clearance to authenticated;
grant select, insert, update, delete on waiver_acceptances to authenticated;

create policy "sessions_select_own" on sessions
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "sessions_insert_own" on sessions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "sessions_update_own" on sessions
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "sessions_delete_own" on sessions
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- exercises_logged / rom_readings have no user_id column of their own, so
-- ownership is checked by joining back to the parent session.
create policy "exercises_logged_select_own" on exercises_logged
  for select to authenticated
  using (
    exists (select 1 from sessions where sessions.id = exercises_logged.session_id and sessions.user_id = (select auth.uid()))
  );
create policy "exercises_logged_insert_own" on exercises_logged
  for insert to authenticated
  with check (
    exists (select 1 from sessions where sessions.id = exercises_logged.session_id and sessions.user_id = (select auth.uid()))
  );
create policy "exercises_logged_update_own" on exercises_logged
  for update to authenticated
  using (
    exists (select 1 from sessions where sessions.id = exercises_logged.session_id and sessions.user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from sessions where sessions.id = exercises_logged.session_id and sessions.user_id = (select auth.uid()))
  );
create policy "exercises_logged_delete_own" on exercises_logged
  for delete to authenticated
  using (
    exists (select 1 from sessions where sessions.id = exercises_logged.session_id and sessions.user_id = (select auth.uid()))
  );

create policy "rom_readings_select_own" on rom_readings
  for select to authenticated
  using (
    exists (select 1 from sessions where sessions.id = rom_readings.session_id and sessions.user_id = (select auth.uid()))
  );
create policy "rom_readings_insert_own" on rom_readings
  for insert to authenticated
  with check (
    exists (select 1 from sessions where sessions.id = rom_readings.session_id and sessions.user_id = (select auth.uid()))
  );
create policy "rom_readings_update_own" on rom_readings
  for update to authenticated
  using (
    exists (select 1 from sessions where sessions.id = rom_readings.session_id and sessions.user_id = (select auth.uid()))
  ) with check (
    exists (select 1 from sessions where sessions.id = rom_readings.session_id and sessions.user_id = (select auth.uid()))
  );
create policy "rom_readings_delete_own" on rom_readings
  for delete to authenticated
  using (
    exists (select 1 from sessions where sessions.id = rom_readings.session_id and sessions.user_id = (select auth.uid()))
  );

create policy "clearance_select_own" on clearance
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "clearance_insert_own" on clearance
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "clearance_update_own" on clearance
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "waiver_acceptances_select_own" on waiver_acceptances
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "waiver_acceptances_insert_own" on waiver_acceptances
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "waiver_acceptances_update_own" on waiver_acceptances
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
