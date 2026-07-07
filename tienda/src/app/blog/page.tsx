import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-data'

export const metadata: Metadata = {
  title: 'Blog — CarbonZ | Cúpulas de Carbono Forjado para Z900',
  description:
    'Artículos sobre carbono forjado, guías de instalación, comparativas y todo lo que necesitas saber sobre cúpulas de carbono para Kawasaki Z900.',
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

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
          href={`/blog/${sorted[0].slug}`}
          style={{
            display: 'block',
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.05)',
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
                background:
                  'linear-gradient(135deg, #1a1a1a 0%, #111 50%, #0a0a0a 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 30% 50%, rgba(48,209,88,0.06), transparent 60%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 140,
                    fontWeight: 900,
                    color: 'rgba(255,255,255,0.015)',
                    userSelect: 'none',
                  }}
                >
                  CZ
                </span>
              </div>
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
                    background: 'rgba(48,209,88,0.1)',
                    color: 'var(--green)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: 980,
                    border: '1px solid rgba(48,209,88,0.2)',
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
                  background: 'rgba(48,209,88,0.1)',
                  color: 'var(--green)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '5px 12px',
                  borderRadius: 980,
                  border: '1px solid rgba(48,209,88,0.2)',
                  width: 'fit-content',
                  marginBottom: 24,
                }}
              >
                {sorted[0].category}
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
                {sorted[0].title}
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'var(--gray-500)',
                  lineHeight: 1.7,
                  marginBottom: 28,
                }}
              >
                {sorted[0].excerpt}
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
                <time dateTime={sorted[0].date}>
                  {new Date(sorted[0].date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{sorted[0].readTime} de lectura</span>
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
          {sorted.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 20,
                overflow: 'hidden',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
            >
              {/* Image */}
              <div
                style={{
                  height: 200,
                  background:
                    'linear-gradient(135deg, #1a1a1a 0%, #111 50%, #0a0a0a 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(48,209,88,0.04), transparent 60%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 64,
                      fontWeight: 900,
                      color: 'rgba(255,255,255,0.02)',
                      userSelect: 'none',
                    }}
                  >
                    CZ
                  </span>
                </div>
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
                      background: 'rgba(48,209,88,0.1)',
                      color: 'var(--green)',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '5px 12px',
                      borderRadius: 980,
                      border: '1px solid rgba(48,209,88,0.2)',
                    }}
                  >
                    {post.category}
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
          ))}
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
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 24,
            padding: '64px 48px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              fontWeight: 800,
              marginBottom: 20,
              letterSpacing: '-0.03em',
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
              background: 'var(--white)',
              color: 'var(--black)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '14px 36px',
              borderRadius: 980,
              transition: 'background 0.2s',
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
