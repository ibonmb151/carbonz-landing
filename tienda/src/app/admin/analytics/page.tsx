'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BlogStats {
  totalArticles: number
  categories: { name: string; count: number }[]
  recentArticles: { title: string; created_at: string; category: string }[]
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      // Try to fetch blog stats (may not exist yet)
      fetch('/api/admin/stats')
        .then(r => r.json())
        .then(() => {
          // Blog stats would come from a blog table if it exists
          setBlogStats({
            totalArticles: 0,
            categories: [],
            recentArticles: [],
          })
        })
        .catch(() => {
          setBlogStats({ totalArticles: 0, categories: [], recentArticles: [] })
        })
        .finally(() => setLoading(false))
    }
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#636366' }}>
        Cargando analytics...
      </div>
    )
  }

  if (!session) return null

  // Placeholder data for GA metrics
  const gaMetrics = [
    { label: 'Pageviews totales', value: '—', icon: '👁️', sub: 'Configura GA para ver datos' },
    { label: 'Visitantes hoy', value: '—', icon: '👥', sub: 'Configura GA para ver datos' },
    { label: 'Tiempo medio', value: '—', icon: '⏱️', sub: 'Configura GA para ver datos' },
    { label: 'Bounce rate', value: '—', icon: '📊', sub: 'Configura GA para ver datos' },
  ]

  // Placeholder revenue chart (last 7 days)
  const revenueDays = [
    { day: 'Lun', amount: 0 },
    { day: 'Mar', amount: 0 },
    { day: 'Mie', amount: 0 },
    { day: 'Jue', amount: 0 },
    { day: 'Vie', amount: 0 },
    { day: 'Sab', amount: 0 },
    { day: 'Dom', amount: 0 },
  ]
  const maxRevenue = Math.max(...revenueDays.map(d => d.amount), 1)

  // Traffic sources (placeholder)
  const trafficSources = [
    { name: 'Directo', pct: 45, color: '#30d158' },
    { name: 'Organico', pct: 25, color: '#64d2ff' },
    { name: 'Social', pct: 20, color: '#bf5af2' },
    { name: 'Referido', pct: 10, color: '#ff9f0a' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f5f5f7', letterSpacing: '-0.03em' }}>
            Analytics
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#636366', marginTop: 4 }}>
            Estadisticas y metricas de tu tienda
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 16px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
              color: '#8e8e93', fontSize: '0.8rem', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font)',
              display: 'flex', alignItems: 'center', gap: 6,
              textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Google Analytics
          </a>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 16px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
              color: '#8e8e93', fontSize: '0.8rem', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font)',
              display: 'flex', alignItems: 'center', gap: 6,
              textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search Console
          </a>
        </div>
      </div>

      {/* GA Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12,
        marginBottom: 24,
      }}>
        {gaMetrics.map((m) => (
          <div key={m.label} style={{
            background: '#1a1a1a',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.04)',
            padding: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12,
            }}>
              <span style={{
                fontSize: '0.65rem', fontWeight: 600, color: '#636366',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>{m.label}</span>
              <span style={{ fontSize: '1rem' }}>{m.icon}</span>
            </div>
            <div style={{
              fontSize: '1.4rem', fontWeight: 800, color: '#f5f5f7',
              letterSpacing: '-0.03em', marginBottom: 4,
            }}>{m.value}</div>
            <div style={{ fontSize: '0.6rem', color: '#48484a' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Revenue Chart */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.04)',
          padding: '24px',
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5f5f7', marginBottom: 20 }}>
            Ingresos ultimos 7 dias
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            height: 140,
            paddingBottom: 24,
            position: 'relative',
          }}>
            {revenueDays.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{
                  width: '100%',
                  height: d.amount > 0 ? `${(d.amount / maxRevenue) * 100}%` : '4px',
                  background: d.amount > 0
                    ? 'linear-gradient(180deg, #30d158, rgba(48,209,88,0.3))'
                    : 'rgba(255,255,255,0.04)',
                  borderRadius: 6,
                  minHeight: 4,
                  transition: 'height 0.3s',
                }} />
                <span style={{
                  fontSize: '0.6rem', color: '#636366', marginTop: 8,
                  position: 'absolute', bottom: 0,
                }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: '#48484a',
            marginTop: 8,
          }}>
            Conecta Google Analytics para ver datos reales
          </div>
        </div>

        {/* Traffic Sources */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.04)',
          padding: '24px',
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f5f5f7', marginBottom: 20 }}>
            Fuentes de trafico
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {trafficSources.map((src) => (
              <div key={src.name}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 6,
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#8e8e93' }}>{src.name}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: src.color }}>{src.pct}%</span>
                </div>
                <div style={{
                  height: 6, borderRadius: 3,
                  background: 'rgba(255,255,255,0.04)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%', width: `${src.pct}%`,
                    background: src.color, borderRadius: 3,
                    transition: 'width 0.5s',
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{
            textAlign: 'center',
            fontSize: '0.7rem',
            color: '#48484a',
            marginTop: 20,
          }}>
            Datos de ejemplo — conecta GA para metricas reales
          </div>
        </div>
      </div>

      {/* Blog Performance */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f7' }}>
            Rendimiento del blog
          </h2>
        </div>
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📝</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f5f5f7', marginBottom: 4 }}>
            {blogStats?.totalArticles || 0} articulos publicados
          </div>
          <div style={{ fontSize: '0.72rem', color: '#636366', lineHeight: 1.6 }}>
            {blogStats?.categories?.length || 0} categorias activas
            <br />
            Conecta una tabla de blog en Supabase para ver estadisticas detalladas
          </div>
        </div>
      </div>
    </div>
  )
}
