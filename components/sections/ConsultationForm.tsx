'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    agree: false,
  })
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    agree: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addToast = useToastStore((state) => state.addToast)

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
      agree: '',
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Минимум 2 символа'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязателен'
    } else {
      const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
      const cleanedPhone = formData.phone.replace(/\s|-|\(|\)/g, '')
      if (!phoneRegex.test(cleanedPhone) && cleanedPhone.length < 10) {
        newErrors.phone = 'Введите корректный номер'
      }
    }

    if (!formData.agree) {
      newErrors.agree = 'Необходимо согласие'
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.phone && !newErrors.agree
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Отправка через API route (безопасно, API ключи на сервере)
    try {
      const response = await fetch('/api/send-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
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
    
    setFormData({ name: '', phone: '', agree: false })
    setErrors({ name: '', phone: '', agree: '' })
    setIsSubmitting(false)
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/30">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-neon-cyan" />
              </div>
              <h2 className="text-3xl font-bold text-gradient mb-2">
                Получите консультацию
              </h2>
              <p className="text-gray-400">
                Оставьте заявку, и наш специалист свяжется с вами
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: '' })
                  }}
                  className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-neon-cyan/30 focus:border-neon-cyan'
                  }`}
                  placeholder="Ваше имя"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    if (errors.phone) setErrors({ ...errors, phone: '' })
                  }}
                  className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.phone
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-neon-cyan/30 focus:border-neon-cyan'
                  }`}
                  placeholder="+7 (999) 123-45-67"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => {
                      setFormData({ ...formData, agree: e.target.checked })
                      if (errors.agree) setErrors({ ...errors, agree: '' })
                    }}
                    className="mt-1 w-5 h-5 rounded border-neon-cyan/30 bg-black/50 text-neon-cyan focus:ring-neon-cyan focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400">
                    Я согласен на обработку персональных данных
                  </span>
                </label>
                {errors.agree && (
                  <p className="mt-1 text-sm text-red-400">{errors.agree}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg neon-button-glow hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>Отправка...</>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Отправить заявку
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
