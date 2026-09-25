import { PHASES, phaseOrder } from '../lib/phases'
import type { PhaseId, Track } from '../lib/phases'
import type { ExerciseDef } from '../types'
import { IconEye, IconEyeOff, IconPlus, IconX } from './icons'
import './ManageExercisesPanel.css'

interface ManageExercisesPanelProps {
  track: Track
  currentPhase: PhaseId
  exercisesByPhase: Partial<Record<PhaseId, ExerciseDef[]>>
  hiddenExercises: ExerciseDef[]
  addedExerciseIds: Set<string>
  /** Sets hidden=false for an exercise — used both to restore a hidden native and to add one from another phase. */
  onAdd: (exerciseId: string) => void
  onHide: (exerciseId: string) => void
  onClose: () => void
}

export function ManageExercisesPanel({
  track,
  currentPhase,
  exercisesByPhase,
  hiddenExercises,
  addedExerciseIds,
  onAdd,
  onHide,
  onClose,
}: ManageExercisesPanelProps) {
  const otherPhases = phaseOrder(track).filter((phase) => phase !== currentPhase)
  const hiddenIds = new Set(hiddenExercises.map((e) => e.id))
  const visibleExercises = (exercisesByPhase[currentPhase] ?? []).filter((e) => !hiddenIds.has(e.id))

  return (
    <section className="manage-exercises-panel">
      <div className="manage-exercises-header">
        <h2>Manage exercises</h2>
        <button type="button" className="manage-exercises-close" aria-label="Close" onClick={onClose}>
          <IconX />
        </button>
      </div>

      {visibleExercises.length > 0 && (
        <div className="manage-exercises-section">
          <p className="manage-exercises-section-title">In this phase</p>
          <ul className="manage-exercises-list">
            {visibleExercises.map((exercise) => (
              <li key={exercise.id} className="manage-exercises-row">
                <span className="manage-exercises-name">{exercise.name}</span>
                <button type="button" className="manage-exercises-action" onClick={() => onHide(exercise.id)}>
                  <IconEyeOff />
                  Hide
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hiddenExercises.length > 0 && (
        <div className="manage-exercises-section">
          <p className="manage-exercises-section-title">Hidden from this phase</p>
          <ul className="manage-exercises-list">
            {hiddenExercises.map((exercise) => (
              <li key={exercise.id} className="manage-exercises-row">
                <span className="manage-exercises-name">{exercise.name}</span>
                <button type="button" className="manage-exercises-action" onClick={() => onAdd(exercise.id)}>
                  <IconEye />
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="manage-exercises-section">
        <p className="manage-exercises-section-title">Add from another phase</p>
        {otherPhases.map((phase) => {
          const candidates = (exercisesByPhase[phase] ?? []).filter((e) => !addedExerciseIds.has(e.id))
          if (candidates.length === 0) return null
          return (
            <div key={phase} className="manage-exercises-phase-group">
              <p className="manage-exercises-phase-label">
                {PHASES[phase].shortLabel}: {PHASES[phase].title}
              </p>
              <ul className="manage-exercises-list">
                {candidates.map((exercise) => (
                  <li key={exercise.id} className="manage-exercises-row">
                    <span className="manage-exercises-name">{exercise.name}</span>
                    <button type="button" className="manage-exercises-action" onClick={() => onAdd(exercise.id)}>
                      <IconPlus />
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
