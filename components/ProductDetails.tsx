'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import QuickOrderModal from './modals/QuickOrderModal'

// Mock product data - в реальном приложении это будет из API
const mockProducts = {
  1: {
    id: 1,
    name: 'Capsule Mini',
    price: 890000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '3×2×2.5 м',
    guests: 2,
    description: 'Компактное решение для двоих',
    materials: 'Каркас из алюминия, утепление эковатой',
    weight: '850 кг',
  },
  2: {
    id: 2,
    name: 'Capsule Standard',
    price: 1290000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '4×3×2.8 м',
    guests: 4,
    description: 'Идеальный вариант для семьи',
    materials: 'Каркас из алюминия, утепление эковатой',
    weight: '1200 кг',
  },
  3: {
    id: 3,
    name: 'Capsule Premium',
    price: 1890000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '5×4×3 м',
    guests: 6,
    description: 'Просторное жильё с премиум-комплектацией',
    materials: 'Каркас из алюминия, утепление эковатой',
    weight: '1800 кг',
  },
  4: {
    id: 4,
    name: 'Capsule Luxe',
    price: 2490000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '6×5×3.5 м',
    guests: 8,
    description: 'Максимальный комфорт и роскошь',
    materials: 'Каркас из алюминия, утепление эковатой',
    weight: '2500 кг',
  },
  5: {
    id: 5,
    name: 'Capsule Studio',
    price: 1590000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '5×3×3 м',
    guests: 4,
    description: 'Студийное пространство для творчества',
    materials: 'Каркас из алюминия, утепление эковатой',
    weight: '1500 кг',
  },
  6: {
    id: 6,
    name: 'Capsule Office',
    price: 1690000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '4×4×3 м',
    guests: 2,
    description: 'Рабочее пространство нового уровня',
    materials: 'Каркас из алюминия, утепление эковатой',
    weight: '1400 кг',
  },
}

interface ProductDetailsProps {
  productId: number
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)

  const product = mockProducts[productId as keyof typeof mockProducts]

  if (!product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Товар не найден</h1>
        <p className="text-gray-400">Запрашиваемый товар не существует.</p>
      </div>
    )
  }

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
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-deep-dark to-black border border-neon-cyan/30"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-48 h-48 mx-auto border-2 border-dashed border-neon-cyan/30 rounded-lg flex items-center justify-center">
                  <span className="text-8xl">🏠</span>
                </div>
                <p className="text-sm text-gray-600">Изображение {currentImageIndex + 1}</p>
              </div>
            </div>
          </motion.div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? 'border-neon-cyan'
                    : 'border-neon-cyan/20 hover:border-neon-cyan/50'
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
            <h1 className="text-4xl font-bold text-gradient mb-4">{product.name}</h1>
            <p className="text-xl text-gray-400 mb-6">{product.description}</p>
            <div className="text-5xl font-bold text-neon-cyan mb-8">
              {formatPrice(product.price)}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20">
            <h2 className="text-xl font-semibold text-white mb-4">Характеристики</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-neon-cyan/20">
                <span className="text-gray-400">Размеры</span>
                <span className="text-white font-medium">{product.dimensions}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neon-cyan/20">
                <span className="text-gray-400">Количество гостей</span>
                <span className="text-white font-medium">{product.guests}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-neon-cyan/20">
                <span className="text-gray-400">Материалы</span>
                <span className="text-white font-medium">{product.materials}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400">Вес</span>
                <span className="text-white font-medium">{product.weight}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-4 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              В корзину
            </button>
            <button
              onClick={() => setIsQuickOrderOpen(true)}
              className="flex-1 px-6 py-4 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all font-semibold flex items-center justify-center gap-2"
            >
              Купить в 1 клик
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>В наличии</span>
          </div>
        </div>
      </div>

      {/* Quick Order Modal */}
      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
        productName={product.name}
      />
    </div>
  )
}
