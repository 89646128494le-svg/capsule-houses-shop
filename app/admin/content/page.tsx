'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Edit, Save, Plus, Trash2, CheckCircle, XCircle, Video, X, Phone, Mail, MapPin, Globe, GripVertical, Layout, Eye, EyeOff } from 'lucide-react'
import { useContentStore, Review, Promotion, PageContent, PageCustomData, InnovationItem, MaterialItem } from '@/store/contentStore'
import { useToastStore } from '@/store/toastStore'
import { useSettingsStore } from '@/store/settingsStore'

// Компонент для редактирования страниц (отдельный компонент для правильного использования hooks)
function PageEditorSection({ 
  pages, 
  updatePage, 
  addToast,
  pageCustomData,
  updatePageCustomData,
  pageBlocks,
  updatePageBlocks,
  togglePageBlock,
}: { 
  pages: PageContent[]
  updatePage: (slug: string, content: Partial<PageContent>) => void
  addToast: (message: string, type?: any) => void
  pageCustomData: PageCustomData
  updatePageCustomData: (pageSlug: string, data: any) => void
  pageBlocks: Record<string, any[]>
  updatePageBlocks: (pageSlug: string, blocks: any[]) => void
  togglePageBlock: (pageSlug: string, blockId: string, enabled: boolean) => void
}) {
  const [editingPages, setEditingPages] = useState<Record<string, Partial<PageContent>>>({})
  const [editingPageData, setEditingPageData] = useState<Record<string, any>>({})
  
  const handleChange = (pageSlug: string, field: string, value: string) => {
    setEditingPages((prev) => ({
      ...prev,
      [pageSlug]: {
        ...prev[pageSlug],
        ...pages.find((p) => p.slug === pageSlug),
        [field]: value,
      },
    }))
  }
  
  const getPageForm = (pageSlug: string) => {
    if (editingPages[pageSlug]) {
      return editingPages[pageSlug]
    }
    const page = pages.find((p) => p.slug === pageSlug)
    return page ? { title: page.title, content: page.content } : { title: '', content: '' }
  }
  
  const getPageData = (slug: string) => {
    if (editingPageData[slug]) {
      return editingPageData[slug]
    }
    return pageCustomData[slug as keyof typeof pageCustomData] || null
  }

  const updatePageDataField = (slug: string, field: string, value: any) => {
    setEditingPageData((prev) => ({
      ...prev,
      [slug]: {
        ...getPageData(slug),
        [field]: value,
      },
    }))
  }

  const savePageData = (slug: string) => {
    const data = editingPageData[slug] || getPageData(slug)
    if (data) {
      updatePageCustomData(slug, data)
      addToast(`Блоки страницы "${slug}" обновлены`, 'success')
      setEditingPageData((prev) => {
        const newPrev = { ...prev }
        delete newPrev[slug]
        return newPrev
      })
    }
  }

  return (
    <div className="space-y-6">
      {pages.map((page) => {
        const pageForm = getPageForm(page.slug)
        const pageData = getPageData(page.slug)

        return (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">{page.title}</h2>
            
            {/* Базовое редактирование (Title & Content) */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Заголовок</label>
                <input
                  type="text"
                  value={pageForm.title || ''}
                  onChange={(e) => handleChange(page.slug, 'title', e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Содержание</label>
                <textarea
                  value={pageForm.content || ''}
                  onChange={(e) => handleChange(page.slug, 'content', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                />
              </div>
              <button
                onClick={() => {
                  updatePage(page.slug, pageForm)
                  addToast(`Страница "${page.title}" обновлена`, 'success')
                  setEditingPages((prev) => {
                    const newPrev = { ...prev }
                    delete newPrev[page.slug]
                    return newPrev
                  })
                }}
                className="px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Сохранить базовую информацию
              </button>
            </div>

          </motion.div>
        )
      })}
    </div>
  )
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'promotions' | 'contacts' | 'pages' | 'settings' | 'homepage'>('reviews')
  const reviews = useContentStore((state) => state.reviews)
  const promotions = useContentStore((state) => state.promotions)
  const updateReview = useContentStore((state) => state.updateReview)
  const deleteReview = useContentStore((state) => state.deleteReview)
  const addPromotion = useContentStore((state) => state.addPromotion)
  const updatePromotion = useContentStore((state) => state.updatePromotion)
  const deletePromotion = useContentStore((state) => state.deletePromotion)
  const footerContent = useContentStore((state) => state.footerContent)
  const updateFooterContent = useContentStore((state) => state.updateFooterContent)
  const updateContactInfo = useContentStore((state) => state.updateContactInfo)
  const updateSocialLink = useContentStore((state) => state.updateSocialLink)
  const updateLegalInfo = useContentStore((state) => state.updateLegalInfo)
  const pages = useContentStore((state) => state.pages)
  const updatePage = useContentStore((state) => state.updatePage)
  const homePageBlocks = useContentStore((state) => state.homePageBlocks)
  const updateHomePageBlocks = useContentStore((state) => state.updateHomePageBlocks)
  const toggleBlock = useContentStore((state) => state.toggleBlock)
  const advantages = useContentStore((state) => state.advantages)
  const updateAdvantages = useContentStore((state) => state.updateAdvantages)
  const heroContent = useContentStore((state) => state.heroContent)
  const updateHeroContent = useContentStore((state) => state.updateHeroContent)
  const pageCustomData = useContentStore((state) => state.pageCustomData)
  const updatePageCustomData = useContentStore((state) => state.updatePageCustomData)
  const pageBlocks = useContentStore((state) => state.pageBlocks)
  const updatePageBlocks = useContentStore((state) => state.updatePageBlocks)
  const togglePageBlock = useContentStore((state) => state.togglePageBlock)
  const designSettings = useSettingsStore((state) => state.designSettings)
  const updateDesignSettings = useSettingsStore((state) => state.updateDesignSettings)
  const addToast = useToastStore((state) => state.addToast)
  
  const [contactForm, setContactForm] = useState({
    phone: footerContent.contacts.phone,
    email: footerContent.contacts.email,
    address: footerContent.contacts.address,
  })
  
  const [footerForm, setFooterForm] = useState({
    logoText: footerContent.logoText,
    description: footerContent.description,
  })
  
  const [legalForm, setLegalForm] = useState({
    privacyPolicyText: footerContent.legalInfo.privacyPolicyText,
    ogrn: footerContent.legalInfo.ogrn,
    companyName: footerContent.legalInfo.companyName,
  })

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
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'contacts'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
        >
          <Phone size={20} className="inline mr-2" />
          Контакты
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'pages'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
        >
          <FileText size={20} className="inline mr-2" />
          Страницы
        </button>
        <button
          onClick={() => setActiveTab('homepage')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'homepage'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
        >
          <Layout size={20} className="inline mr-2" />
          Главная страница
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'settings'
              ? 'text-neon-cyan border-b-2 border-neon-cyan'
              : 'text-gray-400 hover:text-neon-cyan'
          }`}
        >
          <Globe size={20} className="inline mr-2" />
          Настройки
        </button>
      </div>

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
                  <button
                    onClick={() => handleApproveReview(review.id)}
                    className="px-4 py-2 bg-green-400/20 text-green-400 border border-green-400/30 rounded-lg hover:bg-green-400/30 transition-all text-sm"
                  >
                    Одобрить
                  </button>
                )}
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  aria-label={`Удалить отзыв от ${review.author}`}
                  className="px-4 py-2 bg-red-400/20 text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/30 transition-all text-sm"
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Promotions Tab */}
      {activeTab === 'promotions' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleAddPromotion}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all"
            >
              <Plus size={20} />
              Добавить акцию
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promotion) => (
              <motion.div
                key={promotion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
              >
                <div className="aspect-video rounded-lg bg-gradient-to-br from-deep-dark to-black border border-neon-cyan/30 flex items-center justify-center mb-4 overflow-hidden">
                  {promotion.image && (promotion.image.startsWith('http') || promotion.image.startsWith('/') || promotion.image.startsWith('data:')) ? (
                    <img src={promotion.image} alt={promotion.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-4xl">{promotion.image || '🏠'}</div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{promotion.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{promotion.description}</p>
                <p className="text-neon-cyan font-semibold mb-4">{promotion.discount}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    promotion.active
                      ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                      : 'bg-gray-400/20 text-gray-400 border border-gray-400/30'
                  }`}>
                    {promotion.active ? 'Активна' : 'Неактивна'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPromotion(promotion)
                        setIsPromotionModalOpen(true)
                      }}
                      className="px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all text-sm"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Удалить акцию?')) {
                          deletePromotion(promotion.id)
                          addToast('Акция удалена', 'info')
                        }
                      }}
                      className="px-4 py-2 bg-transparent border border-red-400 text-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-all text-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {isPromotionModalOpen && editingPromotion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glassmorphism rounded-2xl p-8 max-w-2xl w-full border border-neon-cyan/30 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                setIsPromotionModalOpen(false)
                setEditingPromotion(null)
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-neon-cyan transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gradient mb-6">
              {editingPromotion.id === 0 ? 'Добавить акцию' : 'Редактировать акцию'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Название акции</label>
                <input
                  type="text"
                  value={editingPromotion.title}
                  onChange={(e) =>
                    setEditingPromotion({ ...editingPromotion, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="Название акции"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Описание</label>
                <textarea
                  value={editingPromotion.description}
                  onChange={(e) =>
                    setEditingPromotion({ ...editingPromotion, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                  placeholder="Описание акции"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Скидка</label>
                  <input
                    type="text"
                    value={editingPromotion.discount}
                    onChange={(e) =>
                      setEditingPromotion({ ...editingPromotion, discount: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="Скидка 20%"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Действует до</label>
                  <input
                    type="date"
                    value={editingPromotion.validUntil}
                    onChange={(e) =>
                      setEditingPromotion({ ...editingPromotion, validUntil: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  />
                </div>
              </div>

              {/* Image/Video Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Изображение или видео</label>
                <div className="space-y-3">
                  {editingPromotion.image && (editingPromotion.image.startsWith('http') || editingPromotion.image.startsWith('/') || editingPromotion.image.startsWith('data:')) && (
                    <div className="relative group">
                      <div className="aspect-video rounded-lg bg-black/50 border border-neon-cyan/30 overflow-hidden">
                        {editingPromotion.image.startsWith('data:video') ? (
                          <video src={editingPromotion.image} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={editingPromotion.image} alt={editingPromotion.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingPromotion({ ...editingPromotion, image: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-all cursor-pointer">
                      <Image size={18} />
                      <span>Загрузить изображение</span>
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
                              setEditingPromotion({ ...editingPromotion, image: result })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-all cursor-pointer">
                      <Video size={18} />
                      <span>Загрузить видео</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const result = event.target?.result as string
                              setEditingPromotion({ ...editingPromotion, image: result })
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Поддерживаются форматы: JPG, PNG, WebP, MP4, WebM. Максимальный размер: 10MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPromotion.active}
                    onChange={(e) =>
                      setEditingPromotion({ ...editingPromotion, active: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-neon-cyan/30 bg-black/50 text-neon-cyan focus:ring-neon-cyan"
                  />
                  <span className="text-sm text-gray-300">Активна</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSavePromotion}
                  className="flex-1 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setIsPromotionModalOpen(false)
                    setEditingPromotion(null)
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

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Информация о компании</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Текст логотипа</label>
                <input
                  type="text"
                  value={footerForm.logoText}
                  onChange={(e) => setFooterForm({ ...footerForm, logoText: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="CAPSULE"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Описание компании</label>
                <textarea
                  value={footerForm.description}
                  onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                  placeholder="Описание компании"
                />
              </div>
              <button
                onClick={() => {
                  updateFooterContent(footerForm)
                  addToast('Информация о компании обновлена', 'success')
                }}
                className="px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Сохранить
              </button>
            </div>
          </motion.div>

          {/* Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Phone size={24} />
              Контактная информация
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Телефон
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="info@capsulehouses.ru"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Адрес
                </label>
                <input
                  type="text"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="г. Москва, ул. Примерная, д. 1"
                />
              </div>
              <button
                onClick={() => {
                  updateContactInfo(contactForm)
                  addToast('Контактная информация обновлена', 'success')
                }}
                className="px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Сохранить
              </button>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe size={24} />
              Социальные сети
            </h2>
            <div className="space-y-4">
              {footerContent.socialLinks.map((social) => (
                <div key={social.id} className="p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Название</label>
                      <input
                        type="text"
                        value={social.name}
                        onChange={(e) => updateSocialLink(social.id, { name: e.target.value })}
                        className="w-full px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Ссылка</label>
                      <input
                        type="url"
                        value={social.href}
                        onChange={(e) => updateSocialLink(social.id, { href: e.target.value })}
                        className="w-full px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors text-sm"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Иконка (эмодзи или текст)</label>
                      <input
                        type="text"
                        value={social.icon}
                        onChange={(e) => updateSocialLink(social.id, { icon: e.target.value })}
                        className="w-full px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors text-sm"
                        placeholder="💬 или VK"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Legal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Юридическая информация</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Текст ссылки на политику конфиденциальности</label>
                <input
                  type="text"
                  value={legalForm.privacyPolicyText}
                  onChange={(e) => setLegalForm({ ...legalForm, privacyPolicyText: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="Политика конфиденциальности"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">ОГРН</label>
                <input
                  type="text"
                  value={legalForm.ogrn}
                  onChange={(e) => setLegalForm({ ...legalForm, ogrn: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="1234567890123"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Название компании / ИП</label>
                <input
                  type="text"
                  value={legalForm.companyName}
                  onChange={(e) => setLegalForm({ ...legalForm, companyName: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="ИП Иванов Иван Иванович"
                />
              </div>
              <button
                onClick={() => {
                  updateLegalInfo(legalForm)
                  addToast('Юридическая информация обновлена', 'success')
                }}
                className="px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Сохранить
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'pages' && (
        <PageEditorSection
          pages={pages}
          updatePage={updatePage}
          addToast={addToast}
          pageCustomData={pageCustomData}
          updatePageCustomData={updatePageCustomData}
          pageBlocks={pageBlocks}
          updatePageBlocks={updatePageBlocks}
          togglePageBlock={togglePageBlock}
        />
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Настройки дизайна</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Основной цвет</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={designSettings.primaryColor}
                    onChange={(e) => updateDesignSettings({ primaryColor: e.target.value })}
                    className="w-20 h-12 rounded-lg border border-neon-cyan/30 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designSettings.primaryColor}
                    onChange={(e) => updateDesignSettings({ primaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="#00f2ff"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Цвет текста</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={designSettings.textColor}
                    onChange={(e) => updateDesignSettings({ textColor: e.target.value })}
                    className="w-20 h-12 rounded-lg border border-neon-cyan/30 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={designSettings.textColor}
                    onChange={(e) => updateDesignSettings({ textColor: e.target.value })}
                    className="flex-1 px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Текст логотипа</label>
                <input
                  type="text"
                  value={designSettings.logoText}
                  onChange={(e) => updateDesignSettings({ logoText: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors mb-4"
                  placeholder="Капсульные дома"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Изображение логотипа (URL или загрузите файл)</label>
                <div className="space-y-4">
                  {designSettings.logoImage && (
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-neon-cyan/30 bg-black/30 flex items-center justify-center">
                      {(designSettings.logoImage.startsWith('data:') || designSettings.logoImage.startsWith('http') || designSettings.logoImage.startsWith('/')) ? (
                        <img
                          src={designSettings.logoImage}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">Предпросмотр</span>
                      )}
                    </div>
                  )}
                  <input
                    type="text"
                    value={designSettings.logoImage}
                    onChange={(e) => updateDesignSettings({ logoImage: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="URL логотипа (например: /logo.svg)"
                  />
                  <label className="flex items-center justify-center gap-2 px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-gray-300 hover:border-neon-cyan hover:text-neon-cyan transition-all cursor-pointer">
                    <Image size={18} />
                    <span>Загрузить логотип</span>
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
                            updateDesignSettings({ logoImage: result })
                            addToast('Логотип загружен', 'success')
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                  <p className="text-xs text-gray-500">
                    Поддерживаются форматы: SVG, PNG, JPG. Рекомендуемый размер: 120×40px
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Номер телефона (отображается в шапке сайта)
                </label>
                <input
                  type="tel"
                  value={designSettings.phoneNumber || ''}
                  onChange={(e) => updateDesignSettings({ phoneNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="+7 (999) 123-45-67"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Номер будет отображаться в шапке сайта рядом с иконкой телефона
                </p>
              </div>
              <button
                onClick={() => {
                  addToast('Настройки дизайна сохранены', 'success')
                }}
                className="px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Сохранить
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Homepage Blocks Tab */}
      {activeTab === 'homepage' && (
        <div className="space-y-6">
          {/* Hero Content Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Главный экран (Hero)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Заголовок</label>
                <input
                  type="text"
                  value={heroContent.title}
                  onChange={(e) => updateHeroContent({ title: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Подзаголовок</label>
                <textarea
                  value={heroContent.subtitle}
                  onChange={(e) => updateHeroContent({ subtitle: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Текст кнопки</label>
                <input
                  type="text"
                  value={heroContent.ctaText}
                  onChange={(e) => updateHeroContent({ ctaText: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
              <button
                onClick={() => addToast('Hero обновлен', 'success')}
                className="px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Сохранить
              </button>
            </div>
          </motion.div>

          {/* Blocks Order & Visibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Управление блоками главной страницы</h2>
            <p className="text-gray-400 mb-6 text-sm">Перетащите блоки для изменения порядка. Отключите ненужные блоки.</p>
            
            <div className="space-y-3">
              {[...homePageBlocks].sort((a, b) => a.order - b.order).map((block) => {
                const blockNames: Record<string, string> = {
                  hero: 'Главный экран',
                  steps: 'Шаги реализации',
                  advantages: 'Преимущества',
                  bestSellers: 'Хиты продаж',
                  consultation: 'Форма консультации',
                  reviews: 'Отзывы',
                }
                
                return (
                  <motion.div
                    key={block.id}
                    className="flex items-center gap-4 p-4 bg-black/30 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all"
                  >
                    <GripVertical size={20} className="text-gray-500 cursor-move" />
                    <div className="flex-1">
                      <div className="text-white font-medium">{blockNames[block.type] || block.type}</div>
                      <div className="text-xs text-gray-400">Порядок: {block.order + 1}</div>
                    </div>
                    <button
                      onClick={() => {
                        toggleBlock(block.id, !block.enabled)
                        addToast(`${blockNames[block.type]} ${block.enabled ? 'скрыт' : 'показан'}`, 'info')
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        block.enabled
                          ? 'text-green-400 hover:bg-green-400/20'
                          : 'text-gray-500 hover:bg-gray-500/20'
                      }`}
                    >
                      {block.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </motion.div>
                )
              })}
            </div>
            
            <div className="mt-6 p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
              <p className="text-sm text-gray-400">
                💡 Порядок блоков обновляется автоматически. Включенные блоки отображаются на главной странице.
              </p>
            </div>
          </motion.div>

          {/* Advantages Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Преимущества</h2>
            <div className="space-y-4">
              {advantages.map((advantage, index) => (
                <div key={advantage.id} className="p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Название иконки (Lucide)</label>
                      <input
                        type="text"
                        value={advantage.icon}
                        onChange={(e) => {
                          const newAdvantages = [...advantages]
                          newAdvantages[index] = { ...advantage, icon: e.target.value }
                          updateAdvantages(newAdvantages)
                        }}
                        className="w-full px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                        placeholder="Zap"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Заголовок</label>
                      <input
                        type="text"
                        value={advantage.title}
                        onChange={(e) => {
                          const newAdvantages = [...advantages]
                          newAdvantages[index] = { ...advantage, title: e.target.value }
                          updateAdvantages(newAdvantages)
                        }}
                        className="w-full px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Описание</label>
                      <input
                        type="text"
                        value={advantage.description}
                        onChange={(e) => {
                          const newAdvantages = [...advantages]
                          newAdvantages[index] = { ...advantage, description: e.target.value }
                          updateAdvantages(newAdvantages)
                        }}
                        className="w-full px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white text-sm focus:outline-none focus:border-neon-cyan transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addToast('Преимущества обновлены', 'success')}
                className="px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all flex items-center gap-2"
              >
                <Save size={20} />
                Сохранить
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
