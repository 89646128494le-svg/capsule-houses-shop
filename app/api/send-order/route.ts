/**
 * API Route для отправки заказа
 * Используется для безопасной отправки email и SMS с сервера
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendOrderEmailAdmin, sendOrderEmailCustomer } from '@/lib/email'
import { sendSMS, formatOrderSMS } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order, customerEmail, customerPhone } = body

    // Отправка Email администратору
    await sendOrderEmailAdmin(order)

    // Отправка Email клиенту (если указан email)
    if (customerEmail) {
      await sendOrderEmailCustomer(order)
    }

    // Отправка SMS клиенту (если указан телефон)
    if (customerPhone) {
      await sendSMS({
        to: customerPhone,
        message: formatOrderSMS({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          total: order.total,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка отправки заказа:', error)
    return NextResponse.json({ success: false, error: 'Ошибка отправки' }, { status: 500 })
  }
}
