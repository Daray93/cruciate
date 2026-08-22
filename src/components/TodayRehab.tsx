import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { toIntOrNull, toNumberOrNull } from '../lib/numeric'
import { weeksPostOp } from '../lib/phases'
import { useExerciseLogs } from '../hooks/useExerciseLogs'
import { useExercises } from '../hooks/useExercises'
import { useLoadClearance } from '../hooks/useLoadClearance'
import { useRomHistory } from '../hooks/useRomHistory'
import { useRomReading } from '../hooks/useRomReading'
import { useSession } from '../hooks/useSession'
import type { LoggedExercise, RomEntry, UserProfile } from '../types'
import { CelebrationOverlay } from './CelebrationOverlay'
import { IconChevronLeft } from './icons'
import { ExerciseChecklist } from './ExerciseChecklist'
import { PostWorkoutRom } from './PostWorkoutRom'
import { RedFlagCheckIn } from './RedFlagCheckIn'

interface TodayRehabProps {
  userId: string
  profile: UserProfile
  onBack: () => void
  onOpenProfile: () => void
  onOpenProgress: () => void
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

export function TodayRehab({ userId, profile, onBack, onOpenProfile, onOpenProgress }: TodayRehabProps) {
  const { current_phase: currentPhase, track } = profile
  const { loadCleared } = useLoadClearance(userId)
  const { points: romHistory } = useRomHistory(userId)
  const [gateCleared, setGateCleared] = useState(false)
  const [stage, setStage] = useState<Stage>('exercises')
  const [celebrating, setCelebrating] = useState(false)

  const cycleWeek = track === 'rehab' && profile.surgery_date ? weeksPostOp(profile.surgery_date) : 0

  const { session, ensureSession, setRedFlag } = useSession(userId, cycleWeek, currentPhase)
  const sessionId = session?.id ?? null
  const redFlagActive = session?.red_flag ?? false

  const { exercises } = useExercises(track, currentPhase)
  const { log: currentLog, setLog: setCurrentLog } = useExerciseLogs(sessionId, exercises)
  const { reading: romReading, setReading: setRomReading } = useRomReading(sessionId)

  const completedCount = exercises.filter((exercise) => currentLog[exercise.id]?.done).length
  const unlockedExercises = exercises.filter((exercise) => !exercise.requiresLoadClearance || loadCleared)
  const hasLockedExercises = !loadCleared && exercises.some((exercise) => exercise.requiresLoadClearance)
  const allUnlockedDone =
    unlockedExercises.length > 0 && unlockedExercises.every((exercise) => currentLog[exercise.id]?.done)

  async function handleExerciseChange(exerciseId: string, patch: Partial<LoggedExercise>) {
    const exerciseDef = exercises.find((e) => e.id === exerciseId)
    if (!exerciseDef) return

    const previous = currentLog[exerciseId] ?? { done: false, weight: '', reps: '', rpe: '' }
    const entry = { ...previous, ...patch }
    setCurrentLog((prev) => ({ ...prev, [exerciseId]: entry }))

    const id = await ensureSession()
    await supabase.from('exercises_logged').upsert(
      {
        session_id: id,
        name: exerciseDef.name,
        done: entry.done,
        weight: toNumberOrNull(entry.weight),
        reps: toIntOrNull(entry.reps),
        rpe: toNumberOrNull(entry.rpe),
      },
      { onConflict: 'session_id,name' },
    )
  }

  async function handleMarkAll() {
    const nextDone = !allUnlockedDone
    await Promise.all(unlockedExercises.map((exercise) => handleExerciseChange(exercise.id, { done: nextDone })))
  }

  async function handleRomChange(patch: Partial<RomEntry>) {
    const merged = { ...romReading, ...patch }
    setRomReading(merged)

    const id = await ensureSession()
    await supabase.from('rom_readings').upsert(
      {
        session_id: id,
        extension: toNumberOrNull(merged.extension),
        flexion: toNumberOrNull(merged.flexion),
      },
      { onConflict: 'session_id' },
    )
  }

  async function handleRedFlag() {
    await setRedFlag(true)
  }

  async function handleClearRedFlag() {
    await setRedFlag(false)
  }

  function handleLogSession() {
    if (completedCount > 0) {
      setCelebrating(true)
      return
    }
    setStage('rom')
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
                onChange={(id, patch) => void handleExerciseChange(id, patch)}
              />

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
              />
            </>
          )}

          <CelebrationOverlay show={celebrating} reactions={SESSION_REACTIONS} onDone={handleCelebrationDone} />
        </div>
      )}
    </main>
  )
}
