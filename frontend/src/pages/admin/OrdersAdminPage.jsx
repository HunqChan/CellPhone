import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { orderApi } from '../../api/orderApi'
import { toast } from '../../store/toastStore'
import { formatCurrency, formatDate, getOrderStatusInfo } from '../../utils/formatters'
import { PageSpinner } from '../../components/ui/Spinner'

const STATUS_TRANSITIONS = {
  PENDING_CONFIRMATION: ['CONFIRMED', 'CANCELED'],
  CONFIRMED: ['SHIPPING'],
  SHIPPING: ['DELIVERED'],
  DELIVERED: [],
  CANCELED: [],
}

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    orderApi.getAll()
      .then((r) => setOrders((r.data || []).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = async (orderId, status) => {
    setUpdating(orderId)
    try {
      const res = await orderApi.updateStatus(orderId, status)
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)))
      toast.success(`Cập nhật trạng thái → ${getOrderStatusInfo(status).label}`)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản lý đơn hàng</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{orders.length} đơn hàng</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Mã ĐH</th>
              <th>Khách hàng</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Cập nhật</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusInfo = getOrderStatusInfo(order.status)
              const nextStatuses = STATUS_TRANSITIONS[order.status] || []
              const isExpanded = expandedId === order.id
              return (
                <>
                  <tr key={order.id}>
                    <td style={{ fontWeight: 700 }}>#{order.id}</td>
                    <td>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order.user?.fullName || '—'}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email}</p>
                      </div>
                    </td>
                    <td style={{ maxWidth: 200, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {order.shippingAddress || '—'}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {formatDate(order.orderDate)}
                    </td>
                    <td>
                      {nextStatuses.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {nextStatuses.map((s) => {
                            const si = getOrderStatusInfo(s)
                            return (
                              <button
                                key={s}
                                className={`btn btn-sm ${s === 'CANCELED' ? 'btn-danger' : 'btn-success'}`}
                                onClick={() => handleStatusUpdate(order.id, s)}
                                disabled={updating === order.id}
                                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                              >
                                {updating === order.id ? '...' : `→ ${si.label}`}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm btn-icon"
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        title="Chi tiết"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${order.id}-detail`}>
                      <td colSpan={8} style={{ padding: 0 }}>
                        <div
                          style={{
                            padding: 'var(--space-md) var(--space-xl)',
                            background: 'var(--bg-surface)',
                            borderTop: '1px solid var(--bg-glass-border)',
                          }}
                        >
                          <p style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: 8, color: 'var(--text-secondary)' }}>
                            CHI TIẾT ĐƠN HÀNG
                          </p>
                          {(order.orderItems || []).map((item) => (
                            <div
                              key={item.id}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.875rem',
                                padding: '4px 0',
                              }}
                            >
                              <span>Variant #{item.productVariant?.id} × {item.quantity}</span>
                              <span style={{ fontWeight: 600 }}>
                                {formatCurrency((item.productVariant?.price || 0) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
