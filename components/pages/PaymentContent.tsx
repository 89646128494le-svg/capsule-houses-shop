'use client'

import { motion } from 'framer-motion'
import { CreditCard, Calendar, Truck, Wrench, CheckCircle } from 'lucide-react'

export default function PaymentContent() {
  const stages = [
    {
      icon: CreditCard,
      title: 'Предоплата',
      description: '30% от стоимости при оформлении заказа',
      time: 'Сразу',
    },
    {
      icon: Calendar,
      title: 'Производство',
      description: 'Изготовление модулей на производстве',
      time: '2-3 недели',
    },
    {
      icon: Truck,
      title: 'Доставка',
      description: 'Доставка до вашего участка',
      time: '1-3 дня',
    },
    {
      icon: Wrench,
      title: 'Сборка',
      description: 'Профессиональная сборка нашими специалистами',
      time: '1-3 дня',
    },
  ]

  const paymentMethods = [
    { name: 'Банковские карты', icon: '💳' },
    { name: 'Рассрочка', icon: '📅' },
    { name: 'СБП (Система быстрых платежей)', icon: '📱' },
    { name: 'Банковский перевод', icon: '🏦' },
  ]

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
            <span className="text-gradient">Оплата и доставка</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Прозрачные условия оплаты и быстрая доставка по всей России
          </p>
        </motion.div>

        {/* Stages */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Этапы работы
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20 text-center"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-cyan-dark flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-deep-dark" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{stage.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{stage.description}</p>
                  <div className="inline-block px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm font-medium">
                    {stage.time}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Способы оплаты
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method, index) => (
              <div
                key={method.name}
                className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20 flex items-center gap-4"
              >
                <div className="text-4xl">{method.icon}</div>
                <div className="text-white font-medium">{method.name}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20">
            <h2 className="text-2xl font-bold text-white mb-6">Доставка</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium mb-1">По всей России</div>
                  <div className="text-gray-400 text-sm">
                    Доставка осуществляется транспортными компаниями до вашего города
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium mb-1">Самовывоз</div>
                  <div className="text-gray-400 text-sm">
                    Возможен самовывоз с нашего склада в Москве
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <div className="text-white font-medium mb-1">Сборка включена</div>
                  <div className="text-gray-400 text-sm">
                    Профессиональная сборка нашими специалистами входит в стоимость
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
