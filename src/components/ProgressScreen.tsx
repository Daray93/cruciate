import { useRomHistory } from '../hooks/useRomHistory'
import { useSessionHistory } from '../hooks/useSessionHistory'
import { summarizeRomProgress } from '../lib/rom'
import type { UserProfile } from '../types'
import { RomProgressSummary } from './RomProgressSummary'
import { RomTrendChart } from './RomTrendChart'
import { SessionCalendar } from './SessionCalendar'

interface ProgressScreenProps {
  userId: string
  profile: UserProfile
}

export function ProgressScreen({ userId, profile }: ProgressScreenProps) {
  const { points: romPoints, refetch: refetchRom } = useRomHistory(userId)
  const { sessions: history, refetch: refetchSessions } = useSessionHistory(userId)

  function handleSessionsChanged() {
    refetchSessions()
    refetchRom()
  }

  return (
    <main className="app-shell app-shell-with-tabs">
      <header className="app-header">
        <h1>Progress</h1>
      </header>

      <section className="rom-trend-section">
        <h2 className="section-title">ROM trend</h2>
        <div className="section-card">
          {romPoints.length < 2 ? (
            <p className="rom-trend-empty">Log range of motion a couple more times to see how you're trending.</p>
          ) : (
            <>
              <RomProgressSummary summary={summarizeRomProgress(romPoints)} />
              <RomTrendChart points={romPoints} />
            </>
          )}
        </div>
      </section>

      <section className="session-history-section">
        <h2 className="section-title">Your calendar</h2>
        <SessionCalendar
          userId={userId}
          track={profile.track}
          currentPhase={profile.current_phase}
          surgeryDate={profile.surgery_date}
          sessions={history}
          createdAt={profile.created_at}
          onSessionsChanged={handleSessionsChanged}
        />
      </section>
    </main>
  )
}
