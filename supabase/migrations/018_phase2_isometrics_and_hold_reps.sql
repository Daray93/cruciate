-- Prehab Phase 2 (quad activation) gets four more quad-loading options, with
-- isometric holds as the backbone: wall sit, Spanish squat, calf raises, and
-- a banded isometric knee extension. Isometrics load the quad hard with
-- little joint shear, which suits an ACL-deficient knee at this stage.
--
-- Also lets a held exercise count each hold as a rep. Quad Sets are 3 sets
-- of 15 x 10s holds, but the app could only count sets, so the counter
-- stopped at 3. `hold_reps` is how many holds make one set (null = 1), and
-- `exercises_logged.holds_completed` saves progress through the current set.

alter table exercises add column if not exists hold_reps integer;
alter table exercises_logged add column if not exists holds_completed integer not null default 0;

update exercises set hold_reps = 15 where name = 'Quad Sets';

insert into exercises
  (name, track, phase, category, instructions, purpose, cue, sets, reps_target, frequency_note, equipment, contraindications, requires_load_clearance, hold_seconds, sort_order)
values

('Wall Sit (Isometric)', 'prehab', 'prehab_activation', 'strength',
 'Stand with your back flat against a wall, feet shoulder-width apart and a step out from the wall. Slide down until your knees bend to about 45-60 degrees. Hold, keeping even weight through both legs.',
 'Quad strength and endurance with very low joint stress. Go deeper toward 90 degrees as it gets easier.',
 'Push the wall away with your back.', 3, '30s hold', '1x daily', 'Wall', 'Stay pain-free. Come up higher if the knee aches.', false, 30, 6),

('Spanish Squat', 'prehab', 'prehab_activation', 'strength',
 'Loop a heavy band around a fixed post and step into it so it sits behind both knees. Walk back until the band is tight. Sit back into a squat with your shins vertical, letting the band hold your knees. Hold at a depth you can manage without pain.',
 'Loads the quad hard while the band takes strain off the front of the knee. One of the best quad isometrics there is.',
 'Shins stay vertical. Sit back, not down.', 3, '30s hold', '1x daily', 'Heavy resistance band, fixed anchor', 'Start shallow. Only go deeper if it stays pain-free.', false, 30, 7),

('Calf Raises', 'prehab', 'prehab_activation', 'strength',
 'Stand on both feet holding a wall or chair. Rise up onto your toes with control, pause at the top, then lower slowly. Move to single-leg on the injured side once this is easy.',
 'Calf strength for walking push-off. The calf also helps stabilise the knee.',
 null, 3, '15', '1x daily', 'Wall or chair for support', null, false, null, 8),

('Isometric Knee Extension (Band)', 'prehab', 'prehab_activation', 'strength',
 'Sit on a chair with a band looped around your ankle and anchored to the chair leg behind you. Keep the knee bent at about 60-90 degrees and push your shin forward into the band without letting the leg move. Hold.',
 'Strong quad contraction at a knee angle that puts little strain on the ACL.',
 'Push into the band. The leg should not move.', 3, '30s hold', '1x daily', 'Resistance band, chair', 'Keep the knee bent past 60 degrees. Do not straighten against the band.', false, 30, 9)

on conflict (track, phase, name) do nothing;

-- Mini Squats isn't a native Phase 2 exercise, so it only shows up there if
-- it was added from Phase 3. Remove that "added" pref (and any added copy of
-- the Phase 3 wall sit, which would now show twice).
delete from user_exercise_prefs
where hidden = false
  and exercise_id in (
    select id from exercises
    where track = 'prehab'
      and phase <> 'prehab_activation'
      and (name ilike 'mini squat%' or name = 'Wall Sit (Isometric)')
  );
