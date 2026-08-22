-- Enables the "Delete profile" flow in Settings: users can delete their own
-- user_profile, clearance, and waiver_acceptances rows. clearance and
-- waiver_acceptances already had DELETE granted at the table level but no
-- RLS policy, so RLS was silently blocking it; user_profile had neither.

grant delete on user_profile to authenticated;

create policy "user_profile_delete_own" on user_profile
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "clearance_delete_own" on clearance
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "waiver_acceptances_delete_own" on waiver_acceptances
  for delete to authenticated
  using ((select auth.uid()) = user_id);
