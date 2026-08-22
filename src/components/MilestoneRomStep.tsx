import type { MilestoneQuestion } from '../lib/phases'
import { KneeAngleVisualSeated } from './KneeAngleVisualSeated'
import { KneeAngleVisualSupine } from './KneeAngleVisualSupine'
import './MilestoneRomStep.css'

interface MilestoneRomStepProps {
  question: MilestoneQuestion & { rom: NonNullable<MilestoneQuestion['rom']> }
  value: number
  onChange: (value: number) => void
}

// Extension is framed so dragging the slider up straightens the leg (left =
// worst/furthest from straight, right = best/fully straight) — sliding
// "toward the goal" reads the same way flexion already does. Flexion is
// finer-grained too: extension deficits are clinically tracked in small
// increments, so its slider steps by 0.5deg instead of a whole degree.
const SLIDER_CONFIG: Record<
  'extension' | 'flexion',
  {
    step: number
    left: (max: number) => string
    right: (max: number) => string
    goal: string
  }
> = {
  extension: {
    step: 0.5,
    left: (max) => `${max}°+ · can't straighten`,
    right: () => '0° · fully straight',
    goal: 'fully straighten',
  },
  flexion: {
    step: 1,
    left: () => '0° · straight leg',
    right: (max) => `${max}°+ · heel to your bum`,
    goal: 'reach a full bend on',
  },
}

export function MilestoneRomStep({ question, value, onChange }: MilestoneRomStepProps) {
  const { direction, max } = question.rom
  const config = SLIDER_CONFIG[direction]

  // Extension's slider is visually reversed from the stored angle: raw slider
  // position 0 (left) is the worst case (max degrees from straight), and max
  // (right) is 0 degrees (fully straight). Flexion's slider matches the
  // stored angle directly.
  const sliderValue = direction === 'extension' ? max - value : value

  function handleSliderChange(raw: number) {
    onChange(direction === 'extension' ? max - raw : raw)
  }

  return (
    <div className="milestone-rom-step">
      <p className="milestone-question-prompt">{question.prompt}</p>
      <p className="milestone-question-help">{question.help}</p>

      <div className="milestone-rom-visual">
        {direction === 'extension' ? (
          <KneeAngleVisualSupine angle={value} maxAngle={max} />
        ) : (
          <KneeAngleVisualSeated angle={value} maxAngle={max} />
        )}
      </div>

      <div className="milestone-rom-control">
        <span className="milestone-rom-value">
          {value}° {direction === 'extension' ? 'from straight' : 'bend'}
        </span>
        <input
          type="range"
          min={0}
          max={max}
          step={config.step}
          value={sliderValue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="milestone-rom-slider"
          aria-label={question.prompt}
        />
        <div className="milestone-rom-scale">
          <span>{config.left(max)}</span>
          <span>{config.right(max)}</span>
        </div>
      </div>

      <p className="milestone-rom-estimate-hint">
        This is just an estimate — we'll keep logging it each check-in until you can {config.goal} your knee.
      </p>
    </div>
  )
}
