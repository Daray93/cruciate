import { motion, useReducedMotion } from 'motion/react'

interface MorphChevronProps {
  open: boolean
  className?: string
}

// Chevron-up is chevron-down's points mirrored vertically about the icon's
// center (y' = 24 - y), so animating between the two `d` strings folds the
// middle point through the line instead of spinning the whole glyph.
const DOWN = 'M5 9l7 7 7-7'
const UP = 'M5 15l7-7 7 7'

/** A chevron that folds from pointing down to pointing up, rather than rotating. */
export function MorphChevron({ open, className }: MorphChevronProps) {
  const reduceMotion = useReducedMotion()

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <motion.path
        animate={{ d: open ? UP : DOWN }}
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.77, 0, 0.175, 1] }}
      />
    </svg>
  )
}
