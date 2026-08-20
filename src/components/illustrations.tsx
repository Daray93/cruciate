/**
 * Exercise illustration rig, documented so the same proportions can be
 * rebuilt in Figma as a poseable template.
 *
 * viewBox: 0 0 160 200
 * Neutral (reference) joint coordinates:
 *   head        center (80, 26)  radius 14
 *   neck               (80, 42)
 *   shoulder L         (62, 50)   shoulder R (98, 50)
 *   elbow L            (52, 82)   elbow R    (108, 82)
 *   wrist L            (46, 112)  wrist R    (114, 112)
 *   hip center         (80, 108)
 *   hip L              (68, 108)  hip R      (92, 108)
 *   knee L             (66, 150)  knee R     (94, 150)
 *   ankle L            (64, 190)  ankle R    (96, 190)
 *
 * Each limb is two line segments pivoting on its joint (shoulder->elbow->
 * wrist, hip->knee->ankle) so reposing in Figma is a matter of rotating
 * two bones per limb around those pivots. Stroke stays 4 (roughly 2x the
 * 2px UI icon weight, since these render much larger), round caps/joins,
 * currentColor so it inherits --ink and is automatically theme-aware.
 * Reserve the teal accent for motion arrows only, never the figure itself.
 */

interface IllustrationProps {
  className?: string
}

const FIGURE_PROPS = {
  viewBox: '0 0 160 200',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function MotionArrow({ d }: { d: string }) {
  return (
    <g className="illustration-motion-arrow" stroke="var(--teal)" strokeWidth={3}>
      <path d={d} fill="none" />
    </g>
  )
}

/** Neutral standing reference pose, the unposed rig itself. */
export function IllustrationFigureBase({ className }: IllustrationProps) {
  return (
    <svg {...FIGURE_PROPS} className={className}>
      <circle cx="80" cy="26" r="14" />
      <path d="M80 42 L80 108" />
      <path d="M62 50 L80 44 L98 50" />
      <path d="M62 50 L52 82 L46 112" />
      <path d="M98 50 L108 82 L114 112" />
      <path d="M68 108 L66 150 L64 190" />
      <path d="M92 108 L94 150 L96 190" />
    </svg>
  )
}

/** Quad sets: seated, one leg extended straight, pressing the knee down. */
export function IllustrationQuadSet({ className }: IllustrationProps) {
  return (
    <svg {...FIGURE_PROPS} className={className}>
      <path d="M20 176 L140 176" strokeWidth={3} opacity={0.4} />
      <circle cx="70" cy="40" r="14" />
      <path d="M70 56 L78 108" />
      <path d="M70 60 L56 86 L60 110" />
      <path d="M70 60 L88 82 L96 100" />
      <path d="M78 108 L130 116" />
      <path d="M78 108 L70 150 L58 176" />
      <MotionArrow d="M118 100 C 124 108, 124 118, 116 124" />
    </svg>
  )
}

/** Mini squat: standing, knees bent, arms forward for balance. */
export function IllustrationMiniSquat({ className }: IllustrationProps) {
  return (
    <svg {...FIGURE_PROPS} className={className}>
      <path d="M20 190 L140 190" strokeWidth={3} opacity={0.4} />
      <circle cx="82" cy="38" r="14" />
      <path d="M80 54 L76 100" />
      <path d="M64 60 L80 52 L96 60" />
      <path d="M64 60 L44 68 L28 66" />
      <path d="M96 60 L116 68 L132 66" />
      <path d="M68 100 L58 134 L64 162" />
      <path d="M84 100 L94 134 L88 162" />
      <MotionArrow d="M100 96 C 108 108, 106 122, 96 130" />
    </svg>
  )
}
