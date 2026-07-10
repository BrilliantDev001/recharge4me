import { useId } from 'react'
import './Switch.css'

function Switch({ checked, onChange, label, id, ...rest }) {
  const generatedId = useId()
  const switchId = id || generatedId

  return (
    <label htmlFor={switchId} className="switch">
      {label && <span className="sr-only">{label}</span>}
      <input
        id={switchId}
        type="checkbox"
        role="switch"
        className="switch__input"
        checked={checked}
        onChange={onChange}
        {...rest}
      />
      <span className="switch__track" aria-hidden="true">
        <span className="switch__thumb" />
      </span>
    </label>
  )
}

export default Switch
