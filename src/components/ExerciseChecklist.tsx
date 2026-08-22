import { useEffect, useState } from 'react'
import type { ExerciseDef, ExerciseLog, LoggedExercise } from '../types'
import { HoldTimerBadge } from './HoldTimerBadge'
import { IconInfoCircle } from './icons'
import './ExerciseChecklist.css'

interface ExerciseChecklistProps {
  exercises: ExerciseDef[]
  log: ExerciseLog
  loadCleared: boolean
  onChange: (exerciseId: string, patch: Partial<LoggedExercise>) => void
}

const emptyLog: LoggedExercise = { done: false, weight: '', reps: '', rpe: '' }

export function ExerciseChecklist({ exercises, log, loadCleared, onChange }: ExerciseChecklistProps) {
  const [openInfoId, setOpenInfoId] = useState<string | null>(null)

  useEffect(() => {
    if (!openInfoId) return
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target instanceof Element) || !e.target.closest('.exercise-info')) {
        setOpenInfoId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openInfoId])

  return (
    <ul className="exercise-list">
      {exercises.map((exercise) => {
        const locked = Boolean(exercise.requiresLoadClearance) && !loadCleared
        const entry = log[exercise.id] ?? emptyLog
        const hasInfo = Boolean(
          exercise.instructions ||
            exercise.purpose ||
            exercise.cue ||
            exercise.frequencyNote ||
            exercise.equipment ||
            exercise.contraindications,
        )

        return (
          <li key={exercise.id} className={`exercise-row${locked ? ' locked' : ''}`}>
            <span className="exercise-row-name">{exercise.name}</span>

            {hasInfo && (
              <span className={`exercise-info${openInfoId === exercise.id ? ' open' : ''}`}>
                <button
                  type="button"
                  className="exercise-info-trigger"
                  aria-label={`More about ${exercise.name}`}
                  aria-expanded={openInfoId === exercise.id}
                  onClick={() => setOpenInfoId((prev) => (prev === exercise.id ? null : exercise.id))}
                >
                  <IconInfoCircle />
                </button>
                <span className="exercise-info-tooltip" role="note">
                  {exercise.instructions && <span className="exercise-info-line">{exercise.instructions}</span>}
                  {exercise.purpose && <span className="exercise-info-line">{exercise.purpose}</span>}
                  {exercise.cue && <span className="exercise-info-line">&ldquo;{exercise.cue}&rdquo;</span>}
                  {exercise.frequencyNote && <span className="exercise-info-line">{exercise.frequencyNote}</span>}
                  {exercise.equipment && <span className="exercise-info-line">Equipment: {exercise.equipment}</span>}
                  {exercise.contraindications && (
                    <span className="exercise-info-line exercise-info-warn">{exercise.contraindications}</span>
                  )}
                </span>
              </span>
            )}

            {exercise.holdSeconds ? (
              <HoldTimerBadge seconds={exercise.holdSeconds} />
            ) : (
              <span className="exercise-row-target">
                {exercise.sets > 0 ? `${exercise.sets} × ${exercise.repsTarget}` : exercise.repsTarget}
              </span>
            )}

            {locked ? (
              <span className="exercise-row-locked-label" title="Needs load clearance">
                Locked
              </span>
            ) : (
              <input
                type="checkbox"
                className="exercise-row-checkbox"
                checked={entry.done}
                aria-label={`Mark ${exercise.name} done`}
                onChange={(e) => onChange(exercise.id, { done: e.target.checked })}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}
