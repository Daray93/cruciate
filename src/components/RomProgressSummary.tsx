import { formatRelativeToToday } from '../lib/date'
import type { RomDirectionSummary, RomProgressSummary as RomProgressSummaryData } from '../lib/rom'
import { IconMinus, IconTrendingDown, IconTrendingUp } from './icons'
import './RomProgressSummary.css'

interface RomProgressSummaryProps {
  summary: RomProgressSummaryData
}

const DIRECTIONS = ['extension', 'flexion'] as const
const LABELS: Record<(typeof DIRECTIONS)[number], string> = { extension: 'Extension', flexion: 'Flexion' }

function sentence(direction: (typeof DIRECTIONS)[number], data: RomDirectionSummary): string {
  const label = LABELS[direction]
  const since = formatRelativeToToday(data.firstDate)
  const sinceText = since === 'today' ? 'your first check-in' : since

  if (data.trend === 'unchanged') {
    return `${label} is holding steady at ${data.latest}°, same as ${sinceText}.`
  }

  const verb = data.trend === 'improved' ? 'improved' : 'gotten worse by'
  return `${label} has ${verb} ${data.delta}°, from ${data.first}° to ${data.latest}°, since ${sinceText}.`
}

export function RomProgressSummary({ summary }: RomProgressSummaryProps) {
  const rows = DIRECTIONS.map((direction) => ({ direction, data: summary[direction] })).filter(
    (row): row is { direction: (typeof DIRECTIONS)[number]; data: RomDirectionSummary } => row.data !== null,
  )

  if (rows.length === 0) {
    return <p className="rom-progress-empty">Log range of motion a couple more times to see how you're trending.</p>
  }

  return (
    <ul className="rom-progress-summary">
      {rows.map(({ direction, data }) => (
        <li key={direction} className={`rom-progress-row ${data.trend}`}>
          {data.trend === 'improved' && <IconTrendingUp className="rom-progress-icon" />}
          {data.trend === 'worsened' && <IconTrendingDown className="rom-progress-icon" />}
          {data.trend === 'unchanged' && <IconMinus className="rom-progress-icon" />}
          <span>{sentence(direction, data)}</span>
        </li>
      ))}
    </ul>
  )
}
