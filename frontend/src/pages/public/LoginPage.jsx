import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Smartphone, LogIn } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { cartApi } from '../../api/cartApi'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { toast } from '../../store/toastStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const setUserId = useAuthStore((s) => s.setUserId)
  const setCart = useCartStore((s) => s.setCart)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.login(form)
      const { userId, token, email, fullName, role } = res.data
      setAuth(token, { id: userId, email, fullName, role })
      toast.success(`Chào mừng trở lại, ${fullName}!`)
      // Load cart ngay cho CUSTOMER
      if (role === 'CUSTOMER' && userId) {
        cartApi.getCart(userId)
          .then((r) => setCart(r.data))
          .catch(() => {})
      }
      navigate(role === 'ADMIN' ? '/admin' : '/')
    } catch (e) {
      setError(e.message || 'Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="page-wrapper"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 420, padding: '0 var(--space-lg)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '1.5rem',
              fontWeight: 900,
              background: 'var(--brand-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 'var(--space-md)',
            }}
          >
            <Smartphone size={28} />
            CellPhone Store
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Đăng nhập</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 8 }}>
            Chào mừng bạn quay trở lại! 👋
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-2xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-lg)',
          }}
        >
          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--error)',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={loading}
            id="login-submit"
          >
            <LogIn size={18} />
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
