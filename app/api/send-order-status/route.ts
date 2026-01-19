/**
 * API Route для отправки уведомления о статусе заказа покупателю
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendOrderStatusEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, status, cancellationReason, trackingNumber, customerEmail } = body

    if (!customerEmail) {
      return NextResponse.json({ success: false, error: 'Email покупателя не указан' }, { status: 400 })
    }

    await sendOrderStatusEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      status,
      items: order.items,
      total: order.total,
      cancellationReason,
      trackingNumber,
      customerEmail,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка отправки уведомления о статусе:', error)
    return NextResponse.json({ success: false, error: 'Ошибка отправки' }, { status: 500 })
  }
}
