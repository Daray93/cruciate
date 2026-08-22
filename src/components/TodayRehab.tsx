import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { toIntOrNull, toNumberOrNull } from '../lib/numeric'
import { weeksPostOp } from '../lib/phases'
import { useExerciseLogs } from '../hooks/useExerciseLogs'
import { useExercises } from '../hooks/useExercises'
import { useRomReading } from '../hooks/useRomReading'
import { useSession } from '../hooks/useSession'
import type { LoggedExercise, RomEntry, UserProfile } from '../types'
import { IconChevronLeft } from './icons'
import { ExerciseChecklist } from './ExerciseChecklist'
import { RedFlagCheckIn } from './RedFlagCheckIn'
import { RomTracker } from './RomTracker'

interface TodayRehabProps {
  userId: string
  profile: UserProfile
  onBack: () => void
}

export function TodayRehab({ userId, profile, onBack }: TodayRehabProps) {
  const { current_phase: currentPhase, track } = profile
  const [loadCleared, setLoadCleared] = useState(false)

  const cycleWeek = track === 'rehab' && profile.surgery_date ? weeksPostOp(profile.surgery_date) : 0

  const { session, ensureSession, setRedFlag } = useSession(userId, cycleWeek, currentPhase)
  const sessionId = session?.id ?? null
  const redFlagActive = session?.red_flag ?? false

  const { exercises } = useExercises(track, currentPhase)
  const { log: currentLog, setLog: setCurrentLog } = useExerciseLogs(sessionId, exercises)
  const { reading: romReading, setReading: setRomReading } = useRomReading(sessionId)

  useEffect(() => {
    supabase
      .from('clearance')
      .select('load_cleared')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => setLoadCleared(data?.load_cleared ?? false))
  }, [userId])

  async function handleToggleLoadCleared(checked: boolean) {
    setLoadCleared(checked)
    await supabase.from('clearance').upsert({ user_id: userId, load_cleared: checked })
  }

  const completedCount = exercises.filter((exercise) => currentLog[exercise.id]?.done).length

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

  return (
    <main className="app-shell">
      <header className="subpage-header">
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
      />

      {!redFlagActive && (
        <>
          <label className="clearance-toggle">
            <input
              type="checkbox"
              checked={loadCleared}
              onChange={(e) => void handleToggleLoadCleared(e.target.checked)}
            />
            Load cleared
          </label>

          <section className="session-summary">
            <span>
              {completedCount} / {exercises.length} complete
            </span>
          </section>

          <ExerciseChecklist
            exercises={exercises}
            log={currentLog}
            loadCleared={loadCleared}
            onChange={(id, patch) => void handleExerciseChange(id, patch)}
          />

          <RomTracker reading={romReading} onChange={(patch) => void handleRomChange(patch)} />
        </>
      )}
    </main>
  )
}
