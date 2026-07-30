import { Smartphone, Phone, Mail, MapPin } from 'lucide-react'
import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--bg-glass-border)',
        padding: 'var(--space-3xl) 0 var(--space-xl)',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-2xl)',
            marginBottom: 'var(--space-2xl)',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '1.25rem',
                fontWeight: 800,
                background: 'var(--brand-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 'var(--space-md)',
              }}
            >
              <Smartphone size={22} />
              CellPhone Store
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Chuyên cung cấp thiết bị điện tử chính hãng, giá tốt nhất, bảo hành toàn quốc.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-md)',
              }}
            >
              Liên kết nhanh
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Trang chủ', to: '/' },
                { label: 'Sản phẩm', to: '/products' },
                { label: 'Đăng nhập', to: '/login' },
                { label: 'Đăng ký', to: '/register' },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
                  onMouseOver={(e) => (e.target.style.color = 'var(--text-primary)')}
                  onMouseOut={(e) => (e.target.style.color = 'var(--text-secondary)')}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-md)',
              }}
            >
              Liên hệ
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { icon: Phone, text: '1800 1234 (Miễn phí)' },
                { icon: Mail, text: 'support@cellphone.vn' },
                { icon: MapPin, text: '123 Nguyễn Huệ, TP.HCM' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Icon size={15} color="var(--brand-primary)" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--bg-glass-border)',
            paddingTop: 'var(--space-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-md)',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            © 2026 CellPhone Store. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Được xây dựng với ❤️ bằng React + Spring Boot
          </p>
        </div>
      </div>
    </footer>
  )
}
