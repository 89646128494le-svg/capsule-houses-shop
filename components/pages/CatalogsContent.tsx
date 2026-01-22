'use client'

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { useCatalogsStore, Catalog } from '@/store/catalogsStore'
import { useState, useEffect } from 'react'

export default function CatalogsContent() {
  const [isMounted, setIsMounted] = useState(false)
  const catalogs = useCatalogsStore((state) => state.getCatalogs())

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDownload = (catalog: Catalog) => {
    if (!catalog.pdfUrl) return

    if (catalog.pdfUrl.startsWith('data:')) {
      // Base64 PDF
      const link = document.createElement('a')
      link.href = catalog.pdfUrl
      link.download = catalog.pdfFileName || 'catalog.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (catalog.pdfUrl.startsWith('http') || catalog.pdfUrl.startsWith('/')) {
      // URL PDF - открываем в новой вкладке
      window.open(catalog.pdfUrl, '_blank')
    }
  }

  if (!isMounted) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center text-gray-400">
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-neon-cyan" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Каталоги</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Скачайте наши каталоги с подробным описанием продукции
          </p>
        </motion.div>

        {/* Catalogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogs.map((catalog, index) => (
            <motion.div
              key={catalog.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassmorphism-light rounded-2xl overflow-hidden border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300 group"
            >
              {/* Cover Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-deep-dark to-black">
                {catalog.coverImage && (catalog.coverImage.startsWith('data:') || catalog.coverImage.startsWith('http') || catalog.coverImage.startsWith('/')) ? (
                  <img
                    src={catalog.coverImage}
                    alt={catalog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 mx-auto border-2 border-dashed border-neon-cyan/30 rounded-lg flex items-center justify-center">
                        <FileText size={48} className="text-neon-cyan/50" />
                      </div>
                      <p className="text-sm text-gray-500">Обложка каталога</p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-dark via-transparent to-transparent opacity-60" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                  {catalog.title}
                </h3>
                {catalog.description && (
                  <p className="text-gray-400 text-sm mb-4">
                    {catalog.description}
                  </p>
                )}
                <button
                  onClick={() => handleDownload(catalog)}
                  disabled={!catalog.pdfUrl}
                  className="w-full px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={20} />
                  {catalog.pdfUrl ? 'Скачать PDF' : 'PDF не загружен'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {catalogs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText size={64} className="mx-auto mb-4 opacity-50" />
            <p>Каталоги пока не добавлены</p>
          </div>
        )}
      </div>
    </div>
  )
}
