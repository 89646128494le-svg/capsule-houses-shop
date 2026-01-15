'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import { Product } from '@/store/productsStore'
import QuickOrderModal from './QuickOrderModal'

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)

  if (!product) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      dimensions: product.dimensions,
      guests: product.guests,
    })
    addToast(`${product.name} добавлен в корзину`, 'success')
    onClose()
  }

  const handleQuickOrder = () => {
    setIsQuickOrderOpen(true)
  }

  return (
    <>
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glassmorphism rounded-2xl max-w-4xl w-full border border-neon-cyan/30 relative my-8">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-black/70 rounded-lg text-gray-400 hover:text-neon-cyan transition-colors z-10"
                >
                  <X size={24} />
                </button>

                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Image Gallery */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-deep-dark to-black border border-neon-cyan/30">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <div className="w-32 h-32 mx-auto border-2 border-dashed border-neon-cyan/30 rounded-lg flex items-center justify-center">
                            <span className="text-6xl">🏠</span>
                          </div>
                          <p className="text-sm text-gray-600">Изображение {currentImageIndex + 1}</p>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === index
                              ? 'border-neon-cyan'
                              : 'border-neon-cyan/20'
                          }`}
                        >
                          <div className="w-full h-full bg-gradient-to-br from-deep-dark to-black flex items-center justify-center">
                            <span className="text-2xl">🏠</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gradient mb-2">{product.name}</h2>
                      <p className="text-gray-400">{product.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-4xl font-bold text-neon-cyan">
                      {formatPrice(product.price)}
                    </div>

                    {/* Specifications */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-neon-cyan/20">
                        <span className="text-gray-400">Размеры</span>
                        <span className="text-white">{product.dimensions}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-neon-cyan/20">
                        <span className="text-gray-400">Количество гостей</span>
                        <span className="text-white">{product.guests}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={20} />
                        В корзину
                      </button>
                      <button
                        onClick={handleQuickOrder}
                        className="flex-1 px-6 py-3 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        Купить в 1 клик
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick Order Modal */}
      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
        productName={product.name}
      />
    </>
  )
}
