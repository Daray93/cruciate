import type { RomPoint } from '../hooks/useRomHistory'
import './RomTrendChart.css'

interface RomTrendChartProps {
  points: RomPoint[]
}

const WIDTH = 320
const HEIGHT = 140
const PADDING = 20

// Matches RomTracker's realistic ranges. Extension is degrees short of fully
// straight (0° = ideal), so it's inverted here — lower plots higher on the
// chart, same "up = better" visual language as flexion.
const RANGE: Record<'extension' | 'flexion', { max: number; invert: boolean }> = {
  extension: { max: 30, invert: true },
  flexion: { max: 150, invert: false },
}

function scaleX(index: number, count: number) {
  if (count <= 1) return PADDING
  return PADDING + (index / (count - 1)) * (WIDTH - PADDING * 2)
}

function scaleY(value: number, key: 'extension' | 'flexion') {
  const { max, invert } = RANGE[key]
  const clamped = Math.max(0, Math.min(max, value))
  const normalized = invert ? max - clamped : clamped
  return HEIGHT - PADDING - (normalized / max) * (HEIGHT - PADDING * 2)
}

function buildPath(points: RomPoint[], key: 'extension' | 'flexion') {
  const segments: string[] = []
  points.forEach((point, index) => {
    const value = point[key]
    if (value === null) return
    segments.push(`${segments.length === 0 ? 'M' : 'L'} ${scaleX(index, points.length)} ${scaleY(value, key)}`)
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
      <p className="rom-trend-hint">Higher on the chart is better for both lines.</p>
    </div>
  )
}
