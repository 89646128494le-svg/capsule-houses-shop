'use client'

import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import Link from 'next/link'

export default function CartContent() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const addToast = useToastStore((state) => state.addToast)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleRemove = (id: number, name: string) => {
    removeItem(id)
    addToast(`${name} удалён из корзины`, 'info')
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-600 mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Корзина пуста</h1>
          <p className="text-gray-400 mb-8">Добавьте товары в корзину, чтобы продолжить покупки</p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300"
          >
            Перейти в каталог
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gradient mb-8">Корзина</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Image Placeholder */}
                <div className="w-full sm:w-32 h-32 rounded-lg bg-gradient-to-br from-deep-dark to-black border border-neon-cyan/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl">🏠</span>
                </div>

                {/* Item Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                  {item.dimensions && (
                    <p className="text-sm text-gray-400 mb-2">{item.dimensions}</p>
                  )}
                  {item.guests && (
                    <p className="text-sm text-gray-400 mb-4">{item.guests} гостей</p>
                  )}
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-lg border border-neon-cyan/30 hover:border-neon-cyan transition-colors"
                      >
                        <Minus size={16} className="text-neon-cyan" />
                      </button>
                      <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-lg border border-neon-cyan/30 hover:border-neon-cyan transition-colors"
                      >
                        <Plus size={16} className="text-neon-cyan" />
                      </button>
                    </div>
                    
                    <div className="text-xl font-bold text-neon-cyan">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(item.id, item.name)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors self-start sm:self-center"
                  aria-label="Удалить"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20 sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6">Итого</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Товаров:</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Сумма:</span>
                <span className="text-white">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="border-t border-neon-cyan/20 pt-4 flex justify-between text-xl font-bold">
                <span className="text-white">К оплате:</span>
                <span className="text-neon-cyan">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full px-6 py-4 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 text-center mb-4"
            >
              Оформить заказ
            </Link>
            
            <Link
              href="/catalog"
              className="block w-full px-6 py-4 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all text-center"
            >
              Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
