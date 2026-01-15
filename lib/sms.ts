/**
 * Система отправки SMS уведомлений
 * 
 * TODO: Настройте отправку SMS через один из сервисов:
 * - SMS.ru: https://sms.ru (Россия)
 * - Twilio: https://www.twilio.com (международный)
 * - SMSC.ru: https://smsc.ru (Россия)
 * 
 * Инструкция по настройке в файле DEPLOYMENT.md
 */

export interface SMSData {
  to: string // Номер телефона в формате +79991234567
  message: string
}

/**
 * Отправка SMS уведомления
 * 
 * TODO: Замените на реальную интеграцию с SMS API
 * 
 * Пример для SMS.ru:
 * ```typescript
 * const response = await fetch('https://sms.ru/sms/send', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     api_id: process.env.SMS_RU_API_ID,
 *     to: data.to,
 *     msg: data.message,
 *     json: 1
 *   })
 * })
 * ```
 */
export async function sendSMS(data: SMSData): Promise<boolean> {
  try {
    // TODO: Интеграция с SMS API
    // Раскомментируйте и настройте один из вариантов ниже
    
    // Вариант 1: SMS.ru (Россия)
    // const response = await fetch('https://sms.ru/sms/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     api_id: process.env.SMS_RU_API_ID, // Получите на https://sms.ru
    //     to: data.to.replace(/[^0-9]/g, ''), // Убираем все кроме цифр
    //     msg: data.message,
    //     json: 1
    //   })
    // })
    // const result = await response.json()
    // return result.status === 'OK'
    
    // Вариант 2: SMSC.ru (Россия)
    // const response = await fetch(`https://smsc.ru/sys/send.php?login=${process.env.SMSC_LOGIN}&psw=${process.env.SMSC_PASSWORD}&phones=${data.to}&mes=${encodeURIComponent(data.message)}`)
    // return response.ok
    
    // Вариант 3: Twilio (международный)
    // const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   },
    //   body: new URLSearchParams({
    //     To: data.to,
    //     From: process.env.TWILIO_PHONE_NUMBER,
    //     Body: data.message
    //   })
    // })
    // return response.ok
    
    console.log('📱 SMS отправка:', {
      to: data.to,
      message: data.message,
    })
    
    // Симуляция отправки (удалите в продакшене)
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    return true
  } catch (error) {
    console.error('Ошибка отправки SMS:', error)
    return false
  }
}

/**
 * Форматирование SMS для нового заказа
 */
export function formatOrderSMS(order: {
  orderNumber: string
  customerName: string
  total: number
}): string {
  return `Ваш заказ #${order.orderNumber} принят! Сумма: ${formatPrice(order.total)} ₽. Менеджер свяжется с вами в ближайшее время. Capsule Houses`
}

/**
 * Форматирование SMS для администратора о новом заказе
 */
export function formatOrderSMSAdmin(order: {
  orderNumber: string
  customerName: string
  total: number
}): string {
  return `Новый заказ #${order.orderNumber} от ${order.customerName}. Сумма: ${formatPrice(order.total)} ₽`
}

/**
 * Форматирование SMS для заявки на звонок
 */
export function formatCallbackSMS(data: {
  name: string
  phone: string
}): string {
  return `Новая заявка на звонок от ${data.name} (${data.phone}). Пожалуйста, свяжитесь с клиентом.`
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
