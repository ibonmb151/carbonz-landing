'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

interface Coupon {
  id: number
  code: string
  type: string
  value: number
  min_order: number
  max_uses: number
  used_count: number
  active: boolean
  expires_at: string | null
  created_at: string
}

export default function CuponesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Form state
  const [formCode, setFormCode] = useState('')
  const [formType, setFormType] = useState('percentage')
  const [formValue, setFormValue] = useState('')
  const [formMinOrder, setFormMinOrder] = useState('')
  const [formMaxUses, setFormMaxUses] = useState('')
  const [formExpires, setFormExpires] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/coupons')
      const data = await res.json()
      setCoupons(Array.isArray(data) ? data : [])
    } catch {
      console.error('Error fetching coupons')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') fetchCoupons()
  }, [status, fetchCoupons])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const generateCode = () => {
    const prefixes = ['CARBON', 'Z900', 'VERANO', 'DESCUENTO', 'VIP', 'BIKE']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = Math.floor(Math.random() * 90 + 10)
    setFormCode(`${prefix}${suffix}`)
  }

  const resetForm = () => {
    setFormCode('')
    setFormType('percentage')
    setFormValue('')
    setFormMinOrder('')
    setFormMaxUses('')
    setFormExpires('')
    setEditingId(null)
  }

  const openNewModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (coupon: Coupon) => {
    setFormCode(coupon.code)
    setFormType(coupon.type)
    setFormValue(String(coupon.value))
    setFormMinOrder(coupon.min_order ? String(coupon.min_order / 100) : '')
    setFormMaxUses(coupon.max_uses ? String(coupon.max_uses) : '')
    setFormExpires(coupon.expires_at ? coupon.expires_at.split('T')[0] : '')
    setEditingId(coupon.id)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formCode.trim() || !formValue) {
      showToast('Codigo y valor son obligatorios', 'error')
      return
    }

    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        code: formCode.trim().toUpperCase(),
        type: formType,
        value: formType === 'percentage' ? Number(formValue) : Math.round(Number(formValue) * 100),
        min_order: formMinOrder ? Math.round(Number(formMinOrder) * 100) : 0,
        max_uses: formMaxUses ? Number(formMaxUses) : 0,
        expires_at: formExpires || null,
      }

      const url = editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        showToast(editingId ? 'Cupon actualizado' : 'Cupon creado')
        setShowModal(false)
        resetForm()
        fetchCoupons()
      } else {
        const err = await res.json().catch(() => ({ error: 'Error' }))
        showToast(err.error || 'Error al guardar cupon', 'error')
      }
    } catch {
      showToast('Error de conexion', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !coupon.active }),
      })
      showToast(coupon.active ? 'Cupon desactivado' : 'Cupon activado')
      fetchCoupons()
    } catch {
      showToast('Error al actualizar cupon', 'error')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminar este cupon?')) return
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
      showToast('Cupon eliminado')
      fetchCoupons()
    } catch {
      showToast('Error al eliminar cupon', 'error')
    }
  }

  // Stats
  const totalCoupons = coupons.length
  const activeCoupons = coupons.filter(c => c.active).length
  const usedCoupons = coupons.reduce((sum, c) => sum + c.used_count, 0)
  const totalDiscount = coupons.reduce((sum, c) => {
    if (c.type === 'percentage') return sum + c.used_count * c.value
    return sum + c.used_count * c.value
  }, 0)

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === 'percentage') return `${coupon.value}%`
    return `EUR ${(coupon.value / 100).toFixed(2)}`
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#636366' }}>
        Cargando cupones...
      </div>
    )
  }

  if (!session) return null

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 2000,
          padding: '12px 20px', borderRadius: 12,
          background: toast.type === 'error' ? 'rgba(255,69,58,0.15)' : 'rgba(48,209,88,0.15)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(255,69,58,0.3)' : 'rgba(48,209,88,0.3)'}`,
          color: toast.type === 'error' ? '#ff453a' : '#30d158',
          fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font)',
          backdropFilter: 'blur(12px)',
          animation: 'toastIn 0.3s ease-out',
        }}>
          {toast.type === 'error' ? '✕ ' : '✓ '}{toast.message}
          <style>{`@keyframes toastIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f5f5f7', letterSpacing: '-0.03em' }}>
            Cupones
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#636366', marginTop: 4 }}>
            Gestiona descuentos y promociones
          </p>
        </div>
        <button
          onClick={openNewModal}
          style={{
            padding: '10px 20px', borderRadius: 10, border: 'none',
            background: '#30d158', color: '#0a0a0a', fontSize: '0.8rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font)',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo cupon
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total cupones', value: totalCoupons, color: '#f5f5f7', icon: '🎟️' },
          { label: 'Activos', value: activeCoupons, color: '#30d158', icon: '✅' },
          { label: 'Usos totales', value: usedCoupons, color: '#64d2ff', icon: '📊' },
          { label: 'Descuento total', value: `EUR ${(totalDiscount / 100).toFixed(2)}`, color: '#ff9f0a', icon: '💰' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#1a1a1a', borderRadius: 14, padding: '18px 20px',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 8,
            }}>
              <span style={{
                fontSize: '0.65rem', color: '#636366', textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>{stat.label}</span>
              <span style={{ fontSize: '1rem' }}>{stat.icon}</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Coupons Table */}
      <div style={{
        background: '#1a1a1a', borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden',
      }}>
        {coupons.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🎟️</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f5f5f7', marginBottom: 4 }}>
              No hay cupones creados
            </div>
            <div style={{ fontSize: '0.72rem', color: '#636366' }}>
              Crea tu primer cupon para ofrecer descuentos a tus clientes
            </div>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '120px 100px 80px 100px 80px 80px 100px',
              gap: 8,
              padding: '12px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.6rem', fontWeight: 600, color: '#636366',
              textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              <span>Codigo</span>
              <span>Tipo</span>
              <span>Valor</span>
              <span>Pedido min.</span>
              <span>Usos</span>
              <span>Estado</span>
              <span style={{ textAlign: 'right' }}>Acciones</span>
            </div>

            {/* Table Rows */}
            {coupons.map((coupon) => (
              <div
                key={coupon.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 100px 80px 100px 80px 80px 100px',
                  gap: 8,
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  fontSize: '0.8rem', fontWeight: 700, color: '#f5f5f7',
                  fontFamily: 'monospace', letterSpacing: '0.05em',
                }}>
                  {coupon.code}
                </span>
                <span style={{
                  fontSize: '0.7rem', color: coupon.type === 'percentage' ? '#64d2ff' : '#bf5af2',
                  fontWeight: 500,
                }}>
                  {coupon.type === 'percentage' ? 'Porcentaje' : 'Fijo'}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f5f5f7' }}>
                  {formatValue(coupon)}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#8e8e93' }}>
                  {coupon.min_order > 0 ? `EUR ${(coupon.min_order / 100).toFixed(2)}` : '—'}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#8e8e93' }}>
                  {coupon.used_count}{coupon.max_uses > 0 ? `/${coupon.max_uses}` : ''}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: '0.65rem', fontWeight: 600,
                  color: coupon.active ? '#30d158' : '#636366',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: coupon.active ? '#30d158' : '#636366',
                  }} />
                  {coupon.active ? 'Activo' : 'Inactivo'}
                </span>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => openEditModal(coupon)}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
                      color: '#8e8e93', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem',
                    }}
                    title="Editar"
                  >✏️</button>
                  <button
                    onClick={() => handleToggleActive(coupon)}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
                      color: coupon.active ? '#ff9f0a' : '#30d158', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem',
                    }}
                    title={coupon.active ? 'Desactivar' : 'Activar'}
                  >{coupon.active ? '⏸️' : '▶️'}</button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: '1px solid rgba(255,69,58,0.2)', background: 'transparent',
                      color: '#ff453a', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem',
                    }}
                    title="Eliminar"
                  >🗑️</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); resetForm() } }}
        >
          <div style={{
            background: '#1a1a1a', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.08)',
            width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f7' }}>
                {editingId ? 'Editar cupon' : 'Nuevo cupon'}
              </h3>
              <button
                onClick={() => { setShowModal(false); resetForm() }}
                style={{
                  width: 28, height: 28, borderRadius: 8, border: 'none',
                  background: 'rgba(255,255,255,0.06)', color: '#8e8e93',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem',
                }}
              >✕</button>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Code */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>
                  Codigo del cupon
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                    placeholder="Ej: CARBON20"
                    style={{
                      flex: 1, padding: '10px 12px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'monospace',
                      letterSpacing: '0.1em', outline: 'none', textTransform: 'uppercase',
                    }}
                  />
                  <button
                    onClick={generateCode}
                    style={{
                      padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
                      background: 'transparent', color: '#8e8e93', fontSize: '0.7rem', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'var(--font)', whiteSpace: 'nowrap',
                    }}
                  >
                    Auto
                  </button>
                </div>
              </div>

              {/* Type + Value */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>
                    Tipo
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                      outline: 'none', cursor: 'pointer', appearance: 'none' as const,
                    }}
                  >
                    <option value="percentage" style={{ background: '#1a1a1a' }}>Porcentaje (%)</option>
                    <option value="fixed" style={{ background: '#1a1a1a' }}>Fijo (EUR)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>
                    Valor {formType === 'percentage' ? '(1-100)' : '(en EUR)'}
                  </label>
                  <input
                    type="number"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder={formType === 'percentage' ? '20' : '10.00'}
                    min={formType === 'percentage' ? 1 : 0.01}
                    max={formType === 'percentage' ? 100 : undefined}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                      outline: 'none', boxSizing: 'border-box' as const,
                    }}
                  />
                </div>
              </div>

              {/* Min Order + Max Uses */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>
                    Pedido minimo (EUR)
                  </label>
                  <input
                    type="number"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value)}
                    placeholder="0 = sin minimo"
                    min={0}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                      outline: 'none', boxSizing: 'border-box' as const,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>
                    Usos maximos
                  </label>
                  <input
                    type="number"
                    value={formMaxUses}
                    onChange={(e) => setFormMaxUses(e.target.value)}
                    placeholder="0 = ilimitado"
                    min={0}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                      outline: 'none', boxSizing: 'border-box' as const,
                    }}
                  />
                </div>
              </div>

              {/* Expires */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>
                  Fecha de expiracion
                </label>
                <input
                  type="date"
                  value={formExpires}
                  onChange={(e) => setFormExpires(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                    color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                    outline: 'none', boxSizing: 'border-box' as const,
                    colorScheme: 'dark',
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { setShowModal(false); resetForm() }}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
                    color: '#8e8e93', fontSize: '0.8rem', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'var(--font)',
                  }}
                >Cancelar</button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formCode.trim() || !formValue}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                    background: !saving && formCode.trim() && formValue ? '#30d158' : '#48484a',
                    color: !saving && formCode.trim() && formValue ? '#0a0a0a' : '#8e8e93',
                    fontSize: '0.8rem', fontWeight: 600,
                    cursor: !saving && formCode.trim() && formValue ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font)',
                  }}
                >
                  {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear cupon'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
