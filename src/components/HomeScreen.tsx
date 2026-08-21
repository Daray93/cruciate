import { useEffect, useState } from 'react'
import type { Theme } from '../hooks/useTheme'
import { formatRelativeToToday } from '../lib/date'
import { supabase } from '../lib/supabase'
import { toIntOrNull, toNumberOrNull } from '../lib/numeric'
import { isTimeEligibleForNextPhase, nextPhase, PHASES, weeksPostOp } from '../lib/phases'
import { useExerciseLogs } from '../hooks/useExerciseLogs'
import { useExercises } from '../hooks/useExercises'
import { useMilestoneCheckins } from '../hooks/useMilestoneCheckins'
import { useRomHistory } from '../hooks/useRomHistory'
import { useRomReading } from '../hooks/useRomReading'
import { useSession } from '../hooks/useSession'
import { useSessionHistory } from '../hooks/useSessionHistory'
import type { LoggedExercise, RomEntry, UserProfile } from '../types'
import { ExerciseChecklist } from './ExerciseChecklist'
import { MilestoneCheckIn } from './MilestoneCheckIn'
import { OverflowMenu } from './OverflowMenu'
import { RedFlagCheckIn } from './RedFlagCheckIn'
import { RomTracker } from './RomTracker'
import { RomTrendChart } from './RomTrendChart'
import { SessionHistory } from './SessionHistory'
import './HomeScreen.css'

interface HomeScreenProps {
  userId: string
  profile: UserProfile
  onProfileChange: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function HomeScreen({ userId, profile, onProfileChange, theme, onToggleTheme }: HomeScreenProps) {
  const { current_phase: currentPhase, track } = profile
  const phaseDef = PHASES[currentPhase]
  const [loadCleared, setLoadCleared] = useState(false)
  const [checkinOpen, setCheckinOpen] = useState(false)

  const cycleWeek = track === 'rehab' && profile.surgery_date ? weeksPostOp(profile.surgery_date) : 0

  const { session, ensureSession, setRedFlag } = useSession(userId, cycleWeek, currentPhase)
  const sessionId = session?.id ?? null
  const redFlagActive = session?.red_flag ?? false

  const { exercises } = useExercises(track, currentPhase)
  const { log: currentLog, setLog: setCurrentLog } = useExerciseLogs(sessionId, exercises)
  const { reading: romReading, setReading: setRomReading } = useRomReading(sessionId)
  const { sessions: history, refetch: refetchHistory } = useSessionHistory(userId)
  const { points: romPoints, refetch: refetchRomHistory } = useRomHistory(userId)
  const { submitCheckin, overridePhase } = useMilestoneCheckins(userId)

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
    refetchHistory()
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
    refetchRomHistory()
  }

  async function handleRedFlag() {
    await setRedFlag(true)
    refetchHistory()
  }

  async function handleClearRedFlag() {
    await setRedFlag(false)
    refetchHistory()
  }

  const next = nextPhase(currentPhase)
  const checkinDue =
    next !== null && (track === 'prehab' || isTimeEligibleForNextPhase(track, currentPhase, profile.surgery_date))

  const surgeryTimelineText =
    track === 'prehab'
      ? profile.surgery_date
        ? `Surgery ${formatRelativeToToday(profile.surgery_date)}`
        : profile.surgery_timeframe === 'considering'
          ? "Still deciding on surgery. That's okay."
          : profile.surgery_timeframe === 'no_date'
            ? 'No surgery date yet.'
            : null
      : null

  const injuryText = profile.injury_date ? `Injury ${formatRelativeToToday(profile.injury_date)}` : null

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Cruciate</h1>
        <OverflowMenu theme={theme} onToggleTheme={onToggleTheme} onSignOut={() => void supabase.auth.signOut()} />
      </header>

      <section className="home-greeting">
        <p className="home-greeting-hi">Hi, {profile.name}</p>
        <p className="home-phase-label">
          {track === 'prehab' ? 'Prehab' : 'Rehab'} · {phaseDef.shortLabel}: {phaseDef.title}
        </p>
        {track === 'rehab' && profile.surgery_date && <p className="home-phase-week">Week {cycleWeek} post-op</p>}
        {surgeryTimelineText && <p className="home-phase-week">{surgeryTimelineText}</p>}
        {injuryText && <p className="home-phase-week">{injuryText}</p>}
        <p className="home-phase-criterion">{phaseDef.graduationCriterion}</p>
      </section>

      {checkinDue && !checkinOpen && (
        <button type="button" className="checkin-prompt-card" onClick={() => setCheckinOpen(true)}>
          <span className="checkin-prompt-title">
            {track === 'rehab' ? "You're time-eligible for your next phase" : 'Ready to check your progress?'}
          </span>
          <span className="checkin-prompt-body">Answer a quick check-in to see if you're ready to advance.</span>
        </button>
      )}

      {checkinDue && checkinOpen && (
        <section className="checkin-panel">
          <MilestoneCheckIn
            phase={currentPhase}
            title="Milestone check-in"
            onSubmit={async (answers) => {
              const result = await submitCheckin(currentPhase, answers)
              onProfileChange()
              return result
            }}
            onOverride={async () => {
              await overridePhase(currentPhase)
              onProfileChange()
            }}
          />
        </section>
      )}

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

      <section className="rom-trend-section">
        <h2>ROM trend</h2>
        <RomTrendChart points={romPoints} />
      </section>

      <section className="session-history-section">
        <h2>Session history</h2>
        <SessionHistory sessions={history} />
      </section>
    </main>
  )
}
