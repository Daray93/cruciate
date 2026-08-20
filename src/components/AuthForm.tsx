import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Alert } from './Alert'
import { FloatingInput } from './FloatingInput'
import './AuthForm.css'

type Mode = 'sign-in' | 'sign-up'

export function AuthForm() {
  const [mode, setMode] = useState<Mode>('sign-up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [waiverChecked, setWaiverChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const isSignUp = mode === 'sign-up'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (isSignUp && !waiverChecked) {
      setError('You need to agree to the waiver before creating an account.')
      return
    }

    setSubmitting(true)
    const { error: authError, data } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (isSignUp && !data.session) {
      setInfo('Check your email to confirm your account, then sign in.')
    }
  }

  return (
    <div className="auth-form-wrap">
      <h1>Cruciate</h1>
      <p className="auth-subtitle">Track your ACL prehab and rehab program.</p>

      <div className="auth-mode-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={isSignUp}
          className={`auth-mode-tab${isSignUp ? ' active' : ''}`}
          onClick={() => setMode('sign-up')}
        >
          Sign up
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!isSignUp}
          className={`auth-mode-tab${!isSignUp ? ' active' : ''}`}
          onClick={() => setMode('sign-in')}
        >
          Sign in
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <FloatingInput
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FloatingInput
          label="Password"
          type="password"
          required
          minLength={6}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {isSignUp && (
          <label className="waiver-checkbox">
            <input
              type="checkbox"
              checked={waiverChecked}
              onChange={(e) => setWaiverChecked(e.target.checked)}
            />
            <span>I understand this isn't medical advice - full details next.</span>
          </label>
        )}

        {error && <Alert variant="error">{error}</Alert>}
        {info && <Alert variant="info">{info}</Alert>}

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
