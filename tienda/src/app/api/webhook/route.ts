import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
// import { prisma } from '@/lib/prisma' // Uncomment when DB is connected
import { sendOrderConfirmation } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // ─── Checkout Session Completed ─────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session & {
      shipping_details?: {
        name?: string
        address?: {
          line1?: string
          line2?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
        }
      }
    }
    console.log('Payment successful:', session.id)

    try {
      // Extract customer data from session
      const customerEmail = session.customer_details?.email || session.customer_email
      const customerName = session.customer_details?.name
      const shippingAddress = session.shipping_details?.address
      const totalAmount = session.amount_total // in cents

      // Get line items from session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      // Build order data
      const orderData = {
        stripeSessionId: session.id,
        email: customerEmail,
        name: customerName,
        total: totalAmount,
        shipping: shippingAddress ? {
          name: session.shipping_details?.name || customerName,
          address: shippingAddress.line1,
          city: shippingAddress.city,
          zip: shippingAddress.postal_code,
          country: shippingAddress.country,
        } : null,
        items: lineItems.data.map((item) => ({
          name: item.description || item.price?.metadata?.product_name || 'Product',
          quantity: item.quantity || 1,
          price: item.price?.unit_amount || 0,
        })),
      }

      console.log('Order data:', JSON.stringify(orderData, null, 2))

      // ─── Prisma: Save to database (uncomment when DB is connected) ───
      /*
      // Create or find user by email
      const user = await prisma.user.upsert({
        where: { email: customerEmail! },
        update: { name: customerName },
        create: {
          email: customerEmail!,
          name: customerName,
        },
      })

      // Create order with status "paid"
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          status: 'paid',
          total: totalAmount!,
          shippingName: orderData.shipping?.name || customerName || '',
          shippingEmail: customerEmail || '',
          shippingAddress: orderData.shipping?.address || '',
          shippingCity: orderData.shipping?.city || '',
          shippingZip: orderData.shipping?.zip || '',
          shippingCountry: orderData.shipping?.country || 'ES',
          stripeSessionId: session.id,
          items: {
            create: orderData.items.map((item) => ({
              productId: 'product-id-here', // Map from Stripe product ID
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })

      console.log('Order created:', order.id)
      */

      // ─── Send confirmation email ───
      if (customerEmail) {
        await sendOrderConfirmation({
          email: customerEmail,
          name: customerName || 'Cliente',
          orderId: session.id,
          total: totalAmount!,
          items: orderData.items,
        })
      }

    } catch (error) {
      console.error('Error processing order:', error)
      // Don't return error to Stripe - we still want to acknowledge receipt
    }
  }

  // ─── Checkout Session Async Payment Failed ──────────────
  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.log('Payment failed:', session.id)

    try {
      // ─── Prisma: Update order status to "failed" (uncomment when DB is connected) ───
      /*
      const order = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      })

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'failed' },
        })
        console.log('Order marked as failed:', order.id)
      }
      */
    } catch (error) {
      console.error('Error updating failed order:', error)
    }
  }

  return NextResponse.json({ received: true })
}
