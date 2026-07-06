'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/cart-store'

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + '\u20AC'
}

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } =
    useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Expose openCart globally for the main page buttons
  useEffect(() => {
    ;(window as unknown as Record<string, unknown>).openCart = () =>
      setIsOpen(true)
    return () => {
      delete (window as unknown as Record<string, unknown>).openCart
    }
  }, [])

  // Escape key closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        showToast('Error al crear la sesion de pago')
      }
    } catch {
      showToast('Error de conexion')
    }
  }

  const count = mounted ? itemCount() : 0
  const totalCents = mounted ? total() : 0
  const iva = Math.round(totalCents * 0.21)

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className={`cart-sidebar${isOpen ? ' open' : ''}`}>
        <div className="cart-header">
          <h3>Tu carrito</h3>
          <button
            className="cart-close"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar carrito"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cart-items">
          {!mounted || items.length === 0 ? (
            <div className="cart-empty">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p>Tu carrito esta vacio</p>
              <span>Anade productos para empezar</span>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-top">
                    <span className="cart-item-name">{item.name}</span>
                    <button
                      className="cart-item-remove"
                      onClick={() => {
                        removeItem(item.id)
                        showToast('Eliminado del carrito')
                      }}
                      aria-label="Eliminar"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="cart-item-price">
                    {formatPrice(item.price)}
                  </div>
                  <div className="cart-item-bottom">
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeItem(item.id)
                            showToast('Eliminado del carrito')
                          } else {
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        }}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => {
                          if (item.quantity >= 2) {
                            showToast('Maximo 2 unidades')
                          } else {
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-item-subtotal">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {mounted && items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span className="label">Subtotal</span>
              <span className="value">{formatPrice(totalCents)}</span>
            </div>
            <div className="cart-summary-row">
              <span className="label">Envio</span>
              <span className="value" style={{ color: 'var(--green)' }}>
                Gratis
              </span>
            </div>
            <div className="cart-summary-row">
              <span className="label">IVA (21%)</span>
              <span className="value">{formatPrice(iva)}</span>
            </div>
            <div className="cart-summary-row total">
              <span className="label">Total</span>
              <span className="value">{formatPrice(totalCents + iva)}</span>
            </div>
            <button
              className="cart-btn-checkout"
              onClick={handleCheckout}
            >
              Tramitar pedido
            </button>
            <button
              className="cart-btn-continue"
              onClick={() => setIsOpen(false)}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      <div className={`cart-toast${toast ? ' show' : ''}`}>{toast}</div>
    </>
  )
}
