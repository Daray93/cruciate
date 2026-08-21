import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Theme } from '../hooks/useTheme'
import { IconDotsHorizontal, IconMoon, IconSun } from './icons'
import './OverflowMenu.css'

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1]

interface OverflowMenuProps {
  theme: Theme
  onToggleTheme: () => void
  onSignOut: () => void
}

export function OverflowMenu({ theme, onToggleTheme, onSignOut }: OverflowMenuProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const reduceMotion = useReducedMotion()
  const isDark = theme === 'dark'

  function close(returnFocus: boolean) {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    itemRefs.current[0]?.focus()

    function handlePointerDown(e: MouseEvent) {
      if (!(e.target instanceof Node)) return
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  function handleKeyDown(e: React.KeyboardEvent) {
    const items = itemRefs.current.filter((el): el is HTMLButtonElement => el !== null)
    const currentIndex = items.findIndex((el) => el === document.activeElement)

    if (e.key === 'Escape') {
      e.preventDefault()
      close(true)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      items[(currentIndex + 1) % items.length]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      items[(currentIndex - 1 + items.length) % items.length]?.focus()
    }
  }

  return (
    <div className="overflow-menu" ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className="overflow-menu-trigger"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? close(false) : setOpen(true))}
      >
        <IconDotsHorizontal />
      </button>

      {open && (
        <motion.div
          className="overflow-menu-dropdown"
          role="menu"
          aria-label="More options"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.94) translateY(-4px)' }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'scale(1) translateY(0px)' }}
          transition={{ duration: 0.16, ease: EASE_OUT }}
          style={{ transformOrigin: 'top right' }}
          onKeyDown={handleKeyDown}
        >
          <button
            type="button"
            role="menuitem"
            ref={(el) => {
              itemRefs.current[0] = el
            }}
            className="overflow-menu-item"
            onClick={() => {
              onToggleTheme()
              close(true)
            }}
          >
            {isDark ? <IconSun /> : <IconMoon />}
            {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          </button>
          <button
            type="button"
            role="menuitem"
            ref={(el) => {
              itemRefs.current[1] = el
            }}
            className="overflow-menu-item overflow-menu-item-danger"
            onClick={() => {
              close(false)
              onSignOut()
            }}
          >
            Sign out
          </button>
        </motion.div>
      )}
    </div>
  )
}
