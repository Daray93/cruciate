import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { WAIVER_VERSION } from '../lib/waiver'

type WaiverStatus = 'loading' | 'needed' | 'accepted'

export function useWaiverStatus(userId: string | undefined) {
  const [status, setStatus] = useState<WaiverStatus>('loading')
  const [refetchIndex, setRefetchIndex] = useState(0)

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    supabase
      .from('waiver_acceptances')
      .select('version')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setStatus(data?.version === WAIVER_VERSION ? 'accepted' : 'needed')
      })

    return () => {
      cancelled = true
    }
  }, [userId, refetchIndex])

  const refetch = useCallback(() => setRefetchIndex((i) => i + 1), [])

  return { status, refetch }
}
