import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { IconCheck } from './icons'
import './SessionDetail.css'

interface ExerciseRow {
  name: string
  done: boolean
  weight: number | null
  reps: number | null
  rpe: number | null
}

interface RomRow {
  extension: number | null
  flexion: number | null
}

export function SessionDetail({ sessionId }: { sessionId: string }) {
  const [exercises, setExercises] = useState<ExerciseRow[] | null>(null)
  const [rom, setRom] = useState<RomRow | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      supabase.from('exercises_logged').select('name, done, weight, reps, rpe').eq('session_id', sessionId),
      supabase.from('rom_readings').select('extension, flexion').eq('session_id', sessionId).maybeSingle(),
    ]).then(([exercisesResult, romResult]) => {
      if (cancelled) return
      setExercises(exercisesResult.data ?? [])
      setRom(romResult.data)
    })
    return () => {
      cancelled = true
    }
  }, [sessionId])

  if (!exercises) {
    return <p className="session-detail-loading">Loading…</p>
  }

  return (
    <div className="session-detail">
      {rom && (rom.extension !== null || rom.flexion !== null) && (
        <p className="session-detail-rom">
          ROM: {rom.extension ?? '-'}° extension / {rom.flexion ?? '-'}° flexion
        </p>
      )}
      {exercises.length === 0 ? (
        <p className="session-detail-empty">No exercises logged.</p>
      ) : (
        <ul className="session-detail-list">
          {exercises.map((exercise) => (
            <li key={exercise.name}>
              <span className={exercise.done ? 'session-detail-done' : 'session-detail-not-done'}>
                {exercise.done ? <IconCheck className="session-detail-check" /> : '-'}
              </span>
              {exercise.name}
              {exercise.weight !== null && ` · ${exercise.weight}kg`}
              {exercise.reps !== null && ` · ${exercise.reps} reps`}
              {exercise.rpe !== null && ` · RPE ${exercise.rpe}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
