import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { RETRY_DELAYS_MS } from '../lib/retry'
import { WAIVER_VERSION } from '../lib/waiver'

type WaiverStatus = 'loading' | 'needed' | 'accepted' | 'error'

export function useWaiverStatus(userId: string | undefined) {
  const [status, setStatus] = useState<WaiverStatus>('loading')
  const [refetchIndex, setRefetchIndex] = useState(0)

  useEffect(() => {
    if (!userId) return
    let cancelled = false
    let retryTimer: ReturnType<typeof setTimeout> | undefined

    // Same rule as useUserProfile: a failed request is not "waiver needed".
    function attempt(tryIndex: number) {
      supabase
        .from('waiver_acceptances')
        .select('version')
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
          setStatus(data?.version === WAIVER_VERSION ? 'accepted' : 'needed')
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

  return { status, refetch }
}
