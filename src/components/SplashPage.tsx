import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AuthForm } from './AuthForm'
import './SplashPage.css'

// Mirrors --ease-out in index.css — Motion needs the numeric curve, not the CSS var.
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

const ENTRANCE_MS = 600
const HOLD_MS = 550

export function SplashPage() {
  const [showAuth, setShowAuth] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const delay = reduceMotion ? 300 : ENTRANCE_MS + HOLD_MS
    const timer = setTimeout(() => setShowAuth(true), delay)
    return () => clearTimeout(timer)
  }, [reduceMotion])

  return (
    <div className="splash-page">
      <AnimatePresence mode="wait">
        {showAuth ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0, transform: `translateY(${reduceMotion ? 0 : 16}px)` }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <AuthForm />
          </motion.div>
        ) : (
          <motion.h1
            key="wordmark"
            className="splash-wordmark"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, filter: 'blur(8px)', transform: 'translateY(8px)' }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0px)' }
            }
            exit={{ opacity: 0, transition: { duration: 0.25, ease: EASE_OUT } }}
            transition={{ duration: reduceMotion ? 0.2 : ENTRANCE_MS / 1000, ease: EASE_OUT }}
          >
            Cruciate
          </motion.h1>
        )}
      </AnimatePresence>
    </div>
  )
}
