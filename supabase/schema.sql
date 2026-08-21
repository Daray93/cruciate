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

-- exercises_logged: one row per exercise performed within a session.
-- Unique on (session_id, name) so a single exercise can be upserted in
-- place as the user edits it, instead of accumulating duplicate rows.
create table if not exists exercises_logged (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  name text not null,
  done boolean not null default false,
  weight numeric,
  reps integer,
  rpe numeric,
  unique (session_id, name)
);

create index if not exists exercises_logged_session_id_idx on exercises_logged (session_id);

-- rom_readings: range-of-motion measurement taken during a session.
-- Unique on session_id so it can be upserted (one reading per check-in).
create table if not exists rom_readings (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions (id) on delete cascade,
  extension numeric,
  flexion numeric,
  unique (session_id)
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

-- Phase ids used throughout (track -> ordered phases):
--   prehab: prehab_rom -> prehab_activation -> prehab_strength -> prehab_ready
--   rehab:  rehab_protection (~wk 0-2) -> rehab_activation (~wk 2-6) -> rehab_strength (~wk 6+)

-- user_profile: one row per user, written on onboarding completion. Row
-- presence (not a boolean flag) is what signals "onboarding complete",
-- mirroring how waiver_acceptances already gates the waiver screen.
create table if not exists user_profile (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  age integer,
  track text not null check (track in ('prehab', 'rehab')),
  surgery_timeframe text check (surgery_timeframe in ('scheduled', 'considering', 'no_date')),
  surgery_date date,
  knee_side text check (knee_side in ('left', 'right')),
  graft_type text check (graft_type in ('patellar_tendon', 'hamstring', 'quad_tendon', 'unknown')),
  current_phase text not null check (
    current_phase in (
      'prehab_rom', 'prehab_activation', 'prehab_strength', 'prehab_ready',
      'rehab_protection', 'rehab_activation', 'rehab_strength'
    )
  ),
  phase_advanced_at timestamptz not null default now(),
  phase_advanced_by text check (phase_advanced_by in ('milestone', 'override')),
  created_at timestamptz not null default now(),
  -- rehab requires a surgery date (used to calculate weeks post-op); prehab does not.
  constraint user_profile_rehab_requires_surgery_date check (track = 'prehab' or surgery_date is not null)
);

-- milestone_checkins: one row per question answered in a check-in event.
-- Several rows share the same (user_id, phase_target, date) to form one
-- check-in; `passed` records that question's individual pass/fail so
-- user_phase can be derived from the latest fully-passed check-in per
-- phase_target, per the "surgery_date + latest passed check-in" rule.
create table if not exists milestone_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  phase_target text not null check (
    phase_target in (
      'prehab_rom', 'prehab_activation', 'prehab_strength', 'prehab_ready',
      'rehab_protection', 'rehab_activation', 'rehab_strength'
    )
  ),
  question_id text not null,
  response text not null,
  passed boolean not null,
  date date not null default current_date
);

create index if not exists milestone_checkins_user_phase_date_idx
  on milestone_checkins (user_id, phase_target, date desc);

-- exercises: shared reference data (not user-owned), scoped by track + phase.
create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  track text not null check (track in ('prehab', 'rehab')),
  phase text not null check (
    phase in (
      'prehab_rom', 'prehab_activation', 'prehab_strength', 'prehab_ready',
      'rehab_protection', 'rehab_activation', 'rehab_strength'
    )
  ),
  instructions text,
  sort_order integer not null default 0
);

create index if not exists exercises_track_phase_idx on exercises (track, phase);

-- Row Level Security: every table is scoped to the owning user.
alter table sessions enable row level security;
alter table exercises_logged enable row level security;
alter table rom_readings enable row level security;
alter table clearance enable row level security;
alter table waiver_acceptances enable row level security;
alter table user_profile enable row level security;
alter table milestone_checkins enable row level security;
alter table exercises enable row level security;

-- With "Automatically expose new tables" left off, the authenticated role
-- needs explicit table-level grants before RLS policies even get evaluated.
-- No grants to anon: every table here requires a signed-in user.
grant select, insert, update, delete on sessions to authenticated;
grant select, insert, update, delete on exercises_logged to authenticated;
grant select, insert, update, delete on rom_readings to authenticated;
grant select, insert, update, delete on clearance to authenticated;
grant select, insert, update, delete on waiver_acceptances to authenticated;
grant select, insert, update on user_profile to authenticated;
grant select, insert, update, delete on milestone_checkins to authenticated;
grant select on exercises to authenticated;

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

create policy "user_profile_select_own" on user_profile
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "user_profile_insert_own" on user_profile
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "user_profile_update_own" on user_profile
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "milestone_checkins_select_own" on milestone_checkins
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "milestone_checkins_insert_own" on milestone_checkins
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "milestone_checkins_update_own" on milestone_checkins
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "milestone_checkins_delete_own" on milestone_checkins
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- exercises is shared reference data: every authenticated user can read all
-- rows, and only the service role (dashboard / seed scripts) can write.
create policy "exercises_select_all" on exercises
  for select to authenticated
  using (true);
