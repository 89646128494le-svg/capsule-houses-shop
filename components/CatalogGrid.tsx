'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  price: number
  dimensions: string
  guests: number
  description: string
}

// Заглушка: 4 карточки товаров для примера
const products: Product[] = [
  {
    id: 1,
    name: 'Capsule Mini',
    price: 890000,
    dimensions: '3×2×2.5 м',
    guests: 2,
    description: 'Компактное решение для двоих. Идеально подходит для дачи или гостевого домика.',
  },
  {
    id: 2,
    name: 'Capsule Standard',
    price: 1290000,
    dimensions: '4×3×2.8 м',
    guests: 4,
    description: 'Идеальный вариант для семьи. Просторный и функциональный дом.',
  },
  {
    id: 3,
    name: 'Capsule Premium',
    price: 1890000,
    dimensions: '5×4×3 м',
    guests: 6,
    description: 'Просторное жильё с премиум-комплектацией. Максимальный комфорт.',
  },
  {
    id: 4,
    name: 'Capsule Luxe',
    price: 2490000,
    dimensions: '6×5×3.5 м',
    guests: 8,
    description: 'Максимальный комфорт и роскошь. Для тех, кто ценит качество.',
  },
]

export default function CatalogGrid() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gradient">Каталог</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Выберите идеальный капсульный дом для ваших потребностей
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <Link href={`/product/${product.id}`}>
                <div className="glassmorphism-light rounded-2xl overflow-hidden border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300 h-full flex flex-col">
                  {/* Image Placeholder */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-deep-dark to-black">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="w-24 h-24 mx-auto border-2 border-dashed border-neon-cyan/30 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">🏠</span>
                        </div>
                        <p className="text-xs text-gray-600">Фото товара</p>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-deep-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
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

                    {/* Price */}
                    <div className="pt-4 border-t border-neon-cyan/20">
                      <div className="text-2xl font-bold text-neon-cyan mb-4">
                        {formatPrice(product.price)}
                      </div>
                      <div className="px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all text-center text-sm font-medium">
                        Подробнее
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Note about more products */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 text-gray-400 text-sm"
        >
          <p>Показано 4 из 30 товаров. Полный каталог будет доступен после интеграции с CMS.</p>
        </motion.div>
      </div>
    </section>
  )
}
