-- Replaces the 007 + 009 seed pair with one consolidated, research-grounded
-- exercise library. Every phase now carries at least one mobility and one
-- strength exercise (007 skewed some phases toward a single category), and
-- equipment is filled in wherever an exercise actually needs something.
--
-- Sourced from published ACL protocols and PT guidance (Jeremy Burnham MD's
-- phase-by-phase ACL rehab guide, [P]rehab Guys' pre-surgery exercise guide,
-- Brigham & Women's ACL reconstruction protocol), adapted to this app's
-- 9-phase structure.
--
-- Also the actual fix for the duplicate-exercise bug: 009 was a plain INSERT
-- with no delete and no unique key, so re-running it (even once, by hand in
-- the SQL editor) appended a second copy of every prehab_ready row. This
-- migration deletes-and-reinserts everything in one shot (safe to re-run on
-- its own), then adds a unique constraint so an accidental re-run of any
-- future seed script fails loudly instead of silently duplicating rows.

delete from exercises;

insert into exercises
  (name, track, phase, category, instructions, purpose, cue, sets, reps_target, frequency_note, equipment, contraindications, requires_load_clearance, sort_order)
values

-- ===================== PREHAB PHASE 1: ROM RESTORATION =====================
('Prone Hang', 'prehab', 'prehab_rom', 'mobility',
 'Lie face-down on a bed with the knee and lower leg hanging off the edge. Let gravity pull the leg straight. Do not force it, relax completely.',
 'Restore terminal knee extension using gravity, without actively pushing.', null, 3, '5 min hold', '2-3x daily', 'Bed', 'Stop if sharp pain.', false, 0),

('Heel Slides', 'prehab', 'prehab_rom', 'mobility',
 'Lie on your back. Slide your heel toward your glutes, bending the knee as far as comfortable. A towel looped around the foot can help pull gently at end range. Hold 5 seconds, then slide back.',
 'Gradually restore knee bending range.', null, 3, '15', '2x daily', 'Towel or strap (optional)', null, false, 1),

('Seated Knee Extension', 'prehab', 'prehab_rom', 'mobility',
 'Sit in a chair with your heel propped on another chair or stool so the whole leg is supported. Relax and let gravity straighten the knee over a few minutes.',
 'Passive, low-load stretch into full extension.', null, 3, '3 min hold', '2x daily', 'Chair or stool', null, false, 2),

('Ankle Pumps', 'prehab', 'prehab_rom', 'mobility',
 'Lying or seated, point your toes down then pull them up toward your shin. Move only the ankle, steady rhythmic pumping.',
 'Reduce swelling via the calf muscle pump.', null, 3, '30', 'Every 1-2 hours if swollen', null, 'Especially important if the knee is acutely swollen.', false, 3),

('Patellar Mobilisations', 'prehab', 'prehab_rom', 'mobility',
 'Sit with your leg straight and relaxed. Use both thumbs to gently glide the kneecap up, down, left, and right. Hold each direction 5 seconds.',
 'Keep the kneecap gliding freely and prevent stiffness.', null, 2, '10 each direction', '1x daily', null, null, false, 4),

('Quad Sets', 'prehab', 'prehab_rom', 'strength',
 'Sit or lie with the leg straight. Push the back of your knee down by tightening your thigh, focusing on the inner quad muscle firing. Hold 10 seconds.',
 'Re-establish voluntary quad contraction before it has a chance to shut down.', 'Try to push a coin into the floor with the back of your knee.', 3, '15 (10s hold each)', '3x daily', null, null, false, 5),

('Straight Leg Raise', 'prehab', 'prehab_rom', 'strength',
 'Lying on your back, tighten your thigh to lock the knee straight, then lift the whole leg about 30cm off the ground. Hold 3 seconds, lower slowly.',
 'Quad strength in a fully knee-safe position.', null, 3, '10', '2x daily', null, 'If the knee bends or sags when lifting, that''s a lag — go back to quad sets first.', false, 6),

-- ===================== PREHAB PHASE 2: QUAD ACTIVATION =====================
('Quad Sets', 'prehab', 'prehab_activation', 'strength',
 'Sit or lie with the leg straight. Push the back of your knee down by tightening your thigh. Hold 10 seconds with a strong, visible contraction.',
 'Keep building on the voluntary quad contraction from Phase 1.', null, 3, '15 (10s hold each)', '2x daily', null, null, false, 0),

('Straight Leg Raise (Supine)', 'prehab', 'prehab_activation', 'strength',
 'Lying on your back, injured leg straight, other knee bent with foot flat. Lock the knee straight, lift to about 30°. Hold 3 seconds, lower slowly.',
 'Quad strength in an ACL-friendly position.', null, 3, '15', '2x daily', null, null, false, 1),

('Straight Leg Raise (Side-Lying)', 'prehab', 'prehab_activation', 'strength',
 'Lie on your uninjured side. Keep the injured leg straight and lift it toward the ceiling about 30°. Hold 2 seconds, lower slowly.',
 'Strengthen the hip abductors that help control the knee.', null, 3, '15', '1x daily', null, null, false, 2),

('Staggered Box Squat', 'prehab', 'prehab_activation', 'strength',
 'Stand with one foot staggered slightly forward in front of a box or sturdy chair. Squat down under control until you tap the box, then stand back up.',
 'Closed-chain quad strengthening within a comfortable range.', null, 3, '10', '3x weekly', 'Box or sturdy chair', null, false, 3),

('Glute Bridges', 'prehab', 'prehab_activation', 'strength',
 'Lie on your back, knees bent, feet flat. Squeeze your glutes to lift your hips until your body forms a straight line from shoulders to knees.',
 'Build hip and glute strength that supports the knee.', null, 3, '12', '1x daily', null, null, false, 4),

('Seated Heel Slides', 'prehab', 'prehab_activation', 'mobility',
 'Sitting on the edge of a chair or bed, slide your heel back underneath you to bend the knee further, then slide it back out.',
 'Maintain and build on the knee-bend range from Phase 1.', null, 3, '10', '1x daily', null, null, false, 5),

-- ===================== PREHAB PHASE 3: QUAD STRENGTH =====================
('Mini Squats', 'prehab', 'prehab_strength', 'strength',
 'Stand with feet shoulder-width apart. Bend both knees to about 45 degrees, keeping weight through your heels, then stand back up.',
 'Closed-chain quad strengthening at a deeper range than Phase 2.', null, 3, '12', '3x weekly', null, null, false, 0),

('Step-Ups', 'prehab', 'prehab_strength', 'strength',
 'Stand in front of a low step or platform. Step up leading with the injured leg, straighten fully at the top, then step back down slowly.',
 'Functional single-leg quad strength.', null, 3, '10', '3x weekly', 'Low step (10-15cm)', null, false, 1),

('Single-Leg Balance', 'prehab', 'prehab_strength', 'strength',
 'Stand on the injured leg only, arms out for balance if needed. Hold as steady as possible.',
 'Build the balance and control you will need for a confident single-leg stance after surgery.', null, 3, '30s', '1x daily', 'Wall for support (optional)', null, false, 2),

('Glute Bridges', 'prehab', 'prehab_strength', 'strength',
 'Lie on your back, knees bent, feet flat. Squeeze your glutes to lift your hips into a straight line, hold, then lower.',
 'Continue building hip and glute strength.', null, 3, '15', '1x daily', null, null, false, 3),

('Hamstring Curls (Standing)', 'prehab', 'prehab_strength', 'strength',
 'Stand holding a wall or chair for balance. Bend the injured knee, bringing your heel toward your glute, then lower slowly. Add a resistance band around the ankle once this feels easy.',
 'Hamstring strength — the ACL''s natural co-stabiliser.', null, 3, '15', '3x weekly', 'Resistance band (optional)', null, false, 4),

('Standing Quad Stretch', 'prehab', 'prehab_strength', 'mobility',
 'Standing and holding a wall for balance, bend your knee and hold your ankle behind you, gently stretching the front of your thigh.',
 'Keep the quad muscle length and knee flexion comfortable as strength work ramps up.', null, 2, '30s hold', '1x daily', 'Wall for support (optional)', null, false, 5),

-- ===================== PREHAB FINAL CHECKPOINT: MAINTENANCE UNTIL SURGERY =====================
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
 'Maintenance frontal-plane stability.', null, 3, '12 each side', 'Continue as maintenance work until surgery', 'Low step', null, false, 3),

('Terminal Knee Extension (Band)', 'prehab', 'prehab_ready', 'strength',
 'Loop a resistance band behind the knee, anchored at knee height. Stand facing the anchor with the knee slightly bent. Straighten the knee against the band''s resistance. Hold 3 seconds, slowly bend again.',
 'Maintenance end-range quad strength.', null, 3, '15', 'Continue as maintenance work until surgery', 'Resistance band', null, false, 4),

('Hamstring Curls (Standing)', 'prehab', 'prehab_ready', 'strength',
 'Stand holding a wall. Bend the injured knee, bringing the heel toward the glute. Slowly lower.',
 'Maintenance hamstring strength.', null, 3, '15', 'Continue as maintenance work until surgery', 'Wall for support', null, false, 5),

('Glute Bridges', 'prehab', 'prehab_ready', 'strength',
 'Lie on your back, knees bent, feet flat. Squeeze glutes and lift hips until body forms a straight line from shoulders to knees. Hold 3 seconds, lower slowly.',
 'Maintenance glute and hamstring strength.', null, 3, '15', 'Continue as maintenance work until surgery', null, null, false, 6),

('Standing Quad Stretch', 'prehab', 'prehab_ready', 'mobility',
 'Standing and holding a wall for balance, bend your knee and hold your ankle behind you, gently stretching the front of your thigh.',
 'Keep tissue length comfortable while you wait for your surgery date.', null, 2, '30s hold', '1x daily', 'Wall for support (optional)', null, false, 7),

-- ===================== REHAB PHASE 1: PROTECTION & EARLY ROM (0-2 weeks) =====================
('Quad Sets', 'rehab', 'rehab_protection', 'strength',
 'Sit or lie with the leg straight. Push the back of your knee down by tightening your thigh. Hold 10 seconds with a visible contraction.',
 'Fight the reflex quad shutdown that happens right after surgery.', 'Try to push a coin into the floor with the back of your knee.', 3, '15 (10s hold each)', '3x daily', null, null, false, 0),

('Straight Leg Raise', 'rehab', 'rehab_protection', 'strength',
 'Lying on your back, lock your knee fully straight before lifting, then raise the whole leg about 30cm. Lower slowly.',
 'Quad strength without bending or loading the healing graft.', null, 3, '10', '2x daily', null, 'If the knee bends or sags on lift-off, that''s a lag — stick with quad sets a bit longer.', false, 1),

('Ankle Pumps', 'rehab', 'rehab_protection', 'mobility',
 'Point your toes down then pull them up toward your shin, steady and rhythmic.',
 'Reduce post-surgical swelling through the calf muscle pump.', null, 3, '30', 'Every 1-2 hours', null, null, false, 2),

('Heel Props (Extension)', 'rehab', 'rehab_protection', 'mobility',
 'Prop your heel up on a rolled towel with your knee unsupported, and let gravity gently pull the knee straight over several minutes.',
 'Restore full passive extension early — the single most important early goal.', null, 3, '5 min hold', '3x daily', 'Rolled towel', 'Stop if sharp pain, not just stretch.', false, 3),

('Patellar Mobilisations', 'rehab', 'rehab_protection', 'mobility',
 'With the leg straight and relaxed, gently glide the kneecap up, down, left, and right with your thumbs.',
 'Prevent scar tissue from restricting kneecap movement.', null, 2, '10 each direction', '1x daily', null, null, false, 4),

-- ===================== REHAB PHASE 2: EARLY ACTIVATION (2-6 weeks) =====================
('Wall Slides / Mini Squats', 'rehab', 'rehab_activation', 'strength',
 'Stand with your back against a wall, feet shoulder-width apart. Slide down into a small squat (0-60°), then slide back up.',
 'Rebuild closed-chain quad strength within a safe, controlled range.', null, 3, '10', '1x daily', 'Wall', null, false, 0),

('Step-Downs', 'rehab', 'rehab_activation', 'strength',
 'Stand on a low step. Slowly lower your other foot toward the floor, controlling the descent with the injured leg, then step back up.',
 'Controlled eccentric quad strength on the operative leg.', null, 3, '10', '1x daily', 'Low step', null, true, 1),

('Straight Leg Raise (Resisted)', 'rehab', 'rehab_activation', 'strength',
 'With a light resistance band looped around your ankle, lock the knee straight and lift the leg. Lower slowly.',
 'Progress quad strength once bodyweight SLR feels easy.', null, 3, '12', '1x daily', 'Resistance band', null, false, 2),

('Calf Raises', 'rehab', 'rehab_activation', 'strength',
 'Rise up onto your toes with control, then lower slowly. Hold a wall or chair for balance if needed.',
 'Restore calf strength for a normal walking push-off.', null, 3, '15', '1x daily', null, null, false, 3),

('Single-Leg Stance', 'rehab', 'rehab_activation', 'strength',
 'Stand on the injured leg only, arms out for balance. Hold as steady as you can.',
 'Rebuild balance and confidence bearing weight through the leg.', null, 3, '20s', '1x daily', 'Wall for support (optional)', null, false, 4),

('Heel Slides', 'rehab', 'rehab_activation', 'mobility',
 'Lying on your back, slide your heel toward your glutes to bend the knee as far as comfortable, then slide back out.',
 'Keep pushing knee bend range forward now that early swelling has settled.', null, 3, '15', '2x daily', null, null, false, 5),

-- ===================== REHAB PHASE 3: STRENGTH BUILDING (6-12 weeks) =====================
('Goblet Squats', 'rehab', 'rehab_strength', 'strength',
 'Hold a dumbbell close to your chest. Squat down keeping your chest up and weight through your heels, then stand back up.',
 'Progress closed-chain strength with added load.', null, 3, '10', '3x weekly', 'Dumbbell', null, true, 0),

('Single-Leg Leg Press', 'rehab', 'rehab_strength', 'strength',
 'Using a leg press machine, push through the injured leg only within a comfortable range.',
 'Loaded, controlled quad strength without the balance demand of a free-standing squat.', null, 3, '10', '2x weekly', 'Leg press machine', null, true, 1),

('Hamstring Curls', 'rehab', 'rehab_strength', 'strength',
 'Using a resistance band or hamstring curl machine, bend the knee against resistance, then lower slowly.',
 'Hamstring strength to match the quad work and protect the graft.', null, 3, '12', '2x weekly', 'Resistance band or hamstring curl machine', null, false, 2),

('Hip Abduction (Band)', 'rehab', 'rehab_strength', 'strength',
 'With a resistance band looped above your knees, stand and step sideways, keeping tension on the band throughout.',
 'Hip strength that keeps the knee tracking properly during single-leg work.', null, 3, '15 each direction', '2x weekly', 'Resistance band', null, false, 3),

('Single-Leg Balance (Unstable Surface)', 'rehab', 'rehab_strength', 'strength',
 'Stand on the injured leg on a pillow, folded towel, or balance pad. Hold as steady as you can.',
 'Build the proprioception needed before returning to sport-like movement.', null, 3, '30s', '3x weekly', 'Pillow, folded towel, or balance pad', null, false, 4),

('Seated Hamstring Stretch', 'rehab', 'rehab_strength', 'mobility',
 'Sit with the injured leg straight out in front of you. Hinge forward gently from the hips until you feel a stretch behind the thigh.',
 'Keep hamstring length comfortable as loaded strength work increases.', null, 2, '30s hold', '1x daily', null, null, false, 5),

-- ===================== REHAB PHASE 4: ADVANCED STRENGTH & POWER (12-20 weeks) =====================
('Bulgarian Split Squats', 'rehab', 'rehab_advanced', 'strength',
 'With your back foot up on a bench, lower into a lunge on the front (injured) leg, then push back up.',
 'Heavier single-leg strength closer to what sport demands.', null, 3, '10', '2x weekly', 'Bench, dumbbells (optional)', null, true, 0),

('Lateral Bounding', 'rehab', 'rehab_advanced', 'strength',
 'Push off one leg to hop sideways, landing softly and under control on the other leg. Stick the landing before hopping back.',
 'Introduce controlled side-to-side power and landing mechanics.', null, 3, '8 each side', '2x weekly', null, 'Only once you''re comfortable with bodyweight single-leg squats.', true, 1),

('Box Jumps (Low Height)', 'rehab', 'rehab_advanced', 'strength',
 'Jump onto a low box with both feet, landing softly with bent knees, then step back down.',
 'Rebuild plyometric power with a forgiving landing target.', null, 3, '8', '2x weekly', 'Low box or step', null, true, 2),

('Agility Ladder Drills', 'rehab', 'rehab_advanced', 'strength',
 'Move through an agility ladder with quick, light footwork patterns (in-in-out-out, lateral steps, etc).',
 'Rebuild footwork speed and coordination before sport-specific drills.', null, 3, '2 passes per pattern', '2x weekly', 'Agility ladder', null, false, 3),

('Dynamic Leg Swings', 'rehab', 'rehab_advanced', 'mobility',
 'Holding a wall for balance, swing the leg forward and back, then side to side, in a controlled, dynamic motion.',
 'Dynamic mobility warm-up before higher-intensity power work.', null, 2, '10 each direction', 'Before training', 'Wall for support (optional)', null, false, 4),

-- ===================== REHAB PHASE 5: RETURN TO SPORT PREP (20+ weeks) =====================
('Single-Leg Hop for Distance', 'rehab', 'rehab_return_to_sport', 'strength',
 'Hop forward on the injured leg only, landing softly and holding the landing for 2 seconds before relaxing.',
 'A standard return-to-sport benchmark — compare distance and landing control side to side.', null, 3, '5', '2x weekly', null, null, true, 0),

('Reactive Agility Drill', 'rehab', 'rehab_return_to_sport', 'strength',
 'Set up a few cones and react to a called direction or a partner''s signal, cutting and changing direction under control.',
 'Rebuild the unplanned, reactive movement sport actually demands.', null, 3, '6 reps', '2x weekly', 'Cones', null, true, 1),

('Maintenance Strength Circuit', 'rehab', 'rehab_return_to_sport', 'strength',
 'Run through squats, Romanian deadlifts, and walking lunges at a challenging but controlled load.',
 'Keep the strength you built in earlier phases from fading as training volume shifts toward sport skills.', null, 3, '10 each', '2x weekly', 'Dumbbells or barbell', null, true, 2),

('Sport-Specific Conditioning Circuit', 'rehab', 'rehab_return_to_sport', 'strength',
 'Combine short sprints, cuts, and jumps that mimic your sport''s demands, building up intensity over several sessions.',
 'Bridge the gap between rehab exercises and full training — this app tracks readiness signs, it does not clear you to play.', null, 3, '4-6 reps per drill', '2x weekly', 'Sport-specific (cones, ball, etc.)', 'This does not replace clearance from your surgeon or PT.', true, 3),

('Dynamic Warm-Up (Leg Swings)', 'rehab', 'rehab_return_to_sport', 'mobility',
 'Holding a wall for balance, swing the leg forward and back, then side to side, building range gradually.',
 'Standard dynamic mobility prep before higher-intensity training.', null, 2, '10 each direction', 'Before training', 'Wall for support (optional)', null, false, 4);

-- Prevents this exact bug from recurring: an accidental re-run of a seed
-- script now fails with a constraint violation instead of silently
-- duplicating every row in that script.
create unique index if not exists exercises_track_phase_name_key on exercises (track, phase, name);
