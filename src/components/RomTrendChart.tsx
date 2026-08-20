import type { RomPoint } from '../hooks/useRomHistory'
import './RomTrendChart.css'

interface RomTrendChartProps {
  points: RomPoint[]
}

const WIDTH = 320
const HEIGHT = 140
const PADDING = 20
const MAX_DEGREES = 140

function scaleX(index: number, count: number) {
  if (count <= 1) return PADDING
  return PADDING + (index / (count - 1)) * (WIDTH - PADDING * 2)
}

function scaleY(value: number) {
  const clamped = Math.max(0, Math.min(MAX_DEGREES, value))
  return HEIGHT - PADDING - (clamped / MAX_DEGREES) * (HEIGHT - PADDING * 2)
}

function buildPath(points: RomPoint[], key: 'extension' | 'flexion') {
  const segments: string[] = []
  points.forEach((point, index) => {
    const value = point[key]
    if (value === null) return
    segments.push(`${segments.length === 0 ? 'M' : 'L'} ${scaleX(index, points.length)} ${scaleY(value)}`)
  })
  return segments.join(' ')
}

export function RomTrendChart({ points }: RomTrendChartProps) {
  if (points.length < 2) {
    return <p className="rom-trend-empty">Log ROM for a couple of sessions to see your trend here.</p>
  }

  return (
    <div className="rom-trend-chart">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="Range of motion trend over time">
        <path d={buildPath(points, 'extension')} className="rom-trend-line extension" />
        <path d={buildPath(points, 'flexion')} className="rom-trend-line flexion" />
      </svg>
      <div className="rom-trend-legend">
        <span className="rom-trend-legend-item extension">Extension</span>
        <span className="rom-trend-legend-item flexion">Flexion</span>
      </div>
    </div>
  )
}
