import { useState } from 'react'
import type { RomPoint } from '../hooks/useRomHistory'
import type { RomEntry } from '../types'
import { CelebrationOverlay } from './CelebrationOverlay'
import { MilestoneRomStep } from './MilestoneRomStep'
import './PostWorkoutRom.css'

interface PostWorkoutRomProps {
  reading: RomEntry
  onChange: (patch: Partial<RomEntry>) => void
  history: RomPoint[]
  onViewProgress: () => void
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

export function PostWorkoutRom({ reading, onChange, history, onViewProgress }: PostWorkoutRomProps) {
  const [step, setStep] = useState<Step>('extension')
  const [celebrating, setCelebrating] = useState(false)
  const [extensionValue, setExtensionValue] = useState(() => toNumber(reading.extension, 15))
  const [flexionValue, setFlexionValue] = useState(() => toNumber(reading.flexion, 75))

  const previous = history.length > 0 ? history[history.length - 1] : null

  function handleCelebrationDone() {
    setCelebrating(false)
    setStep((s) => (s === 'extension' ? 'flexion' : 'summary'))
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
            ? `You're doing better than you were before — ${lines.join(' and ')} than last time.`
            : "Logged. Every reading builds the picture of how you're trending over time."}
        </p>
        <button type="button" className="post-workout-rom-progress-link" onClick={onViewProgress}>
          Want to see your progress?
        </button>
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
