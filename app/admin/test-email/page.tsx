'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle, XCircle, Loader } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'

export default function TestEmailPage() {
  const addToast = useToastStore((state) => state.addToast)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    admin: { success: boolean; message: string } | null
    customer: { success: boolean; message: string } | null
  }>({ admin: null, customer: null })

  const [testData, setTestData] = useState({
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@capsulehouses.ru',
    customerEmail: 'test@example.com',
    orderNumber: `TEST-${Date.now()}`,
    customerName: 'Тестовый Покупатель',
    customerPhone: '+7 (999) 123-45-67',
    total: 1500000,
  })

  const testAdminEmail = async () => {
    setLoading(true)
    setResults({ ...results, admin: null })
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin',
          email: testData.adminEmail,
          order: {
            orderNumber: testData.orderNumber,
            customerName: testData.customerName,
            customerEmail: testData.customerEmail,
            customerPhone: testData.customerPhone,
            total: testData.total,
            items: [
              { name: 'Capsule Standard', quantity: 1, price: 1500000 },
            ],
          },
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResults({
          ...results,
          admin: { success: true, message: data.message || 'Письмо отправлено успешно' },
        })
        addToast('Письмо администратору отправлено', 'success')
      } else {
        setResults({
          ...results,
          admin: { success: false, message: data.error || 'Ошибка отправки' },
        })
        addToast('Ошибка отправки письма администратору', 'error')
      }
    } catch (error) {
      setResults({
        ...results,
        admin: { success: false, message: 'Ошибка соединения' },
      })
      addToast('Ошибка соединения', 'error')
    } finally {
      setLoading(false)
    }
  }

  const testCustomerEmail = async () => {
    setLoading(true)
    setResults({ ...results, customer: null })
    
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'customer',
          email: testData.customerEmail,
          order: {
            orderNumber: testData.orderNumber,
            customerName: testData.customerName,
            customerEmail: testData.customerEmail,
            customerPhone: testData.customerPhone,
            total: testData.total,
            items: [
              { name: 'Capsule Standard', quantity: 1, price: 1500000 },
            ],
          },
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setResults({
          ...results,
          customer: { success: true, message: data.message || 'Письмо отправлено успешно' },
        })
        addToast('Письмо покупателю отправлено', 'success')
      } else {
        setResults({
          ...results,
          customer: { success: false, message: data.error || 'Ошибка отправки' },
        })
        addToast('Ошибка отправки письма покупателю', 'error')
      }
    } catch (error) {
      setResults({
        ...results,
        customer: { success: false, message: 'Ошибка соединения' },
      })
      addToast('Ошибка соединения', 'error')
    } finally {
      setLoading(false)
    }
  }

  const testBothEmails = async () => {
    setLoading(true)
    setResults({ admin: null, customer: null })
    
    await Promise.all([testAdminEmail(), testCustomerEmail()])
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Тестирование Email</h1>
        <p className="text-gray-400">Проверка отправки писем покупателю и администратору</p>
      </div>

      {/* Настройки теста */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Настройки теста</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email администратора</label>
            <input
              type="email"
              value={testData.adminEmail}
              onChange={(e) => setTestData({ ...testData, adminEmail: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
              placeholder="admin@capsulehouses.ru"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email покупателя</label>
            <input
              type="email"
              value={testData.customerEmail}
              onChange={(e) => setTestData({ ...testData, customerEmail: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
              placeholder="customer@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Номер заказа</label>
            <input
              type="text"
              value={testData.orderNumber}
              onChange={(e) => setTestData({ ...testData, orderNumber: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Имя покупателя</label>
            <input
              type="text"
              value={testData.customerName}
              onChange={(e) => setTestData({ ...testData, customerName: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
        </div>
      </motion.div>

      {/* Кнопки тестирования */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Отправка тестовых писем</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={testAdminEmail}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Mail size={20} />}
            Отправить администратору
          </button>
          <button
            onClick={testCustomerEmail}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Mail size={20} />}
            Отправить покупателю
          </button>
          <button
            onClick={testBothEmails}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
            Отправить оба письма
          </button>
        </div>
      </motion.div>

      {/* Результаты */}
      {(results.admin || results.customer) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Результаты тестирования</h2>
          <div className="space-y-4">
            {results.admin && (
              <div className={`p-4 rounded-lg border ${
                results.admin.success
                  ? 'bg-green-400/10 border-green-400/30'
                  : 'bg-red-400/10 border-red-400/30'
              }`}>
                <div className="flex items-center gap-3">
                  {results.admin.success ? (
                    <CheckCircle size={24} className="text-green-400" />
                  ) : (
                    <XCircle size={24} className="text-red-400" />
                  )}
                  <div>
                    <div className="text-white font-semibold">
                      Письмо администратору ({testData.adminEmail})
                    </div>
                    <div className={`text-sm ${results.admin.success ? 'text-green-400' : 'text-red-400'}`}>
                      {results.admin.message}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {results.customer && (
              <div className={`p-4 rounded-lg border ${
                results.customer.success
                  ? 'bg-green-400/10 border-green-400/30'
                  : 'bg-red-400/10 border-red-400/30'
              }`}>
                <div className="flex items-center gap-3">
                  {results.customer.success ? (
                    <CheckCircle size={24} className="text-green-400" />
                  ) : (
                    <XCircle size={24} className="text-red-400" />
                  )}
                  <div>
                    <div className="text-white font-semibold">
                      Письмо покупателю ({testData.customerEmail})
                    </div>
                    <div className={`text-sm ${results.customer.success ? 'text-green-400' : 'text-red-400'}`}>
                      {results.customer.message}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Инструкция */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Как проверить отправку писем</h2>
        <div className="space-y-4 text-gray-300">
          <div className="p-4 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold text-xl">⚠️</span>
              <div>
                <strong className="text-yellow-400">Текущий статус:</strong> Email отправка симулируется (только логи в консоли)
                <br />
                <span className="text-sm text-gray-400 mt-1 block">
                  Письма не отправляются на реальные адреса до настройки email сервиса
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-neon-cyan font-bold">1.</span>
              <div>
                <strong>Проверьте консоль браузера</strong> (F12 → Console)
                <br />
                <span className="text-sm text-gray-400">Там будут логи с информацией о попытке отправки</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-neon-cyan font-bold">2.</span>
              <div>
                <strong>Проверьте консоль сервера</strong> (терминал где запущен Next.js)
                <br />
                <span className="text-sm text-gray-400">Там будут детальные логи с содержимым писем</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-neon-cyan font-bold">3.</span>
              <div>
                <strong>Настройте реальную отправку через Resend (рекомендуется):</strong>
                <ol className="list-decimal list-inside mt-2 space-y-2 ml-4">
                  <li>
                    Зарегистрируйтесь на <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-neon-cyan hover:underline">resend.com</a> (бесплатно до 3000 писем/месяц)
                  </li>
                  <li>
                    Получите API ключ в разделе API Keys
                  </li>
                  <li>
                    Добавьте в <code className="bg-black/50 px-2 py-1 rounded text-sm">.env.local</code>:
                    <pre className="bg-black/50 p-3 rounded mt-2 text-sm overflow-x-auto">
{`RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=your-admin@email.com
EMAIL_FROM=noreply@yourdomain.com`}
                    </pre>
                  </li>
                  <li>
                    Откройте <code className="bg-black/50 px-2 py-1 rounded text-sm">lib/email.ts</code> и раскомментируйте код для Resend (строки 53-67)
                  </li>
                  <li>
                    Перезапустите сервер: <code className="bg-black/50 px-2 py-1 rounded text-sm">npm run dev</code>
                  </li>
                  <li>
                    Повторите тест - письма будут приходить на реальные адреса!
                  </li>
                </ol>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-neon-cyan font-bold">4.</span>
              <div>
                <strong>Проверьте почтовые ящики:</strong>
                <br />
                <span className="text-sm text-gray-400">
                  После настройки реальной отправки письма будут приходить на указанные адреса.
                  Проверьте папку "Спам", если письма не приходят во "Входящие".
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
            <h3 className="text-lg font-semibold text-white mb-2">📋 Что логируется сейчас:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 ml-4">
              <li>Адрес получателя (to)</li>
              <li>Тема письма (subject)</li>
              <li>Адрес отправителя (from)</li>
              <li>Первые 200 символов содержимого</li>
              <li>Статус отправки (успех/ошибка)</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
