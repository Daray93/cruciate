import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface SessionSummary {
  id: string
  date: string
  dayKey: string
  cycleWeek: number
  redFlag: boolean
  completedAt: string | null
  createdAt: string
}

export function useSessionHistory(userId: string) {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [refetchIndex, setRefetchIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('sessions')
      .select('id, date, day_key, cycle_week, red_flag, completed_at, created_at')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setSessions(
          (data ?? []).map((row) => ({
            id: row.id,
            date: row.date,
            dayKey: row.day_key,
            cycleWeek: row.cycle_week,
            redFlag: row.red_flag,
            completedAt: row.completed_at,
            createdAt: row.created_at,
          })),
        )
      })
    return () => {
      cancelled = true
    }
  }, [userId, refetchIndex])

  return { sessions, refetch: () => setRefetchIndex((i) => i + 1) }
}
