'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useToastStore } from '@/store/toastStore'
import { Product } from '@/store/productsStore'
import QuickOrderModal from './QuickOrderModal'

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)

  if (!product) return null

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
    onClose()
  }

  const handleQuickOrder = () => {
    setIsQuickOrderOpen(true)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: 'auto' }}
            >
              <div className="glassmorphism rounded-2xl max-w-4xl w-full border border-neon-cyan/30 relative my-8">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  aria-label="Закрыть"
                  className="absolute top-4 right-4 p-2 bg-black/70 rounded-lg text-gray-400 hover:text-neon-cyan transition-colors z-10"
                >
                  <X size={24} />
                </button>

                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Image Gallery */}
                  <div className="space-y-4">
                    {/* Main Image/Video */}
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-deep-dark to-black border border-neon-cyan/30">
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
                              <div className="w-32 h-32 mx-auto border-2 border-dashed border-neon-cyan/30 rounded-lg flex items-center justify-center">
                                <span className="text-6xl">🏠</span>
                              </div>
                              <p className="text-sm text-gray-600">Изображение {product.video ? currentImageIndex : currentImageIndex + 1}</p>
                            </div>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2">
                      {/* Video Thumbnail */}
                      {product.video && (
                        <button
                          onClick={() => setCurrentImageIndex(0)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                            currentImageIndex === 0
                              ? 'border-neon-cyan'
                              : 'border-neon-cyan/20'
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
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              currentImageIndex === displayIndex
                                ? 'border-neon-cyan'
                                : 'border-neon-cyan/20'
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
                      <h2 className="text-3xl font-bold text-gradient mb-2">{product.name}</h2>
                      <p className="text-gray-400">{product.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-4xl font-bold text-neon-cyan">
                      {formatPrice(product.price)}
                    </div>

                    {/* Specifications */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-neon-cyan/20">
                        <span className="text-gray-400">Размеры</span>
                        <span className="text-white">{product.dimensions}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-neon-cyan/20">
                        <span className="text-gray-400">Количество гостей</span>
                        <span className="text-white">{product.guests}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={handleAddToCart}
                        aria-label={`Добавить ${product.name} в корзину`}
                        className="flex-1 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={20} />
                        В корзину
                      </button>
                      <button
                        onClick={handleQuickOrder}
                        aria-label={`Купить ${product.name} в 1 клик`}
                        className="flex-1 px-6 py-3 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all font-semibold flex items-center justify-center gap-2"
                      >
                        Купить в 1 клик
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Quick Order Modal */}
      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        onClose={() => setIsQuickOrderOpen(false)}
        productName={product.name}
      />
    </>
  )
}
