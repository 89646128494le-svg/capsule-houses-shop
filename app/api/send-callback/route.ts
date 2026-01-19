/**
 * API Route для отправки заявки на звонок
 * Используется для безопасной отправки email и SMS с сервера
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendCallbackEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone } = body

    // Отправка Email администратору
    await sendCallbackEmail({ name, phone })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка отправки заявки:', error)
    return NextResponse.json({ success: false, error: 'Ошибка отправки' }, { status: 500 })
  }
}
