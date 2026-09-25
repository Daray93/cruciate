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
  created_at: string
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
  holdSeconds?: number
  /** How many timed holds make one set (e.g. 15 for quad sets). Absent = one hold per set. */
  holdReps?: number
}

export interface LoggedExercise {
  done: boolean
  /** How many of the exercise's sets are marked complete. `done` is derived from this (setsCompleted >= sets). */
  setsCompleted: number
  /** Holds finished in the current, not-yet-complete set. Only used when the exercise has holdReps > 1. */
  holdsCompleted: number
  weight: string
  reps: string
  rpe: string
}

export type ExerciseLog = Record<string, LoggedExercise>

export interface RomEntry {
  extension: string
  flexion: string
}
