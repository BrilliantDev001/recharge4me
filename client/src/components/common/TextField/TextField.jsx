import { useId, useState } from 'react'
import './TextField.css'

/**
 * Shared form input.
 * type: 'text' | 'email' | 'password' | 'tel' etc.
 * icon: left-aligned icon node
 * error: error message string (shows red state + message when present)
 * isPassword: adds a working show/hide toggle, overrides `type`
 */
function TextField({
  label,
  icon,
  error,
  isPassword = false,
  type = 'text',
  id,
  ...rest
}) {
  const generatedId = useId()
  const fieldId = id || generatedId
  const [showPassword, setShowPassword] = useState(false)

  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="text-field">
      {label && (
        <label htmlFor={fieldId} className="text-field__label">
          {label}
        </label>
      )}
      <div className={`text-field__control ${error ? 'text-field__control--error' : ''}`}>
        {icon && <span className="text-field__icon">{icon}</span>}
        <input id={fieldId} type={resolvedType} className="text-field__input" {...rest} />
        {isPassword && (
          <button
            type="button"
            className="text-field__toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.5 5.2A10.6 10.6 0 0112 5c5 0 9 4 10 7-.4 1.1-1.1 2.3-2.1 3.4M6.6 6.6C4.6 8 3.2 10 2 12c1 3 5 7 10 7 1.4 0 2.7-.3 3.9-.8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default TextField
