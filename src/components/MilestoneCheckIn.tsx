import { useEffect, useState } from 'react'
import { PHASE_QUESTIONS } from '../lib/phases'
import type { PhaseId } from '../lib/phases'
import { IconCheck, IconInfoCircle } from './icons'
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
  onOverride?: () => Promise<void>
}

type Result = 'passed' | 'failed' | null

export function MilestoneCheckIn({ phase, title, onSubmit, onOverride }: MilestoneCheckInProps) {
  const questions = PHASE_QUESTIONS[phase]
  const [answers, setAnswers] = useState<Record<string, boolean | null>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, null])),
  )
  const [submitting, setSubmitting] = useState(false)
  const [overriding, setOverriding] = useState(false)
  const [result, setResult] = useState<Result>(null)
  const [openHelpId, setOpenHelpId] = useState<string | null>(null)

  const allAnswered = questions.every((q) => answers[q.id] !== null)

  useEffect(() => {
    if (!openHelpId) return
    function handleClickOutside(e: MouseEvent) {
      if (!(e.target instanceof Element) || !e.target.closest('.milestone-info')) {
        setOpenHelpId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openHelpId])

  function answerQuestion(questionId: string, value: boolean) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    setOpenHelpId(null)
  }

  async function handleSubmit() {
    setSubmitting(true)
    const payload: CheckinAnswer[] = questions.map((q) => ({
      questionId: q.id,
      response: answers[q.id] ? 'yes' : 'no',
      passed: Boolean(answers[q.id]),
    }))
    const { passed } = await onSubmit(payload)
    setSubmitting(false)
    setResult(passed ? 'passed' : 'failed')
  }

  async function handleOverride() {
    if (!onOverride) return
    setOverriding(true)
    await onOverride()
    setOverriding(false)
  }

  if (result === 'passed') {
    return (
      <div className="milestone-result milestone-result-pass">
        <IconCheck className="milestone-result-icon" />
        <p>Nice work. You've moved to the next phase.</p>
      </div>
    )
  }

  if (result === 'failed') {
    return (
      <div className="milestone-result milestone-result-fail">
        <p>Still working on it. That's normal. You'll stay in your current phase for now.</p>
        <div className="milestone-result-actions">
          <button type="button" className="milestone-edit-answers" onClick={() => setResult(null)}>
            Go back and change an answer
          </button>
          {onOverride && (
            <button type="button" className="milestone-override" onClick={() => void handleOverride()} disabled={overriding}>
              {overriding ? 'Advancing…' : "I'll take responsibility, advance anyway"}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="milestone-checkin">
      {title && <p className="milestone-title">{title}</p>}
      <ul className="milestone-questions">
        {questions.map((question) => (
          <li key={question.id} className="milestone-question">
            <p>
              {question.prompt}
              <span className={`milestone-info${openHelpId === question.id ? ' open' : ''}`}>
                <button
                  type="button"
                  className="milestone-info-trigger"
                  aria-label={`What does "${question.prompt}" mean?`}
                  aria-expanded={openHelpId === question.id}
                  onClick={() => setOpenHelpId((prev) => (prev === question.id ? null : question.id))}
                >
                  <IconInfoCircle />
                </button>
                <span className="milestone-info-tooltip" role="note">
                  {question.help}
                </span>
              </span>
            </p>
            <div className="milestone-answer-buttons">
              <button
                type="button"
                className={`milestone-answer${answers[question.id] === true ? ' active' : ''}`}
                onClick={() => answerQuestion(question.id, true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`milestone-answer${answers[question.id] === false ? ' active' : ''}`}
                onClick={() => answerQuestion(question.id, false)}
              >
                No
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="milestone-submit" disabled={!allAnswered || submitting} onClick={() => void handleSubmit()}>
        {submitting ? 'Saving…' : 'Submit check-in'}
      </button>
    </div>
  )
}
