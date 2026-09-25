import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { PhaseId, Track } from '../lib/phases'
import type { ExerciseCategory, ExerciseDef } from '../types'

export function useExercisesByTrack(track: Track) {
  const [exercisesByPhase, setExercisesByPhase] = useState<Partial<Record<PhaseId, ExerciseDef[]>>>({})

  useEffect(() => {
    let cancelled = false

    supabase
      .from('exercises')
      .select(
        'id, name, category, instructions, purpose, cue, sets, reps_target, frequency_note, equipment, contraindications, requires_load_clearance, hold_seconds, hold_reps, phase',
      )
      .eq('track', track)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error('Failed to load exercises:', error.message)
        }

        const grouped: Partial<Record<PhaseId, ExerciseDef[]>> = {}
        for (const row of data ?? []) {
          const phase = row.phase as PhaseId
          const def: ExerciseDef = {
            id: row.id,
            name: row.name,
            category: (row.category as ExerciseCategory | null) ?? null,
            sets: row.sets ?? 0,
            repsTarget: row.reps_target ?? '',
            instructions: row.instructions ?? undefined,
            purpose: row.purpose ?? undefined,
            cue: row.cue ?? undefined,
            frequencyNote: row.frequency_note ?? undefined,
            equipment: row.equipment ?? undefined,
            contraindications: row.contraindications ?? undefined,
            requiresLoadClearance: row.requires_load_clearance,
            holdSeconds: row.hold_seconds ?? undefined,
            holdReps: row.hold_reps ?? undefined,
          }
          ;(grouped[phase] ??= []).push(def)
        }
        setExercisesByPhase(grouped)
      })

    return () => {
      cancelled = true
    }
  }, [track])

  return { exercisesByPhase }
}
