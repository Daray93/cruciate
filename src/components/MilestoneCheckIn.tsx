import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { nextPhase, PHASE_QUESTIONS, programmeLevelPhrase } from '../lib/phases'
import type { MilestoneQuestion, PhaseId } from '../lib/phases'
import { CelebrationOverlay } from './CelebrationOverlay'
import { IconCheck } from './icons'
import { MilestoneRomStep } from './MilestoneRomStep'
import './MilestoneCheckIn.css'

export interface CheckinAnswer {
  questionId: string
  response: string
  passed: boolean
}

interface MilestoneCheckInProps {
  phase: PhaseId
  title?: string
  onSubmit: (answers: CheckinAnswer[]) => Promise<{ passed: boolean }>
  /** Called after either a pass or a fail, once the user is ready to move on. */
  onContinue?: () => void
}

type Result = 'passed' | 'failed' | null

const LOGGED_REACTIONS = [
  'Nice one!',
  'Great job!',
  'Logged!',
  'Nailed it!',
  'Solid work!',
  'You got it!',
  'Boom, logged!',
  'Way to go!',
  'Awesome!',
  'Keep it up!',
  "That's the one!",
  'Locked in!',
  'Fantastic!',
  'Well done!',
  'Nice progress!',
  'Look at you go!',
  'Sweet!',
  'Good stuff!',
  'Right on!',
  'Great effort!',
]

const stepVariants: Variants = {
  enter: (dir: 1 | -1) => ({ opacity: 0, transform: `translateX(${dir * 24}px)` }),
  center: { opacity: 1, transform: 'translateX(0px)' },
  exit: (dir: 1 | -1) => ({ opacity: 0, transform: `translateX(${dir * -24}px)` }),
}
const stepVariantsReduced: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

export function MilestoneCheckIn({ phase, title, onSubmit, onContinue }: MilestoneCheckInProps) {
  const questions = PHASE_QUESTIONS[phase]
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [yesNo, setYesNo] = useState<Record<string, boolean>>({})
  const [romValue, setRomValue] = useState<Record<string, number>>({})
  const [romTouched, setRomTouched] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Result>(null)
  const [celebrating, setCelebrating] = useState(false)
  const reduceMotion = useReducedMotion()
  const variants = reduceMotion ? stepVariantsReduced : stepVariants

  const question = questions[stepIndex]
  const isLastStep = stepIndex === questions.length - 1
  const canContinue = question.rom ? romTouched[question.id] === true : yesNo[question.id] !== undefined

  function goBack() {
    setDirection(-1)
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  function answerYesNo(value: boolean) {
    setYesNo((prev) => ({ ...prev, [question.id]: value }))
  }

  function answerRom(value: number) {
    setRomValue((prev) => ({ ...prev, [question.id]: value }))
    setRomTouched((prev) => ({ ...prev, [question.id]: true }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    const payload: CheckinAnswer[] = questions.map((q) => {
      if (q.rom) {
        const angle = romValue[q.id] ?? 0
        const passed = q.rom.direction === 'extension' ? angle <= q.rom.passThreshold : angle >= q.rom.passThreshold
        return { questionId: q.id, response: `${angle}`, passed }
      }
      const value = Boolean(yesNo[q.id])
      return { questionId: q.id, response: value ? 'yes' : 'no', passed: value }
    })
    const { passed } = await onSubmit(payload)
    setSubmitting(false)
    setResult(passed ? 'passed' : 'failed')
  }

  function advanceStep() {
    if (isLastStep) {
      void handleSubmit()
      return
    }
    setDirection(1)
    setStepIndex((i) => Math.min(i + 1, questions.length - 1))
  }

  // ROM answers get a beat of celebration before moving on; plain yes/no
  // answers advance immediately since there's nothing to "log".
  function handleContinue() {
    if (question.rom) {
      setCelebrating(true)
      return
    }
    advanceStep()
  }

  function handleCelebrationDone() {
    setCelebrating(false)
    advanceStep()
  }

  if (result) {
    const startingPhase = result === 'passed' ? (nextPhase(phase) ?? phase) : phase
    return (
      <div className="milestone-result">
        <IconCheck className="milestone-result-icon" />
        <div>
          <p className="milestone-result-title">Check-in complete!</p>
          <p>
            Based on your answers, {programmeLevelPhrase(startingPhase)}. You can always switch phases later from
            the Phases tab.
          </p>
          {onContinue && (
            <button type="button" className="milestone-continue" onClick={onContinue}>
              Continue
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="milestone-checkin">
      {title && <p className="milestone-title">{title}</p>}

      <div className="milestone-progress-wrap">
        <p className="milestone-progress-percent">
          Question {stepIndex + 1} of {questions.length}
        </p>
        <div className="milestone-progress" aria-hidden="true">
          {questions.map((q, i) => (
            <span key={q.id} className={`milestone-dot${i <= stepIndex ? ' filled' : ''}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={question.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
        >
          {question.rom ? (
            <MilestoneRomStep
              question={question as MilestoneQuestion & { rom: NonNullable<MilestoneQuestion['rom']> }}
              value={romValue[question.id] ?? Math.round(question.rom.max / 2)}
              onChange={answerRom}
            />
          ) : (
            <div className="milestone-question-step">
              <p className="milestone-question-prompt">{question.prompt}</p>
              <p className="milestone-question-help">{question.help}</p>
              <div className="milestone-answer-buttons">
                <button
                  type="button"
                  className={`milestone-answer${yesNo[question.id] === true ? ' active' : ''}`}
                  onClick={() => answerYesNo(true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`milestone-answer${yesNo[question.id] === false ? ' active' : ''}`}
                  onClick={() => answerYesNo(false)}
                >
                  No
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="milestone-nav">
        {stepIndex > 0 && (
          <button type="button" className="milestone-back" onClick={goBack} disabled={celebrating}>
            Back
          </button>
        )}
        <button
          type="button"
          className="milestone-submit"
          disabled={!canContinue || submitting || celebrating}
          onClick={handleContinue}
        >
          {submitting ? 'Saving…' : isLastStep ? 'Submit check-in' : 'Continue'}
        </button>
      </div>

      <CelebrationOverlay show={celebrating} reactions={LOGGED_REACTIONS} onDone={handleCelebrationDone} />
    </div>
  )
}
