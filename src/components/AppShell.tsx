import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Theme } from '../hooks/useTheme'
import { supabase } from '../lib/supabase'
import { PRIVACY_POLICY_TEXT } from '../lib/privacyPolicy'
import { TERMS_TEXT } from '../lib/termsOfUse'
import type { UserProfile } from '../types'
import type { MainTab } from './BottomTabBar'
import { BottomTabBar } from './BottomTabBar'
import { HomeScreen } from './HomeScreen'
import { LegalPage } from './LegalPage'
import { PhasesScreen } from './PhasesScreen'
import { ProfilePage } from './ProfilePage'
import { ProgressScreen } from './ProgressScreen'
import { SettingsPage } from './SettingsPage'
import { TodayRehab } from './TodayRehab'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

type Screen = MainTab | 'rehab' | 'profile' | 'privacy' | 'terms'

interface AppShellProps {
  userId: string
  profile: UserProfile
  onProfileChange: () => void
  theme: Theme
  onToggleTheme: () => void
}

export function AppShell({ userId, profile, onProfileChange, theme, onToggleTheme }: AppShellProps) {
  const [screen, setScreen] = useState<Screen>('home')

  const showTabBar = screen === 'home' || screen === 'phases' || screen === 'progress' || screen === 'settings'

  return (
    <>
      {/* Opacity-only: a transform here (even settled at translateY(0)) breaks
          position:sticky for the headers each screen renders as a descendant. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          style={{ width: '100%' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {screen === 'home' && (
            <HomeScreen profile={profile} onOpenRehab={() => setScreen('rehab')} onOpenProfile={() => setScreen('profile')} />
          )}
          {screen === 'phases' && (
            <PhasesScreen userId={userId} profile={profile} onProfileChange={onProfileChange} />
          )}
          {screen === 'progress' && <ProgressScreen userId={userId} profile={profile} />}
          {screen === 'profile' && (
            <ProfilePage
              userId={userId}
              profile={profile}
              onProfileChange={onProfileChange}
              onBack={() => setScreen('home')}
            />
          )}
          {screen === 'settings' && (
            <SettingsPage
              theme={theme}
              onToggleTheme={onToggleTheme}
              onSignOut={() => void supabase.auth.signOut()}
              onOpenPrivacy={() => setScreen('privacy')}
              onOpenTerms={() => setScreen('terms')}
            />
          )}
          {screen === 'rehab' && (
            <TodayRehab
              userId={userId}
              profile={profile}
              onBack={() => setScreen('home')}
              onOpenProfile={() => setScreen('profile')}
              onOpenProgress={() => setScreen('progress')}
              onProfileChange={onProfileChange}
            />
          )}
          {screen === 'privacy' && (
            <LegalPage title="Privacy policy" text={PRIVACY_POLICY_TEXT} onBack={() => setScreen('settings')} />
          )}
          {screen === 'terms' && (
            <LegalPage title="Terms of use" text={TERMS_TEXT} onBack={() => setScreen('settings')} />
          )}
        </motion.div>
      </AnimatePresence>

      {showTabBar && <BottomTabBar active={screen as MainTab} onSelect={setScreen} />}
    </>
  )
}
