import { useState, useEffect } from 'react'
import {
  ShoppingBag, Package, Tag, TrendingUp, Users,
  ArrowUpRight, Clock, CheckCircle
} from 'lucide-react'
import { orderApi } from '../../api/orderApi'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import { formatCurrency, formatDate, getOrderStatusInfo } from '../../utils/formatters'

export default function DashboardPage() {
  const [orders, setOrders] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      orderApi.getAll(),
      productApi.filter({ page: 0, size: 1 }),
      categoryApi.getAll(),
    ])
      .then(([oRes, pRes, cRes]) => {
        setOrders(oRes.data || [])
        setProductCount(pRes.data?.totalElements || 0)
        setCategoryCount((cRes.data || []).length)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((s, o) => s + (o.totalPrice || 0), 0)

  const pendingOrders = orders.filter((o) => o.status === 'PENDING_CONFIRMATION').length
  const recentOrders = [...orders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)).slice(0, 5)

  const stats = [
    {
      label: 'Doanh thu',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: 'var(--success)',
      change: 'Từ các đơn đã giao',
    },
    {
      label: 'Tổng đơn hàng',
      value: orders.length,
      icon: ShoppingBag,
      color: 'var(--brand-primary)',
      change: `${pendingOrders} đơn chờ xác nhận`,
    },
    {
      label: 'Sản phẩm',
      value: productCount,
      icon: Package,
      color: 'var(--warning)',
      change: 'Trong kho',
    },
    {
      label: 'Danh mục',
      value: categoryCount,
      icon: Tag,
      color: 'var(--info)',
      change: 'Danh mục hiện có',
    },
  ]

  // Order status distribution
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Tổng quan hoạt động kinh doanh
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 'var(--space-lg)',
          marginBottom: 'var(--space-2xl)',
        }}
      >
        {stats.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="admin-stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="admin-stat-label">{label}</p>
                <p className="admin-stat-value" style={{ color }}>
                  {loading ? '...' : value}
                </p>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: `${color}20`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={color} />
              </div>
            </div>
            <p className="admin-stat-change" style={{ color: 'var(--text-muted)' }}>
              {change}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 'var(--space-xl)' }}>
        {/* Recent Orders */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
            Đơn hàng gần đây
          </h2>
          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Chưa có đơn hàng</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã ĐH</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Ngày đặt</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => {
                    const si = getOrderStatusInfo(o.status)
                    return (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>{o.user?.fullName || o.user?.email || '—'}</td>
                        <td style={{ fontWeight: 600 }}>{formatCurrency(o.totalPrice)}</td>
                        <td>
                          <span className={`status-badge status-${o.status}`}>{si.label}</span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                          {formatDate(o.orderDate)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)',
          }}
        >
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
            Phân bố đơn hàng
          </h2>
          {Object.entries(statusCounts).map(([status, count]) => {
            const info = getOrderStatusInfo(status)
            const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0
            return (
              <div key={status} style={{ marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {info.label}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    {count} ({pct}%)
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'var(--brand-gradient)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
