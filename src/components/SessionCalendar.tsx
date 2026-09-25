import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  addMonths,
  formatFullDate,
  formatMonthYear,
  getMonthGrid,
  getWeekdayLabels,
  parseIsoDate,
  startOfMonth,
  toIsoDate,
} from '../lib/calendar'
import { todayIso } from '../lib/date'
import { PHASES } from '../lib/phases'
import type { PhaseId, Track } from '../lib/phases'
import { supabase } from '../lib/supabase'
import type { SessionSummary } from '../hooks/useSessionHistory'
import { BackfillPanel } from './BackfillPanel'
import { ConfirmModal } from './ConfirmModal'
import { IconChevronLeft, IconChevronRight, IconTrash, IconX } from './icons'
import { SessionDetail } from './SessionDetail'
import './SessionCalendar.css'

interface SessionCalendarProps {
  userId: string
  track: Track
  currentPhase: PhaseId
  surgeryDate: string | null
  sessions: SessionSummary[]
  /** ISO timestamp of when the user's programme started (profile creation). */
  createdAt: string
  /** Called after a round is deleted or a day backfilled, so the caller can refetch sessions/ROM history. */
  onSessionsChanged: () => void
}

type Tier = 'bronze' | 'silver' | 'gold'

const WEEKDAY_LABELS = getWeekdayLabels()

function phaseTitle(dayKey: string): string {
  return PHASES[dayKey as PhaseId]?.title ?? dayKey
}

function compareTimestamps(a: string, b: string): number {
  if (a < b) return -1
  return a > b ? 1 : 0
}

function tierFor(count: number): Tier {
  if (count >= 3) return 'gold'
  if (count === 2) return 'silver'
  return 'bronze'
}

export function SessionCalendar({
  userId,
  track,
  currentPhase,
  surgeryDate,
  sessions,
  createdAt,
  onSessionsChanged,
}: SessionCalendarProps) {
  const today = todayIso()
  const startIso = useMemo(() => toIsoDate(new Date(createdAt)), [createdAt])
  const startMonth = useMemo(() => startOfMonth(new Date(createdAt)), [createdAt])
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, SessionSummary[]>()
    for (const session of sessions) {
      const list = map.get(session.date) ?? []
      list.push(session)
      map.set(session.date, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => compareTimestamps(a.createdAt, b.createdAt))
    }
    return map
  }, [sessions])

  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [backfillDate, setBackfillDate] = useState<string | null>(null)
  const reduceMotion = useReducedMotion()

  const weeks = getMonthGrid(visibleMonth.getFullYear(), visibleMonth.getMonth())
  const currentMonth = startOfMonth(new Date())
  const atCurrentMonth = visibleMonth.getTime() === currentMonth.getTime()
  const atStartMonth = visibleMonth.getTime() === startMonth.getTime()

  const selectedDaySessions = selectedDate ? (sessionsByDate.get(selectedDate) ?? []) : []

  function pastDayIsMissed(dayIso: string, completedCount: number): boolean {
    if (completedCount > 0) return false
    if (dayIso < startIso) return false
    if (dayIso >= today) return false
    return true
  }

  function selectDay(dayIso: string) {
    setSelectedDate((prev) => (prev === dayIso ? null : dayIso))
  }

  function handleMissedDayClick(dayIso: string) {
    setBackfillDate((prev) => (prev === dayIso ? null : dayIso))
  }

  async function handleDeleteRound() {
    if (!pendingDeleteId) return
    setDeletingId(pendingDeleteId)
    await supabase.from('sessions').delete().eq('id', pendingDeleteId)
    setDeletingId(null)
    setPendingDeleteId(null)
    onSessionsChanged()
  }

  const backfillCompletedRounds = backfillDate
    ? (sessionsByDate.get(backfillDate) ?? []).filter((s) => s.completedAt).length
    : 0

  const pendingDeleteSession = sessions.find((s) => s.id === pendingDeleteId) ?? null

  return (
    <div className="session-calendar">
      <div className="session-calendar-header">
        <button
          type="button"
          className="session-calendar-nav"
          aria-label="Previous month"
          disabled={atStartMonth}
          onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
        >
          <IconChevronLeft />
        </button>
        <p className="session-calendar-month" aria-live="polite">
          {formatMonthYear(visibleMonth)}
        </p>
        <button
          type="button"
          className="session-calendar-nav"
          aria-label="Next month"
          disabled={atCurrentMonth}
          onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
        >
          <IconChevronRight />
        </button>
      </div>

      <table className="session-calendar-grid" role="grid" aria-label="Rehab calendar">
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((day) => (
              <th key={day} scope="col">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toIsoDate(week[0])}>
              {week.map((day) => {
                const dayIso = toIsoDate(day)
                const daySessions = sessionsByDate.get(dayIso) ?? []
                const completedCount = daySessions.filter((s) => s.completedAt).length
                const flagged = daySessions.some((s) => s.redFlag)
                const inMonth = day.getMonth() === visibleMonth.getMonth()
                const isToday = dayIso === today
                const missed = pastDayIsMissed(dayIso, completedCount)
                const hasSessions = daySessions.length > 0
                const clickable = hasSessions || missed

                let cellContent: ReactNode = day.getDate()
                let statusClass = ''
                if (completedCount > 0) {
                  statusClass = `done ${tierFor(completedCount)}`
                  cellContent = `x${completedCount}`
                } else if (missed) {
                  statusClass = 'missed'
                  cellContent = <IconX className="session-calendar-missed-icon" />
                } else if (dayIso < startIso || dayIso > today) {
                  statusClass = dayIso < startIso ? 'before-start' : 'future'
                }

                const label =
                  completedCount > 0
                    ? `${formatFullDate(day)}: ${completedCount} round${completedCount === 1 ? '' : 's'} completed${flagged ? ', flagged' : ''}`
                    : missed
                      ? `${formatFullDate(day)}: no session logged — tap to log it`
                      : formatFullDate(day)
                const isSelected = hasSessions ? selectedDate === dayIso : backfillDate === dayIso

                return (
                  <td key={dayIso} className={inMonth ? '' : 'outside'}>
                    {clickable ? (
                      <button
                        type="button"
                        className={`session-calendar-day ${statusClass}${isToday ? ' today' : ''}${
                          isSelected ? ' selected' : ''
                        }`}
                        aria-label={label}
                        aria-expanded={isSelected}
                        onClick={() => (hasSessions ? selectDay(dayIso) : handleMissedDayClick(dayIso))}
                      >
                        {cellContent}
                      </button>
                    ) : (
                      <div className={`session-calendar-day ${statusClass}${isToday ? ' today' : ''}`} aria-label={label}>
                        {cellContent}
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="session-calendar-legend">
        <li>
          <span className="session-calendar-legend-swatch bronze">x1</span>
          1 round
        </li>
        <li>
          <span className="session-calendar-legend-swatch silver">x2</span>
          2 rounds
        </li>
        <li>
          <span className="session-calendar-legend-swatch gold">x3</span>
          3+ rounds
        </li>
        <li>
          <span className="session-calendar-legend-swatch missed">
            <IconX />
          </span>
          Missed
        </li>
      </ul>

      <AnimatePresence>
        {selectedDate && selectedDaySessions.length > 0 && (
          <motion.div
            className="session-calendar-detail"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
          >
            <p className="session-calendar-detail-date">{formatFullDate(parseIsoDate(selectedDate) ?? new Date())}</p>
            {selectedDaySessions.map((session, index) => (
              <div key={session.id} className="session-calendar-round">
                <p className="session-calendar-detail-heading">
                  <span className="session-calendar-round-title">
                    Round {index + 1} · {phaseTitle(session.dayKey)}
                  </span>
                  {!session.completedAt && <span className="session-calendar-tag">In progress</span>}
                  {session.redFlag && <span className="session-calendar-flag">Flagged</span>}
                  <button
                    type="button"
                    className="session-calendar-round-delete"
                    aria-label={`Delete round ${index + 1}`}
                    onClick={() => setPendingDeleteId(session.id)}
                  >
                    <IconTrash />
                  </button>
                </p>
                <SessionDetail sessionId={session.id} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {backfillDate && (
          <motion.div
            className="session-calendar-detail"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
          >
            <p className="session-calendar-detail-date">{formatFullDate(parseIsoDate(backfillDate) ?? new Date())}</p>
            <BackfillPanel
              userId={userId}
              date={backfillDate}
              track={track}
              currentPhase={currentPhase}
              surgeryDate={surgeryDate}
              initialCompletedRounds={backfillCompletedRounds}
              onRoundLogged={onSessionsChanged}
              onClose={() => setBackfillDate(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingDeleteSession && (
          <ConfirmModal
            title="Delete this round?"
            body="Erases the exercises and ROM reading logged for this round. Can't be undone."
            confirmLabel="Delete round"
            confirmingLabel="Deleting…"
            destructive
            confirming={deletingId === pendingDeleteSession.id}
            onConfirm={() => void handleDeleteRound()}
            onCancel={() => setPendingDeleteId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
