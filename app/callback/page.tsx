'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToastStore } from '@/store/toastStore'
import { sendCallbackEmail } from '@/lib/email'
import { sendSMS, formatCallbackSMS } from '@/lib/sms'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CallbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const addToast = useToastStore((state) => state.addToast)
  const router = useRouter()

  const validateForm = () => {
    const newErrors = {
      name: '',
      phone: '',
    }

    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно для заполнения'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа'
    }

    // Валидация телефона
    if (!formData.phone.trim()) {
      newErrors.phone = 'Телефон обязательно для заполнения'
    } else {
      // Простая валидация телефона (российский формат)
      const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
      const cleanedPhone = formData.phone.replace(/\s|-|\(|\)/g, '')
      if (!phoneRegex.test(cleanedPhone) && cleanedPhone.length < 10) {
        newErrors.phone = 'Введите корректный номер телефона'
      }
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.phone
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    // Отправка Email администратору
    const emailSent = await sendCallbackEmail({
      name: formData.name,
      phone: formData.phone,
    })
    
    // Отправка SMS администратору
    // TODO: Замените на реальный номер администратора
    const adminPhone = process.env.ADMIN_PHONE || '+79991234567'
    await sendSMS({
      to: adminPhone,
      message: formatCallbackSMS({
        name: formData.name,
        phone: formData.phone,
      }),
    })
    
    if (emailSent) {
      addToast('Заявка принята! Мы свяжемся с вами в ближайшее время.', 'success')
      setFormData({ name: '', phone: '' })
      setErrors({ name: '', phone: '' })
      // Перенаправление на главную через 2 секунды
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } else {
      addToast('Заявка принята, но произошла ошибка при отправке. Мы свяжемся с вами.', 'warning')
    }
    
    setIsSubmitting(false)
  }

  const handleChange = (field: 'name' | 'phone', value: string) => {
    setFormData({ ...formData, [field]: value })
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <main className="min-h-screen pt-20">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Вернуться на главную</span>
          </Link>

          {/* Form Card */}
          <div className="glassmorphism rounded-2xl p-6 sm:p-8 w-full border-2 border-neon-cyan/50 relative bg-black/40 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                <Phone size={24} className="text-neon-cyan" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Заказать звонок</h1>
                <p className="text-gray-400 text-sm">Мы свяжемся с вами в удобное время</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 font-medium mb-2">
                  Имя <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-3 bg-black/70 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/50'
                      : 'border-neon-cyan/50 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50'
                  }`}
                  placeholder="Ваше имя"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 font-medium mb-2">
                  Телефон <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={`w-full px-4 py-3 bg-black/70 border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.phone
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/50'
                      : 'border-neon-cyan/50 focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50'
                  }`}
                  placeholder="+7 (999) 123-45-67"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg neon-button-glow hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
