import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import type { Theme } from '../hooks/useTheme'
import { supabase } from '../lib/supabase'
import { ConfirmModal } from './ConfirmModal'
import { IconLogout, IconTrash } from './icons'
import './SettingsPage.css'

interface SettingsPageProps {
  theme: Theme
  onToggleTheme: () => void
  onSignOut: () => void
  onOpenPrivacy: () => void
  onOpenTerms: () => void
}

type ConfirmAction = 'signout' | 'delete' | null

export function SettingsPage({ theme, onToggleTheme, onSignOut, onOpenPrivacy, onOpenTerms }: SettingsPageProps) {
  const isDark = theme === 'dark'
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDeleteProfile() {
    setWorking(true)
    setError(null)

    // Deletes the auth account itself; every app table cascades from it (see
    // supabase/functions/delete-account).
    const { data, error: invokeError } = await supabase.functions.invoke<{ error?: string }>('delete-account')
    const failure = invokeError?.message ?? data?.error

    setWorking(false)
    if (failure) {
      setError(failure)
      return
    }
    onSignOut()
  }

  return (
    <main className="app-shell app-shell-with-tabs">
      <header className="app-header">
        <h1>Settings</h1>
      </header>

      <section className="settings-section">
        <h2 className="section-title">Appearance</h2>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-label">Dark mode</span>
            <span className="settings-row-desc">Easier on the eyes in low light</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label="Dark mode"
            className={`settings-switch${isDark ? ' on' : ''}`}
            onClick={onToggleTheme}
          >
            <span className="settings-switch-thumb" />
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="section-title">Legal</h2>
        <button type="button" className="settings-link-row" onClick={onOpenPrivacy}>
          <span className="settings-row-label">Privacy policy</span>
          <span className="settings-row-desc">How your data is stored and used</span>
        </button>
        <button type="button" className="settings-link-row" onClick={onOpenTerms}>
          <span className="settings-row-label">Terms of use</span>
          <span className="settings-row-desc">What you're agreeing to by using this app</span>
        </button>
      </section>

      <section className="settings-section">
        <h2 className="section-title">Account</h2>
        {error && <p className="settings-error">{error}</p>}
        <button type="button" className="settings-signout" onClick={() => setConfirmAction('signout')}>
          <IconLogout />
          <span className="settings-row-text">
            <span className="settings-row-label">Sign out</span>
            <span className="settings-row-desc">You'll need to sign back in to keep tracking</span>
          </span>
        </button>
        <button type="button" className="settings-delete" onClick={() => setConfirmAction('delete')}>
          <IconTrash />
          <span className="settings-row-text">
            <span className="settings-row-label">Delete profile</span>
            <span className="settings-row-desc">Permanently deletes your account and data</span>
          </span>
        </button>
      </section>

      <AnimatePresence>
        {confirmAction === 'signout' && (
          <ConfirmModal
            title="Sign out?"
            body="You'll need to sign back in to continue tracking your recovery."
            confirmLabel="Sign out"
            onConfirm={onSignOut}
            onCancel={() => setConfirmAction(null)}
          />
        )}
        {confirmAction === 'delete' && (
          <ConfirmModal
            title="Delete your profile?"
            body="Erases your account and everything in it: exercise history, ROM readings, check-ins, and profile. You'll need to sign up again to use Cruciate. Can't be undone."
            confirmLabel="Delete everything"
            confirmingLabel="Byeeee…"
            destructive
            confirming={working}
            onConfirm={() => void handleDeleteProfile()}
            onCancel={() => setConfirmAction(null)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
