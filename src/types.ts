import type { PhaseId, Track } from './lib/phases'

export type ClearanceState = {
  load_cleared: boolean
  run_cleared: boolean
}

export type SurgeryTimeframe = 'scheduled' | 'considering' | 'no_date'
export type PhaseAdvancedBy = 'milestone' | 'override'

export interface UserProfile {
  user_id: string
  name: string
  age: number | null
  track: Track
  surgery_timeframe: SurgeryTimeframe | null
  surgery_date: string | null
  injury_date: string | null
  current_phase: PhaseId
  phase_advanced_at: string
  phase_advanced_by: PhaseAdvancedBy | null
}

export type ExerciseCategory = 'mobility' | 'strength'

export interface ExerciseDef {
  id: string
  name: string
  category: ExerciseCategory | null
  sets: number
  repsTarget: string
  instructions?: string
  purpose?: string
  cue?: string
  frequencyNote?: string
  equipment?: string
  contraindications?: string
  requiresLoadClearance?: boolean
}

export interface LoggedExercise {
  done: boolean
  weight: string
  reps: string
  rpe: string
}

export type ExerciseLog = Record<string, LoggedExercise>

export interface RomEntry {
  extension: string
  flexion: string
}
