'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Send, CheckCircle, XCircle, Loader, FileText, User, Phone, ShoppingCart, Package, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'
import { useProductsStore } from '@/store/productsStore'

type EmailType = 'order' | 'order-status' | 'custom'

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

export default function TestEmailPage() {
  const addToast = useToastStore((state) => state.addToast)
  const products = useProductsStore((state) => state.products)
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [emailType, setEmailType] = useState<EmailType>('order')
  const [results, setResults] = useState<{
    admin: { success: boolean; message: string } | null
    customer: { success: boolean; message: string } | null
  }>({ admin: null, customer: null })

  const [formData, setFormData] = useState({
    // Общие поля
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@capsulehouses.ru',
    customerEmail: 'test@example.com',
    customerName: 'Тестовый Покупатель',
    customerPhone: '+7 (999) 123-45-67',
    
    // Поля для заказа
    orderNumber: `ORD-${Date.now()}`,
    items: [{ name: 'Capsule Standard', quantity: 1, price: 1500000 }] as OrderItem[],
    total: 1500000,
    deliveryAddress: '',
    notes: '',
    
    // Поля для статуса заказа
    orderStatus: 'processing' as OrderStatus,
    cancellationReason: '',
    trackingNumber: '',
    
    // Поля для произвольного письма
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Введите корректный email администратора'
    }

    if (!formData.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Введите корректный email покупателя'
    }

    if (!formData.customerName || formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Имя должно содержать минимум 2 символа'
    }

    if (!formData.customerPhone || formData.customerPhone.trim().length < 10) {
      newErrors.customerPhone = 'Введите корректный номер телефона'
    }

    if (emailType === 'order' || emailType === 'order-status') {
      if (!formData.orderNumber || formData.orderNumber.trim().length < 3) {
        newErrors.orderNumber = 'Введите номер заказа'
      }
      if (formData.items.length === 0) {
        newErrors.items = 'Добавьте хотя бы один товар'
      }
      if (formData.total <= 0) {
        newErrors.total = 'Сумма заказа должна быть больше 0'
      }
    }

    if (emailType === 'order-status' && formData.orderStatus === 'cancelled' && !formData.cancellationReason) {
      newErrors.cancellationReason = 'Укажите причину отмены заказа'
    }

    if (emailType === 'custom') {
      if (!formData.subject || formData.subject.trim().length < 3) {
        newErrors.subject = 'Введите тему письма'
      }
      if (!formData.message || formData.message.trim().length < 10) {
        newErrors.message = 'Введите текст письма (минимум 10 символов)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addItem = () => {
    if (products.length > 0) {
      const firstProduct = products[0]
      setFormData({
        ...formData,
        items: [...formData.items, { name: firstProduct.name, quantity: 1, price: firstProduct.price }],
      })
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { name: 'Новый товар', quantity: 1, price: 0 }],
      })
    }
    setErrors({ ...errors, items: '' })
  }

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setFormData({
      ...formData,
      items: newItems,
      total: newTotal,
    })
  }

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setFormData({
      ...formData,
      items: newItems,
      total: newTotal,
    })
  }

  const sendEmail = async (type: 'admin' | 'customer') => {
    if (!validateForm()) {
      addToast('Пожалуйста, исправьте ошибки в форме', 'error')
      return
    }

    setLoading(true)
    setResults({ ...results, [type]: null })

    try {
      let payload: any = {
        type: emailType === 'order' ? type : emailType === 'order-status' ? 'order-status' : 'custom',
        email: type === 'admin' ? formData.adminEmail : formData.customerEmail,
      }

      if (emailType === 'order') {
        payload.order = {
          orderNumber: formData.orderNumber,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          total: formData.total,
          items: formData.items,
          deliveryAddress: formData.deliveryAddress || undefined,
          notes: formData.notes || undefined,
        }
      } else if (emailType === 'order-status') {
        payload.orderStatus = {
          orderNumber: formData.orderNumber,
          customerName: formData.customerName,
          status: formData.orderStatus,
          items: formData.items,
          total: formData.total,
          cancellationReason: formData.orderStatus === 'cancelled' ? formData.cancellationReason : undefined,
          trackingNumber: formData.trackingNumber || undefined,
        }
      } else {
        payload.custom = {
          subject: formData.subject,
          message: formData.message,
          customerName: formData.customerName,
        }
      }

      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        setResults({
          ...results,
          [type]: { success: true, message: data.message || 'Письмо отправлено успешно' },
        })
        addToast(`Письмо ${type === 'admin' ? 'администратору' : 'покупателю'} отправлено`, 'success')
      } else {
        setResults({
          ...results,
          [type]: { success: false, message: data.error || 'Ошибка отправки' },
        })
        addToast(`Ошибка отправки письма ${type === 'admin' ? 'администратору' : 'покупателю'}`, 'error')
      }
    } catch (error) {
      setResults({
        ...results,
        [type]: { success: false, message: 'Ошибка соединения' },
      })
      addToast('Ошибка соединения', 'error')
    } finally {
      setLoading(false)
    }
  }

  const sendBothEmails = async () => {
    if (!validateForm()) {
      addToast('Пожалуйста, исправьте ошибки в форме', 'error')
      return
    }

    setLoading(true)
    setResults({ admin: null, customer: null })

    await Promise.all([sendEmail('admin'), sendEmail('customer')])
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Отправить письмо</h1>
        <p className="text-gray-400">Отправка писем покупателю или администратору</p>
      </div>

      {/* Выбор типа письма */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Тип письма</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'order', label: 'Заказ', icon: ShoppingCart },
            { value: 'order-status', label: 'Статус заказа', icon: Package },
            { value: 'custom', label: 'Произвольное письмо', icon: FileText },
          ].map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.value}
                onClick={() => {
                  setEmailType(type.value as EmailType)
                  setErrors({})
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  emailType === type.value
                    ? 'border-neon-cyan bg-neon-cyan/10'
                    : 'border-neon-cyan/20 hover:border-neon-cyan/50'
                }`}
              >
                <Icon size={24} className={`mb-2 ${emailType === type.value ? 'text-neon-cyan' : 'text-gray-400'}`} />
                <div className={`font-semibold ${emailType === type.value ? 'text-white' : 'text-gray-400'}`}>
                  {type.label}
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Основная форма */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Настройки письма</h2>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-gray-400 hover:text-neon-cyan transition-colors"
          >
            {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
            {showPreview ? 'Скрыть' : 'Показать'} предпросмотр
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email администратора */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email администратора <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.adminEmail}
              onChange={(e) => {
                setFormData({ ...formData, adminEmail: e.target.value })
                setErrors({ ...errors, adminEmail: '' })
              }}
              className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none transition-colors ${
                errors.adminEmail ? 'border-red-400' : 'border-neon-cyan/30 focus:border-neon-cyan'
              }`}
              placeholder="admin@capsulehouses.ru"
            />
            {errors.adminEmail && <p className="text-red-400 text-sm mt-1">{errors.adminEmail}</p>}
          </div>

          {/* Email покупателя */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Mail size={16} />
              Email покупателя <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => {
                setFormData({ ...formData, customerEmail: e.target.value })
                setErrors({ ...errors, customerEmail: '' })
              }}
              className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none transition-colors ${
                errors.customerEmail ? 'border-red-400' : 'border-neon-cyan/30 focus:border-neon-cyan'
              }`}
              placeholder="customer@example.com"
            />
            {errors.customerEmail && <p className="text-red-400 text-sm mt-1">{errors.customerEmail}</p>}
          </div>

          {/* Имя покупателя */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <User size={16} />
              Имя покупателя <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => {
                setFormData({ ...formData, customerName: e.target.value })
                setErrors({ ...errors, customerName: '' })
              }}
              className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none transition-colors ${
                errors.customerName ? 'border-red-400' : 'border-neon-cyan/30 focus:border-neon-cyan'
              }`}
              placeholder="Иван Иванов"
            />
            {errors.customerName && <p className="text-red-400 text-sm mt-1">{errors.customerName}</p>}
          </div>

          {/* Телефон покупателя */}
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Phone size={16} />
              Телефон покупателя <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => {
                setFormData({ ...formData, customerPhone: e.target.value })
                setErrors({ ...errors, customerPhone: '' })
              }}
              className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none transition-colors ${
                errors.customerPhone ? 'border-red-400' : 'border-neon-cyan/30 focus:border-neon-cyan'
              }`}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.customerPhone && <p className="text-red-400 text-sm mt-1">{errors.customerPhone}</p>}
          </div>

          {/* Поля для заказа */}
          {(emailType === 'order' || emailType === 'order-status') && (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Номер заказа <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, orderNumber: e.target.value })
                    setErrors({ ...errors, orderNumber: '' })
                  }}
                  className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none transition-colors ${
                    errors.orderNumber ? 'border-red-400' : 'border-neon-cyan/30 focus:border-neon-cyan'
                  }`}
                  placeholder="ORD-123456"
                />
                {errors.orderNumber && <p className="text-red-400 text-sm mt-1">{errors.orderNumber}</p>}
              </div>

              {/* Статус заказа */}
              {emailType === 'order-status' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Статус заказа <span className="text-red-400">*</span></label>
                  <select
                    value={formData.orderStatus}
                    onChange={(e) => {
                      setFormData({ ...formData, orderStatus: e.target.value as OrderStatus })
                      setErrors({ ...errors, orderStatus: '' })
                    }}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  >
                    <option value="processing">В обработке</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </div>
              )}

              {/* Причина отмены */}
              {emailType === 'order-status' && formData.orderStatus === 'cancelled' && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Причина отмены <span className="text-red-400">*</span></label>
                  <textarea
                    value={formData.cancellationReason}
                    onChange={(e) => {
                      setFormData({ ...formData, cancellationReason: e.target.value })
                      setErrors({ ...errors, cancellationReason: '' })
                    }}
                    rows={3}
                    className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none transition-colors resize-none ${
                      errors.cancellationReason ? 'border-red-400' : 'border-neon-cyan/30 focus:border-neon-cyan'
                    }`}
                    placeholder="Укажите причину отмены заказа"
                  />
                  {errors.cancellationReason && <p className="text-red-400 text-sm mt-1">{errors.cancellationReason}</p>}
                </div>
              )}

              {/* Номер отслеживания */}
              {emailType === 'order-status' && formData.orderStatus === 'shipped' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Номер отслеживания</label>
                  <input
                    type="text"
                    value={formData.trackingNumber}
                    onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="TRACK-123456"
                  />
                </div>
              )}

              {/* Товары */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm text-gray-400">Товары в заказе <span className="text-red-400">*</span></label>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 px-3 py-1.5 bg-neon-cyan/20 border border-neon-cyan/30 rounded-lg text-neon-cyan hover:bg-neon-cyan/30 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Добавить товар
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start p-4 bg-black/30 border border-neon-cyan/20 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="Название товара"
                        />
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = parseInt(e.target.value) || 1
                            updateItem(index, 'quantity', qty)
                          }}
                          min="1"
                          className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="Количество"
                        />
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => {
                            const price = parseInt(e.target.value) || 0
                            updateItem(index, 'price', price)
                          }}
                          min="0"
                          className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                          placeholder="Цена"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-white font-semibold min-w-[100px] text-right">
                          {new Intl.NumberFormat('ru-RU').format(item.price * item.quantity)} ₽
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          aria-label="Удалить товар"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.items && <p className="text-red-400 text-sm mt-1">{errors.items}</p>}
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <div className="text-gray-400 text-sm mb-1">Итого:</div>
                    <div className="text-2xl font-bold text-neon-cyan">
                      {new Intl.NumberFormat('ru-RU').format(formData.total)} ₽
                    </div>
                  </div>
                </div>
              </div>

              {/* Адрес доставки */}
              {emailType === 'order' && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Адрес доставки</label>
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="г. Москва, ул. Примерная, д. 1"
                  />
                </div>
              )}

              {/* Комментарий */}
              {emailType === 'order' && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Комментарий к заказу</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                    placeholder="Дополнительная информация о заказе"
                  />
                </div>
              )}
            </>
          )}

          {/* Поля для произвольного письма */}
          {emailType === 'custom' && (
            <>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Тема письма <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value })
                    setErrors({ ...errors, subject: '' })
                  }}
                  className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none transition-colors ${
                    errors.subject ? 'border-red-400' : 'border-neon-cyan/30 focus:border-neon-cyan'
                  }`}
                  placeholder="Тема письма"
                />
                {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Текст письма <span className="text-red-400">*</span></label>
                <textarea
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value })
                    setErrors({ ...errors, message: '' })
                  }}
                  rows={8}
                  className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none transition-colors resize-none ${
                    errors.message ? 'border-red-400' : 'border-neon-cyan/30 focus:border-neon-cyan'
                  }`}
                  placeholder="Введите текст письма..."
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Кнопки отправки */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Отправка писем</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => sendEmail('admin')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Mail size={20} />}
            Отправить администратору
          </button>
          <button
            onClick={() => sendEmail('customer')}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Mail size={20} />}
            Отправить покупателю
          </button>
          <button
            onClick={sendBothEmails}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
            Отправить оба письма
          </button>
        </div>
      </motion.div>

      {/* Результаты */}
      <AnimatePresence>
        {(results.admin || results.customer) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Результаты отправки</h2>
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
                        Письмо администратору ({formData.adminEmail})
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
                        Письмо покупателю ({formData.customerEmail})
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
      </AnimatePresence>
    </div>
  )
}
