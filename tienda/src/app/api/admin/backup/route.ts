import { NextResponse } from 'next/server'
import { getAllDataForBackup, logBackup } from '@/lib/db'

export async function GET() {
  try {
    const data = await getAllDataForBackup()

    const totalRecords =
      data.orders.length +
      data.customers.length +
      data.communications.length +
      data.coupons.length

    const backup = {
      timestamp: new Date().toISOString(),
      store: 'CarbonZ - Cupulas Forged Carbon Z900',
      stats: {
        total_orders: data.orders.length,
        total_customers: data.customers.length,
        total_communications: data.communications.length,
        total_coupons: data.coupons.length,
        total_records: totalRecords,
      },
      data,
    }

    const json = JSON.stringify(backup, null, 2)
    const fileSize = `${(new TextEncoder().encode(json).length / 1024).toFixed(1)}KB`

    // Log the backup
    await logBackup('success', totalRecords, fileSize)

    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="carbonz-backup-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    console.error('Backup error:', error)
    await logBackup('error', 0, '0KB').catch(() => {})
    return NextResponse.json(
      { error: 'Error creating backup' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const data = await getAllDataForBackup()
    const totalRecords =
      data.orders.length +
      data.customers.length +
      data.communications.length +
      data.coupons.length

    const json = JSON.stringify(data)
    const fileSize = `${(new TextEncoder().encode(json).length / 1024).toFixed(1)}KB`

    await logBackup('success', totalRecords, fileSize)

    return NextResponse.json({ success: true, records: totalRecords, fileSize })
  } catch (error) {
    console.error('Backup log error:', error)
    return NextResponse.json({ error: 'Error logging backup' }, { status: 500 })
  }
}
