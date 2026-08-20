import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { RomEntry } from '../types'

const EMPTY: RomEntry = { extension: '', flexion: '' }

export function useRomReading(sessionId: string | null) {
  const [reading, setReading] = useState<RomEntry>(EMPTY)

  useEffect(() => {
    let cancelled = false
    const fetcher = sessionId
      ? supabase.from('rom_readings').select('extension, flexion').eq('session_id', sessionId).maybeSingle()
      : Promise.resolve({ data: null as { extension: number | null; flexion: number | null } | null })

    fetcher.then(({ data }) => {
      if (cancelled) return
      setReading({
        extension: data?.extension !== null && data?.extension !== undefined ? String(data.extension) : '',
        flexion: data?.flexion !== null && data?.flexion !== undefined ? String(data.flexion) : '',
      })
    })

    return () => {
      cancelled = true
    }
  }, [sessionId])

  return { reading, setReading }
}
