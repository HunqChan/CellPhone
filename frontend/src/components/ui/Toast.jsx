import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const COLORS = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
}

export default function Toast() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || Info
        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <Icon size={18} color={COLORS[t.type]} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '0.875rem' }}>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              style={{ color: 'var(--text-muted)', flexShrink: 0 }}
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
