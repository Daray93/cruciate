import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { PhaseId, Track } from '../lib/phases'
import type { ExerciseDef } from '../types'

export function useExercises(track: Track, phase: PhaseId) {
  const [exercises, setExercises] = useState<ExerciseDef[]>([])

  useEffect(() => {
    let cancelled = false

    supabase
      .from('exercises')
      .select('id, name, instructions, sets, reps_target, requires_load_clearance')
      .eq('track', track)
      .eq('phase', phase)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (cancelled) return
        setExercises(
          (data ?? []).map((row) => ({
            id: row.id,
            name: row.name,
            sets: row.sets ?? 0,
            repsTarget: row.reps_target ?? '',
            cue: row.instructions ?? undefined,
            requiresLoadClearance: row.requires_load_clearance,
          })),
        )
      })

    return () => {
      cancelled = true
    }
  }, [track, phase])

  return { exercises }
}
