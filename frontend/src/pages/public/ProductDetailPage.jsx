import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Package, ChevronLeft, Tag, CheckCircle } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { cartApi } from '../../api/cartApi'
import { useAuthStore, selectIsAuthenticated, selectUser, selectIsCustomer } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { toast } from '../../store/toastStore'
import { formatCurrency, getProductImage } from '../../utils/formatters'
import { PageSpinner } from '../../components/ui/Spinner'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isCustomer = useAuthStore(selectIsCustomer)
  const user = useAuthStore(selectUser)
  const { setCart, openCart } = useCartStore()

  useEffect(() => {
    productApi.getById(id)
      .then((r) => {
        const p = r.data
        setProduct(p)
        if (p.variants?.length > 0) setSelectedVariant(p.variants[0])
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm vào giỏ hàng')
      navigate('/login')
      return
    }
    if (!isCustomer) {
      toast.warning('Tính năng này chỉ dành cho khách hàng')
      return
    }
    if (!selectedVariant) {
      toast.warning('Vui lòng chọn phiên bản sản phẩm')
      return
    }
    if (selectedVariant.quantityInStock === 0) {
      toast.error('Sản phẩm đã hết hàng')
      return
    }

    setAddingToCart(true)
    try {
      const res = await cartApi.addToCart(user.id, {
        productVariantId: selectedVariant.id,
        quantity,
      })
      setCart(res.data)
      toast.success('Đã thêm vào giỏ hàng!')
      openCart()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) return <div className="page-wrapper"><PageSpinner /></div>
  if (!product) return null

  const variants = product.variants || []
  const inStock = selectedVariant?.quantityInStock > 0

  // Group attributes by their values for display
  const allAttributes = variants.flatMap((v) =>
    (v.attributes || []).map((a) => ({ ...a, variantId: v.id }))
  )

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Trang chủ</a>
          <span className="breadcrumb-sep">›</span>
          <a onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>Sản phẩm</a>
          <span className="breadcrumb-sep">›</span>
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3xl)' }}>
          {/* Left – Image */}
          <div>
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--bg-glass-border)',
                overflow: 'hidden',
                aspectRatio: '4/3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={getProductImage(product.image)}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '24px' }}
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div style={{ display: 'none', fontSize: '6rem', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                📱
              </div>
            </div>
          </div>

          {/* Right – Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {/* Brand & Category */}
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="badge badge-primary">{product.brand}</span>
              {product.category && (
                <span className="badge badge-info">{product.category.name}</span>
              )}
            </div>

            {/* Name */}
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.3 }}>
              {product.name}
            </h1>

            {/* Price */}
            <div
              style={{
                padding: 'var(--space-lg)',
                background: 'rgba(99,102,241,0.08)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              {selectedVariant ? (
                <div>
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: 900,
                      background: 'var(--brand-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {formatCurrency(selectedVariant.price)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Tồn kho:{' '}
                    <span style={{ color: inStock ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                      {inStock ? `${selectedVariant.quantityInStock} sản phẩm` : 'Hết hàng'}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)' }}>Chọn phiên bản để xem giá</div>
              )}
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
                  Chọn phiên bản:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                  {variants.map((v) => {
                    const attrs = (v.attributes || []).map((a) => a.value).join(' / ')
                    const isSelected = selectedVariant?.id === v.id
                    const isAvailable = v.quantityInStock > 0
                    return (
                      <button
                        key={v.id}
                        onClick={() => { setSelectedVariant(v); setQuantity(1) }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${isSelected ? 'var(--brand-primary)' : 'var(--bg-glass-border)'}`,
                          background: isSelected ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
                          color: isSelected ? 'var(--brand-primary)' : isAvailable ? 'var(--text-primary)' : 'var(--text-muted)',
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.875rem',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          opacity: isAvailable ? 1 : 0.5,
                          transition: 'all 0.15s ease',
                        }}
                        disabled={!isAvailable}
                        title={isAvailable ? attrs || `Phiên bản ${v.id}` : 'Hết hàng'}
                      >
                        {attrs || `Phiên bản ${v.id}`}
                        {!isAvailable && ' (Hết)'}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            {selectedVariant && inStock && (
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>
                  Số lượng:
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                    {quantity}
                  </span>
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.quantityInStock, q + 1))}
                    disabled={quantity >= selectedVariant.quantityInStock}
                  >
                    +
                  </button>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    (Tối đa {selectedVariant.quantityInStock})
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
                disabled={addingToCart || !inStock}
                id="add-to-cart-btn"
              >
                <ShoppingCart size={18} />
                {addingToCart ? 'Đang thêm...' : inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>
            </div>

            {/* Guarantees */}
            <div
              style={{
                padding: 'var(--space-md)',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--bg-glass-border)',
              }}
            >
              {[
                'Hàng chính hãng 100%',
                'Bảo hành 12-24 tháng',
                'Đổi trả trong 30 ngày',
                'Miễn phí giao hàng toàn quốc',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '6px 0',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <CheckCircle size={14} color="var(--success)" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div style={{ marginTop: 'var(--space-3xl)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
              Mô tả sản phẩm
            </h2>
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xl)',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
              }}
            >
              {product.description}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
