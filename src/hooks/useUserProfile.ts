import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { UserProfile } from '../types'

type Status = 'loading' | 'missing' | 'ready'

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [refetchIndex, setRefetchIndex] = useState(0)

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setProfile(data as UserProfile | null)
        setStatus(data ? 'ready' : 'missing')
      })

    return () => {
      cancelled = true
    }
  }, [userId, refetchIndex])

  const refetch = useCallback(() => setRefetchIndex((i) => i + 1), [])

  // Signed out: report a clean "loading" state instead of a previous
  // account's stale profile, so a subsequent sign-in always starts fresh
  // once the effect above re-fetches for the new user.
  if (!userId) {
    return { profile: null, status: 'loading' as Status, refetch }
  }

  return { profile, status, refetch }
}
