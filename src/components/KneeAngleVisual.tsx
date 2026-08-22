import { motion, useReducedMotion } from 'motion/react'
import './KneeAngleVisual.css'

interface KneeAngleVisualProps {
  /** 0 = leg fully straight, increasing = more bend. */
  angle: number
  maxAngle: number
}

const HIP = { x: 50, y: 14 }
const THIGH_LENGTH = 46
const SHIN_LENGTH = 50
const KNEE = { x: HIP.x, y: HIP.y + THIGH_LENGTH }

export function KneeAngleVisual({ angle, maxAngle }: KneeAngleVisualProps) {
  const reduceMotion = useReducedMotion()
  const clamped = Math.max(0, Math.min(maxAngle, angle))

  return (
    <svg viewBox="0 0 100 120" className="knee-angle-visual" aria-hidden="true">
      <line x1={HIP.x} y1={HIP.y} x2={KNEE.x} y2={KNEE.y} className="knee-angle-bone" />
      <motion.line
        x1={KNEE.x}
        y1={KNEE.y}
        x2={KNEE.x}
        y2={KNEE.y + SHIN_LENGTH}
        className="knee-angle-bone knee-angle-shin"
        style={{ transformOrigin: `${KNEE.x}px ${KNEE.y}px` }}
        animate={{ transform: `rotate(${clamped}deg)` }}
        transition={reduceMotion ? { duration: 0.1 } : { type: 'spring', duration: 0.4, bounce: 0.1 }}
      />
      <circle cx={KNEE.x} cy={KNEE.y} r={3.5} className="knee-angle-joint" />
    </svg>
  )
}
