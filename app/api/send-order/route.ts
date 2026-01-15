/**
 * API Route для отправки заказа
 * Используется для безопасной отправки email и SMS с сервера
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendOrderEmailAdmin, sendOrderEmailCustomer } from '@/lib/email'
import { sendSMS, formatOrderSMS, formatOrderSMSAdmin } from '@/lib/sms'

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

    // Отправка SMS администратору
    const adminPhone = process.env.ADMIN_PHONE || '+79991234567'
    await sendSMS({
      to: adminPhone,
      message: formatOrderSMSAdmin({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        total: order.total,
      }),
    })

    // Отправка SMS клиенту
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
