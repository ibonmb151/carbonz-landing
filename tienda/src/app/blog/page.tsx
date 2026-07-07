import type { Metadata } from 'next'
import Link from 'next/link'
import { blogPosts } from '@/lib/blog-data'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: 'Blog — CarbonZ | Cúpulas de Carbono Forjado para Z900',
  description:
    'Artículos sobre carbono forjado, guías de instalación, comparativas y todo lo que necesitas saber sobre cúpulas de carbono para Kawasaki Z900.',
}

const ACCENT = '#30d158'

/* ── Visual treatment renderers ── */

function TreatmentA({ color }: { color: string }) {
  // Carbon fiber weave pattern
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `repeating-linear-gradient(45deg, ${color}08 0px, ${color}08 1px, transparent 1px, transparent 8px), repeating-linear-gradient(-45deg, ${color}08 0px, ${color}08 1px, transparent 1px, transparent 8px)`,
      }}
    />
  )
}

function TreatmentB({ color }: { color: string }) {
  // Abstract geometry — diagonal SVG lines
  return (
    <svg
      viewBox="0 0 400 250"
      fill="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <line
        x1="-20"
        y1="280"
        x2="200"
        y2="-30"
        stroke={color}
        strokeWidth="1"
        opacity="0.12"
      />
      <line
        x1="60"
        y1="310"
        x2="300"
        y2="-20"
        stroke={color}
        strokeWidth="1"
        opacity="0.08"
      />
      <line
        x1="150"
        y1="290"
        x2="420"
        y2="-10"
        stroke={color}
        strokeWidth="1"
        opacity="0.10"
      />
      <line
        x1="-40"
        y1="180"
        x2="180"
        y2="20"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.15"
      />
    </svg>
  )
}

function TreatmentC({ color }: { color: string }) {
  // Unique conic/radial gradient
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `conic-gradient(from 135deg at 50% 50%, transparent 0deg, ${color}0a 90deg, transparent 180deg, ${color}06 270deg, transparent 360deg)`,
      }}
    />
  )
}

function TreatmentD({ color }: { color: string }) {
  // Z900 silhouette — simplified naked bike SVG
  return (
    <svg
      viewBox="0 0 400 250"
      fill="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <g
        transform="translate(100, 70) scale(0.5)"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.05"
        fill="none"
      >
        {/* Front wheel */}
        <circle cx="40" cy="170" r="45" />
        {/* Rear wheel */}
        <circle cx="260" cy="170" r="45" />
        {/* Frame */}
        <path d="M40 170 L120 80 L200 60 L260 170" />
        <path d="M120 80 L200 60 L220 130 L160 170" />
        <path d="M160 170 L120 80" />
        {/* Tank */}
        <path d="M140 70 L190 55 L210 70 L180 85 Z" />
        {/* Seat */}
        <path d="M190 55 L250 55 L260 80 L210 70 Z" />
        {/* Handlebar */}
        <path d="M130 60 L110 40 L100 35" />
        <path d="M130 60 L140 40 L150 35" />
        {/* Exhaust */}
        <path d="M220 130 L280 120 L300 130" />
        {/* Front fork */}
        <path d="M40 170 L120 80" strokeWidth="2" />
      </g>
    </svg>
  )
}

function getTreatment(treatment: number, color: string) {
  switch (treatment) {
    case 0:
      return <TreatmentA color={color} />
    case 1:
      return <TreatmentB color={color} />
    case 2:
      return <TreatmentC color={color} />
    case 3:
      return <TreatmentD color={color} />
    default:
      return <TreatmentA color={color} />
  }
}

/* ── Featured card treatment (larger weave + more color) ── */

function FeaturedWeave({ color }: { color: string }) {
  return (
    <>
      {/* Base gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 70% 30%, ${color}12, transparent 55%)`,
        }}
      />
      {/* Large weave pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, ${color}0c 0px, ${color}0c 1.5px, transparent 1.5px, transparent 12px), repeating-linear-gradient(-45deg, ${color}0c 0px, ${color}0c 1.5px, transparent 1.5px, transparent 12px)`,
        }}
      />
      {/* Secondary weave layer for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(45deg, ${color}06 0px, ${color}06 1px, transparent 1px, transparent 6px), repeating-linear-gradient(-45deg, ${color}06 0px, ${color}06 1px, transparent 1px, transparent 6px)`,
        }}
      />
      {/* Radial highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 50% at 30% 60%, ${color}08, transparent 70%)`,
        }}
      />
    </>
  )
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const featured = sorted[0]

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#111',
        color: 'var(--white)',
        fontFamily: 'var(--font)',
      }}
    >
      <ScrollProgress />

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

      {/* Hero — taller, more spacious */}
      <section
        style={{
          padding: '220px 48px 100px',
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
            marginBottom: 28,
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
            marginBottom: 32,
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

      {/* Featured article — larger weave, more color */}
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
            {/* Image — featured weave */}
            <div
              style={{
                background: '#1a1a1a',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <FeaturedWeave color={ACCENT} />
              {/* Decorative line accent */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
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
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: ACCENT,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
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
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: 'var(--gray-500)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  width: 'fit-content',
                  marginBottom: 24,
                }}
              >
                {featured.category}
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
          {sorted.slice(1).map((post, idx) => {
            const treatmentIdx = idx % 4
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
                {/* Image — visual treatment */}
                <div
                  style={{
                    height: 200,
                    background: '#1a1a1a',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {getTreatment(treatmentIdx, ACCENT)}
                  {/* Bottom accent line */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
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
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        color: 'var(--gray-500)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
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
