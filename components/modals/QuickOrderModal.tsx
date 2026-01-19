'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useToastStore } from '@/store/toastStore'
import { useOrdersStore } from '@/store/ordersStore'
import { useCartStore } from '@/store/cartStore'

interface QuickOrderModalProps {
  isOpen: boolean
  onClose: () => void
  productName?: string
}

export default function QuickOrderModal({ isOpen, onClose, productName }: QuickOrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addToast = useToastStore((state) => state.addToast)
  const addOrder = useOrdersStore((state) => state.addOrder)
  const cartItems = useCartStore((state) => state.items)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Создаем заказ в админке
    const orderItems = cartItems.length > 0 
      ? cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))
      : productName 
        ? [{ id: 1, name: productName, quantity: 1, price: 0 }]
        : []
    
    if (orderItems.length > 0) {
      const order = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email || undefined,
        items: orderItems,
        total: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'new' as const,
        deliveryAddress: undefined,
        notes: undefined,
      }
      
      const orderNumber = `ORD-${Date.now()}`
      const fullOrder = {
        orderNumber,
        ...order,
      }
      
      addOrder(fullOrder)
      
      // Отправка через API route (безопасно, API ключи на сервере)
      try {
        const response = await fetch('/api/send-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: fullOrder,
            customerEmail: formData.email,
            customerPhone: formData.phone,
          }),
        })

        if (!response.ok) {
          throw new Error('Ошибка отправки заказа')
        }

        addToast('Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.', 'success')
        setFormData({ name: '', phone: '', email: '' })
        setIsSubmitting(false)
        onClose()
      } catch (error) {
        console.error('Ошибка отправки заказа:', error)
        addToast('Заказ создан, но произошла ошибка при отправке уведомления. Мы свяжемся с вами.', 'warning')
        setFormData({ name: '', phone: '', email: '' })
        setIsSubmitting(false)
        onClose()
      }
    } else {
      addToast('Добавьте товары в корзину для оформления заказа', 'error')
      setIsSubmitting(false)
    }
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            style={{ pointerEvents: 'auto' }}
          >
            <div className="glassmorphism rounded-2xl p-8 max-w-md w-full border border-neon-cyan/30 relative mx-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                disabled={isSubmitting}
                aria-label="Закрыть"
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-neon-cyan transition-colors disabled:opacity-50"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold text-gradient mb-2">Быстрый заказ</h2>
              {productName && (
                <p className="text-gray-400 text-sm mb-6">{productName}</p>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Имя</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="Ваше имя"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Телефон</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email (необязательно)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label={isSubmitting ? 'Оформление заказа...' : 'Оформить заказ'}
                  className="w-full px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
