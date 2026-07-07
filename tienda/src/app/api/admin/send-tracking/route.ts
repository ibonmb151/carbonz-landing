import { NextRequest, NextResponse } from 'next/server'
import { getOrder, updateOrderTracking } from '@/lib/db'
import { sendTrackingEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const { orderId, trackingNumber } = await req.json()

    if (!orderId || !trackingNumber) {
      return NextResponse.json(
        { error: 'orderId and trackingNumber are required' },
        { status: 400 }
      )
    }

    const order = getOrder(orderId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order in DB
    updateOrderTracking(orderId, trackingNumber)

    // Send tracking email
    if (order.customer_email) {
      const result = await sendTrackingEmail({
        email: order.customer_email,
        name: order.customer_name || 'Cliente',
        orderId: order.id,
        trackingNumber,
      })

      if (!result.success) {
        console.error('Failed to send tracking email:', result.error)
      }

      return NextResponse.json({
        success: true,
        emailSent: result.success,
      })
    }

    return NextResponse.json({
      success: true,
      emailSent: false,
      reason: 'No customer email',
    })
  } catch (error) {
    console.error('Error in send-tracking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
