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
 * Every bone is its own <path> (upper arm, forearm, thigh, shin all
 * separate) so an SVG import into Figma gives one independently
 * rotatable vector layer per bone instead of a single compound limb.
 * To repose: select a bone, enter vector edit mode (Enter), drag the
 * loose endpoint to its new position, leave the joint-side endpoint
 * anchored where it meets the next bone. Stroke stays 4 (roughly 2x
 * the 2px UI icon weight, since these render much larger), round
 * caps/joins, currentColor so it inherits --ink and is automatically
 * theme-aware. Reserve the teal accent for motion arrows only, never
 * the figure itself.
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
      <circle cx="80" cy="26" r="14" className="bone-head" />
      <path d="M80 42 L80 108" className="bone-spine" />
      <path d="M62 50 L80 44" className="bone-shoulder-l" />
      <path d="M98 50 L80 44" className="bone-shoulder-r" />
      <path d="M62 50 L52 82" className="bone-upper-arm-l" />
      <path d="M52 82 L46 112" className="bone-forearm-l" />
      <path d="M98 50 L108 82" className="bone-upper-arm-r" />
      <path d="M108 82 L114 112" className="bone-forearm-r" />
      <path d="M68 108 L66 150" className="bone-thigh-l" />
      <path d="M66 150 L64 190" className="bone-shin-l" />
      <path d="M92 108 L94 150" className="bone-thigh-r" />
      <path d="M94 150 L96 190" className="bone-shin-r" />
    </svg>
  )
}

/** Quad sets: seated, one leg extended straight, pressing the knee down. */
export function IllustrationQuadSet({ className }: IllustrationProps) {
  return (
    <svg {...FIGURE_PROPS} className={className}>
      <path d="M20 176 L140 176" strokeWidth={3} opacity={0.4} className="ground-line" />
      <circle cx="70" cy="40" r="14" className="bone-head" />
      <path d="M70 56 L78 108" className="bone-spine" />
      <path d="M70 60 L56 86" className="bone-upper-arm-l" />
      <path d="M56 86 L60 110" className="bone-forearm-l" />
      <path d="M70 60 L88 82" className="bone-upper-arm-r" />
      <path d="M88 82 L96 100" className="bone-forearm-r" />
      <path d="M78 108 L130 116" className="bone-thigh-extended" />
      <path d="M78 108 L70 150" className="bone-thigh-bent" />
      <path d="M70 150 L58 176" className="bone-shin-bent" />
      <MotionArrow d="M118 100 C 124 108, 124 118, 116 124" />
    </svg>
  )
}

/** Mini squat: standing, knees bent, arms forward for balance. */
export function IllustrationMiniSquat({ className }: IllustrationProps) {
  return (
    <svg {...FIGURE_PROPS} className={className}>
      <path d="M20 190 L140 190" strokeWidth={3} opacity={0.4} className="ground-line" />
      <circle cx="82" cy="38" r="14" className="bone-head" />
      <path d="M80 54 L76 100" className="bone-spine" />
      <path d="M64 60 L80 52" className="bone-shoulder-l" />
      <path d="M96 60 L80 52" className="bone-shoulder-r" />
      <path d="M64 60 L44 68" className="bone-upper-arm-l" />
      <path d="M44 68 L28 66" className="bone-forearm-l" />
      <path d="M96 60 L116 68" className="bone-upper-arm-r" />
      <path d="M116 68 L132 66" className="bone-forearm-r" />
      <path d="M68 100 L58 134" className="bone-thigh-l" />
      <path d="M58 134 L64 162" className="bone-shin-l" />
      <path d="M84 100 L94 134" className="bone-thigh-r" />
      <path d="M94 134 L88 162" className="bone-shin-r" />
      <MotionArrow d="M100 96 C 108 108, 106 122, 96 130" />
    </svg>
  )
}
