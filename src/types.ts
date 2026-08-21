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

export interface ExerciseDef {
  id: string
  name: string
  sets: number
  repsTarget: string
  cue?: string
  requiresLoadClearance?: boolean
}

export interface DayProgram {
  dayKey: string
  label: string
  focus: string
  exercises: ExerciseDef[]
}

export interface WeekProgram {
  week: number
  phase: string
  days: DayProgram[]
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
