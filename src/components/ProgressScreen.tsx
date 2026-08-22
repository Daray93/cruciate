import { useRomHistory } from '../hooks/useRomHistory'
import { useSessionHistory } from '../hooks/useSessionHistory'
import { IconChevronLeft } from './icons'
import { RomTrendChart } from './RomTrendChart'
import { SessionHistory } from './SessionHistory'

interface ProgressScreenProps {
  userId: string
  onBack: () => void
}

export function ProgressScreen({ userId, onBack }: ProgressScreenProps) {
  const { points: romPoints } = useRomHistory(userId)
  const { sessions: history } = useSessionHistory(userId)

  return (
    <main className="app-shell">
      <header className="subpage-header">
        <button type="button" className="subpage-back" onClick={onBack}>
          <IconChevronLeft />
          Home
        </button>
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
