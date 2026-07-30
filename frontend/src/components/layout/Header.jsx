import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Smartphone, Search, ShoppingCart, User,
  LogOut, Package, MapPin, LayoutDashboard, ChevronDown
} from 'lucide-react'
import { useAuthStore, selectIsAuthenticated, selectIsAdmin, selectUser } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { authApi } from '../../api/authApi'
import { toast } from '../../store/toastStore'

export default function Header() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isAdmin = useAuthStore(selectIsAdmin)
  const user = useAuthStore(selectUser)
  const logout = useAuthStore((s) => s.logout)

  const openCart = useCartStore((s) => s.openCart)
  const getItemCount = useCartStore((s) => s.getItemCount)
  const cartCount = getItemCount()

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // JWT is stateless, logout on client anyway
    }
    logout()
    useCartStore.getState().clearCart()
    toast.success('Đăng xuất thành công')
    navigate('/')
    setShowDropdown(false)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <NavLink to="/" className="header-logo">
            <Smartphone size={26} />
            CellPhone
          </NavLink>

          {/* Nav */}
          <nav className="header-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Sản phẩm
            </NavLink>
          </nav>

          {/* Search */}
          <form className="header-search" onSubmit={handleSearch}>
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="header-search-input"
            />
          </form>

          {/* Actions */}
          <div className="header-actions">
            {/* Cart button – only for customers */}
            {isAuthenticated && !isAdmin && (
              <button
                className="cart-btn"
                onClick={openCart}
                id="cart-button"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart size={18} />
                <span>Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
                )}
              </button>
            )}

            {/* Auth */}
            {isAuthenticated ? (
              <div className="user-menu" ref={dropdownRef}>
                <button
                  className="user-btn"
                  onClick={() => setShowDropdown((v) => !v)}
                  id="user-menu-button"
                >
                  <User size={16} />
                  <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.fullName || user?.email}
                  </span>
                  <ChevronDown
                    size={14}
                    style={{ transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'none' }}
                  />
                </button>

                {showDropdown && (
                  <div className="dropdown">
                    {isAdmin ? (
                      <button
                        className="dropdown-item"
                        onClick={() => { navigate('/admin'); setShowDropdown(false) }}
                      >
                        <LayoutDashboard size={15} />
                        Dashboard Admin
                      </button>
                    ) : (
                      <>
                        <button
                          className="dropdown-item"
                          onClick={() => { navigate('/orders'); setShowDropdown(false) }}
                        >
                          <Package size={15} />
                          Đơn hàng của tôi
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => { navigate('/addresses'); setShowDropdown(false) }}
                        >
                          <MapPin size={15} />
                          Địa chỉ
                        </button>
                      </>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={15} />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <NavLink to="/login" className="btn btn-secondary btn-sm">
                  Đăng nhập
                </NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">
                  Đăng ký
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
