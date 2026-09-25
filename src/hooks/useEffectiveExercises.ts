import { useMemo } from 'react'
import { useExercisePrefs } from './useExercisePrefs'
import { useExercises } from './useExercises'
import { useExercisesByTrack } from './useExercisesByTrack'
import type { PhaseId, Track } from '../lib/phases'
import type { ExerciseDef } from '../types'

/** A phase's exercise list after applying the user's hide/add preferences —
 * native exercises minus hidden ones, plus anything manually added in from
 * another phase. Shared by the live checklist and the backfill panel, since
 * both should respect the same standing preferences for a phase.
 *
 * Memoized: downstream hooks (useExerciseLogs) depend on `exercises` by
 * reference, so a fresh array every render would re-fire their effects in a
 * loop. */
export function useEffectiveExercises(userId: string, track: Track, phase: PhaseId) {
  const { exercises: phaseExercises } = useExercises(track, phase)
  const { exercisesByPhase } = useExercisesByTrack(track)
  const { prefs, hideExercise, addExercise } = useExercisePrefs(userId)

  return useMemo(() => {
    const hiddenIds = new Set(prefs.filter((p) => p.hidden).map((p) => p.exerciseId))
    const addedIds = new Set(prefs.filter((p) => !p.hidden).map((p) => p.exerciseId))

    const allExercisesById = new Map<string, ExerciseDef>()
    for (const list of Object.values(exercisesByPhase)) {
      for (const exercise of list ?? []) allExercisesById.set(exercise.id, exercise)
    }

    const addedExtra = [...addedIds]
      .map((id) => allExercisesById.get(id))
      .filter((e): e is ExerciseDef => e !== undefined && !phaseExercises.some((pe) => pe.id === e.id))

    const exercises = [...phaseExercises.filter((e) => !hiddenIds.has(e.id)), ...addedExtra]
    const hiddenExercises = phaseExercises.filter((e) => hiddenIds.has(e.id))

    return { exercises, hiddenExercises, exercisesByPhase, addedIds, hideExercise, addExercise }
  }, [phaseExercises, exercisesByPhase, prefs, hideExercise, addExercise])
}
