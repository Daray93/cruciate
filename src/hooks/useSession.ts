import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { todayIso } from '../lib/date'

interface SessionRow {
  id: string
  red_flag: boolean
}

// Exercises are often prescribed multiple times a day, so a given date can
// hold several rounds. This tracks whichever round is still in progress (not
// yet completed) for that date; once completed, the next ensureSession()
// call starts a new one. Defaults to today, but a past date lets a round be
// logged retroactively (backfilling a day that was actually done).
export function useSession(userId: string, week: number, dayKey: string, date: string = todayIso()) {
  const [session, setSession] = useState<SessionRow | null>(null)
  const [refetchIndex, setRefetchIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('sessions')
      .select('id, red_flag')
      .eq('user_id', userId)
      .eq('date', date)
      .is('completed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setSession(data)
      })
    return () => {
      cancelled = true
    }
  }, [userId, date, refetchIndex])

  const ensureSession = useCallback(async (): Promise<string> => {
    if (session) return session.id
    const { data, error } = await supabase
      .from('sessions')
      .insert({ user_id: userId, date, day_key: dayKey, cycle_week: week })
      .select('id, red_flag')
      .single()
    if (error || !data) throw error ?? new Error('Failed to create session')
    setSession(data)
    return data.id
  }, [session, userId, date, dayKey, week])

  const setRedFlag = useCallback(
    async (flag: boolean) => {
      const id = await ensureSession()
      await supabase.from('sessions').update({ red_flag: flag }).eq('id', id)
      setSession((prev) => (prev ? { ...prev, red_flag: flag } : prev))
    },
    [ensureSession],
  )

  // Marks the in-progress round done so the next round starts fresh.
  const completeSession = useCallback(async () => {
    if (!session) return
    await supabase.from('sessions').update({ completed_at: new Date().toISOString() }).eq('id', session.id)
    setSession(null)
  }, [session])

  return { session, ensureSession, setRedFlag, completeSession, refetch: () => setRefetchIndex((i) => i + 1) }
}
