import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IconAlertCircle } from './icons'
import './Toast.css'

interface ToastProps {
  message: string | null
  onDismiss: () => void
  durationMs?: number
}

/** Top-anchored, self-dismissing message for a quick "you can't do that yet" nudge. */
export function Toast({ message, onDismiss, durationMs = 2600 }: ToastProps) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, durationMs)
    return () => clearTimeout(timer)
  }, [message, durationMs, onDismiss])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="toast"
          role="status"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translate(-50%, -12px)' }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'translate(-50%, 0px)' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translate(-50%, -12px)' }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
        >
          <IconAlertCircle className="toast-icon" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
