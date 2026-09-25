// Deletes the calling user's auth account. Every app table's user_id column
// references auth.users with "on delete cascade" (see schema.sql), so this
// single admin call also wipes their sessions, exercises_logged,
// rom_readings, milestone_checkins, clearance, waiver_acceptances, and
// user_profile rows — no need to delete them individually.
import { withSupabase } from 'npm:@supabase/server@^1'

export default {
  fetch: withSupabase({ auth: 'user' }, async (_req, ctx) => {
    const { supabaseAdmin, userClaims } = ctx

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userClaims.sub)
    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ deleted: true })
  }),
}
