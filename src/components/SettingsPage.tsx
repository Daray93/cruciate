import type { Theme } from '../hooks/useTheme'
import { IconLogout } from './icons'
import './SettingsPage.css'

interface SettingsPageProps {
  theme: Theme
  onToggleTheme: () => void
  onSignOut: () => void
}

export function SettingsPage({ theme, onToggleTheme, onSignOut }: SettingsPageProps) {
  const isDark = theme === 'dark'

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
        <a className="settings-link-row" href="/privacy">
          Privacy policy
        </a>
        <a className="settings-link-row" href="/terms">
          Terms of use
        </a>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Account</h2>
        <button type="button" className="settings-signout" onClick={onSignOut}>
          <IconLogout />
          Sign out
        </button>
      </section>
    </main>
  )
}
