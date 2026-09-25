import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { supabase } from '../lib/supabase'
import { isTimeEligibleForPhase, PHASES, phaseOrder, weekRangeLabel } from '../lib/phases'
import type { PhaseId } from '../lib/phases'
import { useExercisesByTrack } from '../hooks/useExercisesByTrack'
import type { UserProfile } from '../types'
import { ConfirmModal } from './ConfirmModal'
import { IconCheck } from './icons'
import { MorphChevron } from './MorphChevron'
import './PhasesScreen.css'

interface PhasesScreenProps {
  userId: string
  profile: UserProfile
  onProfileChange: () => void
}

export function PhasesScreen({ userId, profile, onProfileChange }: PhasesScreenProps) {
  const { exercisesByPhase } = useExercisesByTrack(profile.track)
  const [openPhaseId, setOpenPhaseId] = useState<PhaseId | null>(null)
  const [switching, setSwitching] = useState<PhaseId | null>(null)
  const [earlySwitchTarget, setEarlySwitchTarget] = useState<PhaseId | null>(null)

  const order = phaseOrder(profile.track)
  const currentIndex = order.indexOf(profile.current_phase)

  async function handleSwitch(phaseId: PhaseId) {
    setSwitching(phaseId)
    await supabase
      .from('user_profile')
      .update({ current_phase: phaseId, phase_advanced_by: 'override', phase_advanced_at: new Date().toISOString() })
      .eq('user_id', userId)
    setSwitching(null)
    onProfileChange()
  }

  function requestSwitch(phaseId: PhaseId) {
    if (isTimeEligibleForPhase(profile.track, phaseId, profile.surgery_date)) {
      void handleSwitch(phaseId)
    } else {
      setEarlySwitchTarget(phaseId)
    }
  }

  function openPhase(phaseId: PhaseId) {
    setOpenPhaseId(phaseId)
    document.getElementById(`phase-card-${phaseId}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <main className="app-shell app-shell-with-tabs">
      <header className="app-header">
        <h1>Phases</h1>
      </header>

      <p className="phases-intro">
        Your ACL {profile.track === 'prehab' ? 'prehab' : 'rehab'} journey, phase by phase. Tap a phase to see its
        exercises, or switch to it directly.
      </p>

      <ul className="phase-roadmap" aria-label="Your phase roadmap">
        {order.map((phaseId, i) => {
          const phaseDef = PHASES[phaseId]
          const isCurrent = i === currentIndex
          const isDone = i < currentIndex
          let state = 'upcoming'
          if (isCurrent) state = 'current'
          else if (isDone) state = 'done'

          return (
            <li className="phase-roadmap-node" key={phaseId}>
              <button
                type="button"
                className={`phase-roadmap-dot ${state}`}
                aria-label={`${phaseDef.shortLabel}: ${phaseDef.title}${isCurrent ? ' (current)' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => openPhase(phaseId)}
              >
                {isDone ? <IconCheck className="phase-roadmap-dot-icon" /> : i + 1}
              </button>
              {i < order.length - 1 && <span className={`phase-roadmap-connector${isDone ? ' filled' : ''}`} />}
            </li>
          )
        })}
      </ul>

      <ul className="phases-list">
        {order.map((phaseId) => {
          const phaseDef = PHASES[phaseId]
          const isCurrent = phaseId === profile.current_phase
          const isOpen = openPhaseId === phaseId
          const exercises = exercisesByPhase[phaseId] ?? []

          return (
            <li key={phaseId} id={`phase-card-${phaseId}`} className={`phase-card${isCurrent ? ' current' : ''}`}>
              <button
                type="button"
                className="phase-card-header"
                onClick={() => setOpenPhaseId(isOpen ? null : phaseId)}
                aria-expanded={isOpen}
              >
                <span className="phase-card-heading">
                  <span className="phase-card-label">{phaseDef.shortLabel}</span>
                  <span className="phase-card-title">{phaseDef.title}</span>
                </span>
                <span className="phase-card-header-end">
                  {isCurrent && <span className="phase-card-current-badge">Current</span>}
                  <span className="phase-card-chevron">
                    <MorphChevron open={isOpen} />
                  </span>
                </span>
              </button>

              <p className="phase-card-criterion">{phaseDef.graduationCriterion}</p>
              {weekRangeLabel(phaseId) && <p className="phase-card-weeks">{weekRangeLabel(phaseId)}</p>}

              {isOpen && (
                <div className="phase-card-detail">
                  {exercises.length > 0 ? (
                    <ul className="phase-exercise-list">
                      {exercises.map((exercise) => (
                        <li key={exercise.id} className="phase-exercise-row">
                          <div className="phase-exercise-main">
                            <span className="phase-exercise-name">{exercise.name}</span>
                            {exercise.equipment && (
                              <span className="phase-exercise-equipment">{exercise.equipment}</span>
                            )}
                          </div>
                          <span className="phase-exercise-target">
                            {exercise.sets > 0 ? `${exercise.sets} × ${exercise.repsTarget}` : exercise.repsTarget}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="phase-exercise-empty">No exercises listed for this phase.</p>
                  )}

                  {!isCurrent && (
                    <button
                      type="button"
                      className="phase-switch-button"
                      disabled={switching === phaseId}
                      onClick={() => requestSwitch(phaseId)}
                    >
                      {switching === phaseId ? 'Switching…' : 'Switch to this phase'}
                    </button>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <AnimatePresence>
        {earlySwitchTarget && (
          <ConfirmModal
            title="Switch early?"
            body={`You're not typically eligible for ${PHASES[earlySwitchTarget].shortLabel}: ${PHASES[earlySwitchTarget].title} yet (${weekRangeLabel(earlySwitchTarget)}). If your PT or surgeon has cleared you sooner, that's fine, this is just a general guideline.`}
            confirmLabel="Switch anyway"
            confirming={switching === earlySwitchTarget}
            onConfirm={() => void handleSwitch(earlySwitchTarget).then(() => setEarlySwitchTarget(null))}
            onCancel={() => setEarlySwitchTarget(null)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
