import { useState } from 'react'
import type { SessionSummary } from '../hooks/useSessionHistory'
import { SessionDetail } from './SessionDetail'
import './SessionHistory.css'

interface SessionHistoryProps {
  sessions: SessionSummary[]
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (sessions.length === 0) {
    return <p className="session-history-empty">No sessions logged yet.</p>
  }

  return (
    <ul className="session-history">
      {sessions.map((session) => {
        const expanded = expandedId === session.id
        return (
          <li key={session.id} className="session-history-row">
            <button
              type="button"
              className="session-history-summary"
              onClick={() => setExpandedId(expanded ? null : session.id)}
              aria-expanded={expanded}
            >
              <span className="session-history-date">{session.date}</span>
              <span className="session-history-day">
                Week {session.cycleWeek} · {session.dayKey}
              </span>
              {session.redFlag && <span className="session-history-flag">Flagged</span>}
              <span className="session-history-chevron">{expanded ? '▲' : '▼'}</span>
            </button>
            {expanded && <SessionDetail sessionId={session.id} />}
          </li>
        )
      })}
    </ul>
  )
}
