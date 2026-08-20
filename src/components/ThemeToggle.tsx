import type { Theme } from '../hooks/useTheme'
import { IconMoon, IconSun } from './icons'
import './ThemeToggle.css'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <IconMoon className="theme-toggle-icon" /> : <IconSun className="theme-toggle-icon" />}
    </button>
  )
}
