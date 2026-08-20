import type { ExerciseDef, ExerciseLog, LoggedExercise } from '../types'
import { FloatingInput } from './FloatingInput'
import './ExerciseChecklist.css'

interface ExerciseChecklistProps {
  exercises: ExerciseDef[]
  log: ExerciseLog
  loadCleared: boolean
  onChange: (exerciseId: string, patch: Partial<LoggedExercise>) => void
}

const emptyLog: LoggedExercise = { done: false, weight: '', reps: '', rpe: '' }

export function ExerciseChecklist({ exercises, log, loadCleared, onChange }: ExerciseChecklistProps) {
  return (
    <ul className="exercise-checklist">
      {exercises.map((exercise) => {
        const locked = Boolean(exercise.requiresLoadClearance) && !loadCleared
        const entry = log[exercise.id] ?? emptyLog

        return (
          <li key={exercise.id} className={`exercise-row${locked ? ' locked' : ''}`}>
            <div className="exercise-row-main">
              <label className="exercise-checkbox">
                <input
                  type="checkbox"
                  checked={entry.done}
                  disabled={locked}
                  onChange={(e) => onChange(exercise.id, { done: e.target.checked })}
                />
                <span className="exercise-name">{exercise.name}</span>
              </label>
              <span className="exercise-target">
                {exercise.sets} x {exercise.repsTarget}
              </span>
              {locked && <span className="lock-badge">Locked · needs load clearance</span>}
            </div>

            {!locked && (
              <div className="exercise-fields">
                <FloatingInput
                  label="Weight"
                  type="number"
                  inputMode="decimal"
                  value={entry.weight}
                  onChange={(e) => onChange(exercise.id, { weight: e.target.value })}
                />
                <FloatingInput
                  label="Reps"
                  type="number"
                  inputMode="numeric"
                  value={entry.reps}
                  onChange={(e) => onChange(exercise.id, { reps: e.target.value })}
                />
                <FloatingInput
                  label="RPE"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={10}
                  value={entry.rpe}
                  onChange={(e) => onChange(exercise.id, { rpe: e.target.value })}
                />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
