/**
 * Система отправки Email уведомлений
 * 
 * TODO: Настройте отправку email через один из сервисов:
 * - Resend (рекомендуется): https://resend.com
 * - SendGrid: https://sendgrid.com  
 * - Nodemailer (собственный SMTP): https://nodemailer.com
 * 
 * Инструкция по настройке в файле DEPLOYMENT.md
 * 
 * После настройки замените функцию sendEmail на реальную интеграцию
 */

import { formatOrderEmailAdmin, formatOrderEmailCustomer, formatCallbackEmail, formatOrderEmailHTML, formatOrderEmailCustomerHTML, formatCallbackEmailHTML, formatOrderStatusEmailHTML, formatOrderStatusEmail, OrderStatusEmailData } from './email-templates'

export interface EmailData {
  to: string
  subject: string
  body: string
  html?: string // HTML версия письма (опционально)
  from?: string
}

/**
 * Отправка Email уведомления
 * 
 * TODO: Замените на реальную интеграцию с Email API
 * 
 * Пример для Resend:
 * ```typescript
 * const response = await fetch('https://api.resend.com/emails', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({
 *     from: data.from || 'noreply@capsulehouses.ru',
 *     to: data.to,
 *     subject: data.subject,
 *     html: data.html || data.body
 *   })
 * })
 * return response.ok
 * ```
 */
export async function sendEmail(data: EmailData): Promise<boolean> {
  try {
    // Детальное логирование для отладки
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 EMAIL ОТПРАВКА')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📬 Кому:', data.to)
    console.log('📝 Тема:', data.subject)
    console.log('📄 От:', data.from || process.env.EMAIL_FROM || 'noreply@capsulehouses.ru')
    
    // Вариант 1: Resend (рекомендуется для Next.js)
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: data.from || process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: data.to,
            subject: data.subject,
            html: data.html || data.body.replace(/\n/g, '<br>')
          })
        })
        
        const result = await response.json()
        
        if (response.ok && result.id) {
          console.log('✅ Email успешно отправлен через Resend')
          console.log('📧 Email ID:', result.id)
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          return true
        } else {
          console.error('❌ Ошибка Resend API:', result)
          if (result.message === 'API key is invalid') {
            console.error('🔑 ПРОБЛЕМА: Неверный API ключ Resend!')
            console.error('   Решение:')
            console.error('   1. Зайдите на https://resend.com/api-keys')
            console.error('   2. Создайте новый API ключ')
            console.error('   3. Обновите RESEND_API_KEY в .env.local')
            console.error('   4. Перезапустите сервер')
          } else if (result.statusCode === 403 && result.message?.includes('testing emails')) {
            console.error('⚠️  ОГРАНИЧЕНИЕ: Resend в тестовом режиме!')
            console.error('   В тестовом режиме Resend позволяет отправлять письма только на ваш email.')
            console.error('   Решение для продакшена:')
            console.error('   1. Зайдите на https://resend.com/domains')
            console.error('   2. Добавьте и подтвердите свой домен')
            console.error('   3. Обновите EMAIL_FROM в .env.local на ваш домен (например: noreply@yourdomain.com)')
            console.error('   4. После подтверждения домена можно отправлять на любые адреса')
            console.error('   Для тестирования используйте ваш email:', result.message.match(/\(([^)]+)\)/)?.[1] || 'ваш email из Resend')
          } else if (result.message?.includes('domain') || result.message?.includes('from')) {
            console.error('📧 ПРОБЛЕМА: Неверный адрес отправителя!')
            console.error('   Решение:')
            console.error('   1. Используйте подтвержденный домен в Resend')
            console.error('   2. Или используйте тестовый: onboarding@resend.dev')
            console.error('   3. Обновите EMAIL_FROM в .env.local')
          }
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          return false
        }
      } catch (fetchError) {
        console.error('❌ Ошибка при запросе к Resend:', fetchError)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        return false
      }
    }
    
    // Вариант 2: SendGrid
    const sendgridApiKey = process.env.SENDGRID_API_KEY
    if (sendgridApiKey) {
      try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sendgridApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: data.to }] }],
            from: { email: data.from || process.env.EMAIL_FROM || 'noreply@capsulehouses.ru' },
            subject: data.subject,
            content: [{ type: 'text/html', value: data.html || data.body }]
          })
        })
        
        if (response.ok) {
          console.log('✅ Email успешно отправлен через SendGrid')
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          return true
        } else {
          const errorText = await response.text()
          console.error('❌ Ошибка SendGrid API:', errorText)
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
          return false
        }
      } catch (fetchError) {
        console.error('❌ Ошибка при запросе к SendGrid:', fetchError)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        return false
      }
    }
    
    // Если нет настроенных сервисов - симуляция
    console.log('📋 Содержание (первые 200 символов):')
    console.log(data.body.substring(0, 200) + (data.body.length > 200 ? '...' : ''))
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('⚠️  ВНИМАНИЕ: Email отправка симулируется!')
    console.log('   Для реальной отправки настройте переменные окружения:')
    console.log('   - RESEND_API_KEY (рекомендуется)')
    console.log('   - или SENDGRID_API_KEY')
    console.log('   См. ENV_SETUP.md для инструкций')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    // Симуляция отправки
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return true
  } catch (error) {
    console.error('❌ Ошибка отправки email:', error)
    return false
  }
}

/**
 * Отправка email о новом заказе администратору
 */
export async function sendOrderEmailAdmin(order: Parameters<typeof formatOrderEmailAdmin>[0]): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'orders@capsulehouses.ru'
  
  return await sendEmail({
    to: adminEmail,
    subject: `🎉 Новый заказ #${order.orderNumber} от ${order.customerName}`,
    body: formatOrderEmailAdmin(order),
    html: formatOrderEmailHTML(order),
  })
}

/**
 * Отправка email клиенту с подтверждением заказа
 */
export async function sendOrderEmailCustomer(order: Parameters<typeof formatOrderEmailCustomer>[0]): Promise<boolean> {
  if (!order.customerEmail) return false
  
  return await sendEmail({
    to: order.customerEmail,
    subject: `✅ Ваш заказ #${order.orderNumber} принят - Capsule Houses`,
    body: formatOrderEmailCustomer(order),
    html: formatOrderEmailCustomerHTML(order),
  })
}

/**
 * Отправка email о заявке на звонок
 */
export async function sendCallbackEmail(data: Parameters<typeof formatCallbackEmail>[0]): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'orders@capsulehouses.ru'
  
  return await sendEmail({
    to: adminEmail,
    subject: `📞 Новая заявка на звонок от ${data.name}`,
    body: formatCallbackEmail(data),
    html: formatCallbackEmailHTML(data),
  })
}

/**
 * Отправка email покупателю об изменении статуса заказа
 */
export async function sendOrderStatusEmail(data: OrderStatusEmailData & { customerEmail?: string }): Promise<boolean> {
  if (!data.customerName) return false
  
  const customerEmail = data.customerEmail
  if (!customerEmail) return false

  const statusSubjects = {
    processing: `⏳ Заказ #${data.orderNumber} принят в обработку`,
    shipped: `🚚 Заказ #${data.orderNumber} отправлен`,
    delivered: `✅ Заказ #${data.orderNumber} доставлен`,
    cancelled: `❌ Заказ #${data.orderNumber} отменен`,
  }

  return await sendEmail({
    to: customerEmail,
    subject: `${statusSubjects[data.status]} - Capsule Houses`,
    body: formatOrderStatusEmail(data),
    html: formatOrderStatusEmailHTML(data),
  })
}

// Экспортируем функции форматирования для обратной совместимости
export { formatOrderEmailAdmin as formatOrderEmail, formatCallbackEmail }
