import { X, Trash2, ShoppingBag, Minus, Plus } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore, selectUser } from '../../store/authStore'
import { cartApi } from '../../api/cartApi'
import { toast } from '../../store/toastStore'
import { formatCurrency, getProductImage } from '../../utils/formatters'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer() {
  const navigate = useNavigate()
  const { isOpen, closeCart, cart, getItemCount, getTotalPrice, setCart } = useCartStore()
  const user = useAuthStore(selectUser)

  if (!isOpen) return null

  const items = cart?.cartItems || []
  const totalPrice = getTotalPrice()

  const handleAddMore = async (variantId, currentQty) => {
    if (!user) return
    try {
      const res = await cartApi.addToCart(user.id, { productVariantId: variantId, quantity: 1 })
      setCart(res.data)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <>
      <div className="drawer-overlay" onClick={closeCart} />
      <aside className="drawer">
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--brand-primary)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Giỏ hàng ({getItemCount()} sản phẩm)
            </h2>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={closeCart} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <ShoppingBag size={36} />
              </div>
              <p className="empty-state-title">Giỏ hàng trống</p>
              <p className="empty-state-desc">Thêm sản phẩm vào giỏ để bắt đầu mua sắm</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { navigate('/products'); closeCart() }}
              >
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  userId={user?.id}
                  onAdd={() => handleAddMore(item.productVariant?.id, item.quantity)}
                  onCartUpdate={setCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="drawer-footer">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-md)',
              }}
            >
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Tổng tiền:</span>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  background: 'var(--brand-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

function CartItemCard({ item, userId, onAdd, onCartUpdate }) {
  const { productVariant } = item
  // productVariant giờ có productName, productBrand, attributes (sau khi fix backend)
  const productName = productVariant?.productName || `Sản phẩm #${productVariant?.id}`
  const attrLabel = (productVariant?.attributes || []).map((a) => a.value).join(' / ')

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--bg-glass-border)',
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: 64,
          height: 64,
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {productVariant?.productImage ? (
          <img
            src={getProductImage(productVariant.productImage)}
            alt={productName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}
        <span style={{ fontSize: '1.5rem', display: productVariant?.productImage ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>📱</span>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {productName}
        </p>
        {attrLabel && (
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>
            {attrLabel}
          </p>
        )}
        <p style={{ fontSize: '0.875rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
          {formatCurrency(productVariant?.price)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <button
            className="btn btn-secondary btn-icon"
            onClick={onAdd}
            style={{ padding: '4px', width: 28, height: 28 }}
            title="Thêm 1"
          >
            <Plus size={14} />
          </button>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, minWidth: 24, textAlign: 'center' }}>
            {item.quantity}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            × {formatCurrency(productVariant?.price)}
          </span>
        </div>
      </div>
    </div>
  )
}
