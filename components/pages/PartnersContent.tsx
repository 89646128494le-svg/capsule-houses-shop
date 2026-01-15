'use client'

import { motion } from 'framer-motion'
import { Handshake, TrendingUp, Users, Award, Mail } from 'lucide-react'
import { useState } from 'react'
import { useToastStore } from '@/store/toastStore'
import { sendEmail } from '@/lib/email'

export default function PartnersContent() {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    phone: '',
    email: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addToast = useToastStore((state) => state.addToast)

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Выгодные условия',
      description: 'Специальные цены и условия для партнёров',
    },
    {
      icon: Users,
      title: 'Поддержка',
      description: 'Персональный менеджер и техническая поддержка',
    },
    {
      icon: Award,
      title: 'Обучение',
      description: 'Обучение ваших специалистов работе с продукцией',
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Отправка на Email
    const emailSent = await sendEmail({
      to: 'partners@capsulehouses.ru', // Замените на реальный email
      subject: 'Новая заявка на партнёрство',
      body: `Компания: ${formData.company}\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nEmail: ${formData.email}`,
    })
    
    if (emailSent) {
      addToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время.', 'success')
    } else {
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
            <span className="text-gradient">Партнёрам</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Станьте нашим партнёром и получите выгодные условия сотрудничества
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
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
