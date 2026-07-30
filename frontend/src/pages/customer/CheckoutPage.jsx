import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, Package, CheckCircle } from 'lucide-react'
import { addressApi } from '../../api/addressApi'
import { orderApi } from '../../api/orderApi'
import { useAuthStore, selectUser } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { toast } from '../../store/toastStore'
import { formatCurrency } from '../../utils/formatters'
import { PageSpinner } from '../../components/ui/Spinner'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const user = useAuthStore(selectUser)
  const { cart, clearCart } = useCartStore()
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const cartItems = cart?.cartItems || []
  const total = cartItems.reduce(
    (s, i) => s + (i.productVariant?.price || 0) * i.quantity, 0
  )

  useEffect(() => {
    if (!user) return
    addressApi
      .getByUser(user.id)
      .then((r) => {
        const list = r.data || []
        setAddresses(list)
        const def = list.find((a) => a.isDefault) || list[0]
        if (def) setSelectedAddressId(def.id)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.warning('Vui lòng chọn địa chỉ giao hàng')
      return
    }
    if (cartItems.length === 0) {
      toast.warning('Giỏ hàng của bạn đang trống')
      return
    }
    setSubmitting(true)
    try {
      await orderApi.checkout({ userId: user.id, addressId: selectedAddressId })
      clearCart()
      setSuccess(true)
      toast.success('Đặt hàng thành công! Cảm ơn bạn!')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="page-wrapper"><PageSpinner /></div>

  if (success) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
          <div style={{ fontSize: '5rem', marginBottom: 'var(--space-lg)' }}>🎉</div>
          <CheckCircle size={60} color="var(--success)" style={{ margin: '0 auto var(--space-lg)' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
            Đặt hàng thành công!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
            Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => navigate('/orders')}>
              <Package size={16} />
              Xem đơn hàng
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/products')}>
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <h1 className="section-title">Thanh toán</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-xl)', alignItems: 'flex-start' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            {/* Address selection */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-glass-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-xl)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={18} color="var(--brand-primary)" />
                  Địa chỉ giao hàng
                </h2>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate('/addresses')}
                >
                  Quản lý địa chỉ
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
                  <p className="empty-state-title">Chưa có địa chỉ nào</p>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/addresses')}
                  >
                    Thêm địa chỉ ngay
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 'var(--space-md)',
                        padding: 'var(--space-lg)',
                        borderRadius: 'var(--radius-lg)',
                        border: `2px solid ${selectedAddressId === addr.id ? 'var(--brand-primary)' : 'var(--bg-glass-border)'}`,
                        background: selectedAddressId === addr.id ? 'rgba(99,102,241,0.08)' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        style={{ marginTop: 2, accentColor: 'var(--brand-primary)' }}
                      />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {addr.detailAddress}
                          {addr.isDefault && (
                            <span className="badge badge-success" style={{ marginLeft: 8, fontSize: '0.7rem' }}>
                              Mặc định
                            </span>
                          )}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                          {addr.ward?.name}, {addr.province?.name}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment method */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-glass-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-xl)',
              }}
            >
              <h2 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}>
                <CreditCard size={18} color="var(--brand-primary)" />
                Phương thức thanh toán
              </h2>
              <div
                style={{
                  padding: 'var(--space-lg)',
                  background: 'rgba(16,185,129,0.08)',
                  border: '2px solid var(--success)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>💵</span>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--success)' }}>Thanh toán khi nhận hàng (COD)</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Bạn thanh toán khi nhận được hàng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right – Order Summary */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--bg-glass-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-xl)',
              position: 'sticky',
              top: 'calc(var(--header-height) + 24px)',
            }}
          >
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
              Tóm tắt đơn hàng
            </h2>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}
                >
                  <span style={{ color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
                    {item.productVariant?.productName || `Sản phẩm #${item.productVariant?.id}`}
                    {' '}× {item.quantity}
                  </span>
                  <span style={{ fontWeight: 600, flexShrink: 0 }}>
                    {formatCurrency((item.productVariant?.price || 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Phí vận chuyển:</span>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>Miễn phí</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
              <span style={{ fontWeight: 700 }}>Tổng cộng:</span>
              <span
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {formatCurrency(total)}
              </span>
            </div>

            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={handleCheckout}
              disabled={submitting || !selectedAddressId || cartItems.length === 0}
              id="place-order-btn"
            >
              {submitting ? 'Đang xử lý...' : '🛒 Đặt hàng ngay'}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-md)' }}>
              Bằng cách đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
