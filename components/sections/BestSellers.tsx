'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ShoppingCart, Eye, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import QuickViewModal from '@/components/modals/QuickViewModal'
import QuickOrderModal from '@/components/modals/QuickOrderModal'

interface Product {
  id: number
  name: string
  price: number
  images: string[]
  dimensions: string
  guests: number
  description: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Capsule Mini',
    price: 890000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '3×2×2.5 м',
    guests: 2,
    description: 'Компактное решение для двоих',
  },
  {
    id: 2,
    name: 'Capsule Standard',
    price: 1290000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '4×3×2.8 м',
    guests: 4,
    description: 'Идеальный вариант для семьи',
  },
  {
    id: 3,
    name: 'Capsule Premium',
    price: 1890000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '5×4×3 м',
    guests: 6,
    description: 'Просторное жильё с премиум-комплектацией',
  },
  {
    id: 4,
    name: 'Capsule Luxe',
    price: 2490000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '6×5×3.5 м',
    guests: 8,
    description: 'Максимальный комфорт и роскошь',
  },
  {
    id: 5,
    name: 'Capsule Studio',
    price: 1590000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '5×3×3 м',
    guests: 4,
    description: 'Студийное пространство для творчества',
  },
  {
    id: 6,
    name: 'Capsule Office',
    price: 1690000,
    images: ['/placeholder-1.jpg', '/placeholder-2.jpg'],
    dimensions: '4×4×3 м',
    guests: 2,
    description: 'Рабочее пространство нового уровня',
  },
]

export default function BestSellers() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null)
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      dimensions: product.dimensions,
      guests: product.guests,
    })
    addToast(`${product.name} добавлен в корзину`, 'success')
  }

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product)
  }

  const handleQuickAdd = (product: Product) => {
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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Хиты продаж</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Самые популярные модели капсульных домов
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => {
            const [currentImageIndex, setCurrentImageIndex] = useState(0)
            const isHovered = hoveredProduct === product.id

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => {
                  setHoveredProduct(product.id)
                  setCurrentImageIndex(1)
                }}
                onMouseLeave={() => {
                  setHoveredProduct(null)
                  setCurrentImageIndex(0)
                }}
                className="group relative"
              >
                <div className="glassmorphism-light rounded-2xl overflow-hidden border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-deep-dark to-black">
                    {/* Placeholder Image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-24 h-24 mx-auto border-2 border-dashed border-neon-cyan/30 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">🏠</span>
                        </div>
                        <p className="text-xs text-gray-600">Изображение {currentImageIndex + 1}</p>
                      </div>
                    </div>

                    {/* Image Transition Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-deep-dark via-transparent to-transparent"
                      animate={{
                        opacity: isHovered ? 0.7 : 0.5,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-neon-cyan text-deep-dark text-xs font-semibold rounded-full">
                      Хит продаж
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleQuickView(product)}
                        className="p-2 bg-black/70 rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-colors"
                        aria-label="Быстрый просмотр"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleQuickAdd(product)}
                        className="p-2 bg-black/70 rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-colors"
                        aria-label="Добавить в корзину"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 flex-1">
                      {product.description}
                    </p>

                    {/* Specifications */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <span>{product.dimensions}</span>
                      <span>•</span>
                      <span>{product.guests} гостей</span>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-neon-cyan/20">
                      <div className="text-2xl font-bold text-neon-cyan">
                        {formatPrice(product.price)}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all text-sm font-medium"
                        >
                          Подробнее
                        </Link>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2 bg-gradient-hero text-deep-dark rounded-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all text-sm font-medium"
                        >
                          В корзину
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/catalog"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all group"
          >
            <span>Смотреть весь каталог</span>
            <ArrowRight 
              size={18} 
              className="group-hover:translate-x-1 transition-transform" 
            />
          </Link>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        product={quickViewProduct}
      />

      {/* Quick Order Modal */}
      <QuickOrderModal
        isOpen={!!quickOrderProduct}
        onClose={() => setQuickOrderProduct(null)}
        productName={quickOrderProduct?.name}
      />
    </section>
  )
}
