import { useEffect, useState } from 'react'
import { AuthGate } from './components/AuthGate'
import { WeekDaySelector } from './components/WeekDaySelector'
import { ExerciseChecklist } from './components/ExerciseChecklist'
import { ThemeToggle } from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'
import { supabase } from './lib/supabase'
import { program } from './data/program'
import type { ExerciseLog, LoggedExercise } from './types'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <div className="floating-theme-toggle">
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </div>
      <AuthGate>{(userId) => <Tracker userId={userId} />}</AuthGate>
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
  const [logsByDay, setLogsByDay] = useState<Record<string, ExerciseLog>>({})

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

  const currentWeek = program.find((week) => week.week === selectedWeek) ?? program[0]
  const currentDay = currentWeek.days.find((day) => day.dayKey === selectedDayKey) ?? currentWeek.days[0]
  const currentLog = logsByDay[currentDay.dayKey] ?? {}

  const completedCount = currentDay.exercises.filter((exercise) => currentLog[exercise.id]?.done).length

  function handleSelectWeek(week: number) {
    setSelectedWeek(week)
    const nextWeek = program.find((w) => w.week === week)
    if (nextWeek) setSelectedDayKey(nextWeek.days[0].dayKey)
  }

  function handleExerciseChange(exerciseId: string, patch: Partial<LoggedExercise>) {
    setLogsByDay((prev) => {
      const dayLog = prev[currentDay.dayKey] ?? {}
      const entry = dayLog[exerciseId] ?? { done: false, weight: '', reps: '', rpe: '' }
      return {
        ...prev,
        [currentDay.dayKey]: {
          ...dayLog,
          [exerciseId]: { ...entry, ...patch },
        },
      }
    })
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

      <WeekDaySelector
        program={program}
        selectedWeek={selectedWeek}
        selectedDayKey={currentDay.dayKey}
        onSelectWeek={handleSelectWeek}
        onSelectDay={setSelectedDayKey}
      />

      <section className="session-summary">
        <span>
          {completedCount} / {currentDay.exercises.length} complete
        </span>
      </section>

      <ExerciseChecklist
        exercises={currentDay.exercises}
        log={currentLog}
        loadCleared={loadCleared}
        onChange={handleExerciseChange}
      />
    </main>
  )
}

export default App
