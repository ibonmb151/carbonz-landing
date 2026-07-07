import { NextRequest, NextResponse } from 'next/server'
import { getAllOrders, getOrder, updateOrderStatus, updateOrderTracking } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl
    const id = url.searchParams.get('id')

    if (id) {
      const order = getOrder(id)
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }
      return NextResponse.json(order)
    }

    const orders = getAllOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Error fetching orders' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, trackingNumber } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    if (status) {
      updateOrderStatus(id, status)
    }

    if (trackingNumber) {
      updateOrderTracking(id, trackingNumber)
    }

    const order = getOrder(id)
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 })
  }
}
