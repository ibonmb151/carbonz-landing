import { getSupabase } from './supabase'

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
  const { error } = await getSupabase()
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
  const { data, error } = await getSupabase()
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
  const { data, error } = await getSupabase()
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
  const { data, error } = await getSupabase()
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
  const { error } = await getSupabase()
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

export async function updateOrderTracking(id: string, trackingNumber: string) {
  const { error } = await getSupabase()
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
  const { data: allOrders, error: err1 } = await getSupabase()
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

  const { data, error } = await getSupabase()
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

// ─── Customers (CRM) ────────────────────────────────────

export interface CustomerData {
  id?: number
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal?: string
  country?: string
  notes?: string
  tags?: string[]
  total_orders?: number
  total_spent?: number
}

export async function getAllCustomers() {
  const { data, error } = await getSupabase()
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching customers:', error)
    throw error
  }

  return data || []
}

export async function getCustomer(id: number) {
  const { data, error } = await getSupabase()
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching customer:', error)
    throw error
  }

  return data
}

export async function createCustomer(customer: CustomerData) {
  const { data, error } = await getSupabase()
    .from('customers')
    .insert({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      postal: customer.postal || '',
      country: customer.country || 'ES',
      notes: customer.notes || '',
      tags: customer.tags || [],
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating customer:', error)
    throw error
  }

  return data
}

export async function updateCustomer(id: number, updates: Partial<CustomerData>) {
  const { data, error } = await getSupabase()
    .from('customers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating customer:', error)
    throw error
  }

  return data
}

export async function deleteCustomer(id: number) {
  const { error } = await getSupabase()
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting customer:', error)
    throw error
  }
}

export async function searchCustomers(query: string) {
  const { data, error } = await getSupabase()
    .from('customers')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching customers:', error)
    throw error
  }

  return data || []
}

export async function getCustomerStats() {
  const { count: total } = await getSupabase()
    .from('customers')
    .select('*', { count: 'exact', head: true })

  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const { count: thisMonth } = await getSupabase()
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', firstOfMonth)

  const { data: vip } = await getSupabase()
    .from('customers')
    .select('*')
    .gte('total_orders', 2)

  return {
    total: total || 0,
    thisMonth: thisMonth || 0,
    vip: vip?.length || 0,
  }
}

// ─── Communications ──────────────────────────────────────

export interface CommunicationData {
  id?: number
  customer_id: number
  type: string
  subject?: string
  content: string
}

export async function getCustomerCommunications(customerId: number) {
  const { data, error } = await getSupabase()
    .from('communications')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching communications:', error)
    throw error
  }

  return data || []
}

export async function addCommunication(comm: CommunicationData) {
  const { data, error } = await getSupabase()
    .from('communications')
    .insert({
      customer_id: comm.customer_id,
      type: comm.type,
      subject: comm.subject || '',
      content: comm.content,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding communication:', error)
    throw error
  }

  return data
}
