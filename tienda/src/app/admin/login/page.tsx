'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Credenciales incorrectas')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      Error('Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 360,
        padding: '0 24px',
      }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center',
          marginBottom: 40,
        }}>
          <span style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            color: '#f5f5f7',
            letterSpacing: '-0.03em',
          }}>
            Carbon<span style={{ color: '#30d158' }}>Z</span>
          </span>
          <div style={{
            marginTop: 8,
            fontSize: '0.7rem',
            color: '#636366',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            Panel de administración
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: '#111',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '32px 28px',
        }}>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#8e8e93',
                marginBottom: 6,
                letterSpacing: '0.04em',
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@carbonz.com"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#f5f5f7',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(48,209,88,0.4)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#8e8e93',
                marginBottom: 6,
                letterSpacing: '0.04em',
              }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#f5f5f7',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(48,209,88,0.4)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: 16,
                padding: '10px 14px',
                borderRadius: 10,
                background: 'rgba(255,69,58,0.1)',
                border: '1px solid rgba(255,69,58,0.2)',
                fontSize: '0.75rem',
                color: '#ff453a',
              }}>
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: 10,
                border: 'none',
                background: loading ? '#48484a' : '#f5f5f7',
                color: loading ? '#8e8e93' : '#0a0a0a',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font)',
                transition: 'all 0.2s',
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div style={{
          textAlign: 'center',
          marginTop: 24,
        }}>
          <a
            href="/"
            style={{
              fontSize: '0.72rem',
              color: '#636366',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            ← Volver a la tienda
          </a>
        </div>
      </div>
    </div>
  )
}
