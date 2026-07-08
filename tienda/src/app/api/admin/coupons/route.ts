import { NextRequest, NextResponse } from 'next/server'
import { getAllCoupons, createCoupon } from '@/lib/db'

export async function GET() {
  try {
    const coupons = await getAllCoupons()
    return NextResponse.json(coupons)
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json({ error: 'Error fetching coupons' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, type, value, min_order, max_uses, expires_at } = body

    if (!code || !type || value === undefined) {
      return NextResponse.json({ error: 'Code, type, and value are required' }, { status: 400 })
    }

    if (type === 'percentage' && (value < 1 || value > 100)) {
      return NextResponse.json({ error: 'Percentage must be 1-100' }, { status: 400 })
    }

    const coupon = await createCoupon({
      code,
      type,
      value,
      min_order: min_order || 0,
      max_uses: max_uses || 0,
      expires_at: expires_at || null,
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error: any) {
    console.error('Error creating coupon:', error)
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Este codigo ya existe' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error creating coupon' }, { status: 500 })
  }
}
