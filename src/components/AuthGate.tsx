import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'
import { useWaiverStatus } from '../hooks/useWaiverStatus'
import type { UserProfile } from '../types'
import { OnboardingWizard } from './OnboardingWizard'
import { SplashPage } from './SplashPage'
import { WaiverScreen } from './WaiverScreen'

interface AuthGateProps {
  children: (userId: string, profile: UserProfile, refetchProfile: () => void) => ReactNode
  /** Fires whenever the gate's rendered screen changes to or away from `children` (the Home screen). */
  onHomeChange?: (isHome: boolean) => void
}

export function AuthGate({ children, onHomeChange }: AuthGateProps) {
  const { user, loading: authLoading } = useAuth()
  const { status: waiverStatus, refetch: refetchWaiver } = useWaiverStatus(user?.id)
  const { profile, status: profileStatus, refetch: refetchProfile } = useUserProfile(user?.id)

  const isHome = Boolean(user) && waiverStatus === 'accepted' && profileStatus === 'ready' && Boolean(profile)

  useEffect(() => {
    onHomeChange?.(isHome)
  }, [isHome, onHomeChange])

  if (authLoading) {
    return <div className="full-screen-message">Loading…</div>
  }

  if (!user) {
    return <SplashPage />
  }

  if (waiverStatus === 'loading') {
    return <div className="full-screen-message">Loading…</div>
  }

  if (waiverStatus === 'needed') {
    return <WaiverScreen userId={user.id} onAccepted={refetchWaiver} />
  }

  if (profileStatus === 'loading') {
    return <div className="full-screen-message">Loading…</div>
  }

  if (profileStatus === 'missing' || !profile) {
    return <OnboardingWizard userId={user.id} onComplete={refetchProfile} />
  }

  return <>{children(user.id, profile, refetchProfile)}</>
}
