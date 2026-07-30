import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'

// Layout
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CartDrawer from './components/cart/CartDrawer'
import Toast from './components/ui/Toast'
import { PageSpinner } from './components/ui/Spinner'

// Route guards
import { PrivateRoute, CustomerRoute, AdminRoute } from './router/PrivateRoute'

// Public pages
import HomePage from './pages/public/HomePage'
import ProductListPage from './pages/public/ProductListPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'

// Customer pages
import CheckoutPage from './pages/customer/CheckoutPage'
import OrdersPage from './pages/customer/OrdersPage'
import AddressesPage from './pages/customer/AddressesPage'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import ProductsAdminPage from './pages/admin/ProductsAdminPage'
import CategoriesAdminPage from './pages/admin/CategoriesAdminPage'
import OrdersAdminPage from './pages/admin/OrdersAdminPage'
import InventoryAdminPage from './pages/admin/InventoryAdminPage'
import AttributesAdminPage from './pages/admin/AttributesAdminPage'

// Cart store initialization for authenticated customers
import { useAuthStore, selectIsAuthenticated, selectIsCustomer, selectUser } from './store/authStore'
import { useCartStore } from './store/cartStore'
import { cartApi } from './api/cartApi'

function AppBootstrap() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isCustomer = useAuthStore(selectIsCustomer)
  const user = useAuthStore(selectUser)
  const setCart = useCartStore((s) => s.setCart)

  // Tự động load cart khi page refresh (đã có userId trong persisted store)
  useEffect(() => {
    if (isAuthenticated && isCustomer && user?.id) {
      cartApi.getCart(user.id)
        .then((r) => setCart(r.data))
        .catch(() => {})
    }
  }, [isAuthenticated, isCustomer, user?.id])

  return null
}

// Public layout wrapper (Header + Footer)
function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppBootstrap />
      <Toast />
      <CartDrawer />
      <Routes>
        {/* ── Public routes ── */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/products"
          element={
            <PublicLayout>
              <ProductListPage />
            </PublicLayout>
          }
        />
        <Route
          path="/products/:id"
          element={
            <PublicLayout>
              <ProductDetailPage />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          }
        />

        {/* ── Customer routes ── */}
        <Route element={<CustomerRoute />}>
          <Route
            path="/checkout"
            element={
              <PublicLayout>
                <CheckoutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <PublicLayout>
                <OrdersPage />
              </PublicLayout>
            }
          />
          <Route
            path="/addresses"
            element={
              <PublicLayout>
                <AddressesPage />
              </PublicLayout>
            }
          />
        </Route>

        {/* ── Admin routes ── */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductsAdminPage />} />
            <Route path="categories" element={<CategoriesAdminPage />} />
            <Route path="attributes" element={<AttributesAdminPage />} />
            <Route path="orders" element={<OrdersAdminPage />} />
            <Route path="inventory" element={<InventoryAdminPage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div
                className="page-wrapper"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div className="empty-state">
                  <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🔍</div>
                  <p className="empty-state-title" style={{ fontSize: '1.5rem' }}>
                    404 – Trang không tìm thấy
                  </p>
                  <p className="empty-state-desc">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
                  </p>
                  <a href="/" className="btn btn-primary">
                    Về trang chủ
                  </a>
                </div>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
