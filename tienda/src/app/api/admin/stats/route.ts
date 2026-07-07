import { NextResponse } from 'next/server'
import { getOrderStats, getAllOrders } from '@/lib/db'

export async function GET() {
  try {
    const stats = getOrderStats()
    const recentOrders = getAllOrders().slice(0, 10)

    return NextResponse.json({
      stats,
      recentOrders,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Error fetching stats' },
      { status: 500 }
    )
  }
}
