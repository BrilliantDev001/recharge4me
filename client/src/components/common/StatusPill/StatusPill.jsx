import './StatusPill.css'

const STATUS_LABELS = {
  success: 'Success',
  pending: 'Pending',
  failed: 'Failed',
}

function StatusPill({ status }) {
  return <span className={`status-pill status-pill--${status}`}>{STATUS_LABELS[status] || status}</span>
}

export default StatusPill
