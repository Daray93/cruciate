import { useRomHistory } from '../hooks/useRomHistory'
import { useSessionHistory } from '../hooks/useSessionHistory'
import { RomTrendChart } from './RomTrendChart'
import { SessionHistory } from './SessionHistory'

interface ProgressScreenProps {
  userId: string
}

export function ProgressScreen({ userId }: ProgressScreenProps) {
  const { points: romPoints } = useRomHistory(userId)
  const { sessions: history } = useSessionHistory(userId)

  return (
    <main className="app-shell app-shell-with-tabs">
      <header className="app-header">
        <h1>Progress</h1>
      </header>

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
