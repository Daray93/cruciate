import { useEffect, useState } from 'react'
import { AuthGate } from './components/AuthGate'
import { DesignSystemPage } from './components/DesignSystemPage'
import { WeekDaySelector } from './components/WeekDaySelector'
import { ExerciseChecklist } from './components/ExerciseChecklist'
import { ThemeToggle } from './components/ThemeToggle'
import { RedFlagCheckIn } from './components/RedFlagCheckIn'
import { RomTracker } from './components/RomTracker'
import { RomTrendChart } from './components/RomTrendChart'
import { SessionHistory } from './components/SessionHistory'
import { useTheme } from './hooks/useTheme'
import { useSession } from './hooks/useSession'
import { useExerciseLogs } from './hooks/useExerciseLogs'
import { useRomReading } from './hooks/useRomReading'
import { useRomHistory } from './hooks/useRomHistory'
import { useSessionHistory } from './hooks/useSessionHistory'
import { supabase } from './lib/supabase'
import { toIntOrNull, toNumberOrNull } from './lib/numeric'
import { program } from './data/program'
import type { LoggedExercise, RomEntry } from './types'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const isDesignSystemRoute = window.location.pathname === '/design-system'

  return (
    <>
      <div className="floating-theme-toggle">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      {isDesignSystemRoute ? (
        <DesignSystemPage />
      ) : (
        <AuthGate>{(userId) => <Tracker userId={userId} />}</AuthGate>
      )}
    </>
  )
}

interface TrackerProps {
  userId: string
}

function Tracker({ userId }: TrackerProps) {
  const [selectedWeek, setSelectedWeek] = useState(program[0].week)
  const [selectedDayKey, setSelectedDayKey] = useState(program[0].days[0].dayKey)
  const [loadCleared, setLoadCleared] = useState(false)

  const currentWeek = program.find((week) => week.week === selectedWeek) ?? program[0]
  const currentDay = currentWeek.days.find((day) => day.dayKey === selectedDayKey) ?? currentWeek.days[0]

  const { session, ensureSession, setRedFlag } = useSession(userId, selectedWeek, selectedDayKey)
  const sessionId = session?.id ?? null
  const redFlagActive = session?.red_flag ?? false

  const { log: currentLog, setLog: setCurrentLog } = useExerciseLogs(sessionId, currentDay.exercises)
  const { reading: romReading, setReading: setRomReading } = useRomReading(sessionId)
  const { sessions: history, refetch: refetchHistory } = useSessionHistory(userId)
  const { points: romPoints, refetch: refetchRomHistory } = useRomHistory(userId)

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

  const completedCount = currentDay.exercises.filter((exercise) => currentLog[exercise.id]?.done).length

  function handleSelectWeek(week: number) {
    setSelectedWeek(week)
    const nextWeek = program.find((w) => w.week === week)
    if (nextWeek) setSelectedDayKey(nextWeek.days[0].dayKey)
  }

  async function handleExerciseChange(exerciseId: string, patch: Partial<LoggedExercise>) {
    const exerciseDef = currentDay.exercises.find((e) => e.id === exerciseId)
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

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Cruciate</h1>
        <button type="button" className="sign-out-button" onClick={() => void supabase.auth.signOut()}>
          Sign out
        </button>
      </header>

      <label className="clearance-toggle">
        <input
          type="checkbox"
          checked={loadCleared}
          onChange={(e) => void handleToggleLoadCleared(e.target.checked)}
        />
        Load cleared
      </label>

      <RedFlagCheckIn
        active={redFlagActive}
        onFlag={() => void handleRedFlag()}
        onClear={() => void handleClearRedFlag()}
      />

      <WeekDaySelector
        program={program}
        selectedWeek={selectedWeek}
        selectedDayKey={currentDay.dayKey}
        onSelectWeek={handleSelectWeek}
        onSelectDay={setSelectedDayKey}
      />

      {!redFlagActive && (
        <>
          <section className="session-summary">
            <span>
              {completedCount} / {currentDay.exercises.length} complete
            </span>
          </section>

          <ExerciseChecklist
            exercises={currentDay.exercises}
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

export default App
