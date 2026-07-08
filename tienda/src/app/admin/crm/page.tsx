'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo } from 'react'

// ─── Types ─────────────────────────────────────────────

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  postal: string
  country: string
  company: string
  source: string
  status: string
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

// ─── Constants ─────────────────────────────────────────

const commTypeOptions = [
  { value: 'email', label: 'Email', color: '#64d2ff' },
  { value: 'phone', label: 'Teléfono', color: '#30d158' },
  { value: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
  { value: 'note', label: 'Nota', color: '#ff9f0a' },
  { value: 'meeting', label: 'Reunión', color: '#bf5af2' },
]

const statusOptions = [
  { value: 'lead', label: 'Lead', color: '#64d2ff' },
  { value: 'cliente', label: 'Cliente', color: '#30d158' },
  { value: 'vip', label: 'VIP', color: '#ff9f0a' },
  { value: 'inactivo', label: 'Inactivo', color: '#636366' },
]

const sourceOptions = [
  { value: 'google', label: 'Google' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'recomendacion', label: 'Recomendación' },
  { value: 'otro', label: 'Otro' },
]

type SortField = 'name' | 'created_at' | 'total_spent' | 'total_orders'
type SortDir = 'asc' | 'desc'

// ─── Helpers ───────────────────────────────────────────

const formatEuros = (cents: number) => `€${(cents / 100).toFixed(2)}`

const getStatusInfo = (status: string) =>
  statusOptions.find(o => o.value === status) || statusOptions[0]

const getSourceLabel = (source: string) =>
  sourceOptions.find(o => o.value === source)?.label || source || '—'

const getSourceColor = (source: string) => {
  const map: Record<string, string> = {
    google: '#4285f4',
    instagram: '#e4405f',
    facebook: '#1877f2',
    recomendacion: '#30d158',
    otro: '#636366',
  }
  return map[source] || '#636366'
}

function toCSVRow(values: (string | number)[]) {
  return values.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
}

// ─── Main Component ────────────────────────────────────

export default function CrmPage() {
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()

  // Data
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [communications, setCommunications] = useState<Communication[]>([])
  const [stats, setStats] = useState<CustomerStats>({ total: 0, thisMonth: 0, vip: 0 })
  const [loading, setLoading] = useState(true)

  // UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Edit form
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editPostal, setEditPostal] = useState('')
  const [editCountry, setEditCountry] = useState('')
  const [editCompany, setEditCompany] = useState('')
  const [editSource, setEditSource] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editTags, setEditTags] = useState('')

  // New customer form
  const [showNewModal, setShowNewModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newPostal, setNewPostal] = useState('')
  const [newCountry, setNewCountry] = useState('ES')
  const [newCompany, setNewCompany] = useState('')
  const [newSource, setNewSource] = useState('google')
  const [newStatus, setNewStatus] = useState('lead')

  // Communication form
  const [commType, setCommType] = useState('email')
  const [commSubject, setCommSubject] = useState('')
  const [commContent, setCommContent] = useState('')
  const [sendingComm, setSendingComm] = useState(false)

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // ─── Toast helper ──────────────────────────────────────
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  // ─── Auth redirect ─────────────────────────────────────
  useEffect(() => {
    if (authStatus === 'unauthenticated') router.push('/admin/login')
  }, [authStatus, router])

  // ─── Fetch customers + stats ───────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [custRes, statsRes] = await Promise.all([
        fetch('/api/admin/customers'),
        fetch('/api/admin/customers?stats=1'),
      ])
      const custData = await custRes.json()
      const statsData = await statsRes.json()
      setCustomers(Array.isArray(custData) ? custData : [])
      setStats(statsData)
    } catch (err) {
      console.error(err)
      showToast('Error al cargar clientes', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (authStatus === 'authenticated') fetchData()
  }, [authStatus, fetchData])

  // ─── Fetch communications ──────────────────────────────
  useEffect(() => {
    if (selectedCustomer) {
      fetch(`/api/admin/customers/${selectedCustomer.id}/communications`)
        .then(r => r.json())
        .then(data => setCommunications(Array.isArray(data) ? data : []))
        .catch(console.error)

      // Sync edit fields
      setEditName(selectedCustomer.name || '')
      setEditEmail(selectedCustomer.email || '')
      setEditPhone(selectedCustomer.phone || '')
      setEditAddress(selectedCustomer.address || '')
      setEditCity(selectedCustomer.city || '')
      setEditPostal(selectedCustomer.postal || '')
      setEditCountry(selectedCustomer.country || 'ES')
      setEditCompany(selectedCustomer.company || '')
      setEditSource(selectedCustomer.source || '')
      setEditStatus(selectedCustomer.status || 'lead')
      setEditNotes(selectedCustomer.notes || '')
      setEditTags((selectedCustomer.tags || []).join(', '))
    }
  }, [selectedCustomer])

  // ─── Filtered + sorted customers ───────────────────────
  const filteredCustomers = useMemo(() => {
    let list = [...customers]

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q))
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'vip') {
        list = list.filter(c => c.total_orders >= 2)
      } else {
        list = list.filter(c => c.status === statusFilter)
      }
    }

    // Sort
    list.sort((a, b) => {
      let va: string | number, vb: string | number
      switch (sortField) {
        case 'name':
          va = a.name.toLowerCase(); vb = b.name.toLowerCase()
          return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
        case 'total_spent':
          va = a.total_spent; vb = b.total_spent
          break
        case 'total_orders':
          va = a.total_orders; vb = b.total_orders
          break
        default: // created_at
          va = a.created_at; vb = b.created_at
          return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      }
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })

    return list
  }, [customers, searchQuery, statusFilter, sortField, sortDir])

  // ─── Handlers ──────────────────────────────────────────

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
          name: editName.trim(),
          email: editEmail.trim(),
          phone: editPhone,
          address: editAddress,
          city: editCity,
          postal: editPostal,
          country: editCountry,
          company: editCompany,
          source: editSource,
          status: editStatus,
          notes: editNotes,
          tags: editTags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Error desconocido' }))
        showToast(err.error || 'Error al guardar', 'error')
        return
      }
      const updated = await res.json()
      setSelectedCustomer(updated)
      setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c))
      setSaved(true)
      showToast('Cliente guardado')
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving customer:', error)
      showToast('Error de conexión al guardar', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateCustomer = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      showToast('Nombre y email son obligatorios', 'error')
      return
    }
    setCreating(true)
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
          company: newCompany.trim(),
          source: newSource,
          status: newStatus,
        }),
      })
      if (res.ok) {
        const customer = await res.json()
        setCustomers(prev => [customer, ...prev])
        setSelectedCustomer(customer)
        setShowNewModal(false)
        resetNewForm()
        setStats(prev => ({ ...prev, total: prev.total + 1, thisMonth: prev.thisMonth + 1 }))
        showToast('Cliente creado')
      } else {
        const err = await res.json().catch(() => ({ error: 'Error al crear cliente' }))
        showToast(err.error || 'Error al crear cliente', 'error')
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      showToast('Error de conexión al crear cliente', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return
    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer.id}`, { method: 'DELETE' })
      if (!res.ok) {
        showToast('Error al eliminar cliente', 'error')
        return
      }
      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id))
      setSelectedCustomer(null)
      setShowDeleteConfirm(false)
      setStats(prev => ({ ...prev, total: prev.total - 1 }))
      showToast('Cliente eliminado')
    } catch (error) {
      console.error('Error deleting customer:', error)
      showToast('Error de conexión al eliminar', 'error')
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
        showToast('Comunicación registrada')
      } else {
        showToast('Error al añadir comunicación', 'error')
      }
    } catch (error) {
      console.error('Error adding communication:', error)
      showToast('Error de conexión', 'error')
    } finally {
      setSendingComm(false)
    }
  }

  const handleExportCSV = () => {
    const header = ['Nombre', 'Email', 'Teléfono', 'Empresa', 'Fuente', 'Estado', 'Pedidos', 'Total gastado', 'Ciudad', 'País', 'Creado']
    const rows = filteredCustomers.map(c => [
      c.name, c.email, c.phone || '', c.company || '', getSourceLabel(c.source || ''),
      getStatusInfo(c.status || 'lead').label, c.total_orders, formatEuros(c.total_spent),
      c.city || '', c.country || '', new Date(c.created_at).toLocaleDateString('es-ES'),
    ])
    const csv = [toCSVRow(header), ...rows.map(r => toCSVRow(r))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `clientes-carbonz-${new Date().toISOString().split('T')[0]}.csv`
    a.click(); URL.revokeObjectURL(url)
    showToast('CSV exportado')
  }

  const resetNewForm = () => {
    setNewName(''); setNewEmail(''); setNewPhone(''); setNewAddress('')
    setNewCity(''); setNewPostal(''); setNewCountry('ES')
    setNewCompany(''); setNewSource('google'); setNewStatus('lead')
  }

  const getCommTypeInfo = (type: string) =>
    commTypeOptions.find(o => o.value === type) || commTypeOptions[3]

  // ─── Loading ───────────────────────────────────────────

  if (authStatus === 'loading' || loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#636366' }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#30d158', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Cargando CRM...
      </div>
    )
  }

  if (!session) return null

  // ─── Render ────────────────────────────────────────────

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
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f5f5f7', letterSpacing: '-0.03em' }}>CRM</h1>
          <p style={{ fontSize: '0.8rem', color: '#636366', marginTop: 4 }}>Gestión de clientes y comunicaciones</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleExportCSV}
            style={{
              padding: '10px 16px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
              color: '#8e8e93', fontSize: '0.8rem', fontWeight: 500,
              cursor: 'pointer', fontFamily: 'var(--font)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar CSV
          </button>
          <button
            onClick={() => setShowNewModal(true)}
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
            Nuevo cliente
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total clientes', value: stats.total, color: '#f5f5f7' },
          { label: 'Nuevos este mes', value: stats.thisMonth, color: '#30d158' },
          { label: 'VIP (2+ pedidos)', value: stats.vip, color: '#ff9f0a' },
          { label: 'Filtrados', value: filteredCustomers.length, color: '#64d2ff' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#1a1a1a', borderRadius: 14, padding: '18px 20px',
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
        {/* ─── Customer List ────────────────────────────── */}
        <div style={{
          background: '#1a1a1a', borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden',
        }}>
          {/* Search + Filters */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#636366" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px 10px 36px', borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                  color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '7px 10px', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                  color: '#f5f5f7', fontSize: '0.7rem', fontFamily: 'var(--font)',
                  outline: 'none', cursor: 'pointer', appearance: 'none' as const,
                }}
              >
                <option value="all" style={{ background: '#1a1a1a' }}>Todos</option>
                {statusOptions.map(o => (
                  <option key={o.value} value={o.value} style={{ background: '#1a1a1a' }}>{o.label}</option>
                ))}
              </select>
              <select
                value={`${sortField}-${sortDir}`}
                onChange={(e) => {
                  const [field, dir] = e.target.value.split('-')
                  setSortField(field as SortField)
                  setSortDir(dir as SortDir)
                }}
                style={{
                  padding: '7px 10px', borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                  color: '#f5f5f7', fontSize: '0.7rem', fontFamily: 'var(--font)',
                  outline: 'none', cursor: 'pointer', appearance: 'none' as const,
                  flex: 1,
                }}
              >
                <option value="created_at-desc" style={{ background: '#1a1a1a' }}>Más recientes</option>
                <option value="created_at-asc" style={{ background: '#1a1a1a' }}>Más antiguos</option>
                <option value="name-asc" style={{ background: '#1a1a1a' }}>Nombre A-Z</option>
                <option value="name-desc" style={{ background: '#1a1a1a' }}>Nombre Z-A</option>
                <option value="total_spent-desc" style={{ background: '#1a1a1a' }}>Mayor gasto</option>
                <option value="total_spent-asc" style={{ background: '#1a1a1a' }}>Menor gasto</option>
                <option value="total_orders-desc" style={{ background: '#1a1a1a' }}>Más pedidos</option>
              </select>
            </div>
          </div>

          {/* Customer Cards */}
          <div style={{ maxHeight: 'calc(100vh - 380px)', overflowY: 'auto' }}>
            {filteredCustomers.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center', color: '#636366', fontSize: '0.8rem' }}>
                {searchQuery || statusFilter !== 'all' ? 'No se encontraron clientes' : 'No hay clientes aún'}
              </div>
            ) : (
              filteredCustomers.map((customer) => {
                const isSelected = selectedCustomer?.id === customer.id
                const statusInfo = getStatusInfo(customer.status || 'lead')
                return (
                  <div
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    style={{
                      padding: '16px 20px', cursor: 'pointer',
                      background: isSelected ? 'rgba(48,209,88,0.04)' : 'transparent',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f5f5f7' }}>
                        {customer.name}
                      </span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 6,
                          background: `${statusInfo.color}15`, color: statusInfo.color,
                          fontSize: '0.55rem', fontWeight: 600, textTransform: 'uppercase',
                        }}>
                          {statusInfo.label}
                        </span>
                        {customer.total_orders >= 2 && (
                          <span style={{
                            padding: '2px 8px', borderRadius: 6,
                            background: 'rgba(255,159,10,0.12)', color: '#ff9f0a',
                            fontSize: '0.55rem', fontWeight: 600,
                          }}>VIP</span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#636366', marginBottom: 6 }}>
                      {customer.email}
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.65rem', color: '#48484a' }}>
                      <span>{customer.total_orders} pedidos</span>
                      <span>{formatEuros(customer.total_spent)}</span>
                      {customer.company && <span>{customer.company}</span>}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ─── Customer Detail Panel ────────────────────── */}
        {selectedCustomer ? (
          <div style={{
            background: '#1a1a1a', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden',
            position: 'sticky', top: 20,
          }}>
            {/* Detail Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f7', marginBottom: 2 }}>
                  {selectedCustomer.name}
                </h3>
                <div style={{ fontSize: '0.7rem', color: '#636366' }}>{selectedCustomer.email}</div>
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
                >🗑</button>
                <button
                  onClick={() => { setSelectedCustomer(null); setShowDeleteConfirm(false) }}
                  style={{
                    width: 32, height: 32, borderRadius: 8, border: 'none',
                    background: 'rgba(255,255,255,0.06)', color: '#8e8e93',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem',
                  }}
                >✕</button>
              </div>
            </div>

            <div style={{ padding: '20px 24px', maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
              {/* Delete Confirmation */}
              {showDeleteConfirm && (
                <div style={{
                  marginBottom: 16, padding: 16, borderRadius: 12,
                  background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.2)',
                }}>
                  <div style={{ fontSize: '0.8rem', color: '#ff453a', fontWeight: 600, marginBottom: 8 }}>¿Eliminar este cliente?</div>
                  <div style={{ fontSize: '0.7rem', color: '#8e8e93', marginBottom: 12 }}>
                    Esta acción no se puede deshacer. Se eliminarán también todas las comunicaciones.
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleDeleteCustomer} style={{
                      padding: '8px 16px', borderRadius: 8, border: 'none',
                      background: '#ff453a', color: '#fff', fontSize: '0.75rem', fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'var(--font)',
                    }}>Sí, eliminar</button>
                    <button onClick={() => setShowDeleteConfirm(false)} style={{
                      padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                      background: 'transparent', color: '#8e8e93', fontSize: '0.75rem', fontWeight: 500,
                      cursor: 'pointer', fontFamily: 'var(--font)',
                    }}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* Editable Fields */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#636366', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Información de contacto
                </div>
                <FieldInput label="Nombre" value={editName} onChange={setEditName} placeholder="Nombre completo" />
                <FieldInput label="Email" value={editEmail} onChange={setEditEmail} placeholder="email@ejemplo.com" type="email" />
                <FieldInput label="Teléfono" value={editPhone} onChange={setEditPhone} placeholder="+34 600 000 000" />
                <FieldInput label="Empresa" value={editCompany} onChange={setEditCompany} placeholder="Nombre de empresa" />
                <FieldInput label="Dirección" value={editAddress} onChange={setEditAddress} placeholder="Calle, número" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <FieldInput label="Ciudad" value={editCity} onChange={setEditCity} placeholder="Bilbao" />
                  <FieldInput label="Código Postal" value={editPostal} onChange={setEditPostal} placeholder="48001" />
                </div>
                <FieldInput label="País" value={editCountry} onChange={setEditCountry} placeholder="ES" />

                {/* Source + Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>Fuente</label>
                    <select
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                        color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                        outline: 'none', cursor: 'pointer', appearance: 'none' as const, boxSizing: 'border-box',
                      }}
                    >
                      {sourceOptions.map(o => (
                        <option key={o.value} value={o.value} style={{ background: '#1a1a1a' }}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>Estado</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 12px', borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                        color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                        outline: 'none', cursor: 'pointer', appearance: 'none' as const, boxSizing: 'border-box',
                      }}
                    >
                      {statusOptions.map(o => (
                        <option key={o.value} value={o.value} style={{ background: '#1a1a1a' }}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

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
                      <div key={comm.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 6,
                            background: `${typeInfo.color}15`, color: typeInfo.color,
                            fontSize: '0.6rem', fontWeight: 600,
                          }}>{typeInfo.label}</span>
                          {comm.subject && (
                            <span style={{ fontSize: '0.75rem', color: '#f5f5f7', fontWeight: 500 }}>{comm.subject}</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#8e8e93', lineHeight: 1.5 }}>{comm.content}</div>
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
            background: '#1a1a1a', borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.04)',
            padding: '80px 40px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>👥</div>
            <div style={{ color: '#636366', fontSize: '0.8rem' }}>
              Selecciona un cliente para ver sus detalles
            </div>
          </div>
        )}
      </div>

      {/* ─── New Customer Modal ─────────────────────────── */}
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
            width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f7' }}>Nuevo cliente</h3>
              <button
                onClick={() => setShowNewModal(false)}
                style={{
                  width: 28, height: 28, borderRadius: 8, border: 'none',
                  background: 'rgba(255,255,255,0.06)', color: '#8e8e93',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem',
                }}
              >✕</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <FieldInput label="Nombre *" value={newName} onChange={setNewName} placeholder="Juan García" />
              <FieldInput label="Email *" value={newEmail} onChange={setNewEmail} placeholder="juan@email.com" type="email" />
              <FieldInput label="Teléfono" value={newPhone} onChange={setNewPhone} placeholder="+34 600 000 000" />
              <FieldInput label="Empresa" value={newCompany} onChange={setNewCompany} placeholder="Nombre de empresa" />
              <FieldInput label="Dirección" value={newAddress} onChange={setNewAddress} placeholder="Calle Principal 123" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <FieldInput label="Ciudad" value={newCity} onChange={setNewCity} placeholder="Bilbao" />
                <FieldInput label="Código Postal" value={newPostal} onChange={setNewPostal} placeholder="48001" />
              </div>
              <FieldInput label="País" value={newCountry} onChange={setNewCountry} placeholder="ES" />

              {/* Source + Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>Fuente</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                      outline: 'none', cursor: 'pointer', appearance: 'none' as const, boxSizing: 'border-box',
                    }}
                  >
                    {sourceOptions.map(o => (
                      <option key={o.value} value={o.value} style={{ background: '#1a1a1a' }}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>Estado</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 10,
                      border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
                      color: '#f5f5f7', fontSize: '0.8rem', fontFamily: 'var(--font)',
                      outline: 'none', cursor: 'pointer', appearance: 'none' as const, boxSizing: 'border-box',
                    }}
                  >
                    {statusOptions.map(o => (
                      <option key={o.value} value={o.value} style={{ background: '#1a1a1a' }}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button
                  onClick={() => { setShowNewModal(false); resetNewForm() }}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
                    color: '#8e8e93', fontSize: '0.8rem', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'var(--font)',
                  }}
                >Cancelar</button>
                <button
                  onClick={handleCreateCustomer}
                  disabled={creating || !newName.trim() || !newEmail.trim()}
                  style={{
                    flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                    background: !creating && newName.trim() && newEmail.trim() ? '#30d158' : '#48484a',
                    color: !creating && newName.trim() && newEmail.trim() ? '#0a0a0a' : '#8e8e93',
                    fontSize: '0.8rem', fontWeight: 600,
                    cursor: !creating && newName.trim() && newEmail.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font)',
                  }}
                >
                  {creating ? 'Creando...' : 'Crear cliente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── FieldInput Component ──────────────────────────────

function FieldInput({ label, value, onChange, placeholder, type = 'text' }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: '0.65rem', color: '#636366', display: 'block', marginBottom: 4 }}>{label}</label>
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
