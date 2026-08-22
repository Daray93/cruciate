import './KneeAngleVisual.css'

interface KneeAngleVisualProps {
  /** 0 = leg fully straight, increasing = more bend. */
  angle: number
  maxAngle: number
}

// Side-on leg, facing right. Bending swings the shin+foot backward (left),
// same direction a knee actually hinges when you sit down or bend it.
const HIP = { x: 46, y: 12 }
const THIGH_LENGTH = 42
const SHIN_LENGTH = 42
const FOOT_LENGTH = 16
const KNEE = { x: HIP.x, y: HIP.y + THIGH_LENGTH }
const ARC_RADIUS = 20

function polarPoint(center: { x: number; y: number }, angleDeg: number, radius: number) {
  // 0deg points straight down; positive rotates clockwise (screen coords).
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: center.x - radius * Math.sin(rad),
    y: center.y + radius * Math.cos(rad),
  }
}

function describeArc(center: { x: number; y: number }, radius: number, endAngle: number) {
  if (endAngle <= 0) return ''
  const start = polarPoint(center, 0, radius)
  const end = polarPoint(center, endAngle, radius)
  const largeArc = endAngle > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export function KneeAngleVisual({ angle, maxAngle }: KneeAngleVisualProps) {
  const clamped = Math.max(0, Math.min(maxAngle, angle))

  return (
    <svg viewBox="0 0 100 120" className="knee-angle-visual" aria-hidden="true">
      {/* Full sweep range, faint guide */}
      <path d={describeArc(KNEE, ARC_RADIUS, maxAngle)} className="knee-angle-range" />
      {/* Swept-so-far arc, highlighted */}
      <path d={describeArc(KNEE, ARC_RADIUS, clamped)} className="knee-angle-progress" />

      {/* Thigh, fixed */}
      <line x1={HIP.x} y1={HIP.y} x2={KNEE.x} y2={KNEE.y} className="knee-angle-bone" />
      <circle cx={HIP.x} cy={HIP.y} r={3} className="knee-angle-joint knee-angle-joint-minor" />

      {/* Shin + foot, pivoting together around the knee. Uses SVG's own
          three-argument rotate(angle, cx, cy) so the pivot point is embedded
          directly in the transform — CSS transform-origin on SVG elements is
          notoriously inconsistent about which box it measures from, which is
          exactly what was making this drift away from the knee as it rotated. */}
      <g
        className="knee-angle-shin-group"
        transform={`rotate(${clamped} ${KNEE.x} ${KNEE.y})`}
      >
        <line x1={KNEE.x} y1={KNEE.y} x2={KNEE.x} y2={KNEE.y + SHIN_LENGTH} className="knee-angle-bone" />
        <line
          x1={KNEE.x}
          y1={KNEE.y + SHIN_LENGTH}
          x2={KNEE.x + FOOT_LENGTH}
          y2={KNEE.y + SHIN_LENGTH}
          className="knee-angle-bone knee-angle-foot"
        />
      </g>

      {/* Knee pivot, drawn last so it sits on top of both bones */}
      <circle cx={KNEE.x} cy={KNEE.y} r={5} className="knee-angle-joint" />
      <circle cx={KNEE.x} cy={KNEE.y} r={2} className="knee-angle-joint-pin" />
    </svg>
  )
}
