import Link from 'next/link'

export default function ExitoPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
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
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(48, 209, 88, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#30d158"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
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
        <p
          style={{
            fontSize: '0.95rem',
            color: '#8e8e93',
            maxWidth: 400,
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}
        >
          Gracias por tu compra. Recibirás un email de confirmación en breve
          con los detalles de tu envío.
        </p>
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
            padding: '12px 28px',
            borderRadius: 980,
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  )
}
