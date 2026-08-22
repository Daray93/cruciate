import { useEffect, useRef, useState } from 'react'

interface HoldTimerBadgeProps {
  seconds: number
}

/** Tap to start a countdown for a held exercise (a stretch, a balance hold, a
 * sustained quad set) — shows "Done!" briefly at zero, then resets. */
export function HoldTimerBadge({ seconds }: HoldTimerBadgeProps) {
  const [remaining, setRemaining] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    }
  }, [])

  function start() {
    if (remaining !== null) return
    setRemaining(seconds)
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          resetTimeoutRef.current = setTimeout(() => setRemaining(null), 1200)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const label = seconds >= 60 ? `${Math.round(seconds / 60)} min` : `${seconds}s`
  const running = remaining !== null

  return (
    <button
      type="button"
      className={`exercise-row-timer${running ? ' running' : ''}`}
      onClick={start}
      disabled={running}
    >
      {remaining === 0 ? 'Done!' : running ? `${remaining}s` : `⏱ ${label}`}
    </button>
  )
}
