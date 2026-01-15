'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, Edit, Save, Plus, Trash2, CheckCircle, XCircle, Video, X, Phone, Mail, MapPin, Globe } from 'lucide-react'
import { useContentStore, Review, Promotion } from '@/store/contentStore'
import { useToastStore } from '@/store/toastStore'

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<'reviews' | 'promotions' | 'contacts'>('reviews')
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
    </div>
  )
}
