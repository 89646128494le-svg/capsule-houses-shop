'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone } from 'lucide-react'
import { useState } from 'react'
import { useToastStore } from '@/store/toastStore'

interface CallbackModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CallbackModal({ isOpen, onClose }: CallbackModalProps) {
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
    
    // Отправка через API route (безопасно, API ключи на сервере)
    try {
      const response = await fetch('/api/send-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        addToast('Заявка принята! Мы свяжемся с вами в ближайшее время.', 'success')
      } else {
        addToast('Заявка принята, но произошла ошибка при отправке. Мы свяжемся с вами.', 'warning')
      }
    } catch (error) {
      addToast('Заявка принята, но произошла ошибка при отправке. Мы свяжемся с вами.', 'warning')
    }
    setFormData({ name: '', phone: '' })
    setErrors({ name: '', phone: '' })
    setIsSubmitting(false)
    onClose()
  }

  const handleChange = (field: 'name' | 'phone', value: string) => {
    setFormData({ ...formData, [field]: value })
    // Очищаем ошибку при вводе
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto pointer-events-none"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md my-auto pointer-events-auto"
            >
            <div className="glassmorphism rounded-2xl p-6 sm:p-8 w-full border-2 border-neon-cyan/50 relative bg-black/40 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                aria-label="Закрыть"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                  <Phone size={24} className="text-neon-cyan" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gradient">Заказать звонок</h2>
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
        </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
