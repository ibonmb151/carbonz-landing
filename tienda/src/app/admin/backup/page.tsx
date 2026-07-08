'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BackupEntry {
  id: number
  status: string
  records_count: number
  file_size: string
  created_at: string
}

export default function BackupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [backups, setBackups] = useState<BackupEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/admin/backup')
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setBackups(data)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [status])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const res = await fetch('/api/admin/backup')
      if (!res.ok) throw new Error('Error')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `carbonz-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      showToast('Backup descargado correctamente')

      // Refresh history
      const historyRes = await fetch('/api/admin/backup', { method: 'POST' })
      const historyData = await historyRes.json()
      if (historyData.success) {
        // Reload the page data
        window.location.reload()
      }
    } catch {
      showToast('Error al descargar backup', 'error')
    } finally {
      setDownloading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center', color: '#636366' }}>
        Cargando...
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
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f5f5f7', letterSpacing: '-0.03em' }}>
          Backup
        </h1>
        <p style={{ fontSize: '0.8rem', color: '#636366', marginTop: 4 }}>
          Exporta y gestiona copias de seguridad de tu tienda
        </p>
      </div>

      {/* Info Card */}
      <div style={{
        background: 'rgba(48,209,88,0.06)',
        border: '1px solid rgba(48,209,88,0.15)',
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <span style={{ fontSize: '1.5rem' }}>💾</span>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#30d158', marginBottom: 2 }}>
            Backup semanal recomendado
          </div>
          <div style={{ fontSize: '0.72rem', color: '#8e8e93', lineHeight: 1.5 }}>
            Se recomienda hacer un backup semanal de todos los datos de la tienda.
            El backup incluye pedidos, clientes, comunicaciones y cupones.
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.04)',
        padding: '32px 24px',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>📦</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f5f5f7', marginBottom: 4 }}>
          Descargar backup completo
        </div>
        <div style={{ fontSize: '0.72rem', color: '#636366', marginBottom: 20 }}>
          Incluye todos los pedidos, clientes, comunicaciones y cupones en formato JSON
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            padding: '12px 28px', borderRadius: 10, border: 'none',
            background: downloading ? '#48484a' : '#30d158',
            color: downloading ? '#8e8e93' : '#0a0a0a',
            fontSize: '0.8rem', fontWeight: 600,
            cursor: downloading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font)',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {downloading ? 'Descargando...' : 'Descargar backup'}
        </button>
      </div>

      {/* Backup History */}
      <div style={{
        background: '#1a1a1a',
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f7' }}>
            Historial de backups
          </h2>
        </div>

        {backups.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: '#636366',
            fontSize: '0.8rem',
          }}>
            No hay backups registrados aun
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 100px 100px 140px',
              gap: 12,
              padding: '12px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.6rem',
              fontWeight: 600,
              color: '#636366',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              <span>ID</span>
              <span>Estado</span>
              <span>Registros</span>
              <span>Tamano</span>
              <span style={{ textAlign: 'right' }}>Fecha</span>
            </div>

            {backups.map((backup) => (
              <div
                key={backup.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 100px 100px 140px',
                  gap: 12,
                  padding: '14px 24px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '0.7rem', color: '#48484a' }}>#{backup.id}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '0.72rem', fontWeight: 500,
                  color: backup.status === 'success' ? '#30d158' : '#ff453a',
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: backup.status === 'success' ? '#30d158' : '#ff453a',
                  }} />
                  {backup.status === 'success' ? 'Exitoso' : 'Error'}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#8e8e93' }}>
                  {backup.records_count}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#8e8e93' }}>
                  {backup.file_size}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#636366', textAlign: 'right' }}>
                  {new Date(backup.created_at).toLocaleString('es-ES', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
