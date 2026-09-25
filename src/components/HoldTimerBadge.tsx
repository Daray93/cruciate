import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { IconX } from './icons'

interface HoldTimerBadgeProps {
  seconds: number
  /** Called once when the countdown reaches zero (not on cancel). */
  onComplete?: () => void
}

/** Tap to start a countdown for a held exercise (a stretch, a balance hold, a
 * sustained quad set). Tap again while it's running to cancel it. Shows
 * "Done!" briefly at zero, then resets. */
export function HoldTimerBadge({ seconds, onComplete }: HoldTimerBadgeProps) {
  const [remaining, setRemaining] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Latest onComplete, so a hold that finishes counts from the current
  // progress, not whatever it was when the timer was started.
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    }
  }, [])

  function clearTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current)
    intervalRef.current = null
    resetTimeoutRef.current = null
  }

  function start() {
    clearTimers()
    // Count down against the clock rather than ticks, so a throttled
    // interval (screen dimmed, tab in background) doesn't stretch the hold.
    const endsAt = Date.now() + seconds * 1000
    setRemaining(seconds)
    intervalRef.current = setInterval(() => {
      const left = Math.ceil((endsAt - Date.now()) / 1000)
      if (left > 0) {
        setRemaining(left)
        return
      }
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = null
      setRemaining(0)
      resetTimeoutRef.current = setTimeout(() => setRemaining(null), 1200)
      onCompleteRef.current?.()
    }, 250)
  }

  function cancel() {
    clearTimers()
    setRemaining(null)
  }

  const label = seconds >= 60 ? `${Math.round(seconds / 60)} min` : `${seconds}s`
  const running = remaining !== null && remaining > 0
  const done = remaining === 0

  let content: ReactNode = `⏱ ${label}`
  if (done) content = 'Done!'
  else if (running) {
    content = (
      <>
        {remaining}s
        <IconX className="exercise-row-timer-cancel" />
      </>
    )
  }

  return (
    <button
      type="button"
      className={`exercise-row-timer${running ? ' running' : ''}`}
      onPointerDownCapture={(e) => e.stopPropagation()}
      onClick={running ? cancel : start}
      disabled={done}
      aria-label={running ? `Cancel ${label} timer` : `Start ${label} timer`}
    >
      {content}
    </button>
  )
}
