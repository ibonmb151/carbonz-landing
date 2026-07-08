import { NextRequest, NextResponse } from 'next/server'
import { getAllCustomers, createCustomer, searchCustomers, getCustomerStats } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl
    const query = url.searchParams.get('q')
    const stats = url.searchParams.get('stats')

    if (stats === '1') {
      const customerStats = await getCustomerStats()
      return NextResponse.json(customerStats)
    }

    if (query) {
      const customers = await searchCustomers(query)
      return NextResponse.json(customers)
    }

    const customers = await getAllCustomers()
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Error fetching customers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, address, city, postal, country, company, source, status, notes, tags } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const customer = await createCustomer({
      name,
      email,
      phone,
      address,
      city,
      postal,
      country,
      company,
      source,
      status,
      notes,
      tags,
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error: any) {
    console.error('Error creating customer:', error)
    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error creating customer' }, { status: 500 })
  }
}
