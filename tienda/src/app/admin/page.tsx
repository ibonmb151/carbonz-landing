'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  total: number
  status: string
  created_at: string
}

interface Stats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  todayOrders: number
  todayRevenue: number
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: '#ff9f0a' },
  processing: { label: 'En preparación', color: '#64d2ff' },
  shipped: { label: 'Enviado', color: '#30d158' },
  delivered: { label: 'Entregado', color: '#30d158' },
  failed: { label: 'Fallido', color: '#ff453a' },
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/admin/stats')
        .then((res) => res.json())
        .then((data) => {
          setStats(data.stats)
          setRecentOrders(data.recentOrders)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [status])

  if (status === 'loading' || loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#636366' }}>
        Cargando...
      </div>
    )
  }

  if (!session) return null

  const formatCents = (cents: number) => `€${(cents / 100).toFixed(2)}`

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
          Dashboard
        </h1>
        <p style={{
          fontSize: '0.8rem',
          color: '#636366',
          marginTop: 4,
        }}>
          Resumen de tu tienda
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
        marginBottom: 32,
      }}>
        <StatCard
          title="Total pedidos"
          value={String(stats?.totalOrders || 0)}
          icon="📦"
        />
        <StatCard
          title="Facturación total"
          value={formatCents(stats?.totalRevenue || 0)}
          icon="💰"
        />
        <StatCard
          title="Pedidos hoy"
          value={String(stats?.todayOrders || 0)}
          icon="📅"
        />
        <StatCard
          title="Ingresos hoy"
          value={formatCents(stats?.todayRevenue || 0)}
          icon="📈"
        />
        <StatCard
          title="Pendientes"
          value={String(stats?.pendingOrders || 0)}
          icon="⏳"
          accent={stats?.pendingOrders ? '#ff9f0a' : undefined}
        />
      </div>

      {/* Recent Orders */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#f5f5f7',
          }}>
            Pedidos recientes
          </h2>
          <Link
            href="/admin/pedidos"
            style={{
              fontSize: '0.72rem',
              fontWeight: 500,
              color: '#30d158',
              textDecoration: 'none',
            }}
          >
            Ver todos →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: '#636366',
            fontSize: '0.8rem',
          }}>
            No hay pedidos aún
          </div>
        ) : (
          <div>
            {recentOrders.map((order) => {
              const statusInfo = statusLabels[order.status] || statusLabels.pending
              return (
                <div
                  key={order.id}
                  style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onClick={() => router.push(`/admin/pedidos?id=${order.id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#f5f5f7',
                      marginBottom: 2,
                    }}>
                      {order.customer_name || 'Sin nombre'}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#636366',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {order.customer_email}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#f5f5f7',
                    flexShrink: 0,
                  }}>
                    {formatCents(order.total)}
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: `${statusInfo.color}15`,
                    color: statusInfo.color,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {statusInfo.label}
                  </div>
                  <div style={{
                    fontSize: '0.65rem',
                    color: '#48484a',
                    flexShrink: 0,
                    minWidth: 70,
                    textAlign: 'right',
                  }}>
                    {new Date(order.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, accent }: {
  title: string
  value: string
  icon: string
  accent?: string
}) {
  return (
    <div style={{
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
          fontSize: '0.65rem',
          fontWeight: 600,
          color: '#636366',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          {title}
        </span>
        <span style={{ fontSize: '1rem' }}>{icon}</span>
      </div>
      <div style={{
        fontSize: '1.4rem',
        fontWeight: 800,
        color: accent || '#f5f5f7',
        letterSpacing: '-0.03em',
      }}>
        {value}
      </div>
    </div>
  )
}
