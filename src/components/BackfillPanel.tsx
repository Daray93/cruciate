import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { parseIsoDate } from '../lib/calendar'
import { toIntOrNull, toNumberOrNull } from '../lib/numeric'
import { weeksPostOp } from '../lib/phases'
import type { PhaseId, Track } from '../lib/phases'
import { supabase } from '../lib/supabase'
import { useEffectiveExercises } from '../hooks/useEffectiveExercises'
import { useExerciseLogs } from '../hooks/useExerciseLogs'
import { useLoadClearance } from '../hooks/useLoadClearance'
import { useSession } from '../hooks/useSession'
import { useWakeLock } from '../hooks/useWakeLock'
import { ExerciseChecklist } from './ExerciseChecklist'
import { ManageExercisesPanel } from './ManageExercisesPanel'
import './BackfillPanel.css'

interface BackfillPanelProps {
  userId: string
  date: string
  track: Track
  currentPhase: PhaseId
  surgeryDate: string | null
  /** How many rounds are already completed for this date, so the round counter starts in the right place. */
  initialCompletedRounds: number
  /** Called each time a round is logged, so the caller can refetch the calendar/ROM trend. */
  onRoundLogged: () => void
  onClose: () => void
}

export function BackfillPanel({
  userId,
  date,
  track,
  currentPhase,
  surgeryDate,
  initialCompletedRounds,
  onRoundLogged,
  onClose,
}: BackfillPanelProps) {
  const { loadCleared } = useLoadClearance(userId)
  const { exercises, hiddenExercises, exercisesByPhase, addedIds, hideExercise, addExercise } = useEffectiveExercises(
    userId,
    track,
    currentPhase,
  )
  const [roundsLogged, setRoundsLogged] = useState(initialCompletedRounds)
  const [error, setError] = useState<string | null>(null)
  const [finishing, setFinishing] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const reduceMotion = useReducedMotion()
  useWakeLock(true)

  const cycleWeek = track === 'rehab' && surgeryDate ? weeksPostOp(surgeryDate, parseIsoDate(date) ?? new Date()) : 0
  const { session, ensureSession, completeSession } = useSession(userId, cycleWeek, currentPhase, date)
  const sessionId = session?.id ?? null
  const { log, setLog } = useExerciseLogs(sessionId, exercises)

  const completedCount = exercises.filter((exercise) => log[exercise.id]?.done).length

  async function handleExerciseChange(exerciseId: string, setsCompleted: number, holdsCompleted = 0) {
    const exerciseDef = exercises.find((e) => e.id === exerciseId)
    if (!exerciseDef) return

    const previous = log[exerciseId] ?? { done: false, setsCompleted: 0, holdsCompleted: 0, weight: '', reps: '', rpe: '' }
    const done = setsCompleted >= Math.max(exerciseDef.sets, 1)
    const entry = { ...previous, setsCompleted, holdsCompleted, done }
    setLog((prev) => ({ ...prev, [exerciseId]: entry }))

    const id = await ensureSession()
    const { error: upsertError } = await supabase.from('exercises_logged').upsert(
      {
        session_id: id,
        name: exerciseDef.name,
        done,
        sets_completed: setsCompleted,
        holds_completed: holdsCompleted,
        weight: toNumberOrNull(entry.weight),
        reps: toIntOrNull(entry.reps),
        rpe: toNumberOrNull(entry.rpe),
      },
      { onConflict: 'session_id,name' },
    )
    if (upsertError) {
      setLog((prev) => ({ ...prev, [exerciseId]: previous }))
      setError(`Couldn't save ${exerciseDef.name}: ${upsertError.message}`)
    } else {
      setError(null)
    }
  }

  async function handleFinishRound() {
    if (completedCount === 0) {
      setError('Check at least one exercise before logging this round.')
      return
    }
    setFinishing(true)
    await completeSession()
    setFinishing(false)
    setRoundsLogged((n) => n + 1)
    onRoundLogged()
  }

  return (
    <div className="backfill-panel">
      <p className="backfill-panel-round">Round {roundsLogged + 1}</p>

      {error && <p className="backfill-panel-error">{error}</p>}

      <ExerciseChecklist
        exercises={exercises}
        log={log}
        loadCleared={loadCleared}
        onChange={(id, setsCompleted, holdsCompleted) => void handleExerciseChange(id, setsCompleted, holdsCompleted)}
        onHide={(id) => void hideExercise(id)}
      />

      <button type="button" className="manage-exercises-trigger" onClick={() => setManageOpen((v) => !v)}>
        {manageOpen ? 'Close' : 'Manage exercises'}
      </button>

      <AnimatePresence>
        {manageOpen && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
            style={{ overflow: 'hidden' }}
          >
            <ManageExercisesPanel
              track={track}
              currentPhase={currentPhase}
              exercisesByPhase={exercisesByPhase}
              hiddenExercises={hiddenExercises}
              addedExerciseIds={addedIds}
              onAdd={(id) => void addExercise(id)}
              onHide={(id) => void hideExercise(id)}
              onClose={() => setManageOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="backfill-panel-actions">
        <button type="button" className="backfill-panel-close" onClick={onClose}>
          Done
        </button>
        <button
          type="button"
          className="backfill-panel-finish"
          disabled={finishing}
          onClick={() => void handleFinishRound()}
        >
          {finishing ? 'Logging…' : 'Log this round'}
        </button>
      </div>
    </div>
  )
}
