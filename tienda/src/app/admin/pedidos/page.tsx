'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

interface Order {
  id: string
  stripe_session_id: string
  customer_name: string
  customer_email: string
  customer_address: string
  customer_city: string
  customer_postal: string
  customer_country: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: string
  tracking_number: string | null
  created_at: string
  updated_at: string
}

const statusOptions = [
  { value: 'pending', label: 'Pendiente', color: '#ff9f0a' },
  { value: 'processing', label: 'En preparación', color: '#64d2ff' },
  { value: 'shipped', label: 'Enviado', color: '#30d158' },
  { value: 'delivered', label: 'Entregado', color: '#30d158' },
  { value: 'failed', label: 'Fallido', color: '#ff453a' },
]

function PedidosContent() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('id')

  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [trackingInput, setTrackingInput] = useState('')

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [authStatus, router])

  // Fetch orders
  useEffect(() => {
    if (authStatus === 'authenticated') {
      fetch('/api/admin/orders')
        .then((res) => res.json())
        .then((data) => {
          setOrders(Array.isArray(data) ? data : [])
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [authStatus])

  // Fetch selected order
  useEffect(() => {
    if (selectedId && authStatus === 'authenticated') {
      fetch(`/api/admin/orders?id=${selectedId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setSelectedOrder(data)
            setTrackingInput(data.tracking_number || '')
          }
        })
        .catch(console.error)
    }
  }, [selectedId, authStatus])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(true)
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleTrackingUpdate = async (orderId: string) => {
    if (!trackingInput.trim()) return
    setUpdating(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, trackingNumber: trackingInput.trim() }),
      })
      const updated = await res.json()
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, tracking_number: trackingInput.trim(), status: 'shipped' }
            : o
        )
      )
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? { ...prev, tracking_number: trackingInput.trim(), status: 'shipped' }
            : null
        )
      }
    } catch (error) {
      console.error('Error updating tracking:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleSendTrackingEmail = async (orderId: string) => {
    if (!trackingInput.trim()) return
    setSendingEmail(true)
    setEmailSent(false)
    try {
      const res = await fetch('/api/admin/send-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, trackingNumber: trackingInput.trim() }),
      })
      if (res.ok) {
        setEmailSent(true)
        setTimeout(() => setEmailSent(false), 3000)
      }
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setSendingEmail(false)
    }
  }

  if (authStatus === 'loading' || loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#636366' }}>
        Cargando pedidos...
      </div>
    )
  }

  if (!session) return null

  const formatCents = (cents: number) => `€${(cents / 100).toFixed(2)}`

  const getStatusInfo = (status: string) =>
    statusOptions.find((s) => s.value === status) || statusOptions[0]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: '1.6rem',
          fontWeight: 800,
          color: '#f5f5f7',
          letterSpacing: '-0.03em',
        }}>
          Pedidos
        </h1>
        <p style={{
          fontSize: '0.8rem',
          color: '#636366',
          marginTop: 4,
        }}>
          {orders.length} pedido{orders.length !== 1 ? 's' : ''} en total
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr',
        gap: 20,
        alignItems: 'start',
      }}>
        {/* Orders Table */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.04)',
          overflow: 'hidden',
        }}>
          {orders.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#636366',
              fontSize: '0.8rem',
            }}>
              No hay pedidos aún
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.8rem',
              }}>
                <thead>
                  <tr>
                    {['ID', 'Cliente', 'Email', 'Total', 'Estado', 'Fecha'].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '14px 16px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: '#636366',
                          fontSize: '0.65rem',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status)
                    const isSelected = selectedOrder?.id === order.id
                    return (
                      <tr
                        key={order.id}
                        onClick={() => {
                          setSelectedOrder(order)
                          setTrackingInput(order.tracking_number || '')
                          router.push(`/admin/pedidos?id=${order.id}`, { scroll: false })
                        }}
                        style={{
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(48,209,88,0.04)' : 'transparent',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <td style={{ padding: '14px 16px', color: '#8e8e93', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                          {order.id.slice(0, 16)}...
                        </td>
                        <td style={{ padding: '14px 16px', color: '#f5f5f7', fontWeight: 500 }}>
                          {order.customer_name || '—'}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#8e8e93', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {order.customer_email}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#f5f5f7', fontWeight: 700 }}>
                          {formatCents(order.total)}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: 6,
                            background: `${statusInfo.color}15`,
                            color: statusInfo.color,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                          }}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#48484a', fontSize: '0.7rem' }}>
                          {new Date(order.created_at).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Detail Panel */}
        {selectedOrder && (
          <div style={{
            background: '#1a1a1a',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.04)',
            overflow: 'hidden',
            position: 'sticky',
            top: 20,
          }}>
            {/* Detail Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#f5f5f7',
              }}>
                Detalle del pedido
              </h3>
              <button
                onClick={() => {
                  setSelectedOrder(null)
                  router.push('/admin/pedidos', { scroll: false })
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: 'none',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#8e8e93',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Customer Info */}
              <div style={{ marginBottom: 20 }}>
                <DetailRow label="Cliente" value={selectedOrder.customer_name || '—'} />
                <DetailRow label="Email" value={selectedOrder.customer_email} />
                <DetailRow label="Dirección" value={selectedOrder.customer_address || '—'} />
                <DetailRow label="Ciudad" value={selectedOrder.customer_city || '—'} />
                <DetailRow label="Código postal" value={selectedOrder.customer_postal || '—'} />
                <DetailRow label="País" value={selectedOrder.customer_country || '—'} />
              </div>

              {/* Items */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: '#636366',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  Productos
                </div>
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#f5f5f7', fontWeight: 500 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#636366' }}>
                        ×{item.quantity}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#f5f5f7', fontWeight: 600 }}>
                      {formatCents(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                <div style={{
                  padding: '12px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f5f5f7' }}>Total</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f5f5f7' }}>
                    {formatCents(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: '#636366',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  Estado
                </div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  disabled={updating}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#f5f5f7',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font)',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none' as const,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238e8e93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                  }}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: '#1a1a1a' }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tracking Number */}
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: '#636366',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  Nº de tracking
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Ej: 1Z999AA10123456784"
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font)',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => handleTrackingUpdate(selectedOrder.id)}
                    disabled={updating || !trackingInput.trim()}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 10,
                      border: 'none',
                      background: trackingInput.trim() ? '#30d158' : '#48484a',
                      color: trackingInput.trim() ? '#0a0a0a' : '#8e8e93',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: trackingInput.trim() ? 'pointer' : 'not-allowed',
                      fontFamily: 'var(--font)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>

              {/* Send Tracking Email */}
              <button
                onClick={() => handleSendTrackingEmail(selectedOrder.id)}
                disabled={sendingEmail || !trackingInput.trim()}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 10,
                  border: '1px solid rgba(48,209,88,0.3)',
                  background: emailSent
                    ? 'rgba(48,209,88,0.15)'
                    : sendingEmail
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(48,209,88,0.08)',
                  color: emailSent ? '#30d158' : '#30d158',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: sendingEmail || !trackingInput.trim() ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {emailSent ? (
                  <>✓ Email enviado</>
                ) : sendingEmail ? (
                  <>Enviando...</>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Enviar email de tracking
                  </>
                )}
              </button>

              {/* Stripe Session ID */}
              <div style={{
                marginTop: 16,
                padding: '10px 12px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{
                  fontSize: '0.6rem',
                  color: '#48484a',
                  marginBottom: 4,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}>
                  Stripe Session
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#636366',
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                }}>
                  {selectedOrder.stripe_session_id}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 0',
      borderBottom: '1px solid rgba(255,255,255,0.03)',
    }}>
      <span style={{ fontSize: '0.7rem', color: '#636366' }}>{label}</span>
      <span style={{ fontSize: '0.7rem', color: '#f5f5f7', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>
        {value}
      </span>
    </div>
  )
}

export default function PedidosPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#636366' }}>
        Cargando...
      </div>
    }>
      <PedidosContent />
    </Suspense>
  )
}
