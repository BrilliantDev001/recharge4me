import './StatCard.css'

const STAT_ICONS = {
  'trending-up': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 17l6-6 4 4 8-8M21 7v6M15 7h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mobile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 18h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  ),
  database: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" strokeWidth="1.75" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  ),
  link: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 15l6-6M8 12l-2 2a3.5 3.5 0 004.9 4.9l2-2M16 12l2-2a3.5 3.5 0 00-4.9-4.9l-2 2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  bolt: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14H11L10 22L21 9H13L13 2Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  ),
}

/**
 * Generic stat display card.
 * trend: { direction: 'up' | 'down', percent: string } — optional
 */
function StatCard({ label, value, icon, trend, footnote = 'vs last month', compact = false }) {
  const iconNode = typeof icon === 'string' ? STAT_ICONS[icon] : icon

  return (
    <div className={`stat-card ${compact ? 'stat-card--compact' : ''}`}>
      <div className="stat-card__top">
        <p className="stat-card__label">{label}</p>
        {iconNode && <span className="stat-card__icon">{iconNode}</span>}
      </div>
      <p className="stat-card__value">{value}</p>
      {trend && (
        <p className={`stat-card__trend stat-card__trend--${trend.direction}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            {trend.direction === 'up' ? (
              <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
          {trend.percent} <span className="stat-card__footnote">{footnote}</span>
        </p>
      )}
    </div>
  )
}

export default StatCard
