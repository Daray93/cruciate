-- Adds two band exercises the user is already doing, into prehab_strength
-- (matches their difficulty level) so they're available via "Add from
-- another phase" while in an earlier phase.

insert into exercises
  (name, track, phase, category, instructions, purpose, sets, reps_target, frequency_note, equipment, requires_load_clearance, sort_order)
values
('Standing Leg Extension (Band)', 'prehab', 'prehab_strength', 'strength',
 'Loop a resistance band around your ankle, anchored behind you. Stand on your other leg and kick the banded leg forward, extending the knee straight, then return slowly and with control.',
 'Quad strength through a full range against resistance.', 3, '12-15', '3x weekly', 'Resistance band', false, 6),

('Standing Side Steps (Band)', 'prehab', 'prehab_strength', 'strength',
 'Loop a resistance band around your ankles or just above the knees. Stand with feet hip-width apart, knees slightly bent, and step sideways against the band''s resistance, keeping tension on the band throughout. Repeat in the other direction.',
 'Hip abductor and glute medius strength, key for knee stability and control.', 3, '10 each direction', '3x weekly', 'Resistance band', false, 7);
