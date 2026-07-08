import { NextRequest, NextResponse } from 'next/server'
import { getCustomerCommunications, addCommunication } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const communications = await getCustomerCommunications(Number(id))
    return NextResponse.json(communications)
  } catch (error) {
    console.error('Error fetching communications:', error)
    return NextResponse.json({ error: 'Error fetching communications' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { type, subject, content } = body

    if (!type || !content) {
      return NextResponse.json({ error: 'Type and content are required' }, { status: 400 })
    }

    const comm = await addCommunication({
      customer_id: Number(id),
      type,
      subject,
      content,
    })

    return NextResponse.json(comm, { status: 201 })
  } catch (error) {
    console.error('Error adding communication:', error)
    return NextResponse.json({ error: 'Error adding communication' }, { status: 500 })
  }
}
