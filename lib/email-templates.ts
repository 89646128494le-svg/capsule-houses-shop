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

ВАЖНО: Наш администратор скоро свяжется с вами для подтверждения заказа и уточнения деталей доставки. Пожалуйста, будьте на связи!

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
 * HTML шаблон для email администратору о новом заказе
 */
export function formatOrderEmailHTML(order: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #00f2ff 0%, #00b8cc 100%); padding: 40px 30px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; margin-bottom: 10px; }
    .header .order-number { color: #ffffff; font-size: 18px; opacity: 0.95; }
    .content { padding: 40px 30px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 18px; font-weight: 600; color: #00b8cc; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0; }
    .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #666; width: 140px; flex-shrink: 0; }
    .info-value { color: #1a1a1a; flex: 1; }
    .items-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .items-table th { background-color: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #666; font-size: 14px; }
    .items-table td { padding: 15px 12px; border-bottom: 1px solid #f0f0f0; }
    .items-table tr:last-child td { border-bottom: none; }
    .item-name { font-weight: 500; color: #1a1a1a; }
    .item-details { color: #666; font-size: 14px; margin-top: 4px; }
    .item-price { text-align: right; font-weight: 600; color: #1a1a1a; }
    .total-section { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 25px; border-radius: 8px; margin-top: 20px; border: 2px solid #00f2ff; }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .total-label { font-size: 20px; font-weight: 600; color: #666; }
    .total-value { font-size: 32px; font-weight: 700; color: #00b8cc; }
    .footer { background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; }
    .footer-text { font-size: 14px; opacity: 0.8; margin-bottom: 10px; }
    .footer-date { font-size: 12px; opacity: 0.6; }
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .header { padding: 30px 20px; }
      .header h1 { font-size: 24px; }
      .info-row { flex-direction: column; }
      .info-label { width: 100%; margin-bottom: 5px; }
      .items-table { font-size: 14px; }
      .items-table th, .items-table td { padding: 10px 8px; }
      .total-value { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h1>🎉 Новый заказ</h1>
      <div class="order-number">#${order.orderNumber}</div>
    </div>
    
    <div class="content">
      <div class="section">
        <div class="section-title">👤 Информация о клиенте</div>
        <div class="info-row">
          <div class="info-label">Имя:</div>
          <div class="info-value">${escapeHtml(order.customerName)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Телефон:</div>
          <div class="info-value">${escapeHtml(order.customerPhone)}</div>
        </div>
        ${order.customerEmail ? `
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-value">${escapeHtml(order.customerEmail)}</div>
        </div>
        ` : ''}
        ${order.deliveryAddress ? `
        <div class="info-row">
          <div class="info-label">Адрес доставки:</div>
          <div class="info-value">${escapeHtml(order.deliveryAddress)}</div>
        </div>
        ` : ''}
        ${order.notes ? `
        <div class="info-row">
          <div class="info-label">Комментарий:</div>
          <div class="info-value">${escapeHtml(order.notes)}</div>
        </div>
        ` : ''}
      </div>

      <div class="section">
        <div class="section-title">🛒 Состав заказа</div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Товар</th>
              <th style="text-align: right;">Цена</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item) => `
            <tr>
              <td>
                <div class="item-name">${escapeHtml(item.name)}</div>
                <div class="item-details">Количество: ${item.quantity} шт. × ${formatPrice(item.price)} ₽</div>
              </td>
              <td class="item-price">${formatPrice(item.price * item.quantity)} ₽</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-section">
          <div class="total-row">
            <div class="total-label">Итого:</div>
            <div class="total-value">${formatPrice(order.total)} ₽</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">Capsule Houses</div>
      <div class="footer-date">Дата заказа: ${new Date().toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * HTML шаблон для email клиенту с подтверждением заказа
 */
export function formatOrderEmailCustomerHTML(order: OrderEmailData): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #00f2ff 0%, #00b8cc 100%); padding: 50px 30px; text-align: center; }
    .header .icon { font-size: 64px; margin-bottom: 20px; }
    .header h1 { color: #ffffff; font-size: 32px; font-weight: 700; margin-bottom: 10px; }
    .header .greeting { color: #ffffff; font-size: 18px; opacity: 0.95; }
    .content { padding: 40px 30px; }
    .message { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #00f2ff; }
    .message p { margin-bottom: 15px; color: #333; font-size: 16px; }
    .message p:last-child { margin-bottom: 0; }
    .section-title { font-size: 20px; font-weight: 600; color: #00b8cc; margin-bottom: 20px; text-align: center; }
    .order-box { background: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 25px; margin-bottom: 25px; }
    .order-number { text-align: center; font-size: 24px; font-weight: 700; color: #00b8cc; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0; }
    .items-list { margin-bottom: 20px; }
    .item { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid #f0f0f0; }
    .item:last-child { border-bottom: none; }
    .item-name { font-weight: 500; color: #1a1a1a; flex: 1; }
    .item-quantity { color: #666; margin-left: 10px; }
    .item-price { font-weight: 600; color: #1a1a1a; }
    .total-box { background: linear-gradient(135deg, #00f2ff 0%, #00b8cc 100%); padding: 25px; border-radius: 8px; text-align: center; }
    .total-label { color: #ffffff; font-size: 18px; opacity: 0.9; margin-bottom: 10px; }
    .total-value { color: #ffffff; font-size: 36px; font-weight: 700; }
    .contact-info { background: #f8f9fa; padding: 25px; border-radius: 8px; margin-top: 30px; text-align: center; }
    .contact-info p { margin-bottom: 10px; color: #666; font-size: 15px; }
    .contact-info a { color: #00b8cc; text-decoration: none; font-weight: 600; }
    .footer { background-color: #1a1a1a; color: #ffffff; padding: 40px 30px; text-align: center; }
    .footer-logo { font-size: 24px; font-weight: 700; margin-bottom: 15px; }
    .footer-text { font-size: 14px; opacity: 0.8; margin-bottom: 10px; line-height: 1.8; }
    .footer-date { font-size: 12px; opacity: 0.6; margin-top: 15px; }
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .header { padding: 40px 20px; }
      .header h1 { font-size: 26px; }
      .header .icon { font-size: 48px; }
      .order-box { padding: 20px; }
      .total-value { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="icon">✅</div>
      <h1>Спасибо за заказ!</h1>
      <div class="greeting">Здравствуйте, ${escapeHtml(order.customerName)}!</div>
    </div>
    
    <div class="content">
      <div class="message">
        <p>Благодарим вас за заказ в <strong>Capsule Houses</strong>!</p>
        <p>Ваш заказ принят и находится в обработке. <strong>Наш администратор скоро свяжется с вами</strong> для подтверждения заказа и уточнения деталей доставки.</p>
        <p>Пожалуйста, будьте на связи - мы свяжемся с вами в ближайшее время!</p>
      </div>

      <div class="order-box">
        <div class="section-title">Детали вашего заказа</div>
        <div class="order-number">#${order.orderNumber}</div>
        
        <div class="items-list">
          ${order.items.map((item) => `
          <div class="item">
            <div class="item-name">
              ${escapeHtml(item.name)}
              <span class="item-quantity">× ${item.quantity}</span>
            </div>
            <div class="item-price">${formatPrice(item.price * item.quantity)} ₽</div>
          </div>
          `).join('')}
        </div>
        
        <div class="total-box">
          <div class="total-label">Итого к оплате</div>
          <div class="total-value">${formatPrice(order.total)} ₽</div>
        </div>
      </div>

      <div class="contact-info">
        <p><strong>Есть вопросы?</strong></p>
        <p>Свяжитесь с нами:</p>
        <p>📞 Телефон: <a href="tel:+79991234567">+7 (999) 123-45-67</a></p>
        <p>📧 Email: <a href="mailto:info@capsulehouses.ru">info@capsulehouses.ru</a></p>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-logo">Capsule Houses</div>
      <div class="footer-text">
        Мы ценим ваше доверие и всегда готовы помочь!<br>
        С уважением, команда Capsule Houses
      </div>
      <div class="footer-date">Дата заказа: ${new Date().toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * HTML шаблон для email администратору о заявке на звонок
 */
export function formatCallbackEmailHTML(data: CallbackEmailData): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #00f2ff 0%, #00b8cc 100%); padding: 40px 30px; text-align: center; }
    .header .icon { font-size: 48px; margin-bottom: 15px; }
    .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .info-box { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 30px; border-radius: 8px; border-left: 4px solid #00f2ff; }
    .info-row { display: flex; padding: 15px 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #666; width: 140px; flex-shrink: 0; }
    .info-value { color: #1a1a1a; flex: 1; font-size: 16px; }
    .info-value a { color: #00b8cc; text-decoration: none; font-weight: 600; }
    .action-box { background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 20px; margin-top: 25px; text-align: center; }
    .action-box p { color: #856404; font-weight: 600; margin: 0; }
    .footer { background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; }
    .footer-text { font-size: 14px; opacity: 0.8; margin-bottom: 10px; }
    .footer-date { font-size: 12px; opacity: 0.6; }
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .header { padding: 30px 20px; }
      .info-row { flex-direction: column; }
      .info-label { width: 100%; margin-bottom: 5px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="icon">📞</div>
      <h1>Новая заявка на звонок</h1>
    </div>
    
    <div class="content">
      <div class="info-box">
        <div class="info-row">
          <div class="info-label">Имя:</div>
          <div class="info-value">${escapeHtml(data.name)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Телефон:</div>
          <div class="info-value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
        </div>
        ${data.time ? `
        <div class="info-row">
          <div class="info-label">Удобное время:</div>
          <div class="info-value">${escapeHtml(data.time)}</div>
        </div>
        ` : ''}
      </div>

      <div class="action-box">
        <p>⚠️ Пожалуйста, свяжитесь с клиентом в ближайшее время</p>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">Capsule Houses</div>
      <div class="footer-date">Дата заявки: ${new Date().toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * HTML шаблон для сообщения с страницы контактов
 */
export function formatContactEmailHTML(data: { name: string; email: string; phone: string; message: string }): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #00f2ff 0%, #00b8cc 100%); padding: 40px 30px; text-align: center; }
    .header .icon { font-size: 48px; margin-bottom: 15px; }
    .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .info-box { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 30px; border-radius: 8px; border-left: 4px solid #00f2ff; }
    .info-row { display: flex; padding: 15px 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #666; width: 140px; flex-shrink: 0; }
    .info-value { color: #1a1a1a; flex: 1; font-size: 16px; }
    .info-value a { color: #00b8cc; text-decoration: none; font-weight: 600; }
    .message-box { background: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 20px; margin-top: 20px; }
    .message-label { font-weight: 600; color: #666; margin-bottom: 10px; }
    .message-text { color: #1a1a1a; line-height: 1.8; white-space: pre-wrap; }
    .footer { background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; }
    .footer-text { font-size: 14px; opacity: 0.8; margin-bottom: 10px; }
    .footer-date { font-size: 12px; opacity: 0.6; }
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .header { padding: 30px 20px; }
      .info-row { flex-direction: column; }
      .info-label { width: 100%; margin-bottom: 5px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="icon">📧</div>
      <h1>Новое сообщение с сайта</h1>
    </div>
    
    <div class="content">
      <div class="info-box">
        <div class="info-row">
          <div class="info-label">Имя:</div>
          <div class="info-value">${escapeHtml(data.name)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
        </div>
        <div class="info-row">
          <div class="info-label">Телефон:</div>
          <div class="info-value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
        </div>
      </div>

      <div class="message-box">
        <div class="message-label">Сообщение:</div>
        <div class="message-text">${escapeHtml(data.message)}</div>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">Capsule Houses</div>
      <div class="footer-date">Дата сообщения: ${new Date().toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * HTML шаблон для заявки на консультацию
 */
export function formatConsultationEmailHTML(data: { name: string; phone: string }): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #00f2ff 0%, #00b8cc 100%); padding: 40px 30px; text-align: center; }
    .header .icon { font-size: 48px; margin-bottom: 15px; }
    .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .info-box { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 30px; border-radius: 8px; border-left: 4px solid #00f2ff; }
    .info-row { display: flex; padding: 15px 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #666; width: 140px; flex-shrink: 0; }
    .info-value { color: #1a1a1a; flex: 1; font-size: 16px; }
    .info-value a { color: #00b8cc; text-decoration: none; font-weight: 600; }
    .action-box { background: #d1ecf1; border: 2px solid #00b8cc; border-radius: 8px; padding: 20px; margin-top: 25px; text-align: center; }
    .action-box p { color: #0c5460; font-weight: 600; margin: 0; }
    .footer { background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; }
    .footer-text { font-size: 14px; opacity: 0.8; margin-bottom: 10px; }
    .footer-date { font-size: 12px; opacity: 0.6; }
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .header { padding: 30px 20px; }
      .info-row { flex-direction: column; }
      .info-label { width: 100%; margin-bottom: 5px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="icon">💬</div>
      <h1>Новая заявка на консультацию</h1>
    </div>
    
    <div class="content">
      <div class="info-box">
        <div class="info-row">
          <div class="info-label">Имя:</div>
          <div class="info-value">${escapeHtml(data.name)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Телефон:</div>
          <div class="info-value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
        </div>
      </div>

      <div class="action-box">
        <p>💡 Клиент запросил консультацию. Пожалуйста, свяжитесь с ним в ближайшее время</p>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">Capsule Houses</div>
      <div class="footer-date">Дата заявки: ${new Date().toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * HTML шаблон для заявки на партнёрство
 */
export function formatPartnerEmailHTML(data: { company: string; name: string; phone: string; email: string }): string {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #00f2ff 0%, #00b8cc 100%); padding: 40px 30px; text-align: center; }
    .header .icon { font-size: 48px; margin-bottom: 15px; }
    .header h1 { color: #ffffff; font-size: 28px; font-weight: 700; }
    .content { padding: 40px 30px; }
    .info-box { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 30px; border-radius: 8px; border-left: 4px solid #00f2ff; }
    .info-row { display: flex; padding: 15px 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #666; width: 160px; flex-shrink: 0; }
    .info-value { color: #1a1a1a; flex: 1; font-size: 16px; }
    .info-value a { color: #00b8cc; text-decoration: none; font-weight: 600; }
    .company-name { font-size: 20px; font-weight: 700; color: #00b8cc; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #e0e0e0; }
    .action-box { background: #d4edda; border: 2px solid #28a745; border-radius: 8px; padding: 20px; margin-top: 25px; text-align: center; }
    .action-box p { color: #155724; font-weight: 600; margin: 0; }
    .footer { background-color: #1a1a1a; color: #ffffff; padding: 30px; text-align: center; }
    .footer-text { font-size: 14px; opacity: 0.8; margin-bottom: 10px; }
    .footer-date { font-size: 12px; opacity: 0.6; }
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .header { padding: 30px 20px; }
      .info-row { flex-direction: column; }
      .info-label { width: 100%; margin-bottom: 5px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="icon">🤝</div>
      <h1>Новая заявка на партнёрство</h1>
    </div>
    
    <div class="content">
      <div class="info-box">
        <div class="company-name">${escapeHtml(data.company)}</div>
        <div class="info-row">
          <div class="info-label">Контактное лицо:</div>
          <div class="info-value">${escapeHtml(data.name)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Телефон:</div>
          <div class="info-value"><a href="tel:${escapeHtml(data.phone)}">${escapeHtml(data.phone)}</a></div>
        </div>
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
        </div>
      </div>

      <div class="action-box">
        <p>✨ Компания заинтересована в партнёрстве. Пожалуйста, свяжитесь для обсуждения деталей</p>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">Capsule Houses</div>
      <div class="footer-date">Дата заявки: ${new Date().toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export interface OrderStatusEmailData {
  orderNumber: string
  customerName: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: Array<{ name: string; quantity: number; price: number }>
  total: number
  cancellationReason?: string
  trackingNumber?: string
}

/**
 * HTML шаблон для уведомления о статусе заказа
 */
export function formatOrderStatusEmailHTML(data: OrderStatusEmailData): string {
  const statusConfig = {
    processing: {
      icon: '⏳',
      title: 'Заказ в обработке',
      message: 'Ваш заказ принят в обработку. Мы готовим его к отправке.',
      color: '#3b82f6',
    },
    shipped: {
      icon: '🚚',
      title: 'Заказ отправлен',
      message: 'Ваш заказ отправлен! Скоро он будет у вас.',
      color: '#a855f7',
    },
    delivered: {
      icon: '✅',
      title: 'Заказ доставлен',
      message: 'Ваш заказ успешно доставлен! Надеемся, вы остались довольны.',
      color: '#10b981',
    },
    cancelled: {
      icon: '❌',
      title: 'Заказ отменен',
      message: 'К сожалению, ваш заказ был отменен.',
      color: '#ef4444',
    },
  }

  const config = statusConfig[data.status]

  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; }
    .email-wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%); padding: 50px 30px; text-align: center; }
    .header .icon { font-size: 64px; margin-bottom: 20px; }
    .header h1 { color: #ffffff; font-size: 32px; font-weight: 700; margin-bottom: 10px; }
    .header .order-number { color: #ffffff; font-size: 18px; opacity: 0.95; }
    .content { padding: 40px 30px; }
    .message-box { background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%); padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid ${config.color}; }
    .message-box p { margin-bottom: 15px; color: #333; font-size: 16px; }
    .message-box p:last-child { margin-bottom: 0; }
    .order-info { background: #ffffff; border: 2px solid #e0e0e0; border-radius: 8px; padding: 25px; margin-bottom: 25px; }
    .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: 600; color: #666; width: 140px; flex-shrink: 0; }
    .info-value { color: #1a1a1a; flex: 1; }
    .items-list { margin-top: 15px; }
    .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
    .item:last-child { border-bottom: none; }
    .item-name { font-weight: 500; color: #1a1a1a; }
    .item-price { font-weight: 600; color: #1a1a1a; }
    .total-box { background: linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%); padding: 25px; border-radius: 8px; text-align: center; margin-top: 20px; }
    .total-label { color: #ffffff; font-size: 18px; opacity: 0.9; margin-bottom: 10px; }
    .total-value { color: #ffffff; font-size: 32px; font-weight: 700; }
    .reason-box { background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 20px; margin-top: 20px; }
    .reason-title { font-weight: 600; color: #856404; margin-bottom: 10px; }
    .reason-text { color: #856404; line-height: 1.8; }
    .tracking-box { background: #d1ecf1; border: 2px solid #0dcaf0; border-radius: 8px; padding: 20px; margin-top: 20px; text-align: center; }
    .tracking-title { font-weight: 600; color: #0c5460; margin-bottom: 10px; }
    .tracking-number { font-size: 24px; font-weight: 700; color: #0c5460; }
    .contact-info { background: #f8f9fa; padding: 25px; border-radius: 8px; margin-top: 30px; text-align: center; }
    .contact-info p { margin-bottom: 10px; color: #666; font-size: 15px; }
    .contact-info a { color: ${config.color}; text-decoration: none; font-weight: 600; }
    .footer { background-color: #1a1a1a; color: #ffffff; padding: 40px 30px; text-align: center; }
    .footer-logo { font-size: 24px; font-weight: 700; margin-bottom: 15px; }
    .footer-text { font-size: 14px; opacity: 0.8; margin-bottom: 10px; line-height: 1.8; }
    @media only screen and (max-width: 600px) {
      .content { padding: 30px 20px; }
      .header { padding: 40px 20px; }
      .header h1 { font-size: 26px; }
      .header .icon { font-size: 48px; }
      .total-value { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <div class="icon">${config.icon}</div>
      <h1>${config.title}</h1>
      <div class="order-number">Заказ #${escapeHtml(data.orderNumber)}</div>
    </div>
    
    <div class="content">
      <div class="message-box">
        <p>Здравствуйте, ${escapeHtml(data.customerName)}!</p>
        <p>${config.message}</p>
        ${data.status === 'cancelled' && data.cancellationReason ? `
        <p><strong>Причина отмены:</strong> ${escapeHtml(data.cancellationReason)}</p>
        ` : ''}
        ${data.status === 'shipped' && data.trackingNumber ? `
        <p><strong>Номер отслеживания:</strong> ${escapeHtml(data.trackingNumber)}</p>
        ` : ''}
      </div>

      <div class="order-info">
        <div class="info-row">
          <div class="info-label">Номер заказа:</div>
          <div class="info-value">#${escapeHtml(data.orderNumber)}</div>
        </div>
        
        <div class="items-list">
          ${data.items.map((item) => `
          <div class="item">
            <div class="item-name">${escapeHtml(item.name)} × ${item.quantity}</div>
            <div class="item-price">${formatPrice(item.price * item.quantity)} ₽</div>
          </div>
          `).join('')}
        </div>
        
        <div class="total-box">
          <div class="total-label">Сумма заказа</div>
          <div class="total-value">${formatPrice(data.total)} ₽</div>
        </div>
      </div>

      ${data.status === 'cancelled' && data.cancellationReason ? `
      <div class="reason-box">
        <div class="reason-title">Причина отмены заказа:</div>
        <div class="reason-text">${escapeHtml(data.cancellationReason)}</div>
      </div>
      ` : ''}

      ${data.status === 'shipped' && data.trackingNumber ? `
      <div class="tracking-box">
        <div class="tracking-title">Номер для отслеживания:</div>
        <div class="tracking-number">${escapeHtml(data.trackingNumber)}</div>
      </div>
      ` : ''}

      <div class="contact-info">
        <p><strong>Есть вопросы?</strong></p>
        <p>Свяжитесь с нами:</p>
        <p>📞 Телефон: <a href="tel:+79991234567">+7 (999) 123-45-67</a></p>
        <p>📧 Email: <a href="mailto:info@capsulehouses.ru">info@capsulehouses.ru</a></p>
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-logo">Capsule Houses</div>
      <div class="footer-text">
        Мы ценим ваше доверие и всегда готовы помочь!<br>
        С уважением, команда Capsule Houses
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Текстовая версия уведомления о статусе заказа
 */
export function formatOrderStatusEmail(data: OrderStatusEmailData): string {
  const statusMessages = {
    processing: 'Ваш заказ принят в обработку. Мы готовим его к отправке.',
    shipped: 'Ваш заказ отправлен! Скоро он будет у вас.',
    delivered: 'Ваш заказ успешно доставлен! Надеемся, вы остались довольны.',
    cancelled: 'К сожалению, ваш заказ был отменен.',
  }

  let message = `Здравствуйте, ${data.customerName}!\n\n`
  message += `${statusMessages[data.status]}\n\n`
  message += `Заказ #${data.orderNumber}\n`
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
  
  message += `Состав заказа:\n`
  data.items.forEach((item) => {
    message += `${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)} ₽\n`
  })
  
  message += `\nИтого: ${formatPrice(data.total)} ₽\n\n`

  if (data.status === 'cancelled' && data.cancellationReason) {
    message += `Причина отмены: ${data.cancellationReason}\n\n`
  }

  if (data.status === 'shipped' && data.trackingNumber) {
    message += `Номер отслеживания: ${data.trackingNumber}\n\n`
  }

  message += `Если у вас возникли вопросы, свяжитесь с нами:\n`
  message += `📞 Телефон: +7 (999) 123-45-67\n`
  message += `📧 Email: info@capsulehouses.ru\n\n`
  message += `С уважением,\nКоманда Capsule Houses`

  return message
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
