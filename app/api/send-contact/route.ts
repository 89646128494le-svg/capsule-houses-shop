/**
 * API Route для отправки сообщения с страницы контактов
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    const adminEmail = process.env.ADMIN_EMAIL || 'orders@capsulehouses.ru'

    await sendEmail({
      to: adminEmail,
      subject: `Сообщение от ${name}`,
      body: `Имя: ${name}\nEmail: ${email}\nТелефон: ${phone}\n\nСообщение:\n${message}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка отправки сообщения:', error)
    return NextResponse.json({ success: false, error: 'Ошибка отправки' }, { status: 500 })
  }
}
