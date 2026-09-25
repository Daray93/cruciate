import { useCallback, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'
import { useWaiverStatus } from '../hooks/useWaiverStatus'
import type { UserProfile } from '../types'
import { AppSkeleton } from './AppSkeleton'
import { LoadErrorScreen } from './LoadErrorScreen'
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

  const retryLoad = useCallback(() => {
    refetchWaiver()
    refetchProfile()
  }, [refetchWaiver, refetchProfile])

  if (authLoading) {
    return <AppSkeleton />
  }

  if (!user) {
    return <SplashPage />
  }

  if (waiverStatus === 'error' || profileStatus === 'error') {
    return <LoadErrorScreen onRetry={retryLoad} />
  }

  if (waiverStatus === 'loading') {
    return <AppSkeleton />
  }

  if (waiverStatus === 'needed') {
    return <WaiverScreen userId={user.id} onAccepted={refetchWaiver} />
  }

  if (profileStatus === 'loading') {
    return <AppSkeleton />
  }

  if (profileStatus === 'missing' || !profile) {
    return <OnboardingWizard userId={user.id} onComplete={refetchProfile} />
  }

  return <>{children(user.id, profile, refetchProfile)}</>
}
