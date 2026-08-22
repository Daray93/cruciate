import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
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
  const reduceMotion = useReducedMotion()

  const showTabBar = screen === 'home' || screen === 'phases' || screen === 'progress' || screen === 'settings'

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          style={{ width: '100%' }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(12px)' }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'translateY(0px)' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-12px)' }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {screen === 'home' && (
            <HomeScreen
              userId={userId}
              profile={profile}
              onProfileChange={onProfileChange}
              onOpenRehab={() => setScreen('rehab')}
              onOpenProfile={() => setScreen('profile')}
            />
          )}
          {screen === 'phases' && (
            <PhasesScreen userId={userId} profile={profile} onProfileChange={onProfileChange} />
          )}
          {screen === 'progress' && <ProgressScreen userId={userId} />}
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
              userId={userId}
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
