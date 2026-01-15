/**
 * API Route для отправки заявки на звонок
 * Используется для безопасной отправки email и SMS с сервера
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendCallbackEmail } from '@/lib/email'
import { sendSMS, formatCallbackSMS } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone } = body

    // Отправка Email администратору
    await sendCallbackEmail({ name, phone })

    // Отправка SMS администратору
    const adminPhone = process.env.ADMIN_PHONE || '+79991234567'
    await sendSMS({
      to: adminPhone,
      message: formatCallbackSMS({ name, phone }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка отправки заявки:', error)
    return NextResponse.json({ success: false, error: 'Ошибка отправки' }, { status: 500 })
  }
}
