import { useEffect } from 'react'
import Button from '../Button/Button.jsx'
import './ConfirmDialog.css'

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isProcessing = false,
  onConfirm,
  onCancel,
}) {
  // Close on Escape for keyboard accessibility.
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="confirm-dialog__overlay" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        {isDestructive && (
          <span className="confirm-dialog__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M10.3 3.9L2.5 17a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h2>
        <p className="confirm-dialog__description">{description}</p>
        <div className="confirm-dialog__actions">
          <Button variant="outline" size="md" onClick={onCancel} disabled={isProcessing}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'primary' : 'secondary'}
            size="md"
            onClick={onConfirm}
            disabled={isProcessing}
            className={isDestructive ? 'confirm-dialog__destructive-btn' : ''}
          >
            {isProcessing ? 'Please wait…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
