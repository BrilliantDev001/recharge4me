import { useState } from 'react'
import './Accordion.css'

/**
 * Single accordion item. Manages its own open/closed state so
 * multiple FAQ items can be open simultaneously (matches mockup:
 * no evidence of single-open-at-a-time behavior).
 */
function AccordionItem({ question, answer, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`accordion-item ${isOpen ? 'accordion-item--open' : ''}`}>
      <button
        className="accordion-item__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="accordion-item__question">{question}</span>
        <span className="accordion-item__icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div className="accordion-item__panel" role="region">
        <p className="accordion-item__answer">{answer}</p>
      </div>
    </div>
  )
}

export default AccordionItem
