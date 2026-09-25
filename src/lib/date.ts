import { parseIsoDate } from './calendar'

export function todayIso(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Whole days from today to the given 'yyyy-mm-dd' date. Negative if it's in the past. */
export function daysUntil(iso: string, today: Date = new Date()): number {
  const target = parseIsoDate(iso)
  if (!target) return 0
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((target.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))
}

/** "Sat 22 Aug, 2026" — fixed weekday/day/month/year order regardless of browser locale. */
export function formatLongDate(date: Date = new Date()): string {
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-GB', { month: 'short' })
  const year = date.getFullYear()
  return `${weekday} ${day} ${month}, ${year}`
}

/** "in 3 weeks" / "6 days ago" / "today" — days under two weeks read as days, past that as weeks. */
export function formatRelativeToToday(iso: string, today: Date = new Date()): string {
  const days = daysUntil(iso, today)
  if (days === 0) return 'today'

  const future = days > 0
  const abs = Math.abs(days)
  const useDays = abs < 14
  const value = useDays ? abs : Math.round(abs / 7)
  const unit = useDays ? (value === 1 ? 'day' : 'days') : value === 1 ? 'week' : 'weeks'

  return future ? `in ${value} ${unit}` : `${value} ${unit} ago`
}
