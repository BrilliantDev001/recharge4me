import { useState } from 'react'
import './ExpandableRow.css'

function ExpandableRow({ icon, iconBg, title, subtitle, trailingText, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`expandable-row ${isOpen ? 'expandable-row--open' : ''}`}>
      <button
        type="button"
        className="expandable-row__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="expandable-row__icon" style={{ backgroundColor: iconBg }}>
          {icon}
        </span>
        <span className="expandable-row__text">
          <span className="expandable-row__title">{title}</span>
          <span className="expandable-row__subtitle">{subtitle}</span>
        </span>
        {trailingText && <span className="expandable-row__trailing">{trailingText}</span>}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="expandable-row__chevron"
        >
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="expandable-row__panel">
        <div className="expandable-row__panel-inner">{children}</div>
      </div>
    </div>
  )
}

export default ExpandableRow
