import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { supabase } from '../lib/supabase'
import { toIntOrNull, toNumberOrNull } from '../lib/numeric'
import { isTimeEligibleForNextPhase, nextPhase, PREHAB_MIN_ROUNDS_FOR_CHECKIN, weeksPostOp } from '../lib/phases'
import { useEffectiveExercises } from '../hooks/useEffectiveExercises'
import { useExerciseLogs } from '../hooks/useExerciseLogs'
import { useLoadClearance } from '../hooks/useLoadClearance'
import { useMilestoneCheckins } from '../hooks/useMilestoneCheckins'
import { useRomHistory } from '../hooks/useRomHistory'
import { useRomReading } from '../hooks/useRomReading'
import { useSession } from '../hooks/useSession'
import { useSessionHistory } from '../hooks/useSessionHistory'
import { useWakeLock } from '../hooks/useWakeLock'
import type { RomEntry, UserProfile } from '../types'
import { Alert } from './Alert'
import { CelebrationOverlay } from './CelebrationOverlay'
import { IconChevronLeft } from './icons'
import { ExerciseChecklist } from './ExerciseChecklist'
import { ManageExercisesPanel } from './ManageExercisesPanel'
import { PostWorkoutRom } from './PostWorkoutRom'
import { RedFlagCheckIn } from './RedFlagCheckIn'
import { Toast } from './Toast'

interface TodayRehabProps {
  userId: string
  profile: UserProfile
  onBack: () => void
  onOpenProfile: () => void
  onOpenProgress: () => void
  onProfileChange: () => void
}

type Stage = 'exercises' | 'rom'

const SESSION_REACTIONS = [
  'Workout complete!',
  'Session logged!',
  'Great work today!',
  'Fantastic session!',
  'Nice session!',
  'All done!',
  'Way to show up!',
  'Strong session!',
  "That's a wrap!",
  'Session in the books!',
  "Nailed today's session!",
  'Solid effort!',
  'You did the work!',
  'Rehab done for today!',
  'Great job today!',
  'Session complete!',
  'Consistency wins!',
  "Today's in the books!",
  'Well done today!',
  'You showed up today!',
]

export function TodayRehab({ userId, profile, onBack, onOpenProfile, onOpenProgress, onProfileChange }: TodayRehabProps) {
  const { current_phase: currentPhase, track } = profile
  const { loadCleared } = useLoadClearance(userId)
  const { points: romHistory } = useRomHistory(userId)
  const { submitCheckin } = useMilestoneCheckins(userId)
  const { sessions: sessionHistory, refetch: refetchSessionHistory } = useSessionHistory(userId)
  const [gateCleared, setGateCleared] = useState(false)
  const [stage, setStage] = useState<Stage>('exercises')
  const [celebrating, setCelebrating] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const cycleWeek = track === 'rehab' && profile.surgery_date ? weeksPostOp(profile.surgery_date) : 0
  const completedRoundsInPhase = sessionHistory.filter((s) => s.dayKey === currentPhase && s.completedAt !== null).length
  const checkinDue =
    nextPhase(currentPhase) !== null &&
    (track === 'prehab'
      ? completedRoundsInPhase >= PREHAB_MIN_ROUNDS_FOR_CHECKIN
      : isTimeEligibleForNextPhase(track, currentPhase, profile.surgery_date))

  const { session, ensureSession, setRedFlag, completeSession } = useSession(userId, cycleWeek, currentPhase)
  const sessionId = session?.id ?? null
  const redFlagActive = session?.red_flag ?? false
  useWakeLock(gateCleared && !redFlagActive)

  const { exercises, hiddenExercises, exercisesByPhase, addedIds, hideExercise, addExercise } = useEffectiveExercises(
    userId,
    track,
    currentPhase,
  )
  const [manageOpen, setManageOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const { log: currentLog, setLog: setCurrentLog } = useExerciseLogs(sessionId, exercises)
  const { reading: romReading, setReading: setRomReading } = useRomReading(sessionId)

  const completedCount = exercises.filter((exercise) => currentLog[exercise.id]?.done).length
  const unlockedExercises = exercises.filter((exercise) => !exercise.requiresLoadClearance || loadCleared)
  const hasLockedExercises = !loadCleared && exercises.some((exercise) => exercise.requiresLoadClearance)
  const allUnlockedDone =
    unlockedExercises.length > 0 && unlockedExercises.every((exercise) => currentLog[exercise.id]?.done)

  async function handleExerciseChange(exerciseId: string, setsCompleted: number, holdsCompleted = 0) {
    const exerciseDef = exercises.find((e) => e.id === exerciseId)
    if (!exerciseDef) return

    const previous = currentLog[exerciseId] ?? { done: false, setsCompleted: 0, holdsCompleted: 0, weight: '', reps: '', rpe: '' }
    const done = setsCompleted >= Math.max(exerciseDef.sets, 1)
    const entry = { ...previous, setsCompleted, holdsCompleted, done }
    setCurrentLog((prev) => ({ ...prev, [exerciseId]: entry }))

    const id = await ensureSession()
    const { error } = await supabase.from('exercises_logged').upsert(
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
    if (error) {
      setCurrentLog((prev) => ({ ...prev, [exerciseId]: previous }))
      setSaveError(`Couldn't save ${exerciseDef.name}: ${error.message}`)
    } else {
      setSaveError(null)
    }
  }

  async function handleMarkAll() {
    const nextDone = !allUnlockedDone
    await Promise.all(
      unlockedExercises.map((exercise) => handleExerciseChange(exercise.id, nextDone ? Math.max(exercise.sets, 1) : 0)),
    )
  }

  async function handleRomChange(patch: Partial<RomEntry>) {
    const previous = romReading
    const merged = { ...romReading, ...patch }
    setRomReading(merged)

    const id = await ensureSession()
    const { error } = await supabase.from('rom_readings').upsert(
      {
        session_id: id,
        extension: toNumberOrNull(merged.extension),
        flexion: toNumberOrNull(merged.flexion),
      },
      { onConflict: 'session_id' },
    )
    if (error) {
      setRomReading(previous)
      setSaveError(`Couldn't save your ROM reading: ${error.message}`)
    } else {
      setSaveError(null)
    }
  }

  async function handleRoundComplete() {
    await completeSession()
    refetchSessionHistory()
  }

  async function handleRedFlag() {
    await setRedFlag(true)
  }

  async function handleClearRedFlag() {
    await setRedFlag(false)
  }

  function handleLogSession() {
    if (completedCount === 0) {
      setToast('Log at least one exercise before submitting.')
      return
    }
    setCelebrating(true)
  }

  function handleCelebrationDone() {
    setCelebrating(false)
    setStage('rom')
  }

  return (
    <main className="app-shell">
      <header className="subpage-header subpage-header-inline">
        <button type="button" className="subpage-back" onClick={onBack}>
          <IconChevronLeft />
          Home
        </button>
        <h1>Today's rehab</h1>
      </header>

      <RedFlagCheckIn
        active={redFlagActive}
        onFlag={() => void handleRedFlag()}
        onClear={() => void handleClearRedFlag()}
        onGateCleared={() => setGateCleared(true)}
      />

      {!redFlagActive && gateCleared && (
        <div className="today-rehab-body">
          {saveError && <Alert variant="error">{saveError}</Alert>}

          {stage === 'exercises' && (
            <>
              <section className="session-summary-row">
                <span className="session-summary">
                  {completedCount} / {exercises.length} complete
                </span>
                {unlockedExercises.length > 0 && (
                  <button type="button" className="session-mark-all" onClick={() => void handleMarkAll()}>
                    {allUnlockedDone ? 'Unmark all' : 'Mark all done'}
                  </button>
                )}
              </section>

              <ExerciseChecklist
                exercises={exercises}
                log={currentLog}
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

              {hasLockedExercises && (
                <button type="button" className="load-clearance-hint" onClick={onOpenProfile}>
                  Some exercises are locked until you're cleared for load — set that in Profile.
                </button>
              )}

              <button type="button" className="log-session-button" onClick={handleLogSession}>
                Log session
              </button>
            </>
          )}

          {stage === 'rom' && (
            <>
              <button type="button" className="subpage-back" onClick={() => setStage('exercises')}>
                <IconChevronLeft />
                Edit exercises
              </button>

              <PostWorkoutRom
                reading={romReading}
                onChange={(patch) => void handleRomChange(patch)}
                history={romHistory}
                onViewProgress={onOpenProgress}
                track={track}
                phase={currentPhase}
                checkinDue={checkinDue}
                onSubmitCheckin={async (answers) => {
                  const result = await submitCheckin(currentPhase, answers)
                  onProfileChange()
                  return result
                }}
                onRoundComplete={() => void handleRoundComplete()}
              />
            </>
          )}

          <CelebrationOverlay show={celebrating} reactions={SESSION_REACTIONS} onDone={handleCelebrationDone} />
        </div>
      )}

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </main>
  )
}
