import { NextRequest, NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { code, orderTotal } = await req.json()

    if (!code) {
      return NextResponse.json({ valid: false, error: 'Introduce un codigo de cupon' }, { status: 400 })
    }

    const result = await validateCoupon(code, orderTotal || 0)

    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 400 })
    }

    const coupon = result.coupon!
    let discount = 0

    if (coupon.type === 'percentage') {
      discount = Math.round((orderTotal || 0) * coupon.value / 100)
    } else {
      discount = Math.min(coupon.value, orderTotal || 0)
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
      discount,
    })
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'Error al validar el cupon' },
      { status: 500 }
    )
  }
}
