'use client'

import { motion } from 'framer-motion'
import { Handshake, TrendingUp, Users, Award, Mail, LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useToastStore } from '@/store/toastStore'
import { useContentStore } from '@/store/contentStore'

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Users,
  Award,
}

export default function PartnersContent() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    phone: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addToast = useToastStore((state) => state.addToast)
  const pageData = useContentStore((state) => state.pageCustomData.partners)

  const benefits = pageData?.benefits || []
  const requirements = pageData?.requirements || []
  const heroTitle = pageData?.heroTitle || 'Партнёрам'
  const heroSubtitle = pageData?.heroSubtitle || 'Станьте нашим партнером и получите выгодные условия сотрудничества.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Отправка через API route (безопасно, API ключи на сервере)
    try {
      const response = await fetch('/api/send-partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: formData.company,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        addToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success')
      } else {
        addToast('Ошибка отправки. Попробуйте позже.', 'error')
      }
    } catch (error) {
      addToast('Ошибка отправки. Попробуйте позже.', 'error')
    }
    
    setFormData({ company: '', name: '', phone: '', email: '' })
    setIsSubmitting(false)
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-6">
            <Handshake size={40} className="text-neon-cyan" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">{heroTitle}</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = (benefit.icon && iconMap[benefit.icon]) || TrendingUp
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20 text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-cyan-dark flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-deep-dark" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Partner Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Стать партнёром</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                placeholder="Название компании"
              />
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                  placeholder="Email"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg neon-button-glow hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
