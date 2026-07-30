import { ShoppingCart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, getProductImage, getMinPrice } from '../../utils/formatters'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const minPrice = getMinPrice(product.variants)

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="product-card-image">
        <img
          src={getProductImage(product.image)}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/400x300/1a1a2e/818cf8?text=${encodeURIComponent(product.brand || 'SP')}`
          }}
        />
      </div>

      {/* Body */}
      <div className="product-card-body">
        <span className="product-card-brand">{product.brand}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
          <span className="product-card-price">
            {minPrice != null ? `Từ ${formatCurrency(minPrice)}` : 'Liên hệ'}
          </span>
          {product.category && (
            <span className="badge badge-primary" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
              {product.category.name}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="product-card-footer">
        <button
          className="btn btn-primary btn-sm"
          style={{ width: '100%' }}
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/products/${product.id}`)
          }}
        >
          <ShoppingCart size={14} />
          Xem chi tiết
        </button>
      </div>
    </div>
  )
}
