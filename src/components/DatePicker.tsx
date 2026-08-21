import { useEffect, useId, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  addDays,
  addMonths,
  formatDisplayDate,
  formatFullDate,
  formatMonthYear,
  getMonthGrid,
  getWeekdayLabels,
  isSameDay,
  parseIsoDate,
  startOfMonth,
  toIsoDate,
} from '../lib/calendar'
import { IconCalendar, IconChevronLeft, IconChevronRight } from './icons'
import './DatePicker.css'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
const WEEKDAY_LABELS = getWeekdayLabels()

interface DatePickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  /** Inclusive bounds, as 'yyyy-mm-dd'. */
  min?: string
  max?: string
}

export function DatePicker({ label, value, onChange, required, min, max }: DatePickerProps) {
  const selectedDate = parseIsoDate(value)
  const minDate = min ? parseIsoDate(min) : null
  const maxDate = max ? parseIsoDate(max) : null

  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate ?? new Date()))
  const [focusedDate, setFocusedDate] = useState(() => selectedDate ?? new Date())

  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dayRefs = useRef(new Map<string, HTMLButtonElement>())
  const reduceMotion = useReducedMotion()
  const headingId = useId()

  function isInRange(date: Date) {
    if (minDate && date < minDate) return false
    if (maxDate && date > maxDate) return false
    return true
  }

  function openPicker() {
    const base = selectedDate ?? new Date()
    setVisibleMonth(startOfMonth(base))
    setFocusedDate(base)
    setOpen(true)
  }

  function closePicker(returnFocus: boolean) {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  function selectDate(date: Date) {
    onChange(toIsoDate(date))
    closePicker(true)
  }

  function moveFocus(next: Date) {
    setFocusedDate(next)
    if (next.getMonth() !== visibleMonth.getMonth() || next.getFullYear() !== visibleMonth.getFullYear()) {
      setVisibleMonth(startOfMonth(next))
    }
  }

  function handleGridKeyDown(e: React.KeyboardEvent) {
    const deltas: Record<string, Date | undefined> = {
      ArrowLeft: addDays(focusedDate, -1),
      ArrowRight: addDays(focusedDate, 1),
      ArrowUp: addDays(focusedDate, -7),
      ArrowDown: addDays(focusedDate, 7),
      PageUp: addMonths(focusedDate, -1),
      PageDown: addMonths(focusedDate, 1),
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      closePicker(true)
      return
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isInRange(focusedDate)) selectDate(focusedDate)
      return
    }
    const next = deltas[e.key]
    if (next) {
      e.preventDefault()
      moveFocus(next)
    }
  }

  // Keep DOM focus on the roving-tabindex day whenever it changes.
  useEffect(() => {
    if (!open) return
    dayRefs.current.get(toIsoDate(focusedDate))?.focus()
  }, [open, focusedDate])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: MouseEvent) {
      if (!(e.target instanceof Node)) return
      if (wrapRef.current && !wrapRef.current.contains(e.target)) closePicker(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  const weeks = getMonthGrid(visibleMonth.getFullYear(), visibleMonth.getMonth())

  return (
    <div className="date-picker" ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className="date-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? closePicker(false) : openPicker())}
      >
        <span className="date-picker-label">
          {label}
          {required ? '' : ' (optional)'}
        </span>
        <span className={`date-picker-value${selectedDate ? '' : ' placeholder'}`}>
          {selectedDate ? formatDisplayDate(selectedDate) : 'Choose a date'}
        </span>
        <IconCalendar className="date-picker-icon" />
      </button>

      {open && (
        <motion.div
          className="date-picker-popover"
          role="dialog"
          aria-label={`Choose ${label.toLowerCase()}`}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.96) translateY(-4px)' }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1) translateY(0px)' }}
          transition={{ duration: 0.16, ease: EASE_OUT }}
          style={{ transformOrigin: 'top left' }}
        >
          <div className="date-picker-header">
            <button
              type="button"
              className="date-picker-nav"
              aria-label="Previous month"
              onClick={() => setVisibleMonth((m) => addMonths(m, -1))}
            >
              <IconChevronLeft />
            </button>
            <p id={headingId} className="date-picker-month" aria-live="polite">
              {formatMonthYear(visibleMonth)}
            </p>
            <button
              type="button"
              className="date-picker-nav"
              aria-label="Next month"
              onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
            >
              <IconChevronRight />
            </button>
          </div>

          <table className="date-picker-grid" role="grid" aria-labelledby={headingId}>
            <thead>
              <tr>
                {WEEKDAY_LABELS.map((day) => (
                  <th key={day} scope="col">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody onKeyDown={handleGridKeyDown}>
              {weeks.map((week) => (
                <tr key={toIsoDate(week[0])}>
                  {week.map((day) => {
                    const inMonth = day.getMonth() === visibleMonth.getMonth()
                    const disabled = !isInRange(day)
                    const selected = selectedDate ? isSameDay(day, selectedDate) : false
                    const isFocusTarget = isSameDay(day, focusedDate)
                    return (
                      <td key={toIsoDate(day)} role="gridcell" aria-selected={selected}>
                        <button
                          type="button"
                          ref={(el) => {
                            if (el) dayRefs.current.set(toIsoDate(day), el)
                            else dayRefs.current.delete(toIsoDate(day))
                          }}
                          className={`date-picker-day${inMonth ? '' : ' outside'}${selected ? ' selected' : ''}`}
                          tabIndex={isFocusTarget ? 0 : -1}
                          disabled={disabled}
                          aria-label={formatFullDate(day)}
                          onClick={() => selectDate(day)}
                          onFocus={() => setFocusedDate(day)}
                        >
                          {day.getDate()}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}
