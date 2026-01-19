import { NextRequest, NextResponse } from 'next/server'
import { sendOrderEmailAdmin, sendOrderEmailCustomer } from '@/lib/email'

/**
 * API Route для тестирования отправки email
 * Используется на странице /admin/test-email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email, order } = body

    if (!type || !email || !order) {
      return NextResponse.json(
        { success: false, error: 'Недостаточно данных' },
        { status: 400 }
      )
    }

    let result = false
    let message = ''

    if (type === 'admin') {
      // Тест отправки администратору
      console.log('📧 [TEST] Отправка письма администратору:', {
        to: email,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
      })
      
      result = await sendOrderEmailAdmin({
        ...order,
        customerEmail: order.customerEmail,
      })
      
      message = result
        ? `Письмо успешно отправлено на ${email}. Проверьте консоль сервера для деталей.`
        : 'Ошибка отправки письма. Проверьте консоль сервера.'
    } else if (type === 'customer') {
      // Тест отправки покупателю
      console.log('📧 [TEST] Отправка письма покупателю:', {
        to: email,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
      })
      
      result = await sendOrderEmailCustomer({
        ...order,
        customerEmail: email,
      })
      
      message = result
        ? `Письмо успешно отправлено на ${email}. Проверьте консоль сервера для деталей.`
        : 'Ошибка отправки письма. Проверьте консоль сервера.'
    } else {
      return NextResponse.json(
        { success: false, error: 'Неверный тип письма' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: result,
      message,
      details: {
        type,
        email,
        timestamp: new Date().toISOString(),
        note: 'Если письма не приходят, проверьте настройки в lib/email.ts и переменные окружения',
      },
    })
  } catch (error) {
    console.error('❌ [TEST] Ошибка тестирования email:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    )
  }
}
