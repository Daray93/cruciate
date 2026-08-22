import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useLoadClearance(userId: string) {
  const [loadCleared, setLoadClearedState] = useState(false)

  useEffect(() => {
    supabase
      .from('clearance')
      .select('load_cleared')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => setLoadClearedState(data?.load_cleared ?? false))
  }, [userId])

  async function setLoadCleared(checked: boolean) {
    setLoadClearedState(checked)
    await supabase.from('clearance').upsert({ user_id: userId, load_cleared: checked })
  }

  return { loadCleared, setLoadCleared }
}
