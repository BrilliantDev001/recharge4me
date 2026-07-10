import { Link } from 'react-router-dom'
import './BottomTabBar.css'

const TABS = [
  {
    id: 'home',
    label: 'Home',
    to: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'links',
    label: 'Links',
    to: '/recharge-link',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 15l6-6M8 12l-2 2a3.5 3.5 0 004.9 4.9l2-2M16 12l2-2a3.5 3.5 0 00-4.9-4.9l-2 2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    to: '/transactions',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4v6h6M20 20v-6h-6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 14a8 8 0 0014.9 3M19 10A8 8 0 004.1 7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    to: '/settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 11-4 0v-.2a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 110-4h.2a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.6V3a2 2 0 114 0v.2a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.6 1H21a2 2 0 110 4h-.2a1.7 1.7 0 00-1.6 1z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

function BottomTabBar({ activeTab = 'home' }) {
  return (
    <nav className="bottom-tab-bar" aria-label="Dashboard mobile navigation">
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <Link
            key={tab.id}
            to={tab.to}
            className={`bottom-tab-bar__item ${isActive ? 'bottom-tab-bar__item--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={(e) => {
              // Placeholder tabs have nowhere to go yet — keep the user
              // on the current page rather than navigating to a dead "#".
              if (tab.to === '#') e.preventDefault()
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomTabBar
