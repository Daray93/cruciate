import type { WeekProgram } from '../types'
import './WeekDaySelector.css'

interface WeekDaySelectorProps {
  program: WeekProgram[]
  selectedWeek: number
  selectedDayKey: string
  onSelectWeek: (week: number) => void
  onSelectDay: (dayKey: string) => void
}

export function WeekDaySelector({
  program,
  selectedWeek,
  selectedDayKey,
  onSelectWeek,
  onSelectDay,
}: WeekDaySelectorProps) {
  const currentWeek = program.find((week) => week.week === selectedWeek) ?? program[0]

  return (
    <div className="week-day-selector">
      <div className="week-tabs" role="tablist" aria-label="Program week">
        {program.map((week) => (
          <button
            key={week.week}
            type="button"
            role="tab"
            aria-selected={week.week === selectedWeek}
            className={`week-tab${week.week === selectedWeek ? ' active' : ''}`}
            onClick={() => onSelectWeek(week.week)}
          >
            Week {week.week}
          </button>
        ))}
      </div>

      <p className="phase-label">{currentWeek.phase}</p>

      <div className="day-tabs" role="tablist" aria-label="Program day">
        {currentWeek.days.map((day) => (
          <button
            key={day.dayKey}
            type="button"
            role="tab"
            aria-selected={day.dayKey === selectedDayKey}
            className={`day-tab${day.dayKey === selectedDayKey ? ' active' : ''}`}
            onClick={() => onSelectDay(day.dayKey)}
          >
            <span className="day-tab-label">{day.label}</span>
            <span className="day-tab-focus">{day.focus}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
