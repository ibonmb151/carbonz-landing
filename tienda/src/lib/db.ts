import { supabase } from './supabase'

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

export async function createOrder(data: OrderData) {
  const { error } = await supabase
    .from('orders')
    .insert({
      id: data.id,
      stripe_session_id: data.stripeSessionId,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_address: data.customerAddress || '',
      customer_city: data.customerCity || '',
      customer_postal: data.customerPostal || '',
      customer_country: data.customerCountry || '',
      items: data.items,
      total: data.total,
      status: data.status || 'pending',
    })

  if (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    throw error
  }

  return data || []
}

export async function getOrder(id: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching order:', error)
    throw error
  }

  return data
}

export async function getOrderBySessionId(sessionId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error fetching order by session:', error)
    throw error
  }

  return data
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

export async function updateOrderTracking(id: string, trackingNumber: string) {
  const { error } = await supabase
    .from('orders')
    .update({ tracking_number: trackingNumber, status: 'shipped' })
    .eq('id', id)

  if (error) {
    console.error('Error updating tracking:', error)
    throw error
  }
}

export async function getOrderStats() {
  // Get total orders and total revenue
  const { data: allOrders, error: err1 } = await supabase
    .from('orders')
    .select('total, status, created_at')

  if (err1) {
    console.error('Error fetching stats:', err1)
    throw err1
  }

  const orders = allOrders || []
  const today = new Date().toISOString().split('T')[0]

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const todayOrders = orders.filter(o => o.created_at?.startsWith(today)).length
  const todayRevenue = orders
    .filter(o => o.created_at?.startsWith(today))
    .reduce((sum, o) => sum + (o.total || 0), 0)

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    todayOrders,
    todayRevenue,
  }
}

// ─── Auth ────────────────────────────────────────────────

export async function verifyAdmin(email: string, password: string) {
  const hash = Buffer.from(password).toString('base64')

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .eq('password_hash', hash)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    console.error('Error verifying admin:', error)
    return null
  }

  return data
}
