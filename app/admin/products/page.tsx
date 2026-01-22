'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Save, X, Upload, Image as ImageIcon } from 'lucide-react'
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
      category: 'two-story',
      images: [],
      video: undefined,
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
          aria-label="Добавить новый товар"
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
                        aria-label={`Редактировать ${product.name}`}
                        className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        aria-label={`Удалить ${product.name}`}
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
              aria-label="Закрыть"
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
                  <option value="two-story">Двухэтажные капсульные дома</option>
                  <option value="sliding">Раздвижные капсульные дома</option>
                  <option value="vertical">Вертикальные</option>
                  <option value="mini">Мини капсульные дома</option>
                  <option value="designer">Дизайнерские капсульные дома</option>
                  <option value="new-section-1">Новый раздел</option>
                  <option value="new-section-2">Новый раздел</option>
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

              <div>
                <label className="block text-sm text-gray-400 mb-2">Видео (YouTube, Vimeo или прямой URL)</label>
                <input
                  type="text"
                  value={editingProduct.video || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, video: e.target.value })
                  }
                  placeholder="https://youtube.com/watch?v=... или https://vimeo.com/... или прямой URL"
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors mb-4"
                />
                {editingProduct.video && (
                  <div className="mb-4 p-2 bg-black/30 rounded-lg border border-neon-cyan/20">
                    <p className="text-xs text-gray-400 mb-2">Предпросмотр:</p>
                    {editingProduct.video.includes('youtube.com') || editingProduct.video.includes('youtu.be') ? (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={editingProduct.video.includes('youtube.com/watch') 
                            ? editingProduct.video.replace('watch?v=', 'embed/')
                            : editingProduct.video.replace('youtu.be/', 'youtube.com/embed/')}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : editingProduct.video.includes('vimeo.com') ? (
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                          src={`https://player.vimeo.com/video/${editingProduct.video.split('/').pop()}`}
                          className="w-full h-full"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <video
                        src={editingProduct.video}
                        controls
                        className="w-full h-48 rounded-lg"
                      />
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Фотографии</label>
                <div className="space-y-4">
                  {/* Media URLs */}
                  {editingProduct.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        {image.startsWith('data:') || image.startsWith('http') ? (
                          image.startsWith('data:video') || image.includes('.mp4') || image.includes('.webm') ? (
                            <video
                              src={image}
                              controls
                              className="w-full h-32 object-cover rounded-lg border border-neon-cyan/30"
                            />
                          ) : (
                            <img
                              src={image}
                              alt={`Медиа ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-neon-cyan/30"
                            />
                          )
                        ) : (
                          <div className="w-full h-32 bg-black/50 border border-neon-cyan/30 rounded-lg flex items-center justify-center">
                            <ImageIcon size={24} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...editingProduct.images]
                          newImages[index] = e.target.value
                          setEditingProduct({ ...editingProduct, images: newImages })
                        }}
                        placeholder="URL изображения или видео"
                        className="flex-1 px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                      />
                      <button
                        onClick={() => {
                          const newImages = editingProduct.images.filter((_, i) => i !== index)
                          setEditingProduct({ ...editingProduct, images: newImages })
                        }}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Add Media URL Button */}
                  <button
                    onClick={() => {
                      setEditingProduct({
                        ...editingProduct,
                        images: [...editingProduct.images, ''],
                      })
                    }}
                    className="w-full px-4 py-3 bg-black/50 border border-dashed border-neon-cyan/30 rounded-lg text-gray-400 hover:border-neon-cyan hover:text-neon-cyan transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Добавить URL изображения или видео
                  </button>

                  {/* File Upload - Images */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Загрузить изображения:</label>
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-gray-400 hover:border-neon-cyan hover:text-neon-cyan transition-colors cursor-pointer">
                      <Upload size={18} />
                      <span>Выбрать изображения</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          const newImagePromises = files.map((file) => {
                            return new Promise<string>((resolve) => {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                resolve(reader.result as string)
                              }
                              reader.readAsDataURL(file)
                            })
                          })

                          Promise.all(newImagePromises).then((base64Images) => {
                            setEditingProduct({
                              ...editingProduct,
                              images: [...editingProduct.images, ...base64Images],
                            })
                            addToast(`Загружено ${files.length} изображений`, 'success')
                          })
                        }}
                      />
                    </label>
                  </div>

                  {/* File Upload - Videos */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">Загрузить видео:</label>
                    <label className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-gray-400 hover:border-neon-cyan hover:text-neon-cyan transition-colors cursor-pointer">
                      <Upload size={18} />
                      <span>Выбрать видео</span>
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          const newVideoPromises = files.map((file) => {
                            return new Promise<string>((resolve) => {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                resolve(reader.result as string)
                              }
                              reader.readAsDataURL(file)
                            })
                          })

                          Promise.all(newVideoPromises).then((base64Videos) => {
                            setEditingProduct({
                              ...editingProduct,
                              images: [...editingProduct.images, ...base64Videos],
                            })
                            addToast(`Загружено ${files.length} видео`, 'success')
                          })
                        }}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Поддерживаются форматы: MP4, WebM, MOV. Максимальный размер: 50MB
                    </p>
                  </div>
                </div>
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
