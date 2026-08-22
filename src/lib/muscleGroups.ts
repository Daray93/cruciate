export type MuscleGroup = 'quads' | 'hamstrings' | 'calves' | 'glutes'

export const MUSCLE_GROUPS: MuscleGroup[] = ['quads', 'hamstrings', 'calves', 'glutes']

export const MUSCLE_GROUP_LABEL: Record<MuscleGroup, string> = {
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  calves: 'Calves',
  glutes: 'Glutes',
}

// Mobility/ROM exercises (stretches, ankle pumps, patella mobs) aren't
// strength work and don't appear here — only exercises that actually load a
// muscle count toward the body map. Keyed by exercise name, matching what
// TodayRehab logs to exercises_logged (same name across every phase it
// appears in, so this covers the whole seed regardless of track/phase).
export const EXERCISE_MUSCLE_GROUP: Record<string, MuscleGroup> = {
  'Quad Sets': 'quads',
  'Straight Leg Raise (Supine)': 'quads',
  'Straight Leg Raise (Side-Lying)': 'glutes',
  'Straight Leg Raise (Prone)': 'hamstrings',
  'Standing Calf Raises': 'calves',
  'Mini Squats (Bilateral)': 'quads',
  'Single-Leg Mini Squat': 'quads',
  'Step-Ups (Forward)': 'quads',
  'Lateral Step-Ups': 'glutes',
  'Terminal Knee Extension (Band)': 'quads',
  'Hamstring Curls (Standing)': 'hamstrings',
  'Hamstring Curls (Weighted)': 'hamstrings',
  'Glute Bridges': 'glutes',
  'Glute Bridges (Bilateral)': 'glutes',
  'Weight Shifts': 'quads',
  'Stationary Bike (Low Resistance)': 'quads',
  'Wall Sit': 'quads',
  'Balance / Proprioception Training': 'calves',
  'Goblet Squats': 'quads',
  'Single-Leg Romanian Deadlift': 'hamstrings',
  'Leg Press': 'quads',
  'Box Step-Downs': 'quads',
  'Low-Impact Plyometrics': 'calves',
  'Running Progression': 'calves',
  'Single-Leg Plyometrics': 'calves',
  'Agility Ladder / Cone Drills': 'calves',
  'Deceleration Training': 'quads',
  'Sport-Specific Drills': 'quads',
}

/** Completions needed for a muscle group to read as "fully" worked. */
export const MUSCLE_GROUP_TARGET = 20
