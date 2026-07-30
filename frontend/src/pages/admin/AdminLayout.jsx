import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, ShoppingBag,
  Warehouse, Settings, ArrowLeft, Smartphone, Sliders
} from 'lucide-react'
import Header from '../../components/layout/Header'

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { to: '/admin/categories', icon: Tag, label: 'Danh mục' },
  { to: '/admin/attributes', icon: Sliders, label: 'Thuộc tính' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Đơn hàng' },
  { to: '/admin/inventory', icon: Warehouse, label: 'Kho hàng' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  return (
    <>
      <Header />
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div
            style={{
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-lg)',
              background: 'rgba(99,102,241,0.1)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Smartphone size={16} color="var(--brand-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-primary)' }}>
                Admin Panel
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CellPhone Store</p>
          </div>

          <nav>
            {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div style={{ marginTop: 'auto', paddingTop: 'var(--space-xl)' }}>
            <button
              className="sidebar-nav-item"
              onClick={() => navigate('/')}
              style={{ width: '100%' }}
            >
              <ArrowLeft size={17} />
              Về trang chủ
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </>
  )
}
