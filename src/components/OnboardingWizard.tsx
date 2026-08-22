import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Variants } from 'motion/react'
import { todayIso } from '../lib/date'
import { supabase } from '../lib/supabase'
import { computeStartingPhase, nextPhase, PHASE_QUESTIONS, programmeLevelPhrase } from '../lib/phases'
import type { PhaseId, Track } from '../lib/phases'
import type { PhaseAdvancedBy, SurgeryTimeframe } from '../types'
import { Alert } from './Alert'
import { DatePicker } from './DatePicker'
import { FloatingInput } from './FloatingInput'
import { MilestoneCheckIn } from './MilestoneCheckIn'
import type { CheckinAnswer } from './MilestoneCheckIn'
import './OnboardingWizard.css'

const STEP_ORDER = ['name', 'age', 'track', 'surgery', 'checkin'] as const
type Step = (typeof STEP_ORDER)[number]

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]
const GREETING_MS = 1400

// Ireland's digital age of consent under GDPR (Data Protection Act 2018) is
// 16, not the GDPR default of 13 — processing a minor's data below this age
// needs verified parental consent, which this app doesn't implement.
const MIN_AGE = 16

// Steps page like physical cards: forward continues left, back returns right,
// each carrying momentum via a spring rather than a linear fade.
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

interface OnboardingWizardProps {
  userId: string
  onComplete: () => void
}

export function OnboardingWizard({ userId, onComplete }: OnboardingWizardProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const step: Step = STEP_ORDER[stepIndex]
  const reduceMotion = useReducedMotion()
  const variants = reduceMotion ? stepVariantsReduced : stepVariants

  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [track, setTrack] = useState<Track | null>(null)
  const [surgeryTimeframe, setSurgeryTimeframe] = useState<SurgeryTimeframe | null>(null)
  const [surgeryDate, setSurgeryDate] = useState('')
  const [injuryDate, setInjuryDate] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [finalized, setFinalized] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)

  const ageValue = age === '' ? null : Number(age)
  const isUnderMinAge = ageValue !== null && ageValue < MIN_AGE

  const canGoNext =
    step === 'name'
      ? name.trim().length > 0
      : step === 'age'
        ? ageValue !== null && ageValue > 0 && !isUnderMinAge
        : step === 'track'
          ? track !== null
          : step === 'surgery'
            ? track === 'rehab'
              ? surgeryDate !== ''
              : surgeryTimeframe !== null
            : true

  function goNext() {
    setDirection(1)
    setStepIndex((i) => Math.min(i + 1, STEP_ORDER.length - 1))
  }

  function goBack() {
    setDirection(-1)
    setStepIndex((i) => Math.max(i - 1, 0))
  }

  // The name step hands off to a brief full-screen greeting instead of
  // advancing straight to the next step — it's not a step of its own, it
  // just appears and disappears like the app is saying hello.
  function submitName() {
    if (name.trim().length === 0) return
    setShowGreeting(true)
  }

  useEffect(() => {
    if (!showGreeting) return
    const timer = setTimeout(() => {
      setShowGreeting(false)
      goNext()
    }, GREETING_MS)
    return () => clearTimeout(timer)
  }, [showGreeting])

  async function writeProfile(currentPhase: PhaseId, advancedBy: PhaseAdvancedBy | null): Promise<boolean> {
    setError(null)
    // Upsert rather than insert: if the profile-existence check that gates
    // this wizard raced a still-settling auth session and returned stale
    // "missing" for an account that already onboarded, this must not fail
    // with a duplicate-key error — it should just leave the existing row alone.
    const { error: insertError } = await supabase.from('user_profile').upsert({
      user_id: userId,
      name: name.trim(),
      age: Number(age),
      track: track as Track,
      surgery_timeframe: track === 'prehab' ? surgeryTimeframe : null,
      surgery_date: surgeryDate || null,
      injury_date: injuryDate || null,
      current_phase: currentPhase,
      phase_advanced_by: advancedBy,
    })
    if (insertError) {
      setError(insertError.message)
      return false
    }
    return true
  }

  async function writeCheckinRows(phaseTarget: PhaseId, answers: CheckinAnswer[]) {
    await supabase.from('milestone_checkins').insert(
      answers.map((answer) => ({
        user_id: userId,
        phase_target: phaseTarget,
        question_id: answer.questionId,
        response: answer.response,
        passed: answer.passed,
      })),
    )
  }

  async function handleCheckinSubmit(startingPhase: PhaseId, answers: CheckinAnswer[]) {
    const passed = answers.every((answer) => answer.passed)
    const finalPhase = passed ? (nextPhase(startingPhase) ?? startingPhase) : startingPhase
    const ok = await writeProfile(finalPhase, passed ? 'milestone' : null)
    if (ok) {
      await writeCheckinRows(startingPhase, answers)
      setFinalized(true)
    }
    return { passed }
  }

  async function handleFinishWithoutCheckin(startingPhase: PhaseId) {
    setSaving(true)
    const ok = await writeProfile(startingPhase, null)
    setSaving(false)
    if (ok) setFinalized(true)
  }

  const startingPhase = track ? computeStartingPhase(track, surgeryDate || null) : null
  const hasCheckinQuestions = startingPhase ? PHASE_QUESTIONS[startingPhase].length > 0 : false
  const percentComplete = Math.round(((stepIndex + 1) / STEP_ORDER.length) * 100)

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-progress-wrap">
        {/* Plain text carries the progress info to everyone, including screen
            readers — the dots below are a purely decorative visual echo of it. */}
        <p className="onboarding-progress-percent">{percentComplete}% complete</p>
        <div className="onboarding-progress" aria-hidden="true">
          {STEP_ORDER.map((s, i) => (
            <span key={s} className={`onboarding-dot${i <= stepIndex ? ' filled' : ''}`} />
          ))}
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        {step === 'name' && (
          <motion.section
            key="name"
            className="onboarding-step"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          >
            <h1>What should we call you?</h1>
            <FloatingInput
              label="First name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  submitName()
                }
              }}
              autoFocus
            />
          </motion.section>
        )}

        {step === 'age' && (
          <motion.section
            key="age"
            className="onboarding-step"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          >
            <h1>How old are you?</h1>
            <FloatingInput
              label="Age"
              type="number"
              inputMode="numeric"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            {isUnderMinAge && (
              <Alert variant="error">You need to be {MIN_AGE} or older to use Cruciate.</Alert>
            )}
          </motion.section>
        )}

        {step === 'track' && (
          <motion.section
            key="track"
            className="onboarding-step"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          >
            <h1>Where are you in your journey?</h1>
            <div className="onboarding-choice-grid">
              <button
                type="button"
                className={`onboarding-choice-card${track === 'prehab' ? ' active' : ''}`}
                onClick={() => setTrack('prehab')}
              >
                <span className="onboarding-choice-title">Prehab</span>
                <span className="onboarding-choice-body">Getting ready for surgery</span>
              </button>
              <button
                type="button"
                className={`onboarding-choice-card${track === 'rehab' ? ' active' : ''}`}
                onClick={() => setTrack('rehab')}
              >
                <span className="onboarding-choice-title">Rehab</span>
                <span className="onboarding-choice-body">Recovering after surgery</span>
              </button>
            </div>
          </motion.section>
        )}

        {step === 'surgery' && track === 'prehab' && (
          <motion.section
            key="surgery"
            className="onboarding-step"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          >
            <h1>Is surgery on the calendar?</h1>
            <div className="onboarding-choice-list">
              {(
                [
                  ['scheduled', 'Scheduled'],
                  ['considering', 'Considering'],
                  ['no_date', 'No date yet'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`onboarding-choice-row${surgeryTimeframe === value ? ' active' : ''}`}
                  onClick={() => setSurgeryTimeframe(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            {surgeryTimeframe === 'scheduled' && (
              <DatePicker label="Surgery date" value={surgeryDate} onChange={setSurgeryDate} min={todayIso()} />
            )}
            <DatePicker
              label="Injury date"
              value={injuryDate}
              onChange={setInjuryDate}
              max={surgeryDate || todayIso()}
            />
          </motion.section>
        )}

        {step === 'surgery' && track === 'rehab' && (
          <motion.section
            key="surgery"
            className="onboarding-step"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          >
            <h1>When was your surgery?</h1>
            <p className="onboarding-hint">Used to calculate your weeks post-op.</p>
            <DatePicker label="Surgery date" value={surgeryDate} onChange={setSurgeryDate} required max={todayIso()} />
            <DatePicker
              label="Injury date"
              value={injuryDate}
              onChange={setInjuryDate}
              max={surgeryDate || todayIso()}
            />
          </motion.section>
        )}

        {step === 'checkin' && startingPhase && (
          <motion.section
            key="checkin"
            className="onboarding-step"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          >
            <h1>Quick check-in</h1>
            <p className="onboarding-hint">
              Your answers decide which programme you start with. Answer honestly. There's no wrong answer.
            </p>

            {hasCheckinQuestions ? (
              <MilestoneCheckIn
                phase={startingPhase}
                onSubmit={(answers) => handleCheckinSubmit(startingPhase, answers)}
                onContinue={onComplete}
              />
            ) : (
              <>
                <p className="onboarding-hint">
                  You're already well into your program. Based on your answers, {programmeLevelPhrase(startingPhase)}.
                </p>
                <button
                  type="button"
                  className="onboarding-next"
                  disabled={saving}
                  onClick={finalized ? onComplete : () => void handleFinishWithoutCheckin(startingPhase)}
                >
                  {saving ? 'Saving…' : finalized ? 'Continue to Cruciate' : 'Continue'}
                </button>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {(step !== 'checkin' || !finalized) && (
        <div className="onboarding-nav">
          {stepIndex > 0 && (
            <button type="button" className="onboarding-back" onClick={goBack}>
              Back
            </button>
          )}
          {step !== 'checkin' && (
            <button
              type="button"
              className="onboarding-next"
              disabled={!canGoNext}
              onClick={step === 'name' ? submitName : goNext}
            >
              Continue
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {showGreeting && (
          <motion.div
            className="onboarding-greeting-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <motion.h1
              initial={
                reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)', transform: 'translateY(8px)' }
              }
              animate={
                reduceMotion ? { opacity: 1 } : { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }
              }
              transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: EASE_OUT }}
            >
              Hey,{' '}
              <motion.span
                className="onboarding-greeting-name"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.85)' }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1)' }}
                transition={{ type: 'spring', duration: 0.5, bounce: 0.25, delay: reduceMotion ? 0 : 0.15 }}
              >
                {name.trim()}
              </motion.span>
              .
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
