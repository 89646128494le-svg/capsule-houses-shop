# Настройка переменных окружения

Для работы сайта в продакшене необходимо настроить переменные окружения.

## Создание файла .env.local

Создайте файл `.env.local` в корне проекта со следующим содержимым:

```env
# Email Configuration
# Выберите один из вариантов ниже и настройте соответствующие ключи

# Вариант 1: Resend (рекомендуется для Next.js)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# Вариант 2: SendGrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# EMAIL_FROM=noreply@yourdomain.com

# Вариант 3: Nodemailer (собственный SMTP)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password
# EMAIL_FROM=noreply@yourdomain.com

# SMS Configuration
# Выберите один из вариантов ниже

# Вариант 1: SMS.ru (Россия)
SMS_RU_API_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Вариант 2: SMSC.ru (Россия)
# SMSC_LOGIN=your_login
# SMSC_PASSWORD=your_password

# Вариант 3: Twilio (международный)
# TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# TWILIO_AUTH_TOKEN=your_auth_token
# TWILIO_PHONE_NUMBER=+1234567890

# Admin Configuration
ADMIN_EMAIL=orders@capsulehouses.ru
ADMIN_PHONE=+79991234567

# Admin Panel Authentication
# ВАЖНО: В продакшене используйте сильные пароли!
NEXT_PUBLIC_ADMIN_EMAIL=admin@capsulehouses.ru
NEXT_PUBLIC_ADMIN_PASSWORD=your_strong_password_here

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Настройка Email

### Resend (рекомендуется)

1. Зарегистрируйтесь на [resend.com](https://resend.com)
2. Создайте API ключ
3. Добавьте домен и подтвердите его
4. Укажите `RESEND_API_KEY` и `EMAIL_FROM` в `.env.local`
5. Раскомментируйте код в `lib/email.ts` (Вариант 1)

### SendGrid

1. Зарегистрируйтесь на [sendgrid.com](https://sendgrid.com)
2. Создайте API ключ
3. Укажите `SENDGRID_API_KEY` и `EMAIL_FROM` в `.env.local`
4. Раскомментируйте код в `lib/email.ts` (Вариант 2)

## Настройка SMS

### SMS.ru (Россия)

1. Зарегистрируйтесь на [sms.ru](https://sms.ru)
2. Получите API ID
3. Укажите `SMS_RU_API_ID` в `.env.local`
4. Раскомментируйте код в `lib/sms.ts` (Вариант 1)

### SMSC.ru (Россия)

1. Зарегистрируйтесь на [smsc.ru](https://smsc.ru)
2. Укажите логин и пароль
3. Добавьте `SMSC_LOGIN` и `SMSC_PASSWORD` в `.env.local`
4. Раскомментируйте код в `lib/sms.ts` (Вариант 2)

## Настройка на Vercel

1. Зайдите в настройки проекта на Vercel
2. Перейдите в раздел "Environment Variables"
3. Добавьте все необходимые переменные
4. Перезапустите деплой

## Важно

- Файл `.env.local` не должен попадать в Git (уже добавлен в `.gitignore`)
- Для продакшена используйте переменные окружения на платформе деплоя (Vercel, Netlify и т.д.)
- Не храните секретные ключи в коде
