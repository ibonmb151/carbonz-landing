import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { validateCoupon, applyCoupon } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface CheckoutItem {
  name: string
  price: number // in cents
  image: string
  quantity: number
}

export async function POST(req: NextRequest) {
  try {
    const { items, couponCode }: { items: CheckoutItem[]; couponCode?: string } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || 'https://carbonz.vercel.app'

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Validate coupon if provided
    let discount = 0
    let couponId: number | null = null
    if (couponCode) {
      const validation = await validateCoupon(couponCode, subtotal)
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 })
      }
      const coupon = validation.coupon!
      couponId = coupon.id

      if (coupon.type === 'percentage') {
        discount = Math.round(subtotal * coupon.value / 100)
      } else {
        discount = Math.min(coupon.value, subtotal)
      }
    }

    // Build line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.image.startsWith('http')
            ? [item.image]
            : [`${origin}${item.image}`],
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }))

    // Apply discount as a negative adjustment if needed
    // (Stripe doesn't support direct discounts on price_data, so we note it in metadata)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      shipping_address_collection: {
        allowed_countries: [
          'ES', 'PT', 'FR', 'DE', 'IT', 'NL', 'BE', 'AT',
          'GB', 'IE', 'CH', 'PL',
        ],
      },
      metadata: {
        coupon_code: couponCode || '',
        coupon_id: couponId ? String(couponId) : '',
        discount_amount: String(discount),
      },
    })

    // Log coupon usage
    if (couponId) {
      await applyCoupon(couponId).catch(console.error)
    }

    return NextResponse.json({
      url: session.url,
      discount: discount > 0 ? {
        code: couponCode,
        amount: discount,
        formatted: `-${(discount / 100).toFixed(2)}EUR`,
      } : null,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
