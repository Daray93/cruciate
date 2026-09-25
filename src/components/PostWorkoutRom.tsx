import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { RomPoint } from '../hooks/useRomHistory'
import type { PhaseId, Track } from '../lib/phases'
import type { RomEntry } from '../types'
import { CelebrationOverlay } from './CelebrationOverlay'
import { IconX } from './icons'
import type { CheckinAnswer } from './MilestoneCheckIn'
import { MilestoneCheckIn } from './MilestoneCheckIn'
import { MilestoneRomStep } from './MilestoneRomStep'
import './PostWorkoutRom.css'

interface PostWorkoutRomProps {
  reading: RomEntry
  onChange: (patch: Partial<RomEntry>) => void
  history: RomPoint[]
  onViewProgress: () => void
  track: Track
  phase: PhaseId
  checkinDue: boolean
  onSubmitCheckin: (answers: CheckinAnswer[]) => Promise<{ passed: boolean }>
  /** Called once, when this round's ROM logging finishes (reaching the summary). */
  onRoundComplete: () => void
}

type Step = 'extension' | 'flexion' | 'summary'

const ROM_REACTIONS = [
  'Logged!',
  'Nice tracking!',
  'Great check-in!',
  'Got it!',
  'Nailed it!',
  'Solid!',
  'Way to track it!',
  'Good awareness!',
  'Progress noted!',
  'Right on!',
  'Recorded!',
  'Well tracked!',
  'Good stuff!',
  'Noted!',
  'Great job!',
  'Awesome!',
  "That's logged!",
  'Sweet!',
  'Consistency wins!',
  'Look at that!',
]

const EXTENSION_QUESTION = {
  id: 'session-extension',
  prompt: 'How much can you straighten your knee right now?',
  help: 'Lie on your back with the leg flat, foot relaxed and pointing up. Press the back of your knee down into the bed as far as it will go right now.',
  rom: { direction: 'extension' as const, max: 30, passThreshold: 5 },
}

const FLEXION_QUESTION = {
  id: 'session-flexion',
  prompt: 'How far can you bend your knee right now?',
  help: 'Sit with your leg out straight, then slide your heel back toward your bum as far as feels comfortable right now.',
  rom: { direction: 'flexion' as const, max: 150, passThreshold: 90 },
}

function toNumber(value: string, fallback: number) {
  return value !== '' ? Number(value) : fallback
}

// Positive = better than last time.
function improvement(direction: 'extension' | 'flexion', today: number, previous: number) {
  return direction === 'extension' ? previous - today : today - previous
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function PostWorkoutRom({
  reading,
  onChange,
  history,
  onViewProgress,
  track,
  phase,
  checkinDue,
  onSubmitCheckin,
  onRoundComplete,
}: PostWorkoutRomProps) {
  const [step, setStep] = useState<Step>('extension')
  const [celebrating, setCelebrating] = useState(false)
  const [extensionValue, setExtensionValue] = useState(() => toNumber(reading.extension, 15))
  const [flexionValue, setFlexionValue] = useState(() => toNumber(reading.flexion, 75))
  const [checkinOpen, setCheckinOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const previous = history.length > 0 ? history[history.length - 1] : null

  function handleCelebrationDone() {
    setCelebrating(false)
    if (step === 'extension') {
      setStep('flexion')
    } else {
      setStep('summary')
      onRoundComplete()
    }
  }

  function submitExtension() {
    onChange({ extension: String(extensionValue) })
    setCelebrating(true)
  }

  function submitFlexion() {
    onChange({ flexion: String(flexionValue) })
    setCelebrating(true)
  }

  if (step === 'summary') {
    const extImprovement =
      previous?.extension != null ? improvement('extension', extensionValue, previous.extension) : null
    const flexImprovement =
      previous?.flexion != null ? improvement('flexion', flexionValue, previous.flexion) : null

    const lines: string[] = []
    if (extImprovement !== null && extImprovement > 0) {
      lines.push(`your extension is ${extImprovement}° closer to straight`)
    }
    if (flexImprovement !== null && flexImprovement > 0) {
      lines.push(`you're bending ${flexImprovement}° further`)
    }

    return (
      <div className="post-workout-rom-summary">
        <p className="post-workout-rom-summary-title">Range of motion logged</p>
        <p className="post-workout-rom-summary-body">
          {lines.length > 0
            ? `${capitalize(lines.join(' and '))} than last time.`
            : "Every reading builds the picture of how you're trending over time."}
        </p>
        <button type="button" className="post-workout-rom-progress-link" onClick={onViewProgress}>
          Want to see your progress?
        </button>

        <AnimatePresence mode="wait">
          {checkinDue && !checkinOpen && (
            <motion.button
              key="checkin-prompt"
              type="button"
              className="rom-checkin-prompt-card"
              onClick={() => setCheckinOpen(true)}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.97) translateY(-6px)' }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1) translateY(0px)' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.97) translateY(-6px)' }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            >
              <span className="rom-checkin-prompt-title">
                {track === 'rehab' ? "You're time-eligible for your next phase" : 'Ready to check your progress?'}
              </span>
              <span className="rom-checkin-prompt-body">Answer a quick check-in to see if you're ready to advance.</span>
            </motion.button>
          )}

          {checkinDue && checkinOpen && (
            <motion.section
              key="checkin-panel"
              className="rom-checkin-panel"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.97) translateY(-6px)' }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1) translateY(0px)' }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.97) translateY(-6px)' }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            >
              <button
                type="button"
                className="rom-checkin-panel-close"
                aria-label="Close check-in"
                onClick={() => setCheckinOpen(false)}
              >
                <IconX />
              </button>
              <MilestoneCheckIn
                phase={phase}
                title="Milestone check-in"
                onSubmit={onSubmitCheckin}
                onContinue={() => setCheckinOpen(false)}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="post-workout-rom">
      {step === 'extension' ? (
        <MilestoneRomStep question={EXTENSION_QUESTION} value={extensionValue} onChange={setExtensionValue} />
      ) : (
        <MilestoneRomStep question={FLEXION_QUESTION} value={flexionValue} onChange={setFlexionValue} />
      )}

      <button
        type="button"
        className="post-workout-rom-submit"
        disabled={celebrating}
        onClick={step === 'extension' ? submitExtension : submitFlexion}
      >
        Submit
      </button>

      <CelebrationOverlay show={celebrating} reactions={ROM_REACTIONS} onDone={handleCelebrationDone} />
    </div>
  )
}
