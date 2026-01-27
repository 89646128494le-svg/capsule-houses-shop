'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ShoppingCart, Eye, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import { useProductsStore } from '@/store/productsStore'
import QuickViewModal from '@/components/modals/QuickViewModal'
import QuickOrderModal from '@/components/modals/QuickOrderModal'

export default function BestSellers() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<ReturnType<typeof useProductsStore.getState>['products'][0] | null>(null)
  const [quickOrderProduct, setQuickOrderProduct] = useState<ReturnType<typeof useProductsStore.getState>['products'][0] | null>(null)
  const products = useProductsStore((state) => state.getProducts())
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Берем первые 6 товаров как хиты продаж
  const bestSellers = isMounted ? products.slice(0, 6) : []

  if (!isMounted) {
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      dimensions: product.dimensions,
      guests: product.guests,
      image: (product.images && product.images.length > 0) ? product.images[0] : undefined,
    })
    addToast(`${product.name} добавлен в корзину`, 'success')
  }

  const handleQuickView = (product: typeof products[0]) => {
    setQuickViewProduct(product)
  }

  const handleQuickAdd = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      dimensions: product.dimensions,
      guests: product.guests,
      image: (product.images && product.images.length > 0) ? product.images[0] : undefined,
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
          {bestSellers.map((product, index) => {
            const isHovered = hoveredProduct === product.id
            const currentImageIndex = isHovered && product.images && product.images.length > 1 ? 1 : 0
            const imageUrl = product.images && product.images.length > 0 && currentImageIndex < product.images.length 
              ? product.images[currentImageIndex] 
              : undefined

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => {
                  setHoveredProduct(product.id)
                }}
                onMouseLeave={() => {
                  setHoveredProduct(null)
                }}
                className="group relative"
              >
                <div className="glassmorphism-light rounded-2xl overflow-hidden border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300 h-full flex flex-col">
                  {/* Image/Video Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-deep-dark to-black">
                    {/* Default Image */}
                    {isMounted && imageUrl && (imageUrl.startsWith('data:') || imageUrl.startsWith('http') || imageUrl.startsWith('/')) ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                        <div className="text-center space-y-2">
                          <div className="w-24 h-24 mx-auto border-2 border-dashed border-neon-cyan/30 rounded-lg flex items-center justify-center">
                            <span className="text-4xl">🏠</span>
                          </div>
                          <p className="text-xs text-gray-600">Изображение не загружено</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Video on Hover */}
                    {product.video && product.video.trim() && (() => {
                      let videoSrc: string = '';
                      let videoId: string | undefined;
                      const isYouTube = product.video.includes('youtube.com') || product.video.includes('youtu.be');
                      const isVimeo = product.video.includes('vimeo.com');
                      
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
                          aria-label={`Добавить ${product.name} в корзину`}
                          disabled={!product.inStock}
                          className="px-4 py-2 bg-gradient-hero text-deep-dark rounded-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {product.inStock ? 'В корзину' : 'Нет в наличии'}
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
