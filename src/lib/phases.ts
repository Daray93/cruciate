export type Track = 'prehab' | 'rehab'

export type PhaseId =
  | 'prehab_rom'
  | 'prehab_activation'
  | 'prehab_strength'
  | 'prehab_ready'
  | 'rehab_protection'
  | 'rehab_activation'
  | 'rehab_strength'
  | 'rehab_advanced'
  | 'rehab_return_to_sport'

export interface PhaseDef {
  id: PhaseId
  track: Track
  order: number
  shortLabel: string
  title: string
  graduationCriterion: string
}

export const PHASES: Record<PhaseId, PhaseDef> = {
  prehab_rom: {
    id: 'prehab_rom',
    track: 'prehab',
    order: 0,
    shortLabel: 'Phase 1',
    title: 'ROM restoration',
    graduationCriterion: 'Full knee extension, flexion past 120°, and minimal swelling.',
  },
  prehab_activation: {
    id: 'prehab_activation',
    track: 'prehab',
    order: 1,
    shortLabel: 'Phase 2',
    title: 'Quad activation',
    graduationCriterion: 'A straight leg raise with no lag, a 10-second quad set, and swelling that stays controlled during exercise.',
  },
  prehab_strength: {
    id: 'prehab_strength',
    track: 'prehab',
    order: 2,
    shortLabel: 'Phase 3',
    title: 'Quad strength',
    graduationCriterion: 'A controlled single-leg quarter squat, 30-second single-leg balance, and pain-free exercises.',
  },
  prehab_ready: {
    id: 'prehab_ready',
    track: 'prehab',
    order: 3,
    shortLabel: 'Final checkpoint',
    title: 'Surgery-ready',
    graduationCriterion: "You've met every prehab milestone. You're ready for surgery.",
  },
  rehab_protection: {
    id: 'rehab_protection',
    track: 'rehab',
    order: 0,
    shortLabel: 'Phase 1',
    title: 'Protection & early ROM',
    graduationCriterion: 'Full passive extension, flexion past 90°, and controlled swelling.',
  },
  rehab_activation: {
    id: 'rehab_activation',
    track: 'rehab',
    order: 1,
    shortLabel: 'Phase 2',
    title: 'Early activation',
    graduationCriterion: 'A straight leg raise with no lag, flexion past 120°, and walking without a significant limp.',
  },
  rehab_strength: {
    id: 'rehab_strength',
    track: 'rehab',
    order: 2,
    shortLabel: 'Phase 3',
    title: 'Strength building',
    graduationCriterion: 'Flexion past 130°, a controlled single-leg quarter squat, and 30-second single-leg balance.',
  },
  rehab_advanced: {
    id: 'rehab_advanced',
    track: 'rehab',
    order: 3,
    shortLabel: 'Phase 4',
    title: 'Advanced strength & power',
    graduationCriterion: '20 pain-free bodyweight squats, a single-leg squat to ~60° with good form, a normal heel-to-toe walking gait with no limp, and balance on an unstable surface with eyes closed.',
  },
  rehab_return_to_sport: {
    id: 'rehab_return_to_sport',
    track: 'rehab',
    order: 4,
    shortLabel: 'Phase 5',
    title: 'Return to sport prep',
    graduationCriterion:
      'Sport-specific conditioning and confidence building — this app tracks readiness signs, it does not clear you to play. That call is your surgeon or PT\'s.',
  },
}

export const PREHAB_ORDER: PhaseId[] = ['prehab_rom', 'prehab_activation', 'prehab_strength', 'prehab_ready']
export const REHAB_ORDER: PhaseId[] = [
  'rehab_protection',
  'rehab_activation',
  'rehab_strength',
  'rehab_advanced',
  'rehab_return_to_sport',
]

// Week (post-op) each rehab phase becomes time-eligible, per the 0-2 / 2-6 / 6-12 / 12-20 / 20+ week bands.
const REHAB_PHASE_START_WEEK: Record<PhaseId, number> = {
  prehab_rom: 0,
  prehab_activation: 0,
  prehab_strength: 0,
  prehab_ready: 0,
  rehab_protection: 0,
  rehab_activation: 2,
  rehab_strength: 6,
  rehab_advanced: 12,
  rehab_return_to_sport: 20,
}

export function phaseOrder(track: Track): PhaseId[] {
  return track === 'prehab' ? PREHAB_ORDER : REHAB_ORDER
}

export function nextPhase(phase: PhaseId): PhaseId | null {
  const order = phaseOrder(PHASES[phase].track)
  const index = order.indexOf(phase)
  return index >= 0 && index < order.length - 1 ? order[index + 1] : null
}

/** Plain-language description of a phase, for check-in result copy. */
export function programmeLevelPhrase(phase: PhaseId): string {
  if (phase === 'prehab_ready') return "you're ready for surgery"
  const { shortLabel, title } = PHASES[phase]
  return `we're starting you at ${shortLabel}: ${title}`
}

export function weeksPostOp(surgeryDate: string, today: Date = new Date()): number {
  const surgery = new Date(surgeryDate)
  const days = Math.floor((today.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, Math.floor(days / 7))
}

function rehabPhaseFromWeeks(weeks: number): PhaseId {
  if (weeks < 2) return 'rehab_protection'
  if (weeks < 6) return 'rehab_activation'
  if (weeks < 12) return 'rehab_strength'
  if (weeks < 20) return 'rehab_advanced'
  return 'rehab_return_to_sport'
}

export function computeStartingPhase(track: Track, surgeryDate: string | null): PhaseId {
  if (track === 'prehab') return 'prehab_rom'
  return rehabPhaseFromWeeks(surgeryDate ? weeksPostOp(surgeryDate) : 0)
}

/** True once the user is time-eligible to graduate past their current phase (rehab only — prehab has no week gating). */
export function isTimeEligibleForNextPhase(track: Track, currentPhase: PhaseId, surgeryDate: string | null): boolean {
  if (track !== 'rehab' || !surgeryDate) return false
  const next = nextPhase(currentPhase)
  if (!next) return false
  return weeksPostOp(surgeryDate) >= REHAB_PHASE_START_WEEK[next]
}

export interface MilestoneQuestion {
  id: string
  prompt: string
  help: string
  /** Present when this question is answered by logging a ROM angle rather than yes/no. */
  rom?: {
    direction: 'extension' | 'flexion'
    /** Slider ceiling in degrees. */
    max: number
    /** Extension passes at or under this angle; flexion passes at or over it. */
    passThreshold: number
  }
}

const FULL_EXTENSION_Q: MilestoneQuestion = {
  id: 'full-extension',
  prompt: 'Can you fully straighten your knee?',
  help: 'Lie on your back with the leg flat on the bed, foot relaxed and pointing up. Press the back of your knee down into the bed until your leg is completely straight, no bend left. Compare to your other leg if you\'re not sure what "fully straight" feels like.',
  rom: { direction: 'extension', max: 30, passThreshold: 5 },
}

const SWELLING_CONTROLLED_Q: MilestoneQuestion = {
  id: 'swelling-controlled',
  prompt: 'Is swelling manageable/controlled?',
  help: "\"Controlled\" means swelling isn't getting worse day to day, and it settles down with rest, ice, or elevation. It doesn't mean it's completely gone. If it's increasing, hot, or the knee feels tight and throbbing, that counts as not controlled.",
}

const SLR_NO_LAG_Q: MilestoneQuestion = {
  id: 'slr-no-lag',
  prompt: 'Can you do a straight leg raise without lag?',
  help: 'Lift your straight leg a few inches off the bed while keeping the knee fully locked straight the whole time. "Lag" is when the knee bends slightly instead of staying locked as you lift. If you see or feel that buckle, that\'s a lag.',
}

const QUAD_SET_HOLD_Q: MilestoneQuestion = {
  id: 'quad-set-hold',
  prompt: 'Can you hold a quad set (tightening your thigh) for 10 seconds with a visible contraction?',
  help: 'A quad set is tightening your thigh muscle by pressing the back of your knee down, without bending the knee. "Visible" means you or someone else can actually see the muscle near the inside of your knee pull tight, not just feel it. Hold for a full 10 seconds.',
}

const FLEXION_90_Q: MilestoneQuestion = {
  id: 'flexion-90',
  prompt: 'Can you bend your knee past 90 degrees?',
  help: "90° is a right angle, like your knee position when sitting in a normal chair. Try a seated heel slide. If your heel comes back further than that, you're past 90°.",
  rom: { direction: 'flexion', max: 150, passThreshold: 90 },
}

const FLEXION_120_Q: MilestoneQuestion = {
  id: 'flexion-120',
  prompt: 'Can you bend your knee to at least 120 degrees?',
  help: "Bend your knee as far as you can, using a heel slide or seated stretch. 120° is a bit more than a right angle — close to how far you'd bend sitting on a low stool.",
  rom: { direction: 'flexion', max: 150, passThreshold: 120 },
}

const WALK_NO_LIMP_Q: MilestoneQuestion = {
  id: 'walk-no-limp',
  prompt: 'Can you walk without a limp?',
  help: 'A limp shows up as uneven steps. You spend less time on the operative leg, or keep the knee stiff and swing it instead of bending it normally as you step.',
}

const SINGLE_LEG_SQUAT_CONTROL_Q: MilestoneQuestion = {
  id: 'single-leg-squat-control',
  prompt: 'Can you do a single-leg quarter squat with good control, no knee caving inward?',
  help: 'Stand on the injured leg only and bend the knee into a small squat. "Good control" means the knee doesn\'t cave inward toward your other leg as you bend, and you\'re not wobbling to stay balanced.',
}

const SINGLE_LEG_BALANCE_30_Q: MilestoneQuestion = {
  id: 'single-leg-balance-30',
  prompt: 'Can you hold single-leg balance for 30 seconds without wobbling significantly?',
  help: 'Stand on the injured leg only, arms out for balance if needed. Time how long you can hold it steady, aiming for 30 seconds without significant wobbling.',
}

const PAIN_FREE_EXERCISES_Q: MilestoneQuestion = {
  id: 'pain-free-exercises',
  prompt: 'Are all your exercises pain-free right now?',
  help: 'Think back over your recent sessions. Are quad sets, straight leg raises, and squats all comfortable, without pain during or after?',
}

// Questions gate graduating OUT of the given phase into the next one. Terminal
// phases (prehab_ready, rehab_return_to_sport) have no next phase, so no questions.
export const PHASE_QUESTIONS: Record<PhaseId, MilestoneQuestion[]> = {
  prehab_rom: [FULL_EXTENSION_Q, FLEXION_120_Q, SWELLING_CONTROLLED_Q],
  prehab_activation: [
    SLR_NO_LAG_Q,
    QUAD_SET_HOLD_Q,
    {
      id: 'swelling-during-exercise',
      prompt: 'Does your swelling stay controlled during and after these exercises?',
      help: 'Check whether your knee swelling stays about the same, or only gets a little worse, during and right after these exercises, rather than flaring up noticeably.',
    },
  ],
  prehab_strength: [SINGLE_LEG_SQUAT_CONTROL_Q, SINGLE_LEG_BALANCE_30_Q, PAIN_FREE_EXERCISES_Q],
  prehab_ready: [],
  rehab_protection: [FULL_EXTENSION_Q, FLEXION_90_Q, SWELLING_CONTROLLED_Q],
  rehab_activation: [SLR_NO_LAG_Q, FLEXION_120_Q, WALK_NO_LIMP_Q],
  rehab_strength: [
    {
      id: 'flexion-130',
      prompt: 'Can you bend your knee to at least 130 degrees?',
      help: 'Bend your knee as far as comfortable. 130° is a deep bend — most of the way toward sitting back on your heels.',
      rom: { direction: 'flexion', max: 150, passThreshold: 130 },
    },
    SINGLE_LEG_SQUAT_CONTROL_Q,
    SINGLE_LEG_BALANCE_30_Q,
  ],
  rehab_advanced: [
    {
      id: 'squats-20-pain-free',
      prompt: 'Can you do 20 consecutive bodyweight squats without pain or swelling?',
      help: 'Do 20 regular bodyweight squats in a row, bending to about a right angle each time. Check whether you can complete all 20 without pain, and without swelling afterward.',
    },
    {
      id: 'single-leg-squat-60',
      prompt: 'Can you do a single-leg squat to about 60 degrees with good form, no knee caving inward?',
      help: 'Stand on the injured leg and squat down to about 60 degrees — a deeper bend than the earlier single-leg squat check. Good form means the knee tracks over your toes, not caving in.',
    },
    {
      id: 'normal-gait-heel-to-toe',
      prompt: 'Do you walk with a normal heel-to-toe gait and no limp?',
      help: "Watch yourself walk (or have someone else watch). Each step should land on the heel and roll through to push off the toes, both sides even, with no favoring, shortened stride, or limp on the operative leg. This is a higher bar than the early no-limp check — a normal, natural walking pattern.",
    },
    {
      id: 'balance-unstable-eyes-closed',
      prompt: 'Can you hold single-leg balance for 30 seconds on an unstable surface with your eyes closed?',
      help: 'Stand on the injured leg on a soft or uneven surface (a pillow or folded towel works), close your eyes, and hold as steady as you can for 30 seconds.',
    },
  ],
  rehab_return_to_sport: [],
}
