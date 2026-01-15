/**
 * API Route для отправки заявки на консультацию
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone } = body

    const adminEmail = process.env.ADMIN_EMAIL || 'orders@capsulehouses.ru'

    await sendEmail({
      to: adminEmail,
      subject: 'Новая заявка на консультацию',
      body: `Имя: ${name}\nТелефон: ${phone}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка отправки заявки:', error)
    return NextResponse.json({ success: false, error: 'Ошибка отправки' }, { status: 500 })
  }
}
