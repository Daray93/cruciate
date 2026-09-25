-- Lets a user hide an exercise that's normally scheduled for their phase, or
-- pull in an exercise from a different phase into today's list. One row per
-- (user, exercise): hidden=true suppresses a native exercise, hidden=false on
-- an exercise outside the current phase means "manually added".

create table if not exists user_exercise_prefs (
  user_id uuid not null references auth.users (id) on delete cascade,
  exercise_id uuid not null references exercises (id) on delete cascade,
  hidden boolean not null default false,
  primary key (user_id, exercise_id)
);

alter table user_exercise_prefs enable row level security;

grant select, insert, update, delete on user_exercise_prefs to authenticated;

create policy "user_exercise_prefs_select_own" on user_exercise_prefs
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "user_exercise_prefs_insert_own" on user_exercise_prefs
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "user_exercise_prefs_update_own" on user_exercise_prefs
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "user_exercise_prefs_delete_own" on user_exercise_prefs
  for delete to authenticated
  using ((select auth.uid()) = user_id);
