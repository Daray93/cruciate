import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // INITIAL_SESSION fires once the client has restored the stored session
    // and tried to refresh it if it expired, so queries that run after this
    // aren't racing that refresh.
    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession)
      if (event === 'INITIAL_SESSION') setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, user: session?.user ?? null, loading }
}
