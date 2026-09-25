import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import './ConfirmModal.css'

interface ConfirmModalProps {
  title: string
  body: string
  confirmLabel: string
  cancelLabel?: string
  /** Label shown on the confirm button while `confirming` is true. */
  confirmingLabel?: string
  destructive?: boolean
  confirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  body,
  confirmLabel,
  cancelLabel = 'Cancel',
  confirmingLabel = 'Working…',
  destructive,
  confirming,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <motion.div
      className="confirm-modal-backdrop"
      onClick={onCancel}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.95) translateY(8px)' }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1) translateY(0px)' }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.95) translateY(8px)' }}
        transition={{ type: 'spring', duration: 0.35, bounce: 0.12 }}
      >
        <h2 id="confirm-modal-title">{title}</h2>
        <p>{body}</p>
        <div className="confirm-modal-actions">
          <button type="button" className="confirm-modal-cancel" onClick={onCancel} disabled={confirming}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-modal-confirm${destructive ? ' destructive' : ''}`}
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? confirmingLabel : confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
