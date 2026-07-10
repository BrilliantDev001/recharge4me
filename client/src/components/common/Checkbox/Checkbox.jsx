import { useId } from 'react'
import './Checkbox.css'

function Checkbox({ label, checked, onChange, id, ...rest }) {
  const generatedId = useId()
  const checkboxId = id || generatedId

  return (
    <label htmlFor={checkboxId} className="checkbox">
      <input
        id={checkboxId}
        type="checkbox"
        className="checkbox__input"
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      <span className="checkbox__box" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8l3.5 3.5L13 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  )
}

export default Checkbox
