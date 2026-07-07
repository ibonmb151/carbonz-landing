'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Pedidos',
    href: '/admin/pedidos',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (status === 'loading') return
    if (!session && !isLoginPage) {
      router.push('/admin/login')
    }
  }, [session, status, router, isLoginPage])

  // Login page — no sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 24,
          height: 24,
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#30d158',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Not authenticated
  if (!session) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      display: 'flex',
      fontFamily: 'var(--font)',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: '#0a0a0a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 24px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Link href="/admin" style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#f5f5f7',
            letterSpacing: '-0.03em',
            textDecoration: 'none',
          }}>
            Carbon<span style={{ color: '#30d158' }}>Z</span>
            <span style={{
              fontSize: '0.6rem',
              fontWeight: 500,
              color: '#636366',
              marginLeft: 8,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: isActive ? '#f5f5f7' : '#8e8e93',
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  marginBottom: 2,
                }}
              >
                <span style={{ opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            fontSize: '0.7rem',
            color: '#48484a',
          }}>
            {session.user?.email}
          </div>
          <button
            onClick={() => {
              const { signOut } = require('next-auth/react')
              signOut({ callbackUrl: '/admin/login' })
            }}
            style={{
              marginTop: 8,
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: '#8e8e93',
              fontSize: '0.7rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.color = '#f5f5f7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = '#8e8e93'
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: 240,
        padding: '32px 40px',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  )
}
