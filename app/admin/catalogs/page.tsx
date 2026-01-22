'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Save, X, Upload, Image as ImageIcon, FileText, Download } from 'lucide-react'
import { useCatalogsStore, Catalog } from '@/store/catalogsStore'
import { useToastStore } from '@/store/toastStore'

export default function CatalogsPage() {
  const catalogs = useCatalogsStore((state) => state.getCatalogs())
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const addToast = useToastStore((state) => state.addToast)

  const updateCatalog = useCatalogsStore((state) => state.updateCatalog)
  const addCatalog = useCatalogsStore((state) => state.addCatalog)
  const deleteCatalog = useCatalogsStore((state) => state.deleteCatalog)

  const filteredCatalogs = catalogs.filter((catalog) =>
    catalog.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (catalog: Catalog) => {
    setEditingCatalog({ ...catalog })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!editingCatalog) return

    if (editingCatalog.id > 1000) {
      // Новый каталог
      const { id, ...catalogData } = editingCatalog
      addCatalog(catalogData)
      addToast('Каталог добавлен', 'success')
    } else {
      // Обновление существующего
      updateCatalog(editingCatalog.id, editingCatalog)
      addToast('Каталог обновлен', 'success')
    }
    
    setIsModalOpen(false)
    setEditingCatalog(null)
  }

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот каталог?')) {
      deleteCatalog(id)
      addToast('Каталог удален', 'info')
    }
  }

  const handleAdd = () => {
    const newCatalog: Catalog = {
      id: Date.now(),
      title: 'Новый каталог',
      description: '',
      coverImage: '',
      pdfUrl: '',
      pdfFileName: 'new-catalog.pdf',
    }
    setEditingCatalog(newCatalog)
    setIsModalOpen(true)
  }

  const handleDownloadPDF = (catalog: Catalog) => {
    if (catalog.pdfUrl) {
      if (catalog.pdfUrl.startsWith('data:')) {
        // Base64 PDF
        const link = document.createElement('a')
        link.href = catalog.pdfUrl
        link.download = catalog.pdfFileName || 'catalog.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        // URL PDF
        window.open(catalog.pdfUrl, '_blank')
      }
    } else {
      addToast('PDF файл не загружен', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Каталоги PDF</h1>
          <p className="text-gray-400">Управление PDF каталогами</p>
        </div>
        <button
          onClick={handleAdd}
          aria-label="Добавить новый каталог"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all"
        >
          <Plus size={20} />
          Добавить каталог
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
            placeholder="Поиск каталогов..."
            className="w-full pl-10 pr-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
          />
        </div>
      </div>

      {/* Catalogs List */}
      <div className="glassmorphism-light rounded-xl border border-neon-cyan/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Обложка</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Название</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Описание</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">PDF</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredCatalogs.map((catalog) => (
                <tr
                  key={catalog.id}
                  className="border-t border-neon-cyan/10 hover:bg-black/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    {catalog.coverImage && (catalog.coverImage.startsWith('data:') || catalog.coverImage.startsWith('http') || catalog.coverImage.startsWith('/')) ? (
                      <img
                        src={catalog.coverImage}
                        alt={catalog.title}
                        className="w-20 h-20 object-cover rounded-lg border border-neon-cyan/30"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-black/50 border border-neon-cyan/30 rounded-lg flex items-center justify-center">
                        <ImageIcon size={24} className="text-gray-500" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-white font-medium">{catalog.title}</td>
                  <td className="py-4 px-6 text-gray-300 text-sm max-w-md truncate">{catalog.description}</td>
                  <td className="py-4 px-6">
                    {catalog.pdfUrl ? (
                      <button
                        onClick={() => handleDownloadPDF(catalog)}
                        className="flex items-center gap-2 px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors text-sm"
                      >
                        <Download size={16} />
                        Скачать
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">Не загружен</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(catalog)}
                        aria-label={`Редактировать ${catalog.title}`}
                        className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(catalog.id)}
                        aria-label={`Удалить ${catalog.title}`}
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
      {isModalOpen && editingCatalog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glassmorphism rounded-2xl border border-neon-cyan/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gradient">
                  {editingCatalog.id > 1000 ? 'Добавить каталог' : 'Редактировать каталог'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingCatalog(null)
                  }}
                  className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Название каталога</label>
                  <input
                    type="text"
                    value={editingCatalog.title}
                    onChange={(e) =>
                      setEditingCatalog({ ...editingCatalog, title: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="Название каталога"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Описание</label>
                  <textarea
                    value={editingCatalog.description}
                    onChange={(e) =>
                      setEditingCatalog({ ...editingCatalog, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                    placeholder="Описание каталога"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Обложка каталога</label>
                  <div className="space-y-4">
                    {editingCatalog.coverImage && (editingCatalog.coverImage.startsWith('data:') || editingCatalog.coverImage.startsWith('http') || editingCatalog.coverImage.startsWith('/')) && (
                      <div className="w-32 h-32 rounded-lg overflow-hidden border border-neon-cyan/30">
                        <img
                          src={editingCatalog.coverImage}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      value={editingCatalog.coverImage}
                      onChange={(e) =>
                        setEditingCatalog({ ...editingCatalog, coverImage: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                      placeholder="URL обложки"
                    />
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-all cursor-pointer">
                      <ImageIcon size={18} />
                      <span>Загрузить обложку</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const result = event.target?.result as string
                              setEditingCatalog({ ...editingCatalog, coverImage: result })
                              addToast('Обложка загружена', 'success')
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">PDF файл</label>
                  <div className="space-y-4">
                    {editingCatalog.pdfUrl && (
                      <div className="p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                          <FileText size={18} />
                          <span>PDF загружен</span>
                          {editingCatalog.pdfFileName && (
                            <span className="text-gray-500">({editingCatalog.pdfFileName})</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDownloadPDF(editingCatalog)}
                          className="flex items-center gap-2 px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors text-sm"
                        >
                          <Download size={16} />
                          Скачать для проверки
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      value={editingCatalog.pdfUrl}
                      onChange={(e) =>
                        setEditingCatalog({ ...editingCatalog, pdfUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                      placeholder="URL PDF файла"
                    />
                    <label className="flex items-center justify-center gap-2 px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-all cursor-pointer">
                      <Upload size={18} />
                      <span>Загрузить PDF файл</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const result = event.target?.result as string
                              setEditingCatalog({
                                ...editingCatalog,
                                pdfUrl: result,
                                pdfFileName: file.name,
                              })
                              addToast('PDF файл загружен', 'success')
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      Поддерживаются PDF файлы. Максимальный размер: 50MB
                    </p>
                  </div>
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
                      setEditingCatalog(null)
                    }}
                    className="px-6 py-3 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
