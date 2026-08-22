import { useEffect, useState } from 'react'
import type { ExerciseCategory, ExerciseDef, ExerciseLog, LoggedExercise } from '../types'
import { IconInfoCircle } from './icons'
import './ExerciseChecklist.css'

interface ExerciseChecklistProps {
  exercises: ExerciseDef[]
  log: ExerciseLog
  loadCleared: boolean
  onChange: (exerciseId: string, patch: Partial<LoggedExercise>) => void
}

const emptyLog: LoggedExercise = { done: false, weight: '', reps: '', rpe: '' }

const SECTION_ORDER: ExerciseCategory[] = ['mobility', 'strength']
const SECTION_LABEL: Record<ExerciseCategory, string> = { mobility: 'Mobility', strength: 'Strength' }

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
    <div className="exercise-sections">
      {SECTION_ORDER.map((section) => {
        const sectionExercises = exercises.filter((exercise) => exercise.category === section)
        if (sectionExercises.length === 0) return null

        return (
          <section key={section} className="exercise-section">
            <h3 className="exercise-section-title">{SECTION_LABEL[section]}</h3>
            <div className="exercise-grid">
              {sectionExercises.map((exercise) => {
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
                  <div key={exercise.id} className={`exercise-card${locked ? ' locked' : ''}`}>
                    <div className="exercise-card-top">
                      <label className="exercise-card-checkbox">
                        <input
                          type="checkbox"
                          checked={entry.done}
                          disabled={locked}
                          aria-label={`Mark ${exercise.name} done`}
                          onChange={(e) => onChange(exercise.id, { done: e.target.checked })}
                        />
                      </label>

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
                    </div>

                    <p className="exercise-card-name">{exercise.name}</p>
                    <p className="exercise-card-target">
                      {exercise.sets > 0 ? `${exercise.sets} × ${exercise.repsTarget}` : exercise.repsTarget}
                    </p>

                    {locked && <span className="lock-badge">Locked · needs load clearance</span>}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
