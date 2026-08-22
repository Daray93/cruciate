import { IconGear, IconHome, IconLayers, IconTrendingUp } from './icons'
import './BottomTabBar.css'

export type MainTab = 'home' | 'phases' | 'progress' | 'settings'

interface BottomTabBarProps {
  active: MainTab
  onSelect: (tab: MainTab) => void
}

const TABS: { id: MainTab; label: string; Icon: typeof IconHome }[] = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'phases', label: 'Phases', Icon: IconLayers },
  { id: 'progress', label: 'Progress', Icon: IconTrendingUp },
  { id: 'settings', label: 'Settings', Icon: IconGear },
]

export function BottomTabBar({ active, onSelect }: BottomTabBarProps) {
  return (
    <nav className="bottom-tab-bar" aria-label="Main">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`bottom-tab${active === id ? ' active' : ''}`}
          aria-current={active === id ? 'page' : undefined}
          onClick={() => onSelect(id)}
        >
          <Icon className="bottom-tab-icon" />
          <span className="bottom-tab-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
