import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { todayIso } from '../lib/date'
import { useLoadClearance } from '../hooks/useLoadClearance'
import { PHASES } from '../lib/phases'
import type { SurgeryTimeframe, UserProfile } from '../types'
import { DatePicker } from './DatePicker'
import { FloatingInput } from './FloatingInput'
import { IconChevronLeft } from './icons'
import './ProfilePage.css'

interface ProfilePageProps {
  userId: string
  profile: UserProfile
  onProfileChange: () => void
  onBack: () => void
}

const SURGERY_TIMEFRAME_OPTIONS: [SurgeryTimeframe, string][] = [
  ['scheduled', 'Scheduled'],
  ['considering', 'Considering'],
  ['no_date', 'No date yet'],
]

export function ProfilePage({ userId, profile, onProfileChange, onBack }: ProfilePageProps) {
  const { loadCleared, setLoadCleared } = useLoadClearance(userId)
  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(profile.age?.toString() ?? '')
  const [surgeryTimeframe, setSurgeryTimeframe] = useState<SurgeryTimeframe | null>(profile.surgery_timeframe)
  const [surgeryDate, setSurgeryDate] = useState(profile.surgery_date ?? '')
  const [injuryDate, setInjuryDate] = useState(profile.injury_date ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dirty =
    name.trim() !== profile.name ||
    age !== (profile.age?.toString() ?? '') ||
    surgeryTimeframe !== profile.surgery_timeframe ||
    surgeryDate !== (profile.surgery_date ?? '') ||
    injuryDate !== (profile.injury_date ?? '')

  const phaseDef = PHASES[profile.current_phase]

  async function handleSave() {
    setSaving(true)
    setError(null)
    const { error: updateError } = await supabase
      .from('user_profile')
      .update({
        name: name.trim(),
        age: age === '' ? null : Number(age),
        surgery_timeframe: profile.track === 'prehab' ? surgeryTimeframe : null,
        surgery_date: surgeryDate || null,
        injury_date: injuryDate || null,
      })
      .eq('user_id', userId)
    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }
    setSaved(true)
    onProfileChange()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="app-shell">
      <header className="subpage-header subpage-header-inline">
        <button type="button" className="subpage-back" onClick={onBack}>
          <IconChevronLeft />
          Home
        </button>
        <h1>Profile</h1>
      </header>

      <section className="profile-summary">
        <p className="profile-track-label">
          {profile.track === 'prehab' ? 'Prehab' : 'Rehab'} · {phaseDef.shortLabel}: {phaseDef.title}
        </p>
        <p className="profile-track-hint">Track can't be changed here — it decides your whole phase structure.</p>
      </section>

      <section className="settings-section">
        <h2 className="section-title">Clearance</h2>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-label">Cleared for loaded exercises</span>
            <span className="settings-row-desc">
              Your surgeon or PT decides this — turn on once they've cleared you to load the leg (squats,
              step-downs, jumps).
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={loadCleared}
            aria-label="Cleared for loaded exercises"
            className={`settings-switch${loadCleared ? ' on' : ''}`}
            onClick={() => void setLoadCleared(!loadCleared)}
          >
            <span className="settings-switch-thumb" />
          </button>
        </div>
      </section>

      {error && <p className="profile-error">{error}</p>}

      <div className="profile-form">
        <FloatingInput label="First name" value={name} onChange={(e) => setName(e.target.value)} />
        <FloatingInput
          label="Age"
          type="number"
          inputMode="numeric"
          min={1}
          max={120}
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        {profile.track === 'prehab' && (
          <div className="profile-field-group">
            <p className="profile-field-label">Surgery timeframe</p>
            <div className="onboarding-choice-list">
              {SURGERY_TIMEFRAME_OPTIONS.map(([value, label]) => (
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
          </div>
        )}

        {(profile.track === 'rehab' || surgeryTimeframe === 'scheduled') && (
          <DatePicker
            label="Surgery date"
            value={surgeryDate}
            onChange={setSurgeryDate}
            required={profile.track === 'rehab'}
            min={profile.track === 'prehab' ? todayIso() : undefined}
            max={profile.track === 'rehab' ? todayIso() : undefined}
          />
        )}

        <DatePicker label="Injury date" value={injuryDate} onChange={setInjuryDate} max={surgeryDate || todayIso()} />
      </div>

      <button type="button" className="onboarding-next" disabled={!dirty || saving} onClick={() => void handleSave()}>
        {saving ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
      </button>
    </main>
  )
}
