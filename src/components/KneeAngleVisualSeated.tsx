import './KneeAngleVisual.css'
import './KneeAngleVisualSeated.css'

interface KneeAngleVisualSeatedProps {
  /** 0 = leg fully straight, increasing = more bend. */
  angle: number
  maxAngle: number
}

// Sitting upright, legs out straight in front. Hip and foot both stay on the
// floor line; as the knee bends the heel slides back toward the hip and the
// knee rises, so straight = a flat line and fully bent = a tall peak — a
// real seated heel slide, not a hinge swinging into open air.
const BONE_LENGTH = 45 // thigh and shin drawn equal length for a symmetric peak
const HIP_X = 30
const FLOOR_Y = 98
const TORSO_HEIGHT = 72
const FOOT_LENGTH = 14
// The foot finishes rotating flat to the floor by the time flexion hits this
// angle — further bending past it doesn't rotate the foot any more.
const FOOT_FLAT_AT_DEG = 90

function kneeOffsetForAngle(flexionDeg: number) {
  // Interior angle at the knee: 180deg when straight, shrinking as flexion increases.
  const interior = ((180 - flexionDeg) * Math.PI) / 180
  return {
    halfWidth: BONE_LENGTH * Math.sin(interior / 2),
    height: BONE_LENGTH * Math.cos(interior / 2),
  }
}

export function KneeAngleVisualSeated({ angle, maxAngle }: KneeAngleVisualSeatedProps) {
  const clamped = Math.max(0, Math.min(maxAngle, angle))
  const { halfWidth, height } = kneeOffsetForAngle(clamped)

  const hip = { x: HIP_X, y: FLOOR_Y }
  const knee = { x: HIP_X + halfWidth, y: FLOOR_Y - height }
  const foot = { x: HIP_X + halfWidth * 2, y: FLOOR_Y }
  const shoulder = { x: hip.x, y: hip.y - TORSO_HEIGHT }

  // Foot starts pointing straight up (leg fully extended, heel out front) and
  // rotates down to flat/parallel with the floor by 90deg of flexion.
  const footProgress = Math.min(clamped, FOOT_FLAT_AT_DEG) / FOOT_FLAT_AT_DEG
  const footAngleDeg = 90 * (1 - footProgress)
  const footRad = (footAngleDeg * Math.PI) / 180
  const footTip = {
    x: foot.x + FOOT_LENGTH * Math.cos(footRad),
    y: foot.y - FOOT_LENGTH * Math.sin(footRad),
  }

  return (
    <svg viewBox="0 0 150 130" className="knee-angle-visual-seated" aria-hidden="true">
      <line x1={8} y1={FLOOR_Y} x2={142} y2={FLOOR_Y} className="knee-angle-seated-floor" />

      <line x1={hip.x} y1={hip.y} x2={shoulder.x} y2={shoulder.y} className="knee-angle-bone knee-angle-torso" />
      <circle cx={shoulder.x} cy={shoulder.y} r={4} className="knee-angle-joint knee-angle-joint-minor" />
      <text x={shoulder.x} y={shoulder.y - 8} className="knee-angle-label">
        Head
      </text>

      <line x1={hip.x} y1={hip.y} x2={knee.x} y2={knee.y} className="knee-angle-bone" />
      <line x1={knee.x} y1={knee.y} x2={foot.x} y2={foot.y} className="knee-angle-bone" />
      <line x1={foot.x} y1={foot.y} x2={footTip.x} y2={footTip.y} className="knee-angle-bone knee-angle-foot" />
      <text x={footTip.x} y={footTip.y - 6} className="knee-angle-label">
        Foot
      </text>

      <circle cx={hip.x} cy={hip.y} r={3} className="knee-angle-joint knee-angle-joint-minor" />
      <circle cx={knee.x} cy={knee.y} r={5} className="knee-angle-joint" />
      <circle cx={knee.x} cy={knee.y} r={2} className="knee-angle-joint-pin" />
    </svg>
  )
}
