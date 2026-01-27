'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, X, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useProductsStore } from '@/store/productsStore'
import { useCatalogsStore } from '@/store/catalogsStore'

const categories = [
  { value: 'all', label: 'Все категории' },
  { value: 'two-story', label: 'Двухэтажные капсульные дома' },
  { value: 'sliding', label: 'Раздвижные капсульные дома' },
  { value: 'vertical', label: 'Вертикальные' },
  { value: 'mini', label: 'Мини капсульные дома' },
  { value: 'designer', label: 'Дизайнерские капсульные дома' },
  { value: 'new-section-1', label: 'Новый раздел' },
  { value: 'new-section-2', label: 'Новый раздел' },
]

const sortOptions = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'guests-asc', label: 'Гостей: по возрастанию' },
  { value: 'guests-desc', label: 'Гостей: по убыванию' },
]

const priceRanges = [
  { min: 0, max: 1000000, label: 'До 1 000 000 ₽' },
  { min: 1000000, max: 2000000, label: '1 000 000 - 2 000 000 ₽' },
  { min: 2000000, max: 3000000, label: '2 000 000 - 3 000 000 ₽' },
  { min: 3000000, max: Infinity, label: 'От 3 000 000 ₽' },
]

export default function CatalogGrid() {
  const [isMounted, setIsMounted] = useState(false)
  const products = useProductsStore((state) => state.getProducts())
  const catalogs = useCatalogsStore((state) => state.getCatalogs())
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null)
  const [selectedGuests, setSelectedGuests] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState('default')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products]

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Фильтр по цене
    if (selectedPriceRange !== null && selectedPriceRange >= 0 && selectedPriceRange < priceRanges.length) {
      const range = priceRanges[selectedPriceRange]
      if (range) {
        filtered = filtered.filter((p) => p.price >= range.min && p.price <= range.max)
      }
    }

    // Фильтр по количеству гостей
    if (selectedGuests !== null) {
      filtered = filtered.filter((p) => p.guests === selectedGuests)
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'guests-asc':
          return a.guests - b.guests
        case 'guests-desc':
          return b.guests - a.guests
        default:
          return 0
      }
    })

    return filtered
  }, [products, selectedCategory, selectedPriceRange, selectedGuests, sortBy])

  const totalPages = itemsPerPage > 0 ? Math.ceil(filteredAndSortedProducts.length / itemsPerPage) : 1
  const paginatedProducts = isMounted && itemsPerPage > 0 ? filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : []

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedPriceRange(null)
    setSelectedGuests(null)
    setCurrentPage(1)
  }

  const hasActiveFilters = selectedCategory !== 'all' || selectedPriceRange !== null || selectedGuests !== null

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
                <span className="text-gradient">Каталог</span>
              </h1>
              <p className="text-gray-400">
                Найдено товаров: {filteredAndSortedProducts.length}
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              aria-label={showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
              aria-expanded={showFilters}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all"
            >
              <Filter size={20} />
              Фильтры
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-64 flex-shrink-0`}
          >
            <div className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Фильтры</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    aria-label="Сбросить все фильтры"
                    className="text-sm text-neon-cyan hover:text-neon-cyan-light transition-colors"
                  >
                    Сбросить
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Категория</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label
                      key={cat.value}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={selectedCategory === cat.value}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="w-4 h-4 text-neon-cyan focus:ring-neon-cyan"
                      />
                      <span className="text-sm text-gray-300">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Цена</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPriceRange === index}
                        onChange={() => {
                          setSelectedPriceRange(index)
                          setCurrentPage(1)
                        }}
                        className="w-4 h-4 text-neon-cyan focus:ring-neon-cyan"
                      />
                      <span className="text-sm text-gray-300">{range.label}</span>
                    </label>
                  ))}
                  {selectedPriceRange !== null && (
                    <button
                      onClick={() => {
                        setSelectedPriceRange(null)
                        setCurrentPage(1)
                      }}
                      className="text-xs text-neon-cyan hover:text-neon-cyan-light mt-2"
                    >
                      Сбросить цену
                    </button>
                  )}
                </div>
              </div>

              {/* Guests Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Количество гостей</h3>
                <div className="space-y-2">
                  {[2, 4, 6, 8, 10].map((guests) => (
                    <label
                      key={guests}
                      className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <input
                        type="radio"
                        name="guests"
                        checked={selectedGuests === guests}
                        onChange={() => {
                          setSelectedGuests(selectedGuests === guests ? null : guests)
                          setCurrentPage(1)
                        }}
                        className="w-4 h-4 text-neon-cyan focus:ring-neon-cyan"
                      />
                      <span className="text-sm text-gray-300">{guests} гостей</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {!isMounted ? (
              <div className="text-center py-12 text-gray-400">
                <p>Загрузка...</p>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group"
                    >
                      <Link href={`/product/${product.id}`}>
                        <div className="glassmorphism-light rounded-2xl overflow-hidden border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300 h-full flex flex-col group">
                          {/* Image/Video */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-deep-dark to-black">
                            {/* Default Image */}
                            {product.images && product.images.length > 0 && product.images[0] && (product.images[0].startsWith('data:') || product.images[0].startsWith('http') || product.images[0].startsWith('/')) ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                                <div className="text-center space-y-2">
                                  <div className="w-24 h-24 mx-auto border-2 border-dashed border-neon-cyan/30 rounded-lg flex items-center justify-center">
                                    <span className="text-4xl">🏠</span>
                                  </div>
                                  <p className="text-xs text-gray-600">Фото товара</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Video on Hover */}
                            {product.video && product.video.trim() && (() => {
                              let videoSrc: string = '';
                              let videoId: string | undefined;
                              const isYouTube = product.video.includes('youtube.com') || product.video.includes('youtu.be');
                              const isVimeo = product.video.includes('vimeo.com');
                              
                              // #region agent log
                              try {
                                if (isYouTube) {
                                  if (product.video.includes('youtube.com/watch')) {
                                    videoSrc = product.video.replace('watch?v=', 'embed/').split('&')[0];
                                  } else {
                                    videoId = product.video.split('/').pop()?.split('?')[0];
                                    videoSrc = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
                                  }
                                  if (videoSrc) videoSrc += '?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1';
                                } else if (isVimeo) {
                                  videoId = product.video.split('/').pop()?.split('?')[0];
                                  videoSrc = videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&controls=0` : '';
                                } else {
                                  videoSrc = product.video;
                                }
                                
                      } catch (e) {
                        console.error('Video URL parsing error', e);
                      }
                              // #endregion
                              
                              if (!videoSrc) return null;
                              
                              return (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {isYouTube && videoSrc ? (
                                    <iframe
                                      src={videoSrc}
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  ) : isVimeo && videoSrc ? (
                                    <iframe
                                      src={videoSrc}
                                      className="w-full h-full"
                                      allow="autoplay; fullscreen; picture-in-picture"
                                      allowFullScreen
                                    />
                                  ) : videoSrc ? (
                                    <video
                                      src={videoSrc}
                                      className="w-full h-full object-cover"
                                      muted
                                      playsInline
                                      autoPlay
                                      loop
                                      onError={(e) => {
                                console.error('Video load error', e);
                                      }}
                                    />
                                  ) : null}
                                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                                    ▶ Видео
                                  </div>
                                </div>
                              );
                            })()}
                            
                            {!product.inStock && (
                              <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-medium z-10">
                                Нет в наличии
                              </div>
                            )}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="Предыдущая страница"
                      className="px-4 py-2 bg-transparent border border-neon-cyan/30 text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Назад
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          currentPage === i + 1
                            ? 'bg-neon-cyan text-deep-dark font-semibold'
                            : 'bg-transparent border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan hover:text-deep-dark'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="Следующая страница"
                      className="px-4 py-2 bg-transparent border border-neon-cyan/30 text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Вперёд
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                Товары не найдены. Попробуйте изменить фильтры.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Catalogs Section */}
      {isMounted && catalogs.length > 0 && (
        <div className="py-20 px-4 sm:px-6 lg:px-8 border-t border-neon-cyan/20 mt-20">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">PDF Каталоги</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Скачайте наши каталоги с подробным описанием продукции
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {catalogs.map((catalog, index) => {
                const handleDownload = () => {
                  if (!catalog.pdfUrl) return

                  if (catalog.pdfUrl.startsWith('data:')) {
                    const link = document.createElement('a')
                    link.href = catalog.pdfUrl
                    link.download = catalog.pdfFileName || 'catalog.pdf'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  } else if (catalog.pdfUrl.startsWith('http') || catalog.pdfUrl.startsWith('/')) {
                    window.open(catalog.pdfUrl, '_blank')
                  }
                }

                return (
                  <motion.div
                    key={catalog.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glassmorphism-light rounded-2xl overflow-hidden border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300 group"
                  >
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
                              <span className="text-6xl">📄</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-deep-dark via-transparent to-transparent opacity-60" />
                    </div>
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
                        onClick={handleDownload}
                        disabled={!catalog.pdfUrl}
                        className="w-full px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        {catalog.pdfUrl ? 'Скачать PDF' : 'PDF не загружен'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
