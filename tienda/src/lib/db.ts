import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const DB_PATH = path.join(process.cwd(), 'carbonz.db')

// Ensure DB directory exists
const dir = path.dirname(DB_PATH)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initTables(_db)
    seedAdmin(_db)
  }
  return _db
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      stripe_session_id TEXT UNIQUE,
      customer_name TEXT,
      customer_email TEXT,
      customer_address TEXT,
      customer_city TEXT,
      customer_postal TEXT,
      customer_country TEXT,
      items TEXT,
      total INTEGER,
      status TEXT DEFAULT 'pending',
      tracking_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

function seedAdmin(db: Database.Database) {
  const existing = db.prepare('SELECT id FROM admins WHERE email = ?').get('admin@carbonz.com')
  if (!existing) {
    // Simple hash for hardcoded credentials (not for production)
    const hash = Buffer.from('carbonz2026').toString('base64')
    db.prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)').run('admin@carbonz.com', hash)
  }
}

// ─── Orders ──────────────────────────────────────────────

export interface OrderData {
  id: string
  stripeSessionId: string
  customerName: string
  customerEmail: string
  customerAddress?: string
  customerCity?: string
  customerPostal?: string
  customerCountry?: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status?: string
  trackingNumber?: string
}

export function createOrder(data: OrderData) {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO orders 
    (id, stripe_session_id, customer_name, customer_email, customer_address, customer_city, customer_postal, customer_country, items, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(
    data.id,
    data.stripeSessionId,
    data.customerName,
    data.customerEmail,
    data.customerAddress || '',
    data.customerCity || '',
    data.customerPostal || '',
    data.customerCountry || '',
    JSON.stringify(data.items),
    data.total,
    data.status || 'pending'
  )
}

export function getAllOrders() {
  const db = getDb()
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
  return rows.map((row: any) => ({
    ...row,
    items: JSON.parse(row.items || '[]'),
  }))
}

export function getOrder(id: string) {
  const db = getDb()
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any
  if (!row) return null
  return { ...row, items: JSON.parse(row.items || '[]') }
}

export function getOrderBySessionId(sessionId: string) {
  const db = getDb()
  const row = db.prepare('SELECT * FROM orders WHERE stripe_session_id = ?').get(sessionId) as any
  if (!row) return null
  return { ...row, items: JSON.parse(row.items || '[]') }
}

export function updateOrderStatus(id: string, status: string) {
  const db = getDb()
  db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id)
}

export function updateOrderTracking(id: string, trackingNumber: string) {
  const db = getDb()
  db.prepare('UPDATE orders SET tracking_number = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
    trackingNumber,
    'shipped',
    id
  )
}

export function getOrderStats() {
  const db = getDb()
  const totalOrders = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as any).count
  const totalRevenue = (db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM orders').get() as any).total
  const pendingOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get() as any).count
  const todayOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE date(created_at) = date('now')").get() as any).count
  const todayRevenue = (
    db.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE date(created_at) = date('now')").get() as any
  ).total

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    todayOrders,
    todayRevenue,
  }
}

// ─── Auth ────────────────────────────────────────────────

export function verifyAdmin(email: string, password: string) {
  const db = getDb()
  const hash = Buffer.from(password).toString('base64')
  const admin = db.prepare('SELECT * FROM admins WHERE email = ? AND password_hash = ?').get(email, hash) as any
  return admin || null
}
