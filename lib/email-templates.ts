/**
 * Шаблоны Email уведомлений
 * 
 * TODO: Настройте отправку email через один из сервисов:
 * - Resend (рекомендуется): https://resend.com
 * - SendGrid: https://sendgrid.com  
 * - Nodemailer (собственный SMTP): https://nodemailer.com
 * 
 * Инструкция по настройке в файле DEPLOYMENT.md
 */

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  deliveryAddress?: string
  notes?: string
}

export interface CallbackEmailData {
  name: string
  phone: string
  time?: string
}

/**
 * Шаблон email для нового заказа (для администратора)
 */
export function formatOrderEmailAdmin(order: OrderEmailData): string {
  return `
═══════════════════════════════════════
  НОВЫЙ ЗАКАЗ #${order.orderNumber}
═══════════════════════════════════════

📋 ИНФОРМАЦИЯ О КЛИЕНТЕ:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Имя: ${order.customerName}
📞 Телефон: ${order.customerPhone}
${order.customerEmail ? `📧 Email: ${order.customerEmail}` : ''}

🛒 СОСТАВ ЗАКАЗА:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${order.items.map((item, index) => 
  `${index + 1}. ${item.name}
     Количество: ${item.quantity} шт.
     Цена за единицу: ${formatPrice(item.price)} ₽
     Сумма: ${formatPrice(item.price * item.quantity)} ₽`
).join('\n\n')}

💰 ИТОГО: ${formatPrice(order.total)} ₽

${order.deliveryAddress ? `📍 Адрес доставки: ${order.deliveryAddress}` : ''}
${order.notes ? `📝 Комментарий: ${order.notes}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Дата заказа: ${new Date().toLocaleString('ru-RU')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim()
}

/**
 * Шаблон email для клиента (подтверждение заказа)
 */
export function formatOrderEmailCustomer(order: OrderEmailData): string {
  return `
Здравствуйте, ${order.customerName}!

Благодарим вас за заказ в Capsule Houses!

═══════════════════════════════════════
  ВАШ ЗАКАЗ #${order.orderNumber}
═══════════════════════════════════════

🛒 СОСТАВ ЗАКАЗА:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${order.items.map((item, index) => 
  `${index + 1}. ${item.name} × ${item.quantity} шт. = ${formatPrice(item.price * item.quantity)} ₽`
).join('\n')}

💰 ИТОГО: ${formatPrice(order.total)} ₽

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.

Если у вас возникли вопросы, свяжитесь с нами:
📞 Телефон: +7 (999) 123-45-67
📧 Email: info@capsulehouses.ru

С уважением,
Команда Capsule Houses
  `.trim()
}

/**
 * Шаблон email для заявки на звонок
 */
export function formatCallbackEmail(data: CallbackEmailData): string {
  return `
═══════════════════════════════════════
  НОВАЯ ЗАЯВКА НА ЗВОНОК
═══════════════════════════════════════

👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
${data.time ? `⏰ Удобное время: ${data.time}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Дата заявки: ${new Date().toLocaleString('ru-RU')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Пожалуйста, свяжитесь с клиентом в ближайшее время.
  `.trim()
}

/**
 * HTML шаблон для email (более красивый вариант)
 */
export function formatOrderEmailHTML(order: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #00f2ff 0%, #00b8cc 100%); color: white; padding: 20px; text-align: center; }
    .content { background: #f9f9f9; padding: 20px; }
    .order-info { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #00f2ff; }
    .total { font-size: 24px; font-weight: bold; color: #00f2ff; text-align: center; padding: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Новый заказ #${order.orderNumber}</h1>
    </div>
    <div class="content">
      <div class="order-info">
        <h3>Информация о клиенте:</h3>
        <p><strong>Имя:</strong> ${order.customerName}</p>
        <p><strong>Телефон:</strong> ${order.customerPhone}</p>
        ${order.customerEmail ? `<p><strong>Email:</strong> ${order.customerEmail}</p>` : ''}
      </div>
      <div class="order-info">
        <h3>Состав заказа:</h3>
        ${order.items.map((item) => `
          <p>${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)} ₽</p>
        `).join('')}
      </div>
      <div class="total">
        Итого: ${formatPrice(order.total)} ₽
      </div>
    </div>
    <div class="footer">
      Дата заказа: ${new Date().toLocaleString('ru-RU')}
    </div>
  </div>
</body>
</html>
  `.trim()
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
