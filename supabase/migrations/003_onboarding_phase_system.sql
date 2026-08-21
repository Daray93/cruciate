-- Adds the onboarding + phase/milestone system: user_profile, milestone_checkins,
-- and a phase-aware exercises reference table. Run against an existing project
-- that already has schema.sql + 002_upsert_constraints.sql applied.
--
-- Phase ids used throughout (track -> ordered phases):
--   prehab: prehab_rom -> prehab_activation -> prehab_strength -> prehab_ready
--   rehab:  rehab_protection (~wk 0-2) -> rehab_activation (~wk 2-6) -> rehab_strength (~wk 6+)

-- user_profile: one row per user, written on onboarding completion.
-- Row presence (not a boolean flag) is what signals "onboarding complete",
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

-- Row Level Security
alter table user_profile enable row level security;
alter table milestone_checkins enable row level security;
alter table exercises enable row level security;

grant select, insert, update on user_profile to authenticated;
grant select, insert, update, delete on milestone_checkins to authenticated;
grant select on exercises to authenticated;

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
