/**
 * TabBar
 *
 * Fixed bottom navigation bar: Stats / Quests / Map / Log / Settings
 */
import { useAppState } from '../../context/AppContext'

const TABS = [
  { id: 'home',    icon: '◈', label: 'HOME'    },
  { id: 'quests',  icon: '⚔', label: 'QUESTS'  },
  { id: 'map',     icon: '🗺', label: 'MAP'     },
  { id: 'profile', icon: '◇', label: 'PROFILE' },
  { id: 'config',  icon: '⚙', label: 'CONFIG'  },
]

export default function TabBar({ onTabChange }) {
  const { activeTab } = useAppState()

  return (
    <nav className="tab-bar" role="tablist">
      {TABS.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-btn-icon">{tab.icon}</span>
          <span className="tab-btn-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
