'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import { useProductsStore } from '@/store/productsStore'
import QuickOrderModal from './modals/QuickOrderModal'

interface ProductDetailsProps {
  productId: number
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)
  const product = useProductsStore((state) => 
    state.products.find((p) => p.id === productId)
  )

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
      image: (product.images && product.images.length > 0) ? product.images[0] : undefined,
    })
    addToast(`${product.name} добавлен в корзину`, 'success')
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image/Video Gallery */}
        <div className="space-y-4">
          {/* Main Image/Video */}
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-deep-dark to-black border border-neon-cyan/30"
          >
            {/* Video Support */}
            {product.video && product.video.trim() && currentImageIndex === 0 ? (() => {
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
                } else if (isVimeo) {
                  videoId = product.video.split('/').pop()?.split('?')[0];
                  videoSrc = videoId ? `https://player.vimeo.com/video/${videoId}` : '';
                } else {
                  videoSrc = product.video;
                }
              } catch (e) {
                console.error('Error parsing video URL:', e);
                return null;
              }
              
              if (!videoSrc) return null;
              
              return (
                <div className="w-full h-full">
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
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              );
            })() : (() => {
              // Если есть видео, изображения начинаются с индекса 1
              const imageIndex = product.video ? currentImageIndex - 1 : currentImageIndex
              const hasImages = product.images && product.images.length > 0
              const isValidIndex = imageIndex >= 0 && imageIndex < (product.images?.length || 0)
              const imageUrl = hasImages && isValidIndex ? product.images[imageIndex] : null
              
              return imageUrl && (imageUrl.startsWith('data:') || imageUrl.startsWith('http') || imageUrl.startsWith('/')) ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="w-48 h-48 mx-auto border-2 border-dashed border-neon-cyan/30 rounded-lg flex items-center justify-center">
                    <span className="text-8xl">🏠</span>
                  </div>
                  <p className="text-sm text-gray-600">Изображение {product.video ? currentImageIndex : currentImageIndex + 1}</p>
                </div>
              </div>
              )
            })()}
          </motion.div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {/* Video Thumbnail */}
            {product.video && (
              <button
                onClick={() => setCurrentImageIndex(0)}
                aria-label="Показать видео товара"
                aria-pressed={currentImageIndex === 0}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                  currentImageIndex === 0
                    ? 'border-neon-cyan'
                    : 'border-neon-cyan/20 hover:border-neon-cyan/50'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-deep-dark to-black flex items-center justify-center relative">
                  <span className="text-2xl">▶️</span>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">Видео</span>
                  </div>
                </div>
              </button>
            )}
            {/* Image Thumbnails */}
            {(product.images || []).map((image, index) => {
              const displayIndex = product.video ? index + 1 : index
              // Максимальный индекс: если есть видео, то images.length, иначе images.length - 1
              const maxIndex = product.video ? (product.images?.length || 0) : Math.max(0, (product.images?.length || 0) - 1)
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (displayIndex <= maxIndex) {
                      setCurrentImageIndex(displayIndex)
                    }
                  }}
                  aria-label={`Показать изображение ${index + 1} товара ${product.name}`}
                  aria-pressed={currentImageIndex === displayIndex}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === displayIndex
                      ? 'border-neon-cyan'
                      : 'border-neon-cyan/20 hover:border-neon-cyan/50'
                  }`}
                >
                  {image && (image.startsWith('data:') || image.startsWith('http') || image.startsWith('/')) ? (
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-deep-dark to-black flex items-center justify-center">
                      <span className="text-2xl">🏠</span>
                    </div>
                  )}
                </button>
              )
            })}
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
                <span className="text-gray-400">Категория</span>
                <span className="text-white font-medium">{product.category}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400">Наличие</span>
                <span className={`font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              aria-label={`Добавить ${product.name} в корзину`}
              disabled={!product.inStock}
              className="flex-1 px-6 py-4 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              {product.inStock ? 'В корзину' : 'Нет в наличии'}
            </button>
            <button
              onClick={() => setIsQuickOrderOpen(true)}
              aria-label={`Купить ${product.name} в 1 клик`}
              disabled={!product.inStock}
              className="flex-1 px-6 py-4 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Купить в 1 клик
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Availability */}
          {product.inStock && (
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" aria-hidden="true" />
              <span>В наличии</span>
            </div>
          )}
          {!product.inStock && (
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-2 h-2 bg-red-400 rounded-full" aria-hidden="true" />
              <span>Нет в наличии</span>
            </div>
          )}
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
