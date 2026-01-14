'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'

interface Product {
  id: number
  name: string
  price: number
  dimensions: string
  guests: number
  description: string
  status: 'active' | 'inactive'
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Capsule Mini',
    price: 890000,
    dimensions: '3×2×2.5 м',
    guests: 2,
    description: 'Компактное решение для двоих',
    status: 'active',
  },
  {
    id: 2,
    name: 'Capsule Standard',
    price: 1290000,
    dimensions: '4×3×2.8 м',
    guests: 4,
    description: 'Идеальный вариант для семьи',
    status: 'active',
  },
  {
    id: 3,
    name: 'Capsule Premium',
    price: 1890000,
    dimensions: '5×4×3 м',
    guests: 6,
    description: 'Просторное жильё с премиум-комплектацией',
    status: 'active',
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const addToast = useToastStore((state) => state.addToast)

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      setProducts(products.filter((p) => p.id !== id))
      addToast('Товар удален', 'info')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Товары</h1>
          <p className="text-gray-400">Управление каталогом товаров</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all"
        >
          <Plus size={20} />
          Добавить товар
        </button>
      </div>

      {/* Search */}
      <div className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск товаров..."
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all"
          >
            <div className="aspect-video rounded-lg bg-gradient-to-br from-deep-dark to-black border border-neon-cyan/30 flex items-center justify-center mb-4">
              <span className="text-4xl">🏠</span>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{product.description}</p>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Размеры:</span>
                <span className="text-white">{product.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Гостей:</span>
                <span className="text-white">{product.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Цена:</span>
                <span className="text-neon-cyan font-semibold">{formatPrice(product.price)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-neon-cyan/20">
              <button
                onClick={() => handleEdit(product)}
                className="flex-1 px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all text-sm"
              >
                <Edit size={16} className="inline mr-2" />
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Товары не найдены
        </div>
      )}
    </div>
  )
}
