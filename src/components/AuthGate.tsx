import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useWaiverStatus } from '../hooks/useWaiverStatus'
import { AuthForm } from './AuthForm'
import { WaiverScreen } from './WaiverScreen'

interface AuthGateProps {
  children: (userId: string) => ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const { user, loading: authLoading } = useAuth()
  const { status: waiverStatus, refetch: refetchWaiver } = useWaiverStatus(user?.id)

  if (authLoading) {
    return <div className="full-screen-message">Loading…</div>
  }

  if (!user) {
    return <AuthForm />
  }

  if (waiverStatus === 'loading') {
    return <div className="full-screen-message">Loading…</div>
  }

  if (waiverStatus === 'needed') {
    return <WaiverScreen userId={user.id} onAccepted={refetchWaiver} />
  }

  return <>{children(user.id)}</>
}
