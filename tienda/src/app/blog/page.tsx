import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog — CarbonZ | Cúpulas de Carbono Forjado para Z900',
  description:
    'Artículos sobre carbono forjado, guías de instalación, comparativas y todo lo que necesitas saber sobre cúpulas de carbono para Kawasaki Z900.',
}

const categoryStyles: Record<
  string,
  {
    gradient: string
    radialGradient: string
    icon: string
    accent: string
    accentBg: string
    accentBorder: string
  }
> = {
  Material: {
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, rgba(59,130,246,0.08) 100%)',
    radialGradient:
      'radial-gradient(circle at 70% 30%, rgba(59,130,246,0.10), transparent 55%)',
    icon: '🔬',
    accent: '#3b82f6',
    accentBg: 'rgba(59,130,246,0.10)',
    accentBorder: 'rgba(59,130,246,0.25)',
  },
  Comparativa: {
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, rgba(168,85,247,0.08) 100%)',
    radialGradient:
      'radial-gradient(circle at 30% 60%, rgba(168,85,247,0.10), transparent 55%)',
    icon: '📊',
    accent: '#a855f7',
    accentBg: 'rgba(168,85,247,0.10)',
    accentBorder: 'rgba(168,85,247,0.25)',
  },
  Guía: {
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, rgba(249,115,22,0.08) 100%)',
    radialGradient:
      'radial-gradient(circle at 60% 40%, rgba(249,115,22,0.10), transparent 55%)',
    icon: '🔧',
    accent: '#f97316',
    accentBg: 'rgba(249,115,22,0.10)',
    accentBorder: 'rgba(249,115,22,0.25)',
  },
  Ranking: {
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, rgba(245,158,11,0.08) 100%)',
    radialGradient:
      'radial-gradient(circle at 50% 50%, rgba(245,158,11,0.10), transparent 55%)',
    icon: '🏆',
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.10)',
    accentBorder: 'rgba(245,158,11,0.25)',
  },
  Análisis: {
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, rgba(6,182,212,0.08) 100%)',
    radialGradient:
      'radial-gradient(circle at 40% 70%, rgba(6,182,212,0.10), transparent 55%)',
    icon: '📈',
    accent: '#06b6d4',
    accentBg: 'rgba(6,182,212,0.10)',
    accentBorder: 'rgba(6,182,212,0.25)',
  },
  Estilo: {
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, rgba(236,72,153,0.08) 100%)',
    radialGradient:
      'radial-gradient(circle at 55% 35%, rgba(236,72,153,0.10), transparent 55%)',
    icon: '🏍️',
    accent: '#ec4899',
    accentBg: 'rgba(236,72,153,0.10)',
    accentBorder: 'rgba(236,72,153,0.25)',
  },
  Mantenimiento: {
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, rgba(20,184,166,0.08) 100%)',
    radialGradient:
      'radial-gradient(circle at 45% 55%, rgba(20,184,166,0.10), transparent 55%)',
    icon: '🛡️',
    accent: '#14b8a6',
    accentBg: 'rgba(20,184,166,0.10)',
    accentBorder: 'rgba(20,184,166,0.25)',
  },
  Proceso: {
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, rgba(99,102,241,0.08) 100%)',
    radialGradient:
      'radial-gradient(circle at 65% 45%, rgba(99,102,241,0.10), transparent 55%)',
    icon: '⚡',
    accent: '#6366f1',
    accentBg: 'rgba(99,102,241,0.10)',
    accentBorder: 'rgba(99,102,241,0.25)',
  },
  default: {
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #111 40%, rgba(48,209,88,0.08) 100%)',
    radialGradient:
      'radial-gradient(circle at 50% 50%, rgba(48,209,88,0.08), transparent 55%)',
    icon: '◆',
    accent: '#30d158',
    accentBg: 'rgba(48,209,88,0.10)',
    accentBorder: 'rgba(48,209,88,0.25)',
  },
}

function getCatStyle(category: string) {
  return categoryStyles[category] || categoryStyles.default
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const featured = sorted[0]
  const featuredStyle = getCatStyle(featured.category)

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#111',
        color: 'var(--white)',
        fontFamily: 'var(--font)',
      }}
    >
      {/* Nav pill */}
      <nav className="nav-pill visible">
        <Link href="/#producto">Producto</Link>
        <Link href="/#detalles">Detalles</Link>
        <Link href="/blog" className="pill-cta">
          Blog
        </Link>
        <Link href="/#comprar" className="pill-cta">
          Visitar tienda
        </Link>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: '160px 48px 80px',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--green)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Blog
        </p>
        <h1
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            marginBottom: 28,
          }}
        >
          Guías, comparativas
          <br />
          <span style={{ color: 'var(--gray-500)' }}>
            y todo sobre carbono forjado
          </span>
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: 'var(--gray-500)',
            maxWidth: 520,
            lineHeight: 1.7,
          }}
        >
          Todo lo que necesitas saber para elegir y cuidar las piezas de carbono
          de tu Kawasaki Z900.
        </p>
      </section>

      {/* Featured article */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 48px 64px',
        }}
      >
        <Link
          href={`/blog/${featured.slug}`}
          style={{
            display: 'block',
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 24,
            overflow: 'hidden',
            transition: 'border-color 0.3s',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              minHeight: 380,
            }}
          >
            {/* Image */}
            <div
              style={{
                background: featuredStyle.gradient,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: featuredStyle.radialGradient,
                }}
              />
              {/* Geometric pattern unique per category */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 200,
                    height: 200,
                    border: `1px solid ${featuredStyle.accentBorder}`,
                    borderRadius: 40,
                    transform: 'rotate(15deg)',
                    position: 'absolute',
                  }}
                />
                <div
                  style={{
                    width: 140,
                    height: 140,
                    border: `1px solid ${featuredStyle.accentBorder}`,
                    borderRadius: 32,
                    transform: 'rotate(-10deg)',
                    position: 'absolute',
                    opacity: 0.6,
                  }}
                />
                <span
                  style={{
                    fontSize: 56,
                    position: 'relative',
                    zIndex: 1,
                    filter: 'grayscale(0.3)',
                  }}
                >
                  {featuredStyle.icon}
                </span>
              </div>
              {/* Decorative line accent */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(to right, transparent, ${featuredStyle.accent}, transparent)`,
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 32,
                  left: 32,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    background: featuredStyle.accentBg,
                    color: featuredStyle.accent,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: 980,
                    border: `1px solid ${featuredStyle.accentBorder}`,
                  }}
                >
                  Destacado
                </span>
              </div>
            </div>

            {/* Content */}
            <div
              style={{
                padding: '56px 48px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: featuredStyle.accentBg,
                  color: featuredStyle.accent,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 980,
                  border: `1px solid ${featuredStyle.accentBorder}`,
                  width: 'fit-content',
                  marginBottom: 24,
                }}
              >
                {featuredStyle.icon} {featured.category}
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  fontWeight: 700,
                  color: 'var(--white)',
                  marginBottom: 20,
                  lineHeight: 1.2,
                }}
              >
                {featured.title}
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--gray-500)',
                  lineHeight: 1.7,
                  marginBottom: 28,
                }}
              >
                {featured.excerpt}
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: '0.8rem',
                  color: 'var(--gray-600)',
                }}
              >
                <time dateTime={featured.date}>
                  {new Date(featured.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{featured.readTime} de lectura</span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Articles grid */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 48px 128px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 32,
          }}
        >
          {sorted.slice(1).map((post) => {
            const cs = getCatStyle(post.category)
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  transition: 'border-color 0.3s, transform 0.3s',
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: 200,
                    background: cs.gradient,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: cs.radialGradient,
                    }}
                  />
                  {/* Geometric shapes */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        border: `1px solid ${cs.accentBorder}`,
                        borderRadius: 24,
                        transform: 'rotate(20deg)',
                        position: 'absolute',
                      }}
                    />
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        border: `1px solid ${cs.accentBorder}`,
                        borderRadius: 16,
                        transform: 'rotate(-15deg)',
                        position: 'absolute',
                        opacity: 0.5,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 36,
                        position: 'relative',
                        zIndex: 1,
                        filter: 'grayscale(0.3)',
                      }}
                    >
                      {cs.icon}
                    </span>
                  </div>
                  {/* Bottom accent line */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: `linear-gradient(to right, transparent, ${cs.accent}, transparent)`,
                      opacity: 0.4,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 20,
                      left: 20,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        background: cs.accentBg,
                        color: cs.accent,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '5px 12px',
                        borderRadius: 980,
                        border: `1px solid ${cs.accentBorder}`,
                      }}
                    >
                      {cs.icon} {post.category}
                    </span>
                  </div>
                </div>

              {/* Content */}
              <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: '0.7rem',
                    color: 'var(--gray-600)',
                    marginBottom: 14,
                  }}
                >
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span>·</span>
                  <span>{post.readTime} de lectura</span>
                </div>

                <h2
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--white)',
                    marginBottom: 12,
                    lineHeight: 1.35,
                  }}
                >
                  {post.title}
                </h2>

                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--gray-500)',
                    lineHeight: 1.6,
                    marginBottom: 20,
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.excerpt}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: 'var(--gray-600)',
                  }}
                >
                  Leer artículo
                  <svg
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ width: 12, height: 12 }}
                  >
                    <path
                      d="M1 7h12M8 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          )
          })}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 48px 128px',
        }}
      >
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(48,209,88,0.12)',
            borderRadius: 24,
            padding: '64px 48px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 50% 0%, rgba(48,209,88,0.06), transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 800,
              marginBottom: 20,
              letterSpacing: '-0.03em',
              position: 'relative',
            }}
          >
            ¿Listo para equipar tu Z900?
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--gray-500)',
              marginBottom: 36,
              maxWidth: 480,
              margin: '0 auto 36px',
              lineHeight: 1.7,
              position: 'relative',
            }}
          >
            Nuestras cúpulas de carbono forjado están diseñadas específicamente
            para la Kawasaki Z900.
          </p>
          <Link
            href="/#comprar"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--green)',
              color: 'var(--black)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '14px 36px',
              borderRadius: 980,
              transition: 'background 0.2s',
              position: 'relative',
            }}
          >
            Visitar tienda
            <svg viewBox="0 0 14 14" fill="none" style={{ width: 12, height: 12 }}>
              <path
                d="M1 7h12M8 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: '32px 48px',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--gray-700)' }}>
            © 2026 CarbonZ
          </span>
          <div style={{ display: 'flex', gap: 32 }}>
            <Link
              href="/"
              style={{ fontSize: '0.7rem', color: 'var(--gray-600)' }}
            >
              Tienda
            </Link>
            <Link
              href="/blog"
              style={{ fontSize: '0.7rem', color: 'var(--gray-600)' }}
            >
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
