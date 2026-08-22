-- prehab_ready is a status checkpoint, not its own exercise phase — the doc
-- is explicit that Phase 3 exercises continue as maintenance until surgery
-- date. That carryover was never actually seeded, leaving anyone at
-- prehab_ready with an empty Today's Rehab page. Mirrors prehab_strength's
-- seed rows under prehab_ready.

insert into exercises
  (name, track, phase, category, instructions, purpose, cue, sets, reps_target, frequency_note, equipment, contraindications, requires_load_clearance, sort_order)
values
('Mini Squats (Bilateral)', 'prehab', 'prehab_ready', 'strength',
 'Stand with feet shoulder-width apart, toes slightly out. Bend knees to about 45° (quarter squat depth). Keep weight through heels, chest up. Slowly stand back up.',
 'Maintenance closed-chain quad strengthening.', null, 3, '15', 'Continue as maintenance work until surgery', null, null, false, 0),

('Single-Leg Mini Squat', 'prehab', 'prehab_ready', 'strength',
 'Stand on the injured leg, other foot slightly off the ground. Bend the knee to about 30-40°, keeping the knee tracking over the second toe. Use a wall or chair for balance if needed. Slowly stand back up.',
 'Maintenance unilateral quad strength and balance.', null, 3, '10', 'Continue as maintenance work until surgery', 'Wall or chair (optional)', null, false, 1),

('Step-Ups (Forward)', 'prehab', 'prehab_ready', 'strength',
 'Stand in front of a low step (15-20cm). Step up leading with the injured leg, straighten fully at the top. Step back down slowly, controlling with the injured leg.',
 'Maintenance functional quad strength.', null, 3, '12', 'Continue as maintenance work until surgery', 'Low step (15-20cm)', null, false, 2),

('Lateral Step-Ups', 'prehab', 'prehab_ready', 'strength',
 'Stand beside a low step. Step up sideways leading with the injured leg. Fully straighten at the top, then lower slowly.',
 'Maintenance frontal-plane stability and VMO.', null, 3, '12 each side', 'Continue as maintenance work until surgery', 'Low step', null, false, 3),

('Terminal Knee Extension (Band)', 'prehab', 'prehab_ready', 'strength',
 'Loop a resistance band behind the knee, anchored at knee height. Stand facing the anchor with the knee slightly bent. Straighten the knee against the band''s resistance. Hold 3 seconds, slowly bend again.',
 'Maintenance end-range quad strength.', null, 3, '15', 'Continue as maintenance work until surgery', 'Resistance band', null, false, 4),

('Hamstring Curls (Standing)', 'prehab', 'prehab_ready', 'strength',
 'Stand holding a wall. Bend the injured knee, bringing the heel toward the glute. Slowly lower.',
 'Maintenance hamstring strength.', null, 3, '15', 'Continue as maintenance work until surgery', 'Wall for support', null, false, 5),

('Glute Bridges', 'prehab', 'prehab_ready', 'strength',
 'Lie on your back, knees bent, feet flat. Squeeze glutes and lift hips until body forms a straight line from shoulders to knees. Hold 3 seconds, lower slowly.',
 'Maintenance glute and hamstring strength.', null, 3, '15', 'Continue as maintenance work until surgery', null, null, false, 6);
