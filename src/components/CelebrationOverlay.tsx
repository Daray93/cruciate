import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IconCheck } from './icons'
import './CelebrationOverlay.css'

interface CelebrationOverlayProps {
  show: boolean
  reactions: string[]
  durationMs?: number
  onDone: () => void
}

/** Loud, full-card "done!" moment — picks a random reaction and auto-dismisses.
 * Renders as `position: absolute; inset: 0`, so the parent needs `position: relative`. */
export function CelebrationOverlay({ show, reactions, durationMs = 1400, onDone }: CelebrationOverlayProps) {
  const [message, setMessage] = useState('')
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!show) return
    setMessage(reactions[Math.floor(Math.random() * reactions.length)])
    const timer = setTimeout(onDone, durationMs)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="celebration-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="celebration-overlay-card"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.7)' }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1)' }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.55 }}
          >
            <IconCheck className="celebration-overlay-icon" />
            <span>{message}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
