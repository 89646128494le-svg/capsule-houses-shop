'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react'
import { useProductsStore, Product } from '@/store/productsStore'
import { useToastStore } from '@/store/toastStore'

export default function ProductsPage() {
  const products = useProductsStore((state) => state.products)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const addToast = useToastStore((state) => state.addToast)

  const updateProduct = useProductsStore((state) => state.updateProduct)
  const addProduct = useProductsStore((state) => state.addProduct)
  const deleteProduct = useProductsStore((state) => state.deleteProduct)

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

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!editingProduct) return

    if (editingProduct.id > 30) {
      // Новый товар
      const { id, ...productData } = editingProduct
      addProduct(productData)
      addToast('Товар добавлен', 'success')
    } else {
      // Обновление существующего
      updateProduct(editingProduct.id, editingProduct)
      addToast('Товар обновлен', 'success')
    }
    
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(id)
      addToast('Товар удален', 'info')
    }
  }

  const handleAdd = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: 'Новый товар',
      price: 0,
      dimensions: '0×0×0 м',
      guests: 2,
      description: '',
      category: 'standard',
      images: [],
      inStock: true,
    }
    setEditingProduct(newProduct)
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
          className="flex items-center gap-2 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all"
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

      {/* Products Table */}
      <div className="glassmorphism-light rounded-xl border border-neon-cyan/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/30">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">ID</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Название</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Цена</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Размеры</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Гостей</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Категория</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product: Product) => (
                <tr
                  key={product.id}
                  className="border-t border-neon-cyan/10 hover:bg-black/20 transition-colors"
                >
                  <td className="py-4 px-6 text-gray-400">{product.id}</td>
                  <td className="py-4 px-6 text-white font-medium">{product.name}</td>
                  <td className="py-4 px-6 text-neon-cyan">{formatPrice(product.price)}</td>
                  <td className="py-4 px-6 text-gray-300">{product.dimensions}</td>
                  <td className="py-4 px-6 text-gray-300">{product.guests}</td>
                  <td className="py-4 px-6 text-gray-300">{product.category}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glassmorphism rounded-2xl p-8 max-w-2xl w-full border border-neon-cyan/30 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                setIsModalOpen(false)
                setEditingProduct(null)
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-neon-cyan transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gradient mb-6">
              {editingProduct.id > 30 ? 'Добавить товар' : 'Редактировать товар'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Название</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Цена (₽)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Гостей</label>
                  <input
                    type="number"
                    value={editingProduct.guests}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        guests: parseInt(e.target.value) || 2,
                      })
                    }
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Размеры (Д×Ш×В)</label>
                <input
                  type="text"
                  value={editingProduct.dimensions}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, dimensions: e.target.value })
                  }
                  placeholder="3×2×2.5 м"
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Категория</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                >
                  <option value="mini">Мини</option>
                  <option value="standard">Стандарт</option>
                  <option value="premium">Премиум</option>
                  <option value="luxe">Люкс</option>
                  <option value="studio">Студия</option>
                  <option value="office">Офис</option>
                  <option value="complex">Модульные комплексы</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Описание</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, inStock: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-neon-cyan/30 bg-black/50 text-neon-cyan focus:ring-neon-cyan"
                  />
                  <span className="text-sm text-gray-300">В наличии</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingProduct(null)
                  }}
                  className="px-6 py-3 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
