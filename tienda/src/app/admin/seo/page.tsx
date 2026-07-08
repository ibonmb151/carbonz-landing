'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// ─── Blog Data (hardcoded — will connect to GA later) ──

const blogArticles = [
  { title: 'Cúpula de carbono Kawasaki Z900: Guía completa', slug: 'cupula-carbono-kawasaki-z900-guia', status: 'published', category: 'Guías', date: '2026-06-15' },
  { title: 'Beneficios del carbono forjado en motocicletas', slug: 'beneficios-carbono-forjado-motos', status: 'published', category: 'Blog', date: '2026-06-10' },
  { title: 'Instalación paso a paso: Cúpula CarbonZ', slug: 'instalacion-paso-a-paso-cupula-carbonz', status: 'published', category: 'Tutorial', date: '2026-06-05' },
  { title: 'Kawasaki Z900 2026: Todo lo que necesitas saber', slug: 'kawasaki-z900-2026-review', status: 'published', category: 'Blog', date: '2026-05-28' },
  { title: 'Carbono forjado vs inyectado: Diferencias clave', slug: 'carbono-forjado-vs-inyectado', status: 'published', category: 'Blog', date: '2026-05-20' },
  { title: 'Mantenimiento de piezas de carbono', slug: 'mantenimiento-piezas-carbono', status: 'published', category: 'Guías', date: '2026-05-15' },
  { title: 'Testimonios de clientes CarbonZ', slug: 'testimonios-clientes-carbonz', status: 'published', category: 'Blog', date: '2026-05-10' },
  { title: 'Top 5 accesorios para Kawasaki Z900', slug: 'top-5-accesorios-kawasaki-z900', status: 'published', category: 'Blog', date: '2026-05-01' },
  { title: 'Cómo elegir la cúpula ideal para tu moto', slug: 'como-elegir-cupula-ideal-moto', status: 'published', category: 'Guías', date: '2026-04-25' },
  { title: 'Envío internacional: Cómo funciona', slug: 'envio-internacional-carbonz', status: 'published', category: 'FAQ', date: '2026-04-18' },
  { title: 'Política de devoluciones CarbonZ', slug: 'politica-devoluciones-carbonz', status: 'draft', category: 'FAQ', date: '2026-07-01' },
  { title: 'Novedades CarbonZ 2026: Nuevos productos', slug: 'novedades-carbonz-2026', status: 'draft', category: 'Blog', date: '2026-07-05' },
]

const keywords = [
  { keyword: 'cupula carbono kawasaki z900', position: 3, volume: 480 },
  { keyword: 'kawasaki z900 windshield carbon', position: 5, volume: 320 },
  { keyword: 'carbon fiber windshield motorcycle', position: 12, volume: 1200 },
  { keyword: 'cubierta carbono kawasaki', position: 7, volume: 210 },
  { keyword: 'z900 aftermarket parts', position: 18, volume: 880 },
  { keyword: 'carbon motorcycle parts europe', position: 22, volume: 590 },
  { keyword: 'kawasaki z accessories', position: 9, volume: 720 },
  { keyword: 'forges carbon fiber', position: 15, volume: 340 },
]

const categoryBreakdown = [
  { name: 'Blog', count: 5, color: '#30d158' },
  { name: 'Guías', count: 3, color: '#64d2ff' },
  { name: 'Tutorial', count: 1, color: '#ff9f0a' },
  { name: 'FAQ', count: 2, color: '#bf5af2' },
]

// ─── Main Component ────────────────────────────────────

export default function SeoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#636366' }}>
        Cargando SEO...
      </div>
    )
  }

  if (!session) return null

  const publishedCount = blogArticles.filter(a => a.status === 'published').length
  const draftCount = blogArticles.filter(a => a.status === 'draft').length
  const avgPosition = Math.round(keywords.reduce((s, k) => s + k.position, 0) / keywords.length)
  const topKeywords = [...keywords].sort((a, b) => a.position - b.position).slice(0, 5)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f5f5f7', letterSpacing: '-0.03em' }}>
          SEO Dashboard
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#636366', marginTop: 4 }}>
          Métricas de posicionamiento y contenido del blog
        </p>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <a
          href="https://search.google.com/search-console"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 20px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
            color: '#f5f5f7', fontSize: '0.8rem', fontWeight: 600,
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4285f4" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Google Search Console
        </a>
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 20px', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
            color: '#f5f5f7', fontSize: '0.8rem', fontWeight: 600,
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5af00" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Google Analytics 4
        </a>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Artículos totales', value: blogArticles.length, icon: '📝', color: '#f5f5f7' },
          { label: 'Publicados', value: publishedCount, icon: '✅', color: '#30d158' },
          { label: 'Borradores', value: draftCount, icon: '📋', color: '#ff9f0a' },
          { label: 'Keywords rastreadas', value: keywords.length, icon: '🔑', color: '#64d2ff' },
          { label: 'Posición media', value: avgPosition, icon: '📊', color: '#bf5af2' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#1a1a1a', borderRadius: 14, padding: '18px 20px',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#636366', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {stat.label}
              </span>
              <span style={{ fontSize: '1rem' }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.color, letterSpacing: '-0.03em' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Top Keywords */}
        <div style={{
          background: '#1a1a1a', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f7' }}>Top Keywords</h2>
          </div>
          {topKeywords.map((kw, i) => (
            <div key={kw.keyword} style={{
              padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 8,
                  background: i === 0 ? 'rgba(48,209,88,0.15)' : i < 3 ? 'rgba(255,159,10,0.1)' : 'rgba(255,255,255,0.04)',
                  color: i === 0 ? '#30d158' : i < 3 ? '#ff9f0a' : '#636366',
                  fontSize: '0.65rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  #{kw.position}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#f5f5f7' }}>{kw.keyword}</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#636366' }}>{kw.volume.toLocaleString()} vol/mes</span>
            </div>
          ))}
        </div>

        {/* Categories Breakdown */}
        <div style={{
          background: '#1a1a1a', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f7' }}>Categorías</h2>
          </div>
          {categoryBreakdown.map((cat) => (
            <div key={cat.name} style={{
              padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color }} />
                <span style={{ fontSize: '0.8rem', color: '#f5f5f7' }}>{cat.name}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#636366' }}>{cat.count} artículos</span>
            </div>
          ))}
          <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.65rem', color: '#636366', marginBottom: 8 }}>Último publicado</div>
            <div style={{ fontSize: '0.75rem', color: '#f5f5f7', fontWeight: 500 }}>
              {blogArticles.filter(a => a.status === 'published').sort((a, b) => b.date.localeCompare(a.date))[0]?.title || '—'}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#48484a', marginTop: 4 }}>
              {blogArticles.filter(a => a.status === 'published').sort((a, b) => b.date.localeCompare(a.date))[0]?.date || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div style={{
        background: '#1a1a1a', borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f7' }}>
            Artículos del blog ({blogArticles.length})
          </h2>
        </div>
        <div style={{ maxHeight: 'calc(100vh - 480px)', overflowY: 'auto' }}>
          {blogArticles.sort((a, b) => b.date.localeCompare(a.date)).map((article) => (
            <div
              key={article.slug}
              style={{
                padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f5f5f7', marginBottom: 4 }}>
                  {article.title}
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#48484a' }}>{article.slug}</span>
                  <span style={{
                    padding: '2px 8px', borderRadius: 6,
                    background: 'rgba(100,210,255,0.1)', color: '#64d2ff',
                    fontSize: '0.55rem', fontWeight: 600,
                  }}>{article.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <span style={{ fontSize: '0.65rem', color: '#48484a' }}>{article.date}</span>
                <span style={{
                  padding: '4px 10px', borderRadius: 6,
                  background: article.status === 'published' ? 'rgba(48,209,88,0.12)' : 'rgba(255,159,10,0.12)',
                  color: article.status === 'published' ? '#30d158' : '#ff9f0a',
                  fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase',
                }}>
                  {article.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
