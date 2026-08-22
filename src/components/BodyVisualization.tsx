import { useMuscleGroupTotals } from '../hooks/useMuscleGroupTotals'
import { MUSCLE_GROUPS, MUSCLE_GROUP_LABEL, MUSCLE_GROUP_TARGET } from '../lib/muscleGroups'
import type { MuscleGroup } from '../lib/muscleGroups'
import './BodyVisualization.css'

interface BodyVisualizationProps {
  userId: string
}

function intensity(count: number): number {
  return Math.min(1, count / MUSCLE_GROUP_TARGET)
}

interface ZoneProps {
  x: number
  y: number
  width: number
  height: number
  rx: number
  group: MuscleGroup
  totals: Record<MuscleGroup, number>
}

function Zone({ x, y, width, height, rx, group, totals }: ZoneProps) {
  const value = intensity(totals[group])
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={rx}
      className="body-viz-zone"
      style={{ opacity: 0.12 + value * 0.88 }}
    />
  )
}

export function BodyVisualization({ userId }: BodyVisualizationProps) {
  const { totals } = useMuscleGroupTotals(userId)

  return (
    <main className="app-shell app-shell-with-tabs">
      <header className="app-header">
        <h1>Body</h1>
      </header>

      <p className="body-viz-hint">
        Fills in as you log strength exercises — this app only trains your lower body, so that's all that's tracked.
      </p>

      <div className="body-viz-figure-wrap">
        <svg viewBox="0 0 100 220" className="body-viz-figure" role="img" aria-label="Muscle groups worked, by how often">
          {/* Neutral upper body */}
          <circle cx="50" cy="18" r="11" className="body-viz-neutral" />
          <rect x="46" y="28" width="8" height="8" className="body-viz-neutral" />
          <rect x="30" y="35" width="40" height="52" rx="14" className="body-viz-neutral" />
          <rect x="16" y="38" width="12" height="46" rx="6" className="body-viz-neutral" />
          <rect x="72" y="38" width="12" height="46" rx="6" className="body-viz-neutral" />
          <rect x="14" y="80" width="10" height="12" rx="5" className="body-viz-neutral" />
          <rect x="76" y="80" width="10" height="12" rx="5" className="body-viz-neutral" />

          {/* Pelvis, neutral centre */}
          <rect x="34" y="86" width="32" height="18" rx="9" className="body-viz-neutral" />

          {/* Glutes — hip-side zones */}
          <Zone x={24} y={88} width={12} height={20} rx={6} group="glutes" totals={totals} />
          <Zone x={64} y={88} width={12} height={20} rx={6} group="glutes" totals={totals} />

          {/* Hamstrings — outer thigh sliver */}
          <Zone x={24} y={106} width={9} height={48} rx={4.5} group="hamstrings" totals={totals} />
          <Zone x={67} y={106} width={9} height={48} rx={4.5} group="hamstrings" totals={totals} />

          {/* Quads — main front thigh */}
          <Zone x={33} y={106} width={16} height={50} rx={7} group="quads" totals={totals} />
          <Zone x={51} y={106} width={16} height={50} rx={7} group="quads" totals={totals} />

          {/* Calves */}
          <Zone x={31} y={160} width={15} height={44} rx={7} group="calves" totals={totals} />
          <Zone x={54} y={160} width={15} height={44} rx={7} group="calves" totals={totals} />

          {/* Feet, neutral */}
          <rect x="29" y="204" width="19" height="8" rx="4" className="body-viz-neutral" />
          <rect x="52" y="204" width="19" height="8" rx="4" className="body-viz-neutral" />
        </svg>
      </div>

      <ul className="body-viz-legend">
        {MUSCLE_GROUPS.map((group) => (
          <li key={group} className="body-viz-legend-row">
            <span className="body-viz-legend-label">{MUSCLE_GROUP_LABEL[group]}</span>
            <div className="body-viz-legend-bar">
              <div className="body-viz-legend-fill" style={{ width: `${intensity(totals[group]) * 100}%` }} />
            </div>
            <span className="body-viz-legend-count">{totals[group]}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
