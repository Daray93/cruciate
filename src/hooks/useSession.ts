import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { todayIso } from '../lib/date'

interface SessionRow {
  id: string
  red_flag: boolean
}

export function useSession(userId: string, week: number, dayKey: string) {
  const [session, setSession] = useState<SessionRow | null>(null)
  const [refetchIndex, setRefetchIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('sessions')
      .select('id, red_flag')
      .eq('user_id', userId)
      .eq('date', todayIso())
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setSession(data)
      })
    return () => {
      cancelled = true
    }
  }, [userId, refetchIndex])

  const ensureSession = useCallback(async (): Promise<string> => {
    if (session) return session.id
    const { data, error } = await supabase
      .from('sessions')
      .insert({ user_id: userId, date: todayIso(), day_key: dayKey, cycle_week: week })
      .select('id, red_flag')
      .single()
    if (error || !data) throw error ?? new Error('Failed to create session')
    setSession(data)
    return data.id
  }, [session, userId, dayKey, week])

  const setRedFlag = useCallback(
    async (flag: boolean) => {
      const id = await ensureSession()
      await supabase.from('sessions').update({ red_flag: flag }).eq('id', id)
      setSession((prev) => (prev ? { ...prev, red_flag: flag } : prev))
    },
    [ensureSession],
  )

  return { session, ensureSession, setRedFlag, refetch: () => setRefetchIndex((i) => i + 1) }
}
