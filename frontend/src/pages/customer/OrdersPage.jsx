import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, ChevronRight, X, Clock } from 'lucide-react'
import { orderApi } from '../../api/orderApi'
import { useAuthStore, selectUser } from '../../store/authStore'
import { toast } from '../../store/toastStore'
import { formatCurrency, formatDate, getOrderStatusInfo } from '../../utils/formatters'
import { PageSpinner } from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'

export default function OrdersPage() {
  const navigate = useNavigate()
  const user = useAuthStore(selectUser)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState({ open: false, orderId: null })
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    if (!user) return
    orderApi
      .getByUser(user.id)
      .then((r) => setOrders(r.data || []))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [user])

  const handleCancelConfirm = async () => {
    setCanceling(true)
    try {
      const res = await orderApi.cancel(cancelModal.orderId)
      setOrders((prev) =>
        prev.map((o) => (o.id === cancelModal.orderId ? res.data : o))
      )
      toast.success('Đã hủy đơn hàng thành công')
      setCancelModal({ open: false, orderId: null })
    } catch (e) {
      toast.error(e.message)
    } finally {
      setCanceling(false)
    }
  }

  if (loading) return <div className="page-wrapper"><PageSpinner /></div>

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <h1 className="section-title">Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Package size={36} /></div>
            <p className="empty-state-title">Chưa có đơn hàng nào</p>
            <p className="empty-state-desc">Bắt đầu mua sắm để tạo đơn hàng đầu tiên</p>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {orders.map((order) => {
              const statusInfo = getOrderStatusInfo(order.status)
              const canCancel = order.status === 'PENDING_CONFIRMATION'
              return (
                <div
                  key={order.id}
                  className="card"
                  style={{ padding: 'var(--space-xl)', cursor: 'pointer' }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  {/* Order header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          Đơn hàng #{order.id}
                        </span>
                        <span className={`status-badge status-${order.status}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          marginTop: 4,
                        }}
                      >
                        <Clock size={12} />
                        {formatDate(order.orderDate)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                      {canCancel && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCancelModal({ open: true, orderId: order.id })
                          }}
                        >
                          <X size={14} />
                          Hủy đơn
                        </button>
                      )}
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </div>
                  </div>

                  {/* Items preview */}
                  <div
                    style={{
                      padding: 'var(--space-md)',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    {(order.orderItems || []).slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.875rem',
                          padding: '4px 0',
                        }}
                      >
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {item.productVariant?.productName || `Variant #${item.productVariant?.id}`}
                          {(item.productVariant?.attributes || []).length > 0 && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                              {' '}({item.productVariant.attributes.map(a => a.value).join('/')})
                            </span>
                          )}
                          {' '}× {item.quantity}
                        </span>
                        <span style={{ fontWeight: 600 }}>
                          {formatCurrency((item.price || item.productVariant?.price || 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {order.orderItems?.length > 2 && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        +{order.orderItems.length - 2} sản phẩm khác
                      </p>
                    )}
                  </div>

                  {/* Total */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginRight: 8 }}>
                      Tổng tiền:
                    </span>
                    <span
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        background: 'var(--brand-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Cancel Confirm Modal */}
        <Modal
          isOpen={cancelModal.open}
          onClose={() => setCancelModal({ open: false, orderId: null })}
          title="Xác nhận hủy đơn hàng"
        >
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Bạn có chắc chắn muốn hủy đơn hàng #{cancelModal.orderId}? Hành động này không thể hoàn tác.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setCancelModal({ open: false, orderId: null })}
            >
              Không, giữ đơn
            </button>
            <button
              className="btn btn-danger"
              onClick={handleCancelConfirm}
              disabled={canceling}
              id="confirm-cancel-btn"
            >
              {canceling ? 'Đang hủy...' : 'Xác nhận hủy'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
