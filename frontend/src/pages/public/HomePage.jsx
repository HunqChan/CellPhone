import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Shield, Truck, Star, TrendingUp, Smartphone } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import ProductCard from '../../components/product/ProductCard'
import { PageSpinner } from '../../components/ui/Spinner'

const CATEGORY_ICONS = {
  'Điện thoại': '📱',
  'Laptop': '💻',
  'Tablet': '📟',
  'Tai nghe': '🎧',
  'Đồng hồ': '⌚',
  'Phụ kiện': '🔌',
}

export default function HomePage() {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodsRes, catsRes] = await Promise.all([
          productApi.filter({ page: 0, size: 8, sortBy: 'id', sortDir: 'desc' }),
          categoryApi.getAll(),
        ])
        setFeaturedProducts(prodsRes.data?.content || [])
        setCategories(catsRes.data || [])
      } catch {
        // fail silently, show empty state
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="page-wrapper">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-3xl)',
              alignItems: 'center',
            }}
          >
            <div className="hero-content">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  color: 'var(--text-accent)',
                  fontWeight: 600,
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <TrendingUp size={14} />
                Thiết bị công nghệ hàng đầu Việt Nam
              </div>

              <h1 className="hero-title">
                Công nghệ đỉnh cao{' '}
                <span className="highlight">trong tầm tay</span>{' '}
                bạn
              </h1>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  marginBottom: 'var(--space-xl)',
                  lineHeight: 1.8,
                }}
              >
                Khám phá hàng nghìn sản phẩm điện tử chính hãng — từ smartphone, laptop đến phụ kiện,
                với giá tốt nhất và bảo hành toàn quốc.
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/products')}
                  id="hero-shop-btn"
                >
                  Mua sắm ngay
                  <ArrowRight size={18} />
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => document.getElementById('featured-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Xem sản phẩm nổi bật
                </button>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-xl)',
                  marginTop: 'var(--space-2xl)',
                  paddingTop: 'var(--space-xl)',
                  borderTop: '1px solid var(--bg-glass-border)',
                }}
              >
                {[
                  { label: 'Sản phẩm', value: '1,000+' },
                  { label: 'Khách hàng', value: '50,000+' },
                  { label: 'Thương hiệu', value: '30+' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                  position: 'absolute',
                }}
              />
              <div
                style={{
                  fontSize: '10rem',
                  filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.4))',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                📱
              </div>
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-16px); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: 'var(--space-2xl) 0', borderBottom: '1px solid var(--bg-glass-border)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-lg)',
            }}
          >
            {[
              { icon: Truck, title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 500K' },
              { icon: Shield, title: 'Bảo hành chính hãng', desc: 'Lên đến 24 tháng' },
              { icon: Zap, title: 'Giao hàng nhanh', desc: 'Trong 2-4 giờ tại TP.HCM' },
              { icon: Star, title: 'Sản phẩm chính hãng', desc: '100% hàng mới nguyên hộp' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-lg)',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--bg-glass-border)',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: 'rgba(99,102,241,0.15)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={22} color="var(--brand-primary)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      {categories.length > 0 && (
        <section style={{ padding: 'var(--space-3xl) 0' }}>
          <div className="container">
            <h2 className="section-title">Danh mục sản phẩm</h2>
            <div className="category-grid">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                  id={`category-${cat.id}`}
                >
                  <div className="category-card-icon">
                    {CATEGORY_ICONS[cat.name] || '📦'}
                  </div>
                  <span className="category-card-name">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Products ── */}
      <section
        id="featured-section"
        style={{ padding: 'var(--space-3xl) 0', background: 'var(--bg-surface)' }}
      >
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-xl)' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 4 }}>Sản phẩm nổi bật</h2>
              <p className="section-subtitle" style={{ marginTop: 0, marginBottom: 0 }}>Những sản phẩm được yêu thích nhất</p>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/products')}
            >
              Xem tất cả
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <PageSpinner />
          ) : featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Smartphone size={36} /></div>
              <p className="empty-state-title">Chưa có sản phẩm</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
