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
}

export function RedFlagCheckIn({ active, onFlag, onClear }: RedFlagCheckInProps) {
  if (active) {
    return (
      <div className="red-flag-banner" role="alert">
        <p className="red-flag-title">Contact your care team before continuing</p>
        <p className="red-flag-body">
          You flagged a concerning symptom today, so today's exercises are paused. If
          this feels urgent, don't wait on this app — contact your surgeon, PT, or
          emergency services now.
        </p>
        <button type="button" className="red-flag-clear" onClick={onClear}>
          Symptoms resolved — resume
        </button>
      </div>
    )
  }

  return (
    <div className="red-flag-checkin">
      <p className="red-flag-checkin-title">Any of these today?</p>
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
