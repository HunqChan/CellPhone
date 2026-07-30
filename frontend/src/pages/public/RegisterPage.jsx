import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Smartphone, UserPlus } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { cartApi } from '../../api/cartApi'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { toast } from '../../store/toastStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const setCart = useCartStore((s) => s.setCart)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }
    if (!form.phone) {
      setError('Số điện thoại là bắt buộc')
      return
    }
    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.register(form)
      const { userId, token, email, fullName, role } = res.data
      setAuth(token, { id: userId, email, fullName, role })
      toast.success('Đăng ký thành công! Chào mừng bạn!')
      // Load cart cho customer mới
      if (userId) {
        cartApi.getCart(userId)
          .then((r) => setCart(r.data))
          .catch(() => {})
      }
      navigate('/')
    } catch (e) {
      setError(e.message)
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
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 70%)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 460, padding: '0 var(--space-lg)' }}>
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tạo tài khoản</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 8 }}>
            Tham gia cùng hàng nghìn khách hàng của chúng tôi 🚀
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
            <label className="form-label" htmlFor="reg-fullname">
              Họ và tên <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <input
              id="reg-fullname"
              name="fullName"
              type="text"
              className="form-input"
              placeholder="Nguyễn Văn A"
              value={form.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">
              Email <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <input
              id="reg-email"
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
            <label className="form-label" htmlFor="reg-phone">
              Số điện thoại
            </label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              className="form-input"
              placeholder="0912345678"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Mật khẩu <span style={{ color: 'var(--error)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className="form-input"
                placeholder="Tối thiểu 6 ký tự"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
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
            id="register-submit"
          >
            <UserPlus size={18} />
            {loading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
