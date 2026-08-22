import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Theme } from '../hooks/useTheme'
import type { UserProfile } from '../types'
import { HomeScreen } from './HomeScreen'
import { ProgressScreen } from './ProgressScreen'
import { TodayRehab } from './TodayRehab'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

type Screen = 'home' | 'rehab' | 'progress'

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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
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
            theme={theme}
            onToggleTheme={onToggleTheme}
            onOpenRehab={() => setScreen('rehab')}
            onOpenProgress={() => setScreen('progress')}
          />
        )}
        {screen === 'rehab' && <TodayRehab userId={userId} profile={profile} onBack={() => setScreen('home')} />}
        {screen === 'progress' && <ProgressScreen userId={userId} onBack={() => setScreen('home')} />}
      </motion.div>
    </AnimatePresence>
  )
}
