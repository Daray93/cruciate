import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Alert } from './Alert'
import { FloatingInput } from './FloatingInput'
import { IconGoogle } from './icons'
import './AuthForm.css'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [linkSent, setLinkSent] = useState(false)

  async function handleGoogleSignIn() {
    setError(null)
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (authError) setError(authError.message)
  }

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    setSubmitting(false)

    if (authError) {
      setError(authError.message)
      return
    }
    setLinkSent(true)
  }

  return (
    <div className="auth-form-wrap">
      <h1>Cruciate</h1>
      <p className="auth-subtitle">Track your ACL prehab and rehab program.</p>

      <button type="button" className="auth-google-button" onClick={() => void handleGoogleSignIn()}>
        <IconGoogle />
        Continue with Google
      </button>

      <div className="auth-divider">
        <span>or</span>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {linkSent ? (
        <>
          <Alert variant="info">
            We sent a sign-in link to <strong>{email}</strong>. Open it on this device to continue.
          </Alert>
          <button type="button" className="auth-use-different-email" onClick={() => setLinkSent(false)}>
            Use a different email
          </button>
        </>
      ) : (
        <form className="auth-form" onSubmit={handleMagicLink}>
          <FloatingInput
            label="Email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Continue with email'}
          </button>
        </form>
      )}

      <p className="auth-legal-links">
        By continuing you agree to our <a href="/terms">terms</a> and <a href="/privacy">privacy policy</a>.
      </p>
    </div>
  )
}
