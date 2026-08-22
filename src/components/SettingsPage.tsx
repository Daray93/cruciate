import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import type { Theme } from '../hooks/useTheme'
import { supabase } from '../lib/supabase'
import { ConfirmModal } from './ConfirmModal'
import { IconLogout, IconTrash } from './icons'
import './SettingsPage.css'

interface SettingsPageProps {
  userId: string
  theme: Theme
  onToggleTheme: () => void
  onSignOut: () => void
  onOpenPrivacy: () => void
  onOpenTerms: () => void
}

type ConfirmAction = 'signout' | 'delete' | null

export function SettingsPage({ userId, theme, onToggleTheme, onSignOut, onOpenPrivacy, onOpenTerms }: SettingsPageProps) {
  const isDark = theme === 'dark'
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDeleteProfile() {
    setWorking(true)
    setError(null)

    // Deleting sessions cascades to exercises_logged and rom_readings.
    const steps = [
      supabase.from('sessions').delete().eq('user_id', userId),
      supabase.from('milestone_checkins').delete().eq('user_id', userId),
      supabase.from('clearance').delete().eq('user_id', userId),
      supabase.from('waiver_acceptances').delete().eq('user_id', userId),
      supabase.from('user_profile').delete().eq('user_id', userId),
    ]
    for (const step of steps) {
      const { error: stepError } = await step
      if (stepError) {
        setWorking(false)
        setError(stepError.message)
        return
      }
    }

    setWorking(false)
    onSignOut()
  }

  return (
    <main className="app-shell app-shell-with-tabs">
      <header className="app-header">
        <h1>Settings</h1>
      </header>

      <section className="settings-section">
        <h2 className="settings-section-title">Appearance</h2>
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
        <h2 className="settings-section-title">Legal</h2>
        <button type="button" className="settings-link-row" onClick={onOpenPrivacy}>
          Privacy policy
        </button>
        <button type="button" className="settings-link-row" onClick={onOpenTerms}>
          Terms of use
        </button>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Account</h2>
        {error && <p className="settings-error">{error}</p>}
        <button type="button" className="settings-signout" onClick={() => setConfirmAction('signout')}>
          <IconLogout />
          Sign out
        </button>
        <button type="button" className="settings-delete" onClick={() => setConfirmAction('delete')}>
          <IconTrash />
          Delete profile
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
            body="This permanently deletes your exercise history, ROM readings, check-ins, and profile — everything you've logged. It doesn't delete your login itself, but you'll start over from onboarding if you sign back in. This can't be undone."
            confirmLabel="Delete everything"
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
