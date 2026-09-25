import type { RomPoint } from '../hooks/useRomHistory'

export type RomTrend = 'improved' | 'worsened' | 'unchanged'

export interface RomDirectionSummary {
  trend: RomTrend
  /** Always positive — degrees changed, in whichever direction `trend` says. */
  delta: number
  first: number
  latest: number
  firstDate: string
  latestDate: string
}

export interface RomProgressSummary {
  extension: RomDirectionSummary | null
  flexion: RomDirectionSummary | null
}

// Extension: lower is better (0deg = fully straight). Flexion: higher is better.
function directionSummary(
  direction: 'extension' | 'flexion',
  points: RomPoint[],
): RomDirectionSummary | null {
  const readings = points.filter((p) => p[direction] !== null) as (RomPoint & Record<typeof direction, number>)[]
  if (readings.length < 2) return null

  const firstPoint = readings[0]
  const latestPoint = readings[readings.length - 1]
  const first = firstPoint[direction]
  const latest = latestPoint[direction]

  const rawDelta = direction === 'extension' ? first - latest : latest - first
  const trend: RomTrend = rawDelta > 0 ? 'improved' : rawDelta < 0 ? 'worsened' : 'unchanged'

  return {
    trend,
    delta: Math.abs(rawDelta),
    first,
    latest,
    firstDate: firstPoint.date,
    latestDate: latestPoint.date,
  }
}

/** Compares each direction's earliest reading to its latest, across every session log and milestone check-in. */
export function summarizeRomProgress(points: RomPoint[]): RomProgressSummary {
  return {
    extension: directionSummary('extension', points),
    flexion: directionSummary('flexion', points),
  }
}
