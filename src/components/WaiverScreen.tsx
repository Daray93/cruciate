import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { WAIVER_TEXT, WAIVER_VERSION } from '../lib/waiver'
import { Alert } from './Alert'
import './WaiverScreen.css'

interface WaiverScreenProps {
  userId: string
  onAccepted: () => void
}

export function WaiverScreen({ userId, onAccepted }: WaiverScreenProps) {
  const [checked, setChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAccept() {
    setSubmitting(true)
    setError(null)
    const { error: upsertError } = await supabase
      .from('waiver_acceptances')
      .upsert({ user_id: userId, version: WAIVER_VERSION, accepted_at: new Date().toISOString() })
    setSubmitting(false)

    if (upsertError) {
      setError(upsertError.message)
      return
    }
    onAccepted()
  }

  return (
    <div className="waiver-screen">
      <h1>Before you start</h1>
      <div className="waiver-text">
        {WAIVER_TEXT.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <label className="waiver-accept">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        <span>I have read and agree to the above.</span>
      </label>

      {error && <Alert variant="error">{error}</Alert>}

      <button type="button" className="waiver-accept-button" disabled={!checked || submitting} onClick={handleAccept}>
        {submitting ? 'Saving…' : 'Accept & continue'}
      </button>

      <button
        type="button"
        className="waiver-signout"
        onClick={() => {
          void supabase.auth.signOut()
        }}
      >
        Sign out instead
      </button>
    </div>
  )
}
