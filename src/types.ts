export type ClearanceState = {
  load_cleared: boolean
  run_cleared: boolean
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
