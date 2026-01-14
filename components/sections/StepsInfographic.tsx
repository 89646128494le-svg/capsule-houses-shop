'use client'

import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Wrench, 
  Truck, 
  Hammer, 
  Home, 
  CheckCircle,
  ArrowRight 
} from 'lucide-react'

const steps = [
  {
    id: 1,
    icon: ShoppingCart,
    title: 'Оформление заказа',
    description: 'Выберите модель и комплектацию, оформите заказ онлайн или через менеджера',
    color: 'from-neon-cyan to-neon-cyan-dark',
  },
  {
    id: 2,
    icon: Wrench,
    title: 'Проектирование',
    description: 'Наши инженеры разработают индивидуальный проект с учётом ваших требований',
    color: 'from-neon-cyan-dark to-blue-600',
  },
  {
    id: 3,
    icon: Hammer,
    title: 'Производство',
    description: 'Изготовление модулей на современном производстве с контролем качества',
    color: 'from-blue-600 to-purple-600',
  },
  {
    id: 4,
    icon: Truck,
    title: 'Доставка',
    description: 'Быстрая и безопасная доставка до вашего участка в удобное время',
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 5,
    icon: Home,
    title: 'Сборка',
    description: 'Профессиональная сборка нашими специалистами за 1-3 дня',
    color: 'from-pink-600 to-red-500',
  },
  {
    id: 6,
    icon: CheckCircle,
    title: 'Эксплуатация',
    description: 'Готовый дом с гарантией и полным пакетом документов',
    color: 'from-red-500 to-orange-500',
  },
]

export default function StepsInfographic() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Шаги реализации</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            От заказа до заселения — простой и прозрачный процесс
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="glassmorphism-light rounded-2xl p-6 h-full border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center text-deep-dark font-bold text-lg`}>
                      {step.id}
                    </div>
                    <ArrowRight 
                      size={20} 
                      className="text-gray-500 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" 
                    />
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} className="text-deep-dark" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover Effect Line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Connection Line (Desktop) */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent -z-10" 
          style={{ transform: 'translateY(-50%)' }}
        />
      </div>
    </section>
  )
}
