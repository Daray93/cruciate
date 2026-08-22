-- Seeds the full prehab + 5-phase rehab exercise library, replacing the
-- earlier minimal seed. Run after 006_five_phase_rehab_protocol.sql.

delete from exercises;

insert into exercises
  (name, track, phase, category, instructions, purpose, cue, sets, reps_target, frequency_note, equipment, contraindications, requires_load_clearance, sort_order)
values

-- ===================== PREHAB PHASE 1: ROM RESTORATION =====================
('Prone Hang', 'prehab', 'prehab_rom', 'mobility',
 'Lie face-down on a bed with the knee and lower leg hanging off the edge. Let gravity pull the leg straight. Do not force, relax completely.',
 'Restore terminal knee extension using gravity.', null, 3, '5 min hold', '2-3x daily', 'Bed', 'Stop if sharp pain.', false, 0),

('Heel Slides', 'prehab', 'prehab_rom', 'mobility',
 'Lie on your back. Slide your heel toward your glutes, bending the knee as far as comfortable. Use a towel or strap to gently assist at end range. Hold 5 seconds, then slide back.',
 'Gradually restore knee bending range.', null, 3, '15', '2x daily', 'Towel or strap (optional)', null, false, 1),

('Wall Slides', 'prehab', 'prehab_rom', 'mobility',
 'Lie on your back with both feet on a wall, knees bent. Let the injured leg slowly slide down the wall under its own weight, increasing knee bend. Hold at max comfortable bend for 5 seconds.',
 'Deeper flexion work using gravity assist.', null, 3, '15', '1-2x daily', 'Wall', 'Comfortable with heel slides to about 100° first.', false, 2),

('Seated Knee Extension Stretch', 'prehab', 'prehab_rom', 'mobility',
 'Sit in a chair. Place the heel on another chair or stool so the leg is supported. Let gravity straighten the knee. Do not push down on the kneecap.',
 'Active terminal extension.', null, 3, '3 min hold', '2x daily', 'Chair or stool', null, false, 3),

('Ankle Pumps', 'prehab', 'prehab_rom', 'mobility',
 'Lying or seated, point toes down then pull toes up toward shin. Move only the ankle, steady rhythmic pumping.',
 'Reduce swelling via the calf muscle pump.', null, 3, '30', 'Every 1-2 hours if swollen', null, 'Especially important if the knee is acutely swollen.', false, 4),

('Patella Mobilisations', 'prehab', 'prehab_rom', 'mobility',
 'Sit with leg straight and relaxed. Use both thumbs to gently push the kneecap up, down, left, and right. Hold each direction 5 seconds.',
 'Prevent patellar adhesions and maintain patellar glide.', null, 2, '10 each direction', '1x daily', null, null, false, 5),

-- ===================== PREHAB PHASE 2: QUAD ACTIVATION =====================
('Quad Sets', 'prehab', 'prehab_activation', 'strength',
 'Sit or lie with the leg straight. Push the back of the knee into the floor/bed by tightening the thigh, focusing on the inner quad (VMO) firing. Hold for 10 seconds.',
 'Re-establish voluntary quad contraction, especially VMO.', 'Try to push a coin into the floor with the back of your knee.', 3, '15 (10s hold each)', '3x daily', null, null, false, 0),

('Straight Leg Raise (Supine)', 'prehab', 'prehab_activation', 'strength',
 'Lie on your back, injured leg straight, other knee bent with foot flat. Tighten the quad (lock the knee straight), then lift the entire leg to about 30° off the ground. Hold 3 seconds, lower slowly.',
 'Quad strength in an ACL-safe position.', null, 3, '15', '2x daily', null, 'If the knee bends or sags when lifting (extensor lag), go back to quad sets — the quad isn''t ready yet.', false, 1),

('Straight Leg Raise (Side-Lying)', 'prehab', 'prehab_activation', 'strength',
 'Lie on your uninjured side. Keep the injured leg straight and slightly behind your body. Lift it upward toward the ceiling about 30°. Hold 2 seconds, lower slowly.',
 'Strengthen hip abductors (glute med) — critical for knee stability.', null, 3, '15', '1x daily', null, null, false, 2),

('Straight Leg Raise (Prone)', 'prehab', 'prehab_activation', 'strength',
 'Lie face-down. Keep the injured leg straight. Squeeze the glute and lift the entire leg about 15° off the surface. Hold 2 seconds, lower slowly.',
 'Strengthen glutes and hamstrings.', null, 3, '15', '1x daily', null, null, false, 3),

('Standing Calf Raises', 'prehab', 'prehab_activation', 'strength',
 'Stand holding a wall or chair for balance. Rise up onto both toes, hold 2 seconds, lower slowly.',
 'Maintain calf strength, assist with swelling control.', null, 3, '15', '1x daily', 'Wall or chair for support', null, false, 4),

-- ===================== PREHAB PHASE 3: QUAD STRENGTH =====================
('Mini Squats (Bilateral)', 'prehab', 'prehab_strength', 'strength',
 'Stand with feet shoulder-width apart, toes slightly out. Bend knees to about 45° (quarter squat depth). Keep weight through heels, chest up. Slowly stand back up.',
 'Closed-chain quad strengthening.', null, 3, '15', '1x daily', null, null, false, 0),

('Single-Leg Mini Squat', 'prehab', 'prehab_strength', 'strength',
 'Stand on the injured leg, other foot slightly off the ground. Bend the knee to about 30-40°, keeping the knee tracking over the second toe. Use a wall or chair for balance if needed. Slowly stand back up.',
 'Unilateral quad strength and balance.', null, 3, '10', '1x daily', 'Wall or chair (optional)', 'Comfortable with bilateral mini squats to 45° first.', false, 1),

('Step-Ups (Forward)', 'prehab', 'prehab_strength', 'strength',
 'Stand in front of a low step (15-20cm). Step up leading with the injured leg, straighten fully at the top. Step back down slowly, controlling with the injured leg.',
 'Functional quad strength, stair simulation.', null, 3, '12', '1x daily', 'Low step (15-20cm)', null, false, 2),

('Lateral Step-Ups', 'prehab', 'prehab_strength', 'strength',
 'Stand beside a low step. Step up sideways leading with the injured leg. Fully straighten at the top, then lower slowly.',
 'Frontal-plane stability and VMO.', null, 3, '12 each side', '1x daily', 'Low step', null, false, 3),

('Terminal Knee Extension (Band)', 'prehab', 'prehab_strength', 'strength',
 'Loop a resistance band behind the knee, anchored at knee height. Stand facing the anchor with the knee slightly bent. Straighten the knee against the band''s resistance. Hold 3 seconds, slowly bend again.',
 'Isolated end-range quad strength (last 30° of extension).', null, 3, '15', '1x daily', 'Resistance band', null, false, 4),

('Hamstring Curls (Standing)', 'prehab', 'prehab_strength', 'strength',
 'Stand holding a wall. Bend the injured knee, bringing the heel toward the glute. Slowly lower.',
 'Hamstring strength — protects the ACL and balances quad dominance.', null, 3, '15', '1x daily', 'Wall for support', null, false, 5),

('Glute Bridges', 'prehab', 'prehab_strength', 'strength',
 'Lie on your back, knees bent, feet flat. Squeeze glutes and lift hips until body forms a straight line from shoulders to knees. Hold 3 seconds, lower slowly.',
 'Glute and hamstring strength.', null, 3, '15', '1x daily', null, null, false, 6),

-- ===================== REHAB PHASE 1: PROTECTION & EARLY ROM (0-2wk) =====================
('Ankle Pumps', 'rehab', 'rehab_protection', 'mobility',
 'Lying or seated, point toes down then pull toes up toward shin. Move only the ankle, steady rhythmic pumping.',
 'Reduce swelling via the calf muscle pump.', null, 3, '30', 'Every 1-2 hours while awake, especially days 0-5', null, 'Critical for DVT prevention and swelling — start the day of surgery.', false, 0),

('Prone Hang', 'rehab', 'rehab_protection', 'mobility',
 'Lie face-down on a bed with the knee and lower leg hanging off the edge. Let gravity pull the leg straight. Do not force, relax completely.',
 'Restore terminal knee extension using gravity.', null, 3, '5 min hold', '3x daily — the top priority in early rehab', 'Bed', 'Start day 1 post-op, or as tolerated with brace. Extension is harder to regain than flexion — prioritise this above all else.', false, 1),

('Heel Slides', 'rehab', 'rehab_protection', 'mobility',
 'Lie on your back. Slide your heel toward your glutes, bending the knee as far as comfortable. Use a towel or strap to gently assist at end range. Hold 5 seconds, then slide back.',
 'Gradually restore knee bending range.', null, 3, '15', '2x daily', 'Towel or strap (optional)', 'Start day 1-3 post-op. Go gently — target 90° by end of week 2, not before. Do not force.', false, 2),

('Quad Sets', 'rehab', 'rehab_protection', 'strength',
 'Sit or lie with the leg straight. Push the back of the knee into the floor/bed by tightening the thigh, focusing on the inner quad (VMO) firing. Hold for 10 seconds.',
 'Re-establish voluntary quad contraction, especially VMO.', 'Try to push a coin into the floor with the back of your knee.', 3, '5-10 reps per session', 'Every waking hour if possible', null, 'Start day 1 post-op. The quad will be inhibited — use biofeedback cues (watch the VMO, hand on thigh). A rolled towel under the knee can help. The single most important early rehab exercise.', false, 3),

('Patella Mobilisations', 'rehab', 'rehab_protection', 'mobility',
 'Sit with leg straight and relaxed. Use both thumbs to gently push the kneecap up, down, left, and right. Hold each direction 5 seconds.',
 'Prevent patellar adhesions and maintain patellar glide.', null, 2, '10 each direction', '1x daily, starting day 3-5 post-op', null, null, false, 4),

('Seated Knee Extension Stretch', 'rehab', 'rehab_protection', 'mobility',
 'Sit in a chair. Place the heel on another chair or stool so the leg is supported. Let gravity straighten the knee. Do not push down on the kneecap.',
 'Active terminal extension.', null, 3, '3 min hold', '2x daily, starting day 1 post-op', 'Chair or stool', null, false, 5),

-- ===================== REHAB PHASE 2: EARLY ACTIVATION (2-6wk) =====================
('Quad Sets', 'rehab', 'rehab_activation', 'strength',
 'Sit or lie with the leg straight. Push the back of the knee into the floor/bed by tightening the thigh, focusing on the inner quad (VMO) firing. Hold for 10 seconds.',
 'Re-establish voluntary quad contraction, especially VMO.', 'Try to push a coin into the floor with the back of your knee.', 3, '15 (10s hold each)', '3x daily', null, null, false, 0),

('Straight Leg Raise (Supine)', 'rehab', 'rehab_activation', 'strength',
 'Lie on your back, injured leg straight, other knee bent with foot flat. Tighten the quad (lock the knee straight), then lift the entire leg to about 30° off the ground. Hold 3 seconds, lower slowly.',
 'Quad strength in an ACL-safe position.', null, 3, '15', '1x daily', null, 'Add ankle weights (0.5kg then 1kg) once reps feel easy. If lag returns, drop back to quad sets.', false, 1),

('Straight Leg Raise (Side-Lying)', 'rehab', 'rehab_activation', 'strength',
 'Lie on your uninjured side. Keep the injured leg straight and slightly behind your body. Lift it upward toward the ceiling about 30°. Hold 2 seconds, lower slowly.',
 'Strengthen hip abductors (glute med) — critical for knee stability.', null, 3, '15', '1x daily', null, null, false, 2),

('Standing Calf Raises', 'rehab', 'rehab_activation', 'strength',
 'Stand holding a wall or chair for balance. Rise up onto both toes, hold 2 seconds, lower slowly.',
 'Maintain calf strength, assist with swelling control.', null, 3, '15', '1x daily, once comfortable weight-bearing', 'Wall or chair for support', null, false, 3),

('Mini Squats (Bilateral)', 'rehab', 'rehab_activation', 'strength',
 'Stand with feet shoulder-width apart, toes slightly out. Bend knees to about 30-45°. Keep weight through heels, chest up. Slowly stand back up.',
 'Closed-chain quad strengthening.', null, 3, '12', 'Start ~week 3-4 when weight-bearing is comfortable', null, 'No deep squats yet — keep weight through heels.', false, 4),

('Weight Shifts', 'rehab', 'rehab_activation', 'strength',
 'Stand with feet shoulder-width apart. Slowly shift weight onto the injured leg, hold 5 seconds, shift back. Progress to standing on the injured leg only for 10-30 seconds.',
 'Restore equal weight-bearing and proprioception.', null, 3, '10 shifts, or 30s single-leg holds', '1x daily', null, null, false, 5),

('Glute Bridges (Bilateral)', 'rehab', 'rehab_activation', 'strength',
 'Lie on your back, knees bent, feet flat. Squeeze glutes and lift hips until body forms a straight line from shoulders to knees. Hold 3 seconds, lower slowly.',
 'Glute and hamstring strength.', null, 3, '15', '1x daily', null, null, false, 6),

('Hamstring Curls (Standing)', 'rehab', 'rehab_activation', 'strength',
 'Stand holding a wall. Bend the injured knee, bringing the heel toward the glute. Slowly lower.',
 'Hamstring strength — protects the ACL and balances quad dominance.', null, 3, '15', '1x daily', 'Wall for support', null, false, 7),

('Stationary Bike (Low Resistance)', 'rehab', 'rehab_activation', 'strength',
 'Set the seat high enough that the knee can almost fully extend at the bottom. Start with partial revolutions (rocking back and forth) if full circles aren''t possible. Use minimal or zero resistance.',
 'ROM work, cardiovascular fitness, normalise cyclic motion.', null, null, '10-20 min', 'Daily if available', 'Stationary bike', 'Start when flexion reaches about 100-110°.', false, 8),

-- ===================== REHAB PHASE 3: STRENGTH BUILDING (6-12wk) =====================
('Stationary Bike (Low Resistance)', 'rehab', 'rehab_strength', 'strength',
 'Set the seat high enough that the knee can almost fully extend at the bottom. Use minimal or moderate resistance as tolerated.',
 'Cardiovascular fitness and cyclic knee motion.', null, null, '15-20 min', 'Daily if available', 'Stationary bike', null, false, 0),

('Standing Calf Raises', 'rehab', 'rehab_strength', 'strength',
 'Stand holding a wall or chair for balance. Rise up onto both toes, hold 2 seconds, lower slowly.',
 'Maintain calf strength.', null, 3, '15', '1x daily', 'Wall or chair for support', 'Progress to single-leg on the injured side as it feels ready.', false, 1),

('Glute Bridges (Bilateral)', 'rehab', 'rehab_strength', 'strength',
 'Lie on your back, knees bent, feet flat. Squeeze glutes and lift hips until body forms a straight line from shoulders to knees. Hold 3 seconds, lower slowly.',
 'Glute and hamstring strength.', null, 3, '15', '1x daily', null, 'Progress to single-leg (injured side only) as it feels ready.', false, 2),

('Step-Ups (Forward)', 'rehab', 'rehab_strength', 'strength',
 'Stand in front of a low step (15-20cm). Step up leading with the injured leg, straighten fully at the top. Step back down slowly, controlling with the injured leg.',
 'Functional quad strength, stair simulation.', null, 3, '12', 'Start ~week 6', 'Low step (15-20cm)', null, false, 3),

('Lateral Step-Ups', 'rehab', 'rehab_strength', 'strength',
 'Stand beside a low step. Step up sideways leading with the injured leg. Fully straighten at the top, then lower slowly.',
 'Frontal-plane stability and VMO.', null, 3, '12 each side', 'Start ~week 7', 'Low step', null, false, 4),

('Terminal Knee Extension (Band)', 'rehab', 'rehab_strength', 'strength',
 'Loop a resistance band behind the knee, anchored at knee height. Stand facing the anchor with the knee slightly bent. Straighten the knee against the band''s resistance. Hold 3 seconds, slowly bend again.',
 'Isolated end-range quad strength.', null, 3, '15', 'Start ~week 6', 'Resistance band', null, false, 5),

('Single-Leg Mini Squat', 'rehab', 'rehab_strength', 'strength',
 'Stand on the injured leg, other foot slightly off the ground. Bend the knee to about 30-40°, keeping the knee tracking over the second toe. Use a wall or chair for balance if needed.',
 'Unilateral quad strength and balance.', null, 3, '10', 'Start ~week 8, once bilateral squats feel strong', 'Wall or support (optional)', 'Use a wall or support initially.', false, 6),

('Hamstring Curls (Weighted)', 'rehab', 'rehab_strength', 'strength',
 'Stand holding a wall. Bend the injured knee, bringing the heel toward the glute, against the resistance of an ankle weight. Slowly lower.',
 'Hamstring strength — protects the ACL and balances quad dominance.', null, 3, '15', 'Start ~week 6', '1-2kg ankle weight', null, false, 7),

('Wall Sit', 'rehab', 'rehab_strength', 'strength',
 'Stand with back flat against a wall. Slide down until knees are at about 45-60° bend. Hold.',
 'Quad endurance.', null, 3, '30-60s hold', '1x daily', 'Wall', null, false, 8),

('Balance / Proprioception Training', 'rehab', 'rehab_strength', 'strength',
 'Stand on the injured leg. Hold for 30 seconds. Progress through tiers: eyes open on firm ground, eyes closed on firm ground, eyes open on an unstable surface (pillow or foam pad), eyes closed on an unstable surface.',
 'Restore neuromuscular control and joint position sense.', null, 3, '30s per tier', '1x daily', 'Pillow or foam pad (for later tiers)', null, false, 9),

-- ===================== REHAB PHASE 4: ADVANCED STRENGTH & POWER (12-20wk) =====================
('Goblet Squats', 'rehab', 'rehab_advanced', 'strength',
 'Hold a dumbbell or kettlebell at chest height. Squat to about 90° knee bend (parallel), keeping knees tracking over toes. Drive up through heels.',
 'Progressive quad loading in a functional pattern.', null, 3, '12', '3x per week', 'Dumbbell or kettlebell', 'Increase weight gradually, 2-5kg increments.', true, 0),

('Single-Leg Romanian Deadlift', 'rehab', 'rehab_advanced', 'strength',
 'Stand on the injured leg, holding a light dumbbell. Hinge at the hip, lowering the weight toward the floor while the free leg extends behind. Keep a slight knee bend. Return to standing.',
 'Posterior chain strength, hamstring loading, hip stability.', null, 3, '10 per side', '2-3x per week', 'Dumbbell', null, true, 1),

('Leg Press', 'rehab', 'rehab_advanced', 'strength',
 'Use a leg press machine. Start with both legs, moderate weight. Press through the heels. Do not lock the knee at the top. Controlled descent.',
 'Heavy quad loading in a controlled, safe environment.', null, 3, '12', '2-3x per week', 'Leg press machine', 'If unavailable, substitute goblet squats.', true, 2),

('Box Step-Downs', 'rehab', 'rehab_advanced', 'strength',
 'Stand on a 15-20cm box on the injured leg. Slowly lower the opposite foot to touch the ground, bending the injured knee. Touch lightly, then drive back up.',
 'Eccentric quad strength and knee control during descent.', null, 3, '10', '1x daily', '15-20cm box or step', 'Knee should not cave inward — a good test of knee control.', false, 3),

('Low-Impact Plyometrics', 'rehab', 'rehab_advanced', 'strength',
 'Progress through tiers: double-leg mini hops in place with a soft landing, double-leg forward hops holding the landing 3 seconds, then double-leg lateral hops side-to-side.',
 'Teach landing mechanics, begin power development.', 'Land softly — if you can hear it, you''re landing too hard.', 3, '10 hops per tier', '2-3x per week', null, 'No single-leg plyometrics yet. Watch for the knee caving inward on landing.', false, 4),

('Single-Leg Mini Squat', 'rehab', 'rehab_advanced', 'strength',
 'Stand on the injured leg, other foot slightly off the ground. Bend the knee to about 30-40°, keeping the knee tracking over the second toe.',
 'Maintenance unilateral quad strength and balance.', null, 3, '10', 'Continue as maintenance strength work', null, null, false, 5),

('Terminal Knee Extension (Band)', 'rehab', 'rehab_advanced', 'strength',
 'Loop a resistance band behind the knee, anchored at knee height. Straighten the knee against the band''s resistance. Hold 3 seconds, slowly bend again.',
 'Maintenance end-range quad strength.', null, 3, '15', 'Continue as maintenance strength work', 'Resistance band', null, false, 6),

('Wall Sit', 'rehab', 'rehab_advanced', 'strength',
 'Stand with back flat against a wall. Slide down until knees are at about 45-60° bend. Hold.',
 'Maintenance quad endurance.', null, 3, '30-60s hold', 'Continue as maintenance strength work', 'Wall', null, false, 7),

-- ===================== REHAB PHASE 5: RETURN TO SPORT PREP (20wk+) =====================
('Running Progression', 'rehab', 'rehab_return_to_sport', 'strength',
 'Progress through tiers: walk 5 min / jog 1 min / walk 2 min, repeated 4-5x; then walk 3 min / jog 3 min, repeated; then jog 10 min continuous; then jog 20 min continuous; then add pace changes within a 20 min run.',
 'Gradual return to running.', null, null, 'See tiers in instructions', '3x per week, with rest days between', null, 'If swelling or pain after a session, repeat the same tier next time — do not advance.', false, 0),

('Single-Leg Plyometrics', 'rehab', 'rehab_return_to_sport', 'strength',
 'Progress through tiers: single-leg small hops in place, single-leg forward hops holding the landing 3 seconds, single-leg lateral hops, single-leg hop-and-stick from a small box.',
 'Restore explosive power and confidence in the injured leg.', null, 3, '8 per tier', '2x per week', null, 'Quality over quantity — every landing must be controlled.', false, 1),

('Agility Ladder / Cone Drills', 'rehab', 'rehab_return_to_sport', 'strength',
 'Progress through tiers: forward/backward ladder runs, lateral shuffles through cones, figure-of-8 runs around cones, then cutting drills at increasing speed (45° cuts, then 90° cuts).',
 'Multi-directional movement confidence.', null, null, '10-15 min', '2x per week', 'Agility ladder, cones', 'Start slow — speed is earned through clean mechanics.', false, 2),

('Deceleration Training', 'rehab', 'rehab_return_to_sport', 'strength',
 'Sprint 5-10 metres, then decelerate to a stop over 3-5 steps. Focus on bending the knees, staying low, and not letting the knee cave inward on the plant foot.',
 'Teach safe stopping mechanics — this is where most ACL re-injuries happen.', 'Absorb the stop — knees bent, hips back, chest up.', 3, '6', '2x per week', null, null, false, 3),

('Sport-Specific Drills', 'rehab', 'rehab_return_to_sport', 'strength',
 'Choose drills relevant to your sport. Football/soccer: dribbling, passing, controlled shooting. Basketball: defensive slides, layup drills. Running: tempo runs, hill repeats. General fitness: circuit training with compound movements.',
 'Bridge from rehab back to sport.', null, null, 'As appropriate to your sport', 'As appropriate', null, null, false, 4),

('Goblet Squats', 'rehab', 'rehab_return_to_sport', 'strength',
 'Hold a dumbbell or kettlebell at chest height. Squat to about 90° knee bend, keeping knees tracking over toes. Drive up through heels.',
 'Maintenance quad loading.', null, 3, '12', 'Continue as maintenance strength work', 'Dumbbell or kettlebell', null, true, 5),

('Box Step-Downs', 'rehab', 'rehab_return_to_sport', 'strength',
 'Stand on a 15-20cm box on the injured leg. Slowly lower the opposite foot to touch the ground, bending the injured knee. Touch lightly, then drive back up.',
 'Maintenance eccentric quad control.', null, 3, '10', 'Continue as maintenance strength work', '15-20cm box or step', null, false, 6);
