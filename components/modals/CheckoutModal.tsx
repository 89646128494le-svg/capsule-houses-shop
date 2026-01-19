'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useOrdersStore } from '@/store/ordersStore'
import { useToastStore } from '@/store/toastStore'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  const addOrder = useOrdersStore((state) => state.addOrder)
  const addToast = useToastStore((state) => state.addToast)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    notes: '',
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName.trim() || !formData.customerPhone.trim()) {
      addToast('Пожалуйста, заполните обязательные поля', 'error')
      return
    }

    setIsSubmitting(true)

    try {
      // Создание заказа
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }))

      const total = getTotalPrice()

      // Генерируем номер заказа
      const orderNumber = `ORD-${String(Date.now()).slice(-6)}`

      const order = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim() || undefined,
        items: orderItems,
        total,
        status: 'new' as const,
        deliveryAddress: formData.deliveryAddress.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        orderNumber,
      }

      // Добавляем заказ в store (появится в админке)
      addOrder(order)

      // Отправляем заказ на сервер для email уведомлений
      const response = await fetch('/api/send-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: {
            ...order,
            orderNumber,
          },
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
        }),
      })

      if (!response.ok) {
        throw new Error('Ошибка отправки заказа')
      }

      // Очищаем корзину
      clearCart()

      // Показываем успех
      addToast(`Заказ #${orderNumber} успешно оформлен!`, 'success')

      // Закрываем модальное окно
      setTimeout(() => {
        onClose()
        setFormData({
          customerName: '',
          customerPhone: '',
          customerEmail: '',
          deliveryAddress: '',
          notes: '',
        })
      }, 1500)
    } catch (error) {
      console.error('Ошибка оформления заказа:', error)
      addToast('Произошла ошибка при оформлении заказа. Попробуйте снова.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="glassmorphism rounded-2xl max-w-2xl w-full border border-neon-cyan/30 relative my-8 max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-2 bg-black/70 rounded-lg text-gray-400 hover:text-neon-cyan transition-colors z-10 disabled:opacity-50"
              >
                <X size={24} />
              </button>

              <div className="p-6 sm:p-8">
                <h2 className="text-3xl font-bold text-gradient mb-6">Оформление заказа</h2>

                {/* Order Summary */}
                <div className="glassmorphism-light rounded-xl p-4 mb-6 border border-neon-cyan/20">
                  <h3 className="text-lg font-semibold text-white mb-3">Ваш заказ:</h3>
                  <div className="space-y-2 mb-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-300">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-neon-cyan/20 pt-3 flex justify-between text-lg font-bold">
                    <span className="text-white">Итого:</span>
                    <span className="text-neon-cyan">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Имя <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors disabled:opacity-50"
                      placeholder="Введите ваше имя"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Телефон <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors disabled:opacity-50"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors disabled:opacity-50"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Адрес доставки</label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors disabled:opacity-50"
                      placeholder="Город, улица, дом, квартира"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Комментарий к заказу</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors resize-none disabled:opacity-50"
                      placeholder="Дополнительная информация о заказе..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Оформление...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Оформить заказ
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all disabled:opacity-50"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
