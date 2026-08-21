import { useState } from 'react'
import { AuthGate } from './components/AuthGate'
import { DesignSystemPage } from './components/DesignSystemPage'
import { HomeScreen } from './components/HomeScreen'
import { LegalPage } from './components/LegalPage'
import { ThemeToggle } from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'
import { PRIVACY_POLICY_TEXT } from './lib/privacyPolicy'
import { TERMS_TEXT } from './lib/termsOfUse'
import './App.css'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [isHome, setIsHome] = useState(false)
  const path = window.location.pathname

  return (
    <>
      {/* Home screen owns its own theme control inside its overflow menu, so
          the floating one would be a redundant second control once signed in. */}
      {!isHome && (
        <div className="floating-theme-toggle">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      )}
      {path === '/design-system' ? (
        <DesignSystemPage />
      ) : path === '/privacy' ? (
        <LegalPage title="Privacy policy" text={PRIVACY_POLICY_TEXT} />
      ) : path === '/terms' ? (
        <LegalPage title="Terms of use" text={TERMS_TEXT} />
      ) : (
        <AuthGate onHomeChange={setIsHome}>
          {(userId, profile, refetchProfile) => (
            <HomeScreen
              userId={userId}
              profile={profile}
              onProfileChange={refetchProfile}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          )}
        </AuthGate>
      )}
    </>
  )
}

export default App
