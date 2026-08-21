export type Track = 'prehab' | 'rehab'

export type PhaseId =
  | 'prehab_rom'
  | 'prehab_activation'
  | 'prehab_strength'
  | 'prehab_ready'
  | 'rehab_protection'
  | 'rehab_activation'
  | 'rehab_strength'

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
    graduationCriterion: 'Full extension, controlled swelling, and a straight leg raise with no lag.',
  },
  prehab_activation: {
    id: 'prehab_activation',
    track: 'prehab',
    order: 1,
    shortLabel: 'Phase 2',
    title: 'Quad activation',
    graduationCriterion: 'Solid quad sets, pain-free straight leg raises, and low resting pain.',
  },
  prehab_strength: {
    id: 'prehab_strength',
    track: 'prehab',
    order: 2,
    shortLabel: 'Phase 3',
    title: 'Quad strength',
    graduationCriterion: 'Controlled mini squats and a walk with no limp.',
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
    title: 'Protection / ROM',
    graduationCriterion: 'Full extension, controlled swelling, and a straight leg raise with no lag.',
  },
  rehab_activation: {
    id: 'rehab_activation',
    track: 'rehab',
    order: 1,
    shortLabel: 'Phase 2',
    title: 'Quad activation',
    graduationCriterion: 'Knee flexion past 90°, full quad activation, and swelling that settles after activity.',
  },
  rehab_strength: {
    id: 'rehab_strength',
    track: 'rehab',
    order: 2,
    shortLabel: 'Phase 3',
    title: 'Quad strength',
    graduationCriterion: 'Ongoing strength work. Keep building toward return-to-activity clearance.',
  },
}

export const PREHAB_ORDER: PhaseId[] = ['prehab_rom', 'prehab_activation', 'prehab_strength', 'prehab_ready']
export const REHAB_ORDER: PhaseId[] = ['rehab_protection', 'rehab_activation', 'rehab_strength']

// Week (post-op) each rehab phase becomes time-eligible, per the ~0-2 / 2-6 / 6+ week bands.
const REHAB_PHASE_START_WEEK: Record<PhaseId, number> = {
  prehab_rom: 0,
  prehab_activation: 0,
  prehab_strength: 0,
  prehab_ready: 0,
  rehab_protection: 0,
  rehab_activation: 2,
  rehab_strength: 6,
}

export function phaseOrder(track: Track): PhaseId[] {
  return track === 'prehab' ? PREHAB_ORDER : REHAB_ORDER
}

export function nextPhase(phase: PhaseId): PhaseId | null {
  const order = phaseOrder(PHASES[phase].track)
  const index = order.indexOf(phase)
  return index >= 0 && index < order.length - 1 ? order[index + 1] : null
}

export function weeksPostOp(surgeryDate: string, today: Date = new Date()): number {
  const surgery = new Date(surgeryDate)
  const days = Math.floor((today.getTime() - surgery.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, Math.floor(days / 7))
}

function rehabPhaseFromWeeks(weeks: number): PhaseId {
  if (weeks < 2) return 'rehab_protection'
  if (weeks < 6) return 'rehab_activation'
  return 'rehab_strength'
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
}

const FULL_EXTENSION_Q: MilestoneQuestion = {
  id: 'full-extension',
  prompt: 'Can you fully straighten your knee?',
  help: 'Lying flat, press the back of your knee down into the surface until your leg is completely straight. No bend left. Compare to your other leg if you\'re not sure what "fully straight" feels like.',
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

// Questions gate graduating OUT of the given phase into the next one. Terminal
// phases (prehab_ready, rehab_strength) have no next phase, so no questions.
export const PHASE_QUESTIONS: Record<PhaseId, MilestoneQuestion[]> = {
  prehab_rom: [FULL_EXTENSION_Q, SWELLING_CONTROLLED_Q, SLR_NO_LAG_Q],
  prehab_activation: [
    {
      id: 'quad-set-hold',
      prompt: 'Can you hold a quad set (tightening your thigh) for 10 seconds without pain?',
      help: 'A quad set is tightening your thigh muscle by pressing the back of your knee down, without bending the knee. You should see the kneecap pull slightly upward. Hold that contraction for a full 10 seconds pain-free.',
    },
    {
      id: 'slr-three-sets',
      prompt: 'Can you complete 3 sets of straight leg raises with no lag?',
      help: 'Same movement as before (leg lifted straight, knee locked). This time you\'re checking whether the knee still stays locked across a full set of repeats, not just on the first rep before fatigue sets in.',
    },
    {
      id: 'low-rest-pain',
      prompt: 'Is your knee pain at rest 2/10 or lower?',
      help: '0 = no pain at all, 10 = the worst pain imaginable. "At rest" means sitting still, not mid-exercise. A 2 or below is mild, background discomfort rather than pain that distracts you.',
    },
  ],
  prehab_strength: [
    {
      id: 'mini-squat-control',
      prompt: 'Can you do a mini squat with good control and no pain?',
      help: 'A small, partial squat. Bend the knees roughly 30-45°, like starting to sit into a chair. "Good control" means your weight stays even between both legs, without wobbling or shifting away from the operative side.',
    },
    {
      id: 'walk-no-limp',
      prompt: 'Can you walk without a limp?',
      help: "A limp shows up as uneven steps. You spend less time on the operative leg, or keep the knee stiff and swing it instead of bending it normally as you step.",
    },
  ],
  prehab_ready: [],
  rehab_protection: [FULL_EXTENSION_Q, SWELLING_CONTROLLED_Q, SLR_NO_LAG_Q],
  rehab_activation: [
    {
      id: 'flexion-90',
      prompt: 'Can you bend your knee past 90 degrees?',
      help: "90° is a right angle, like your knee position when sitting in a normal chair. Try a seated heel slide. If your heel comes back further than that, you're past 90°.",
    },
    {
      id: 'quad-activation',
      prompt: 'Can you do a quad set with full activation and no lag on a straight leg raise?',
      help: "Two checks in one: a strong, full quad tightening (see the kneecap pull up clearly), then lifting the straight leg with the knee staying fully locked the entire time. No bending as it rises.",
    },
    {
      id: 'swelling-settles',
      prompt: 'Does swelling settle down after activity?',
      help: "After exercising or being active, check whether the knee's puffiness goes back down within a reasonable time, by the next morning, say. It shouldn't stay swollen or get worse the longer you're active.",
    },
  ],
  rehab_strength: [],
}
