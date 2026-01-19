'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useToastStore } from '@/store/toastStore'
import { useContentStore } from '@/store/contentStore'

export default function ContactsContent() {
  const footerContent = useContentStore((state) => state.footerContent)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addToast = useToastStore((state) => state.addToast)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Отправка через API route (безопасно, API ключи на сервере)
    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        addToast('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success')
      } else {
        addToast('Ошибка отправки. Попробуйте позже.', 'error')
      }
    } catch (error) {
      addToast('Ошибка отправки. Попробуйте позже.', 'error')
    }
    
    setFormData({ name: '', email: '', phone: '', message: '' })
    setIsSubmitting(false)
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Контакты</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Свяжитесь с нами любым удобным способом
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                  <Phone size={24} className="text-neon-cyan" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Телефон</div>
                  <a href={`tel:${footerContent.contacts.phone.replace(/\s/g, '')}`} className="text-white hover:text-neon-cyan transition-colors">
                    {footerContent.contacts.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                  <Mail size={24} className="text-neon-cyan" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Email</div>
                  <a href={`mailto:${footerContent.contacts.email}`} className="text-white hover:text-neon-cyan transition-colors">
                    {footerContent.contacts.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-neon-cyan" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-2">Адрес</div>
                  <div className="text-white whitespace-pre-line">
                    {footerContent.contacts.address}
                  </div>
                </div>
              </div>
            </div>

            {/* Messengers */}
            <div className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20">
              <div className="text-gray-400 text-sm mb-4">Мессенджеры</div>
              <div className="flex gap-4 flex-wrap">
                {footerContent.socialLinks.map((link) => {
                  if (link.id === 'whatsapp' || link.id === 'telegram') {
                    return (
                      <a
                        key={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
                          link.id === 'whatsapp'
                            ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                            : 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
                        }`}
                      >
                        <MessageCircle size={20} />
                        {link.name}
                      </a>
                    )
                  }
                  return null
                })}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20 aspect-video flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-gray-600 mb-2" />
                <p className="text-gray-400">Карта (Yandex/Google Maps)</p>
                <p className="text-sm text-gray-500 mt-2">Интеграция карты будет добавлена</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20">
              <h2 className="text-2xl font-bold text-white mb-6">Напишите нам</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                    placeholder="Телефон"
                  />
                </div>
                <div>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                    placeholder="Ваше сообщение"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg neon-button-glow hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
