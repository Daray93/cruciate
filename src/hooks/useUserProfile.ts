import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { RETRY_DELAYS_MS } from '../lib/retry'
import type { UserProfile } from '../types'

type Status = 'loading' | 'missing' | 'ready' | 'error'

export function useUserProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [refetchIndex, setRefetchIndex] = useState(0)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined

    // A failed request must never read as "no profile": that sends an
    // onboarded user back into the wizard. Opening the installed app cold
    // often means an expired token and a network that isn't ready yet, so
    // retry a few times before giving up.
    function attempt(tryIndex: number) {
      supabase
        .from('user_profile')
        .select('*')
        .eq('user_id', userId!)
        .maybeSingle()
        .then(({ data, error }) => {
          if (cancelled) return
          if (error) {
            if (tryIndex < RETRY_DELAYS_MS.length) {
              retryTimer = setTimeout(() => attempt(tryIndex + 1), RETRY_DELAYS_MS[tryIndex])
            } else {
              setStatus('error')
            }
            return
          }
          setProfile(data as UserProfile | null)
          setStatus(data ? 'ready' : 'missing')
        })
    }
    attempt(0)

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [userId, refetchIndex])

  // Only drop back to loading when recovering from an error. A normal
  // refetch (e.g. after saving the profile) keeps showing the current
  // screen instead of flashing the whole app to a skeleton.
  const refetch = useCallback(() => {
    setStatus((s) => (s === 'error' ? 'loading' : s))
    setRefetchIndex((i) => i + 1)
  }, [])

  // Signed out: report a clean "loading" state instead of a previous
  // account's stale profile, so a subsequent sign-in always starts fresh
  // once the effect above re-fetches for the new user.
  if (!userId) {
    return { profile: null, status: 'loading' as Status, refetch }
  }

  return { profile, status, refetch }
}
