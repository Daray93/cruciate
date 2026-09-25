import { parseIsoDate } from '../lib/calendar'
import type { RomPoint } from '../hooks/useRomHistory'
import './RomTrendChart.css'

interface RomTrendChartProps {
  points: RomPoint[]
}

type Direction = 'extension' | 'flexion'

interface DirectionConfig {
  key: Direction
  label: string
  max: number
  ticks: number[]
  betterHint: string
}

const CONFIGS: DirectionConfig[] = [
  {
    key: 'extension',
    label: 'Extension',
    max: 30,
    ticks: [0, 10, 20, 30],
    betterHint: 'Lower is better — 0° is fully straight.',
  },
  {
    key: 'flexion',
    label: 'Flexion',
    max: 150,
    ticks: [0, 50, 100, 150],
    betterHint: 'Higher is better.',
  },
]

const WIDTH = 320
const HEIGHT = 170
const PAD_LEFT = 30
const PAD_RIGHT = 34
const PAD_TOP = 14
const PAD_BOTTOM = 26
const MAX_X_TICKS = 4

function scaleX(index: number, count: number) {
  if (count <= 1) return PAD_LEFT
  return PAD_LEFT + (index / (count - 1)) * (WIDTH - PAD_LEFT - PAD_RIGHT)
}

function scaleY(value: number, max: number) {
  const clamped = Math.max(0, Math.min(max, value))
  return HEIGHT - PAD_BOTTOM - (clamped / max) * (HEIGHT - PAD_TOP - PAD_BOTTOM)
}

function formatTickDate(iso: string): string {
  const date = parseIsoDate(iso)
  return date ? date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : iso
}

/** Evenly-spaced indices to label on the x-axis — never one per point. */
function pickTickIndices(count: number): number[] {
  if (count <= MAX_X_TICKS) return Array.from({ length: count }, (_, i) => i)
  const step = (count - 1) / (MAX_X_TICKS - 1)
  return Array.from({ length: MAX_X_TICKS }, (_, i) => Math.round(i * step))
}

function DirectionChart({ config, points }: { config: DirectionConfig; points: RomPoint[] }) {
  const readings = points.filter((p) => p[config.key] !== null) as (RomPoint & Record<Direction, number>)[]
  if (readings.length < 2) return null

  const linePath = readings
    .map((r, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(i, readings.length)} ${scaleY(r[config.key], config.max)}`)
    .join(' ')
  const baselineY = scaleY(0, config.max)
  const areaPath = `${linePath} L ${scaleX(readings.length - 1, readings.length)} ${baselineY} L ${scaleX(0, readings.length)} ${baselineY} Z`

  const last = readings.at(-1)!
  const lastX = scaleX(readings.length - 1, readings.length)
  const lastY = scaleY(last[config.key], config.max)
  const tickIndices = pickTickIndices(readings.length)

  return (
    <figure className={`rom-trend-figure ${config.key}`}>
      <figcaption className="rom-trend-figure-title">{config.label}</figcaption>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={`${config.label} range of motion over time`}>
        {config.ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD_LEFT}
              x2={WIDTH - PAD_RIGHT}
              y1={scaleY(tick, config.max)}
              y2={scaleY(tick, config.max)}
              className="rom-trend-gridline"
            />
            <text x={PAD_LEFT - 6} y={scaleY(tick, config.max)} className="rom-trend-axis-label rom-trend-y-label">
              {tick}
            </text>
          </g>
        ))}

        {tickIndices.map((index) => (
          <text
            key={index}
            x={scaleX(index, readings.length)}
            y={HEIGHT - PAD_BOTTOM + 16}
            className="rom-trend-axis-label rom-trend-x-label"
          >
            {formatTickDate(readings[index].date)}
          </text>
        ))}

        <path d={areaPath} className={`rom-trend-area ${config.key}`} />
        <path d={linePath} className={`rom-trend-line ${config.key}`} />
        <circle cx={lastX} cy={lastY} r={5} className={`rom-trend-end-dot ${config.key}`} />
        <text x={lastX + 8} y={lastY + 4} className="rom-trend-end-label">
          {last[config.key]}°
        </text>
      </svg>
      <p className="rom-trend-hint">{config.betterHint}</p>
    </figure>
  )
}

export function RomTrendChart({ points }: RomTrendChartProps) {
  const hasEnoughData = CONFIGS.some((config) => points.filter((p) => p[config.key] !== null).length >= 2)

  if (!hasEnoughData) {
    return <p className="rom-trend-empty">Log ROM for a couple of sessions to see your trend here.</p>
  }

  return (
    <div className="rom-trend-chart">
      {CONFIGS.map((config) => (
        <DirectionChart key={config.key} config={config} points={points} />
      ))}
    </div>
  )
}
