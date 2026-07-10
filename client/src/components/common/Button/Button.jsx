import './Button.css'

/**
 * Shared Button component.
 * variant: 'primary' | 'secondary' | 'outline' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  iconPosition = 'right',
  as: Component = 'button',
  disabled = false,
  className = '',
  ...rest
}) {
  const classNames = `btn btn--${variant} btn--${size} ${className}`.trim()

  return (
    <Component className={classNames} disabled={disabled} {...rest}>
      {icon && iconPosition === 'left' && <span className="btn__icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="btn__icon">{icon}</span>}
    </Component>
  )
}

export default Button
