-- Broadens Phase 3/4 with more varied, evidence-based strength work: a hip
-- hinge pattern (single-leg RDL, bodyweight then weighted), isometric holds
-- (wall sit, single-leg squat hold), an eccentric step-down, and an adductor
-- exercise (Copenhagen plank) — muscle groups and contraction types the
-- existing squat/lunge/band library didn't cover yet.

insert into exercises
  (name, track, phase, category, instructions, purpose, sets, reps_target, frequency_note, equipment, requires_load_clearance, contraindications, hold_seconds, sort_order)
values

('Wall Sit (Isometric)', 'prehab', 'prehab_strength', 'strength',
 'Stand with your back flat against a wall, feet shoulder-width apart and a step out from the wall. Slide down until your knees bend to about 60-90 degrees, like sitting in an invisible chair. Hold the position, keeping even weight through both legs.',
 'Quad strength and endurance built isometrically, with very low joint stress — a safe way to add load before dynamic single-leg work.', 3, '30s hold', '3x weekly', null, false, null, 30, 8),

('Single-Leg Romanian Deadlift', 'prehab', 'prehab_strength', 'strength',
 'Stand on your injured leg with a soft bend in the knee. Hinge forward at the hips, letting your other leg extend straight behind you for balance, until your torso is close to parallel with the floor. Keep your back flat throughout. Drive your hips forward to return to standing.',
 'Hamstring and glute strength through a hip hinge, plus single-leg balance and control — the posterior-chain complement to quad-focused work.', 3, '8-10', '2-3x weekly', null, false, 'Build single-leg balance work first if this feels unsteady — control matters more than range here.', null, 9),

('Single-Leg Romanian Deadlift (Weighted)', 'prehab', 'prehab_ready', 'strength',
 'Same as the bodyweight single-leg RDL, holding a dumbbell or kettlebell in the hand opposite your standing leg. Keep the weight close to your body as you hinge, and only add load once the bodyweight version feels fully controlled.',
 'Progresses posterior-chain strength and single-leg control with external load, building capacity for post-surgery rehab.', 3, '8-10', '2-3x weekly', 'Dumbbell or kettlebell', false, 'Drop back to bodyweight if form breaks down or balance is inconsistent.', null, 8),

('Weighted Step-Downs', 'prehab', 'prehab_ready', 'strength',
 'Stand on a step or low box on your injured leg. Slowly lower your other foot toward the floor with control, tapping lightly, then push back up through the standing leg. Hold a dumbbell in each hand for added load once the unweighted version is controlled and pain-free.',
 'Eccentric quad control descending, which is exactly the demand stairs and landing place on the knee after surgery.', 3, '8-10 each leg', '2-3x weekly', 'Low step, dumbbells (optional)', false, 'Keep the knee tracking over the toes — stop if it caves inward.', null, 9),

('Copenhagen Plank (Adductor)', 'prehab', 'prehab_ready', 'strength',
 'Lie on your side with your top foot resting on a bench or chair. Prop yourself up on your forearm and lift your hips so your body forms a straight line, holding the position. For an easier version, bend the top knee and rest just the shin on the bench instead of the full leg.',
 'Adductor (inner thigh) strength — an often-overlooked muscle group for knee stability, especially in cutting and pivoting movements.', 3, '15-20s hold', '2x weekly', 'Bench or chair', false, 'This is an advanced hold — use the bent-knee version if the full-leg position is too much.', 18, 10),

('Single-Leg Squat Hold (Isometric)', 'prehab', 'prehab_ready', 'strength',
 'Stand on your injured leg and lower into a partial squat, about a quarter to a third of the way down, keeping your knee tracking over your toes. Hold the position, using a wall or chair for balance if needed.',
 'Single-leg quad strength under sustained load, closer to the demand of real-world balance and control than a bilateral hold.', 3, '20s hold', '3x weekly', 'Wall or chair for support (optional)', false, null, 20, 11);
