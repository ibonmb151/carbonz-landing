'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('carbonz_cookies_accepted')
    if (!accepted) setShow(true)
  }, [])

  const accept = () => {
    localStorage.setItem('carbonz_cookies_accepted', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        background: '#1a1a1a',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        backdropFilter: 'saturate(150%) blur(16px)',
        WebkitBackdropFilter: 'saturate(150%) blur(16px)',
      }}
    >
      <p
        style={{
          fontSize: '0.8rem',
          color: 'var(--gray-400)',
          lineHeight: 1.5,
          margin: 0,
          flex: 1,
        }}
      >
        Usamos cookies técnicas para el funcionamiento de la tienda.{' '}
        <Link
          href="/politica-privacidad"
          style={{
            color: 'var(--gray-300)',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
          }}
        >
          Más información
        </Link>
      </p>
      <button
        onClick={accept}
        style={{
          flexShrink: 0,
          background: 'var(--green)',
          color: 'var(--black)',
          fontSize: '0.8rem',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: 980,
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'var(--font)',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#28b84c'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--green)'
        }}
      >
        Aceptar
      </button>
    </div>
  )
}
