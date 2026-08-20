import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ExerciseDef, ExerciseLog } from '../types'

interface ExerciseLogRow {
  name: string
  done: boolean
  weight: number | null
  reps: number | null
  rpe: number | null
}

export function useExerciseLogs(sessionId: string | null, exercises: ExerciseDef[]) {
  const [log, setLog] = useState<ExerciseLog>({})

  useEffect(() => {
    let cancelled = false
    const fetcher = sessionId
      ? supabase.from('exercises_logged').select('name, done, weight, reps, rpe').eq('session_id', sessionId)
      : Promise.resolve({ data: [] as ExerciseLogRow[] })

    fetcher.then((result) => {
      if (cancelled) return
      const rows = result.data ?? []
      const next: ExerciseLog = {}
      for (const exercise of exercises) {
        const row = rows.find((r) => r.name === exercise.name)
        next[exercise.id] = row
          ? {
              done: row.done,
              weight: row.weight !== null ? String(row.weight) : '',
              reps: row.reps !== null ? String(row.reps) : '',
              rpe: row.rpe !== null ? String(row.rpe) : '',
            }
          : { done: false, weight: '', reps: '', rpe: '' }
      }
      setLog(next)
    })

    return () => {
      cancelled = true
    }
  }, [sessionId, exercises])

  return { log, setLog }
}
