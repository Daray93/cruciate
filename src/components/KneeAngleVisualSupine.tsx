import './KneeAngleVisual.css'
import './KneeAngleVisualSupine.css'

interface KneeAngleVisualSupineProps {
  /** 0 = fully straight (best), increasing = further from straight. */
  angle: number
  maxAngle: number
}

// Lying on your back (supine), torso to the left, leg flat out to the right,
// resting on the surface. At 0deg the whole leg lies flat and the relaxed
// foot points up toward the ceiling; as extension is lost, the shin lifts
// off the surface, carrying the foot with it.
const TORSO_LENGTH = 54
const THIGH_LENGTH = 50
const SHIN_LENGTH = 42
const FOOT_LENGTH = 14
const FLOOR_Y = 60
const HIP = { x: TORSO_LENGTH + 12, y: FLOOR_Y }
const KNEE = { x: HIP.x + THIGH_LENGTH, y: HIP.y }
const TORSO = { x: HIP.x - TORSO_LENGTH, y: HIP.y }
const ARC_RADIUS = 20

function polarPoint(center: { x: number; y: number }, angleDeg: number, radius: number) {
  // 0deg points along the extended thigh (to the right, "east"); positive
  // angle sweeps upward (counter-clockwise on screen).
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: center.x + radius * Math.cos(rad),
    y: center.y - radius * Math.sin(rad),
  }
}

function describeArc(center: { x: number; y: number }, radius: number, endAngle: number) {
  if (endAngle <= 0) return ''
  const start = polarPoint(center, 0, radius)
  const end = polarPoint(center, endAngle, radius)
  const largeArc = endAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

export function KneeAngleVisualSupine({ angle, maxAngle }: KneeAngleVisualSupineProps) {
  const clamped = Math.max(0, Math.min(maxAngle, angle))

  return (
    <svg viewBox="0 0 180 100" className="knee-angle-visual-supine" aria-hidden="true">
      {/* Bed/surface, so the body reads as lying flat rather than standing */}
      <line x1={4} y1={FLOOR_Y} x2={176} y2={FLOOR_Y} className="knee-angle-supine-bed" />

      <path d={describeArc(KNEE, ARC_RADIUS, maxAngle)} className="knee-angle-range" />
      <path d={describeArc(KNEE, ARC_RADIUS, clamped)} className="knee-angle-progress" />

      {/* Torso, fixed flat on the surface — only the knee hinges */}
      <line x1={TORSO.x} y1={TORSO.y} x2={HIP.x} y2={HIP.y} className="knee-angle-bone knee-angle-torso" />
      <circle cx={TORSO.x} cy={TORSO.y} r={4} className="knee-angle-joint knee-angle-joint-minor" />
      <text x={TORSO.x} y={TORSO.y - 8} className="knee-angle-label">
        Head
      </text>

      <line x1={HIP.x} y1={HIP.y} x2={KNEE.x} y2={KNEE.y} className="knee-angle-bone" />
      <circle cx={HIP.x} cy={HIP.y} r={3} className="knee-angle-joint knee-angle-joint-minor" />

      <g className="knee-angle-shin-group" transform={`rotate(${-clamped} ${KNEE.x} ${KNEE.y})`}>
        <line x1={KNEE.x} y1={KNEE.y} x2={KNEE.x + SHIN_LENGTH} y2={KNEE.y} className="knee-angle-bone" />
        <line
          x1={KNEE.x + SHIN_LENGTH}
          y1={KNEE.y}
          x2={KNEE.x + SHIN_LENGTH}
          y2={KNEE.y - FOOT_LENGTH}
          className="knee-angle-bone knee-angle-foot"
        />
        <text x={KNEE.x + SHIN_LENGTH} y={KNEE.y - FOOT_LENGTH - 8} className="knee-angle-label">
          Foot
        </text>
      </g>

      <circle cx={KNEE.x} cy={KNEE.y} r={5} className="knee-angle-joint" />
      <circle cx={KNEE.x} cy={KNEE.y} r={2} className="knee-angle-joint-pin" />
    </svg>
  )
}
