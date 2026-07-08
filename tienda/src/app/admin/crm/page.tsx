'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  postal: string
  country: string
  notes: string
  tags: string[]
  total_orders: number
  total_spent: number
  created_at: string
  updated_at: string
}

interface Communication {
  id: number
  customer_id: number
  type: string
  subject: string
  content: string
  created_at: string
}

interface CustomerStats {
  total: number
  thisMonth: number
  vip: number
}

const commTypeOptions = [
  { value: 'email', label: 'Email', color: '#64d2ff' },
  { value: 'phone', label: 'Teléfono', color: '#30d158' },
  { value: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { value: 'note', label: 'Nota', color: '#ff9f0a' },
  { value: 'meeting', label: 'Reunión', color: '#bf5af2' },
]

export default function CrmPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [communications, setCommunications] = useState<Communication[]>([])
  const [stats, setStats] = useState<CustomerStats>({ total: 0, thisMonth: 0, vip: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Edit form state
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editPostal, setEditPostal] = useState('')
  const [editCountry, setEditCountry] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editTags, setEditTags] = useState('')

  // New customer form
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newPostal, setNewPostal] = useState('')
  const [newCountry, setNewCountry] = useState('ES')

  // Communication form
  const [commType, setCommType] = useState('email')
  const [commSubject, setCommSubject] = useState('')
  const [commContent, setCommContent] = useState('')
  const [sendingComm, setSendingComm] = useState(false)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [authStatus, router])

  // Fetch customers and stats
  useEffect(() => {
    if (authStatus === 'authenticated') {
      Promise.all([
        fetch('/api/admin/customers').then(r => r.json()),
        fetch('/api/admin/customers?stats=1').then(r => r.json()),
      ])
        .then(([customersData, statsData]) => {
          setCustomers(Array.isArray(customersData) ? customersData : [])
          setStats(statsData)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [authStatus])

  // Fetch communications when customer selected
  useEffect(() => {
    if (selectedCustomer) {
      fetch(`/api/admin/customers/${selectedCustomer.id}/communications`)
        .then(r => r.json())
        .then(data => setCommunications(Array.isArray(data) ? data : []))
        .catch(console.error)

      // Sync edit fields
      setEditPhone(selectedCustomer.phone || '')
      setEditAddress(selectedCustomer.address || '')
      setEditCity(selectedCustomer.city || '')
      setEditPostal(selectedCustomer.postal || '')
      setEditCountry(selectedCustomer.country || 'ES')
      setEditNotes(selectedCustomer.notes || '')
      setEditTags((selectedCustomer.tags || []).join(', '))
    }
  }, [selectedCustomer])

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  })

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowDeleteConfirm(false)
  }

  const handleSaveCustomer = async () => {
    if (!selectedCustomer) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: editPhone,
          address: editAddress,
          city: editCity,
          postal: editPostal,
          country: editCountry,
          notes: editNotes,
          tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      const updated = await res.json()
      setSelectedCustomer(updated)
      setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving customer:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCreateCustomer = async () => {
    if (!newName.trim() || !newEmail.trim()) return
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          phone: newPhone.trim(),
          address: newAddress.trim(),
          city: newCity.trim(),
          postal: newPostal.trim(),
          country: newCountry.trim() || 'ES',
        }),
      })
      if (res.ok) {
        const customer = await res.json()
        setCustomers(prev => [customer, ...prev])
        setSelectedCustomer(customer)
        setShowNewModal(false)
        setNewName('')
        setNewEmail('')
        setNewPhone('')
        setNewAddress('')
        setNewCity('')
        setNewPostal('')
        setNewCountry('ES')
        setStats(prev => ({ ...prev, total: prev.total + 1, thisMonth: prev.thisMonth + 1 }))
      }
    } catch (error) {
      console.error('Error creating customer:', error)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return
    try {
      await fetch(`/api/admin/customers/${selectedCustomer.id}`, { method: 'DELETE' })
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id))
      setSelectedCustomer(null)
      setShowDeleteConfirm(false)
      setStats(prev => ({ ...prev, total: prev.total - 1 }))
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const handleAddCommunication = async () => {
    if (!selectedCustomer || !commContent.trim()) return
    setSendingComm(true)
    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer.id}/communications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: commType,
          subject: commSubject.trim(),
          content: commContent.trim(),
        }),
      })
      if (res.ok) {
        const comm = await res.json()
        setCommunications(prev => [comm, ...prev])
        setCommSubject('')
        setCommContent('')
      }
    } catch (error) {
      console.error('Error adding communication:', error)
    } finally {
      setSendingComm(false)
    }
  }

  const formatEuros = (cents: number) => `€${(cents / 100).toFixed(2)}`

  const getCommTypeInfo = (type: string) =>
    commTypeOptions.find(o => o.value === type) || commTypeOptions[3]

  if (authStatus === 'loading' || loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#636366' }}>
        Cargando CRM...
      </div>
    )
  }

  if (!session) return null

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f5f5f7', letterSpacing: '-0.03em' }}>
            CRM
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#636366', marginTop: 4 }}>
            Gestión de clientes y comunicaciones
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            background: '#30d158',
            color: '#0a0a0a',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo cliente
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total clientes', value: stats.total, color: '#f5f5f7' },
          { label: 'Nuevos este mes', value: stats.thisMonth, color: '#30d158' },
          { label: 'VIP (2+ pedidos)', value: stats.vip, color: '#ff9f0a' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#1a1a1a',
            borderRadius: 14,
            padding: '18px 20px',
            border: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{ fontSize: '0.65rem', color: '#636366', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedCustomer ? '1fr 420px' : '1fr', gap: 20, alignItems: 'start' }}>
        {/* Customer List */}
        <div style={{
          background: '#1a1a1a',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.04)',
          overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ position: 'relative' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#636366" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  color: '#f5f5f7',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Customer Cards */}
          <div style={{ maxHeight: 'calc(100vh - 320px)', overflowY: 'auto' }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: '#636366', fontSize: '0.8rem' }}>
                {searchQuery ? 'No se encontraron clientes' : 'No hay clientes aún'}
              </div>
            ) : (
              filteredCustomers.map((customer) => {
                const isSelected = selectedCustomer?.id === customer.id
                return (
                  <div
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    style={{
                      padding: '16px 20px',
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f5f5f7' }}>
                        {customer.name}
                      </span>
                      {customer.total_orders >= 2 && (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: 'rgba(255,159,10,0.12)',
                          color: '#ff9f0a',
                          fontSize: '0.6rem',
                          fontWeight: 600,
                        }}>
                          VIP
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#636366', marginBottom: 6 }}>
                      {customer.email}
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.65rem', color: '#48484a' }}>
                      <span>{customer.total_orders} pedidos</span>
                      <span>{formatEuros(customer.total_spent)}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Customer Detail Panel */}
        {selectedCustomer ? (
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
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f7', marginBottom: 2 }}>
                  {selectedCustomer.name}
                </h3>
                <div style={{ fontSize: '0.7rem', color: '#636366' }}>
                  {selectedCustomer.email}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: 'none',
                    background: 'rgba(255,69,58,0.1)', color: '#ff453a',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  🗑
                </button>
                <button
                  onClick={() => { setSelectedCustomer(null); setShowDeleteConfirm(false) }}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: 'none',
                    background: 'rgba(255,255,255,0.06)', color: '#8e8e93',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ padding: '20px 24px', maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
              {/* Delete Confirmation */}
              {showDeleteConfirm && (
                <div style={{
                  marginBottom: 16, padding: 16, borderRadius: 12,
                  background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.2)',
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#ff453a', fontWeight: 600, marginBottom: 8 }}>
                    ¿Eliminar este cliente?
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8e8e93', marginBottom: 12 }}>
                    Esta acción no se puede deshacer. Se eliminarán también todas las comunicaciones.
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={handleDeleteCustomer}
                      style={{
                        padding: '8px 16px', borderRadius: 8, border: 'none',
                        background: '#ff453a', color: '#fff', fontSize: '0.75rem', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'var(--font)',
                      }}
                    >
                      Sí, eliminar
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                        background: 'transparent', color: '#8e8e93', fontSize: '0.75rem', fontWeight: 500,
                        cursor: 'pointer', fontFamily: 'var(--font)',
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Editable Fields */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#636366', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Información de contacto
                </div>

                <FieldInput label="Teléfono" value={editPhone} onChange={setEditPhone} placeholder="+34 600 000 000" />
                <FieldInput label="Dirección" value={editAddress} onChange={setEditAddress} placeholder="Calle, número" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <FieldInput label="Ciudad" value={editCity} onChange={setEditCity} placeholder="Bilbao" />
                  <FieldInput label="Código Postal" value={editPostal} onChange={setEditPostal} placeholder="48001" />
                </div>
                <FieldInput label="País" value={editCountry} onChange={setEditCountry} placeholder="ES" />
                <FieldInput label="Tags" value={editTags} onChange={setEditTags} placeholder="vip, motociclista, frecuente" />
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>Notas</label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Notas sobre el cliente..."
                    rows={3}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                      outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  onClick={handleSaveCustomer}
                  disabled={saving}
                  style={{
                    width: '100%', padding: '10px', borderRadius: 10, border: 'none',
                    background: saved ? 'rgba(48,209,88,0.15)' : '#30d158',
                    color: saved ? '#30d158' : '#0a0a0a',
                    fontSize: '0.8rem', fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font)', transition: 'all 0.2s',
                  }}
                >
                  {saved ? '✓ Guardado' : saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>

              {/* Communications */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#636366', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Comunicaciones ({communications.length})
                </div>

                {/* Add Communication Form */}
                <div style={{
                  padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)', marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <select
                      value={commType}
                      onChange={(e) => setCommType(e.target.value)}
                      style={{
                        padding: '8px 10px', borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                        color: '#f5f5f7', fontSize: '0.75rem', fontFamily: 'var(--font)',
                        outline: 'none', cursor: 'pointer', appearance: 'none' as const,
                      }}
                    >
                      {commTypeOptions.map(o => (
                        <option key={o.value} value={o.value} style={{ background: '#1a1a1a' }}>{o.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={commSubject}
                      onChange={(e) => setCommSubject(e.target.value)}
                      placeholder="Asunto (opcional)"
                      style={{
                        flex: 1, padding: '8px 10px', borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                        color: '#f5f5f7', fontSize: '0.75rem', fontFamily: 'var(--font)', outline: 'none',
                      }}
                    />
                  </div>
                  <textarea
                    value={commContent}
                    onChange={(e) => setCommContent(e.target.value)}
                    placeholder="Escribe el contenido..."
                    rows={2}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: 8,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7', fontSize: '0.75rem', fontFamily: 'var(--font)',
                      outline: 'none', resize: 'none' as const, marginBottom: 8, boxSizing: 'border-box',
                    }}
                  />
                  <button
                    onClick={handleAddCommunication}
                    disabled={sendingComm || !commContent.trim()}
                    style={{
                      padding: '8px 16px', borderRadius: 8, border: 'none',
                      background: commContent.trim() ? '#30d158' : '#48484a',
                      color: commContent.trim() ? '#0a0a0a' : '#8e8e93',
                      fontSize: '0.75rem', fontWeight: 600,
                      cursor: commContent.trim() ? 'pointer' : 'not-allowed',
                      fontFamily: 'var(--font)',
                    }}
                  >
                    {sendingComm ? 'Enviando...' : 'Añadir'}
                  </button>
                </div>

                {/* Timeline */}
                {communications.length === 0 ? (
                  <div style={{ padding: '24px 0', textAlign: 'center', color: '#48484a', fontSize: '0.75rem' }}>
                    Sin comunicaciones registradas
                  </div>
                ) : (
                  communications.map((comm) => {
                    const typeInfo = getCommTypeInfo(comm.type)
                    return (
                      <div key={comm.id} style={{
                        padding: '12px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 6,
                            background: `${typeInfo.color}15`, color: typeInfo.color,
                            fontSize: '0.6rem', fontWeight: 600,
                          }}>
                            {typeInfo.label}
                          </span>
                          {comm.subject && (
                            <span style={{ fontSize: '0.75rem', color: '#f5f5f7', fontWeight: 500 }}>
                              {comm.subject}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#8e8e93', lineHeight: 1.5 }}>
                          {comm.content}
                        </div>
                        <div style={{ fontSize: '0.6rem', color: '#48484a', marginTop: 4 }}>
                          {new Date(comm.created_at).toLocaleString('es-ES')}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Meta */}
              <div style={{
                padding: 12, borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.6rem', color: '#48484a', textTransform: 'uppercase' }}>Creado</span>
                  <span style={{ fontSize: '0.65rem', color: '#636366' }}>
                    {new Date(selectedCustomer.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.6rem', color: '#48484a', textTransform: 'uppercase' }}>Última actualización</span>
                  <span style={{ fontSize: '0.65rem', color: '#636366' }}>
                    {new Date(selectedCustomer.updated_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#1a1a1a',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.04)',
            padding: '80px 40px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>👥</div>
            <div style={{ color: '#636366', fontSize: '0.8rem' }}>
              Selecciona un cliente para ver sus detalles
            </div>
          </div>
        )}
      </div>

      {/* New Customer Modal */}
      {showNewModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowNewModal(false) }}
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
                Nuevo cliente
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  width: 28, height: 28, borderRadius: 8, border: 'none',
                  background: 'rgba(255,255,255,0.06)', color: '#8e8e93',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <FieldInput label="Nombre *" value={newName} onChange={setNewName} placeholder="Juan García" />
              <FieldInput label="Email *" value={newEmail} onChange={setNewEmail} placeholder="juan@email.com" type="email" />
              <FieldInput label="Teléfono" value={newPhone} onChange={setNewPhone} placeholder="+34 600 000 000" />
              <FieldInput label="Dirección" value={newAddress} onChange={setNewAddress} placeholder="Calle Principal 123" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <FieldInput label="Ciudad" value={newCity} onChange={setNewCity} placeholder="Bilbao" />
                <FieldInput label="Código Postal" value={newPostal} onChange={setNewPostal} placeholder="48001" />
              </div>
              <FieldInput label="País" value={newCountry} onChange={setNewCountry} placeholder="ES" />

              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button
                  onClick={() => setShowNewModal(false)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
                    color: '#8e8e93', fontSize: '0.8rem', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'var(--font)',
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateCustomer}
                  disabled={!newName.trim() || !newEmail.trim()}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                    background: newName.trim() && newEmail.trim() ? '#30d158' : '#48484a',
                    color: newName.trim() && newEmail.trim() ? '#0a0a0a' : '#8e8e93',
                    fontSize: '0.8rem', fontWeight: 600,
                    cursor: newName.trim() && newEmail.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font)',
                  }}
                >
                  Crear cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FieldInput({ label, value, onChange, placeholder, type = 'text' }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
          color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
          outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  )
}
