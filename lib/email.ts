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

import { formatOrderEmailAdmin, formatOrderEmailCustomer, formatCallbackEmail, formatOrderEmailHTML } from './email-templates'

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
    // TODO: Интеграция с Email API
    // Раскомментируйте и настройте один из вариантов ниже
    
    // Вариант 1: Resend (рекомендуется для Next.js)
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, // Получите на https://resend.com
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     from: data.from || process.env.EMAIL_FROM || 'noreply@capsulehouses.ru',
    //     to: data.to,
    //     subject: data.subject,
    //     html: data.html || data.body.replace(/\n/g, '<br>')
    //   })
    // })
    // const result = await response.json()
    // return response.ok && result.id
    
    // Вариант 2: SendGrid
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: data.to }] }],
    //     from: { email: data.from || process.env.EMAIL_FROM || 'noreply@capsulehouses.ru' },
    //     subject: data.subject,
    //     content: [{ type: 'text/html', value: data.html || data.body }]
    //   })
    // })
    // return response.ok
    
    // Вариант 3: Nodemailer (собственный SMTP сервер)
    // Используйте API route: app/api/send-email/route.ts
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // })
    // return response.ok
    
    console.log('📧 Email отправка:', {
      to: data.to,
      subject: data.subject,
      body: data.body.substring(0, 100) + '...',
    })

    // Симуляция отправки (удалите в продакшене)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return true
  } catch (error) {
    console.error('Ошибка отправки email:', error)
    return false
  }
}

/**
 * Отправка email о новом заказе администратору
 */
export async function sendOrderEmailAdmin(order: Parameters<typeof formatOrderEmailAdmin>[0]): Promise<boolean> {
  // TODO: Замените на ваш email для получения заказов
  const adminEmail = process.env.ADMIN_EMAIL || 'orders@capsulehouses.ru'
  
  return await sendEmail({
    to: adminEmail,
    subject: `Новый заказ #${order.orderNumber} от ${order.customerName}`,
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
    subject: `Ваш заказ #${order.orderNumber} принят`,
    body: formatOrderEmailCustomer(order),
    html: formatOrderEmailHTML(order),
  })
}

/**
 * Отправка email о заявке на звонок
 */
export async function sendCallbackEmail(data: Parameters<typeof formatCallbackEmail>[0]): Promise<boolean> {
  // TODO: Замените на ваш email для получения заявок
  const adminEmail = process.env.ADMIN_EMAIL || 'orders@capsulehouses.ru'
  
  return await sendEmail({
    to: adminEmail,
    subject: `Новая заявка на звонок от ${data.name}`,
    body: formatCallbackEmail(data),
  })
}

// Экспортируем функции форматирования для обратной совместимости
export { formatOrderEmailAdmin as formatOrderEmail, formatCallbackEmail }
