import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface RomPoint {
  date: string
  extension: number | null
  flexion: number | null
}

export function useRomHistory(userId: string) {
  const [points, setPoints] = useState<RomPoint[]>([])
  const [refetchIndex, setRefetchIndex] = useState(0)

  const load = useCallback(async () => {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, date')
      .eq('user_id', userId)
      .order('date', { ascending: true })

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

    return sessionList.reduce<RomPoint[]>((acc, s) => {
      const reading = bySession.get(s.id)
      if (reading) acc.push({ date: s.date, extension: reading.extension, flexion: reading.flexion })
      return acc
    }, [])
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
