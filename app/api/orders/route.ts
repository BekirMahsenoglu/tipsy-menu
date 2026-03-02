import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // optional: pending | completed

    const where = status ? { status } : {}

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tableNumber, items } = body as {
      tableNumber: string
      items: { productId: string; nameTr: string; nameEn: string; quantity: number; unitPrice: number }[]
    }

    if (!tableNumber?.trim() || !items?.length) {
      return NextResponse.json(
        { error: 'tableNumber and items are required' },
        { status: 400 }
      )
    }

    const totalPrice = items.reduce(
      (sum: number, i: { quantity: number; unitPrice: number }) =>
        sum + i.quantity * i.unitPrice,
      0
    )

    const order = await prisma.order.create({
      data: {
        tableNumber: tableNumber.trim(),
        items: JSON.stringify(items),
        totalPrice,
        status: 'pending',
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create order'
    console.error('[POST /api/orders]', error)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
