-- Extends the exercises reference table with the fields the exercise checklist
-- UI needs (sets, target reps, load-clearance gating), then seeds a starting
-- library covering all 7 phases. Run after 003_onboarding_phase_system.sql.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'exercises' and column_name = 'sets'
  ) then
    alter table exercises add column sets integer;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'exercises' and column_name = 'reps_target'
  ) then
    alter table exercises add column reps_target text;
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'exercises' and column_name = 'requires_load_clearance'
  ) then
    alter table exercises add column requires_load_clearance boolean not null default false;
  end if;
end $$;

-- Seed data. Safe to re-run: clears and re-inserts rather than upserting,
-- since exercises has no natural unique key yet.
delete from exercises;

insert into exercises (name, track, phase, instructions, sets, reps_target, requires_load_clearance, sort_order) values
  -- prehab_rom / rehab_protection: swelling control + early ROM
  ('Quad sets', 'prehab', 'prehab_rom', 'Tighten your thigh muscle, hold, and release.', 3, '10 x 5s hold', false, 0),
  ('Ankle pumps', 'prehab', 'prehab_rom', 'Point and flex your foot to keep circulation moving.', 3, '20', false, 1),
  ('Heel slides', 'prehab', 'prehab_rom', 'Slide your heel toward your glutes to work knee bend.', 3, '10', false, 2),
  ('Straight leg raise', 'prehab', 'prehab_rom', 'Keep the knee locked straight as you lift.', 3, '10', false, 3),
  ('Heel props (extension)', 'prehab', 'prehab_rom', 'Prop your heel up and let gravity work on full extension.', 3, '5 min hold', false, 4),

  ('Quad sets', 'rehab', 'rehab_protection', 'Tighten your thigh muscle, hold, and release.', 3, '10 x 5s hold', false, 0),
  ('Ankle pumps', 'rehab', 'rehab_protection', 'Point and flex your foot to keep circulation moving.', 3, '20', false, 1),
  ('Heel slides', 'rehab', 'rehab_protection', 'Slide your heel toward your glutes to work knee bend.', 3, '10', false, 2),
  ('Straight leg raise', 'rehab', 'rehab_protection', 'Keep the knee locked straight as you lift.', 3, '10', false, 3),
  ('Heel props (extension)', 'rehab', 'rehab_protection', 'Prop your heel up and let gravity work on full extension.', 3, '5 min hold', false, 4),

  -- prehab_activation / rehab_activation: quad activation + control
  ('Straight leg raise', 'prehab', 'prehab_activation', 'Keep the knee locked straight as you lift.', 3, '12', false, 0),
  ('Clamshells', 'prehab', 'prehab_activation', 'Lying on your side, knees bent, lift the top knee.', 3, '15', false, 1),
  ('Seated heel slides', 'prehab', 'prehab_activation', 'Seated, slide your heel back to build knee flexion.', 3, '10', false, 2),
  ('Patellar mobilizations', 'prehab', 'prehab_activation', 'Gently glide the kneecap side to side and up/down.', 2, '1 min', false, 3),
  ('Calf raises', 'prehab', 'prehab_activation', 'Rise onto your toes with control.', 3, '15', false, 4),

  ('Straight leg raise', 'rehab', 'rehab_activation', 'Keep the knee locked straight as you lift.', 3, '12', false, 0),
  ('Clamshells', 'rehab', 'rehab_activation', 'Lying on your side, knees bent, lift the top knee.', 3, '15', false, 1),
  ('Seated heel slides', 'rehab', 'rehab_activation', 'Seated, slide your heel back to build knee flexion.', 3, '10', false, 2),
  ('Glute bridges', 'rehab', 'rehab_activation', 'Squeeze your glutes to lift your hips.', 3, '12', false, 3),
  ('Calf raises', 'rehab', 'rehab_activation', 'Rise onto your toes with control.', 3, '15', false, 4),

  -- prehab_strength: closed-chain strength + balance
  ('Mini squats', 'prehab', 'prehab_strength', 'Small, controlled squats within a pain-free range.', 3, '10', false, 0),
  ('Step-ups', 'prehab', 'prehab_strength', 'Step up onto a low platform, leading with the operative leg.', 3, '10', false, 1),
  ('Single-leg balance', 'prehab', 'prehab_strength', 'Balance on one leg, use a wall for support if needed.', 3, '30s', false, 2),
  ('Glute bridges', 'prehab', 'prehab_strength', 'Squeeze your glutes to lift your hips.', 3, '12', false, 3),

  -- rehab_strength: loaded strength, mirrors prehab_strength plus load-gated work
  ('Mini squats', 'rehab', 'rehab_strength', 'Small, controlled squats within a pain-free range.', 3, '10', false, 0),
  ('Single-leg balance', 'rehab', 'rehab_strength', 'Balance on one leg, use a wall for support if needed.', 3, '30s', false, 1),
  ('Step-downs', 'rehab', 'rehab_strength', 'Step down slowly from a low platform, controlling the descent.', 3, '10', true, 2),
  ('Leg press', 'rehab', 'rehab_strength', 'Loaded leg press within a comfortable range.', 3, '10', true, 3),
  ('Walking lunges', 'rehab', 'rehab_strength', 'Controlled forward lunges, alternating legs.', 3, '10/leg', true, 4),
  ('Single-leg squat (assisted)', 'rehab', 'rehab_strength', 'Assisted single-leg squat, using support as needed.', 3, '8', true, 5);
