import { useEffect, useRef } from 'react'

/** Keeps the screen awake while `active` is true — so a hold timer or rest
 * period doesn't get cut short by the phone locking mid-exercise. Silently
 * does nothing if the browser doesn't support the Wake Lock API, or if the
 * request is refused (e.g. low battery). */
export function useWakeLock(active: boolean) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return

    let cancelled = false

    async function requestLock() {
      try {
        const sentinel = await navigator.wakeLock.request('screen')
        if (cancelled) {
          void sentinel.release()
          return
        }
        sentinelRef.current = sentinel
      } catch {
        // Refused or unsupported in this context — not worth surfacing to the user.
      }
    }

    void requestLock()

    // The lock is released automatically when the tab is backgrounded, so
    // re-request it once the user comes back.
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && !sentinelRef.current) {
        void requestLock()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      void sentinelRef.current?.release()
      sentinelRef.current = null
    }
  }, [active])
}
