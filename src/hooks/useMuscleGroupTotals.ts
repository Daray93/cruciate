import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { EXERCISE_MUSCLE_GROUP, MUSCLE_GROUPS } from '../lib/muscleGroups'
import type { MuscleGroup } from '../lib/muscleGroups'

type Totals = Record<MuscleGroup, number>

function emptyTotals(): Totals {
  return Object.fromEntries(MUSCLE_GROUPS.map((group) => [group, 0])) as Totals
}

export function useMuscleGroupTotals(userId: string) {
  const [totals, setTotals] = useState<Totals>(emptyTotals)
  const [refetchIndex, setRefetchIndex] = useState(0)

  const load = useCallback(async (): Promise<Totals> => {
    const { data: sessions } = await supabase.from('sessions').select('id').eq('user_id', userId)
    const sessionIds = (sessions ?? []).map((s) => s.id)
    if (sessionIds.length === 0) return emptyTotals()

    const { data: logs } = await supabase
      .from('exercises_logged')
      .select('name')
      .eq('done', true)
      .in('session_id', sessionIds)

    const next = emptyTotals()
    for (const row of logs ?? []) {
      const group = EXERCISE_MUSCLE_GROUP[row.name]
      if (group) next[group] += 1
    }
    return next
  }, [userId])

  useEffect(() => {
    let cancelled = false
    load().then((result) => {
      if (!cancelled) setTotals(result)
    })
    return () => {
      cancelled = true
    }
  }, [load, refetchIndex])

  return { totals, refetch: () => setRefetchIndex((i) => i + 1) }
}
