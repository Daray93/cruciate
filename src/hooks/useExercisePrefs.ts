import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface ExercisePref {
  exerciseId: string
  /** true = hidden from a phase it's normally scheduled in; false = manually added from another phase. */
  hidden: boolean
}

export function useExercisePrefs(userId: string) {
  const [prefs, setPrefs] = useState<ExercisePref[]>([])
  const [refetchIndex, setRefetchIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    supabase
      .from('user_exercise_prefs')
      .select('exercise_id, hidden')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (cancelled) return
        setPrefs((data ?? []).map((row) => ({ exerciseId: row.exercise_id, hidden: row.hidden })))
      })
    return () => {
      cancelled = true
    }
  }, [userId, refetchIndex])

  const refetch = useCallback(() => setRefetchIndex((i) => i + 1), [])

  const hideExercise = useCallback(
    async (exerciseId: string) => {
      await supabase.from('user_exercise_prefs').upsert({ user_id: userId, exercise_id: exerciseId, hidden: true })
      refetch()
    },
    [userId, refetch],
  )

  const addExercise = useCallback(
    async (exerciseId: string) => {
      await supabase.from('user_exercise_prefs').upsert({ user_id: userId, exercise_id: exerciseId, hidden: false })
      refetch()
    },
    [userId, refetch],
  )

  const clearPref = useCallback(
    async (exerciseId: string) => {
      await supabase.from('user_exercise_prefs').delete().eq('user_id', userId).eq('exercise_id', exerciseId)
      refetch()
    },
    [userId, refetch],
  )

  return { prefs, hideExercise, addExercise, clearPref, refetch }
}
