import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ROM_QUESTION_DIRECTIONS } from '../lib/phases'

export interface RomPoint {
  /** session id for a session-sourced reading, `checkin-<date>` for a check-in-sourced one. */
  id: string
  date: string
  extension: number | null
  flexion: number | null
}

// Exercises can be logged several times a day, so readings are one point per
// session (not merged by date) — otherwise a second round the same day would
// silently overwrite the first in the trend. Milestone check-ins are still
// merged by date, since one check-in event is the unit there.
async function loadSessionReadings(userId: string): Promise<RomPoint[]> {
  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, date, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  const sessionList = sessions ?? []
  if (sessionList.length === 0) return []

  const { data: readings } = await supabase
    .from('rom_readings')
    .select('session_id, extension, flexion')
    .in(
      'session_id',
      sessionList.map((s) => s.id),
    )

  const bySession = new Map((readings ?? []).map((r) => [r.session_id, r]))
  const points: RomPoint[] = []
  for (const session of sessionList) {
    const reading = bySession.get(session.id)
    if (!reading || (reading.extension === null && reading.flexion === null)) continue
    points.push({ id: session.id, date: session.date, extension: reading.extension, flexion: reading.flexion })
  }
  return points
}

async function loadCheckinReadings(userId: string): Promise<RomPoint[]> {
  const byDate = new Map<string, { extension: number | null; flexion: number | null }>()

  const { data: checkins } = await supabase
    .from('milestone_checkins')
    .select('date, question_id, response')
    .eq('user_id', userId)

  for (const row of checkins ?? []) {
    const direction = ROM_QUESTION_DIRECTIONS[row.question_id]
    if (!direction) continue
    const value = Number(row.response)
    if (Number.isNaN(value)) continue
    const entry = byDate.get(row.date) ?? { extension: null, flexion: null }
    entry[direction] = value
    byDate.set(row.date, entry)
  }

  return Array.from(byDate.entries()).map(([date, value]) => ({ id: `checkin-${date}`, date, ...value }))
}

function compareDates(a: RomPoint, b: RomPoint): number {
  if (a.date < b.date) return -1
  return a.date > b.date ? 1 : 0
}

export function useRomHistory(userId: string) {
  const [points, setPoints] = useState<RomPoint[]>([])
  const [refetchIndex, setRefetchIndex] = useState(0)

  const load = useCallback(async () => {
    const [sessionPoints, checkinPoints] = await Promise.all([
      loadSessionReadings(userId),
      loadCheckinReadings(userId),
    ])
    // Array.prototype.sort is stable, so same-date ties keep sessions (already
    // chronological) ahead of that date's check-in.
    return [...sessionPoints, ...checkinPoints].sort(compareDates)
  }, [userId])

  useEffect(() => {
    let cancelled = false
    load().then((result) => {
      if (!cancelled) setPoints(result)
    })
    return () => {
      cancelled = true
    }
  }, [load, refetchIndex])

  return { points, refetch: () => setRefetchIndex((i) => i + 1) }
}
