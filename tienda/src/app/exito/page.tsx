import Link from 'next/link'
import { Suspense } from 'react'

async function ExitoContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#111',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 440 }}>
        {/* Animated checkmark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(48, 209, 88, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
            animation: 'checkPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#30d158"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              animation: 'checkDraw 0.4s ease-out 0.2s both',
            }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#f5f5f7',
            marginBottom: 12,
          }}
        >
          Pedido confirmado
        </h1>

        {/* Order ID */}
        {sessionId && (
          <div
            style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 8,
              padding: '10px 16px',
              marginBottom: 20,
              display: 'inline-block',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                color: '#8e8e93',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              ID del pedido
            </span>
            <br />
            <span
              style={{
                fontSize: '0.8rem',
                color: '#f5f5f7',
                fontFamily: 'monospace',
                fontWeight: 600,
                wordBreak: 'break-all',
              }}
            >
              {sessionId}
            </span>
          </div>
        )}

        {/* Description */}
        <p
          style={{
            fontSize: '0.95rem',
            color: '#8e8e93',
            maxWidth: 360,
            margin: '0 auto 12px',
            lineHeight: 1.6,
          }}
        >
          Gracias por tu compra. Recibirás un email de confirmación en breve
          con los detalles de tu envío.
        </p>

        {/* Spam notice */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#636366',
            maxWidth: 360,
            margin: '0 auto 16px',
            lineHeight: 1.5,
            textAlign: 'center',
          }}
        >
          ¿No lo ves? Revisa tu carpeta de <strong>spam</strong> o <strong>promociones</strong>.
        </p>

        {/* Shipping info */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.8rem',
            color: '#636366',
            marginBottom: 36,
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 8,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          Envío en 3-5 días laborables
        </div>

        {/* CTA Button */}
        <div>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#000',
              background: '#f5f5f7',
              padding: '14px 32px',
              borderRadius: 980,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#111',
          }}
        >
          <div style={{ color: '#8e8e93', fontSize: '0.9rem' }}>Cargando...</div>
        </div>
      }
    >
      <ExitoContent searchParams={searchParams} />
    </Suspense>
  )
}
