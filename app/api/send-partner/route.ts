/**
 * API Route для отправки заявки на партнёрство
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { formatPartnerEmailHTML } from '@/lib/email-templates'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { company, name, phone, email } = body

    const adminEmail = process.env.ADMIN_EMAIL || 'orders@capsulehouses.ru'

    await sendEmail({
      to: adminEmail,
      subject: `🤝 Новая заявка на партнёрство от ${company}`,
      body: `Компания: ${company}\nИмя: ${name}\nТелефон: ${phone}\nEmail: ${email}`,
      html: formatPartnerEmailHTML({ company, name, phone, email }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка отправки заявки:', error)
    return NextResponse.json({ success: false, error: 'Ошибка отправки' }, { status: 500 })
  }
}
