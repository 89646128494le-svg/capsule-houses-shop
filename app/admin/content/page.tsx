'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Edit, Save, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { useContentStore, Review, Promotion } from '@/store/contentStore'
import { useToastStore } from '@/store/toastStore'

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'promotions'>('reviews')
  const reviews = useContentStore((state) => state.reviews)
  const promotions = useContentStore((state) => state.promotions)
  const updateReview = useContentStore((state) => state.updateReview)
  const deleteReview = useContentStore((state) => state.deleteReview)
  const addPromotion = useContentStore((state) => state.addPromotion)
  const updatePromotion = useContentStore((state) => state.updatePromotion)
  const deletePromotion = useContentStore((state) => state.deletePromotion)
  const addToast = useToastStore((state) => state.addToast)

  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false)

  const handleApproveReview = (id: number) => {
    updateReview(id, { approved: true })
    addToast('Отзыв одобрен', 'success')
  }

  const handleDeleteReview = (id: number) => {
    if (confirm('Удалить отзыв?')) {
      deleteReview(id)
      addToast('Отзыв удален', 'info')
    }
  }

  const handleAddPromotion = () => {
    setEditingPromotion({
      id: 0,
      title: '',
      description: '',
      discount: '',
      validUntil: '',
      image: '🏠',
      active: true,
    })
    setIsPromotionModalOpen(true)
  }

  const handleSavePromotion = () => {
    if (!editingPromotion) return

    if (editingPromotion.id === 0) {
      addPromotion({
        title: editingPromotion.title,
        description: editingPromotion.description,
        discount: editingPromotion.discount,
        validUntil: editingPromotion.validUntil,
        image: editingPromotion.image,
        active: editingPromotion.active,
      })
      addToast('Акция добавлена', 'success')
    } else {
      updatePromotion(editingPromotion.id, editingPromotion)
      addToast('Акция обновлена', 'success')
    }
    
    setIsPromotionModalOpen(false)
    setEditingPromotion(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Контент</h1>
        <p className="text-gray-400">Управление страницами, баннерами и отзывами</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neon-cyan/20">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'reviews'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
        >
          <Edit size={20} className="inline mr-2" />
          Отзывы ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('promotions')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'promotions'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
        >
          <Image size={20} className="inline mr-2" />
          Акции ({promotions.length})
        </button>
      </div>

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          {pages.map((page) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{page.title}</h3>
                  <p className="text-sm text-gray-400">{page.slug}</p>
                </div>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] transition-all"
                >
                  <Save size={18} />
                  Редактировать
                </button>
              </div>
              <textarea
                defaultValue={page.content}
                className="w-full h-32 px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors resize-none"
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
            >
              <div className="aspect-video rounded-lg bg-gradient-to-br from-deep-dark to-black border border-neon-cyan/30 flex items-center justify-center mb-4">
                <Image size={48} className="text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{banner.title}</h3>
              <p className="text-sm text-gray-400 mb-4">Ссылка: {banner.link}</p>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  banner.active
                    ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                    : 'bg-gray-400/20 text-gray-400 border border-gray-400/30'
                }`}>
                  {banner.active ? 'Активен' : 'Неактивен'}
                </span>
                <button className="px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all text-sm">
                  Редактировать
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{review.author}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  review.approved
                    ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                    : 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                }`}>
                  {review.approved ? 'Одобрен' : 'На модерации'}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{review.text}</p>
              <div className="flex gap-2">
                {!review.approved && (
                  <button className="px-4 py-2 bg-green-400/20 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/30 transition-all text-sm">
                    Одобрить
                  </button>
                )}
                <button className="px-4 py-2 bg-red-400/20 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/30 transition-all text-sm">
                  Удалить
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
