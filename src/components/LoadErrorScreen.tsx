import { useEffect } from 'react'
import { Alert } from './Alert'
import './LoadErrorScreen.css'

interface LoadErrorScreenProps {
  onRetry: () => void
}

export function LoadErrorScreen({ onRetry }: LoadErrorScreenProps) {
  // Most failures here are a phone that hasn't found its connection yet,
  // so try again on our own as soon as it comes back.
  useEffect(() => {
    window.addEventListener('online', onRetry)
    return () => window.removeEventListener('online', onRetry)
  }, [onRetry])

  return (
    <main className="load-error-screen">
      <h1>Couldn't load your account</h1>
      <Alert variant="error">Your data is safe. We just couldn't reach it. Check your connection and try again.</Alert>
      <button type="button" className="load-error-retry" onClick={onRetry}>
        Try again
      </button>
    </main>
  )
}
