import { useState } from 'react'
import { IconCheck } from './icons'
import './RedFlagCheckIn.css'

const SYMPTOMS = [
  { id: 'fever', label: 'Fever' },
  { id: 'calf', label: 'Calf pain or swelling' },
  { id: 'chest', label: 'Chest pain or shortness of breath' },
  { id: 'severe-pain', label: 'Sudden, severe pain' },
  { id: 'wound', label: 'Wound is red, warm, swollen, or draining' },
  { id: 'weight-bearing', label: "Can't bear weight" },
] as const

interface RedFlagCheckInProps {
  active: boolean
  onFlag: () => void
  onClear: () => void
  /** Called once the user says they have no symptoms today. */
  onGateCleared: () => void
}

export function RedFlagCheckIn({ active, onFlag, onClear, onGateCleared }: RedFlagCheckInProps) {
  const [hasSymptoms, setHasSymptoms] = useState<boolean | null>(null)

  if (active) {
    return (
      <div className="red-flag-banner" role="alert">
        <p className="red-flag-title">Contact your care team before continuing</p>
        <p className="red-flag-body">
          You flagged a concerning symptom today, so today's exercises are paused. If
          this feels urgent, don't wait on this app. Contact your surgeon, PT, or
          emergency services now.
        </p>
        <button
          type="button"
          className="red-flag-clear"
          onClick={() => {
            onClear()
            setHasSymptoms(null)
          }}
        >
          Symptoms resolved, resume
        </button>
      </div>
    )
  }

  if (hasSymptoms === null) {
    return (
      <div className="red-flag-gate">
        <p className="red-flag-gate-question">Any symptoms today?</p>
        <div className="red-flag-gate-buttons">
          <button
            type="button"
            className="red-flag-gate-no"
            onClick={() => {
              setHasSymptoms(false)
              onGateCleared()
            }}
          >
            No
          </button>
          <button type="button" className="red-flag-gate-yes" onClick={() => setHasSymptoms(true)}>
            Yes
          </button>
        </div>
      </div>
    )
  }

  if (hasSymptoms === false) {
    return (
      <button type="button" className="red-flag-gate-cleared" onClick={() => setHasSymptoms(null)}>
        <IconCheck className="red-flag-gate-cleared-icon" />
        No symptoms today
      </button>
    )
  }

  return (
    <div className="red-flag-checkin">
      <div className="red-flag-checkin-header">
        <p className="red-flag-checkin-title">Which of these?</p>
        <button type="button" className="red-flag-checkin-back" onClick={() => setHasSymptoms(null)}>
          Actually, none of these
        </button>
      </div>
      <div className="red-flag-checkin-list">
        {SYMPTOMS.map((symptom) => (
          <label key={symptom.id} className="red-flag-checkin-item">
            <input type="checkbox" onChange={(e) => e.target.checked && onFlag()} />
            {symptom.label}
          </label>
        ))}
      </div>
    </div>
  )
}
