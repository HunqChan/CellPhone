import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, selectIsAuthenticated, selectIsAdmin, selectIsCustomer } from '../store/authStore'

export function PrivateRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function CustomerRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isCustomer = useAuthStore(selectIsCustomer)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isCustomer) return <Navigate to="/" replace />
  return <Outlet />
}

export function AdminRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isAdmin = useAuthStore(selectIsAdmin)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return <Outlet />
}
