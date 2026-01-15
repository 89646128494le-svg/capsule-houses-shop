'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Leaf, Wrench, TrendingUp, Home } from 'lucide-react'

export default function AboutContent() {
  const innovations = [
    {
      icon: Zap,
      title: 'Инновационные технологии',
      description: 'Использование современных материалов и технологий производства для создания долговечных и энергоэффективных домов.',
    },
    {
      icon: Shield,
      title: 'Высокое качество',
      description: 'Строгий контроль качества на всех этапах производства. Гарантия на все материалы и работы.',
    },
    {
      icon: Leaf,
      title: 'Экологичность',
      description: 'Использование экологически чистых материалов, безопасных для здоровья человека и окружающей среды.',
    },
    {
      icon: Wrench,
      title: 'Простота монтажа',
      description: 'Модульная конструкция позволяет собрать дом за 1-3 дня без специальных навыков и сложного оборудования.',
    },
  ]

  const materials = [
    {
      name: 'Каркас',
      description: 'Прочный алюминиевый каркас с антикоррозийным покрытием',
      icon: '🏗️',
    },
    {
      name: 'Утепление',
      description: 'Эковата и современные теплоизоляционные материалы',
      icon: '🧱',
    },
    {
      name: 'Умный замок',
      description: 'Система умного дома с управлением через смартфон',
      icon: '🔐',
    },
  ]

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">О продукте</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Инновационные капсульные дома — это будущее комфортного и экологичного жилья. 
            Мы создаем дома нового поколения с использованием передовых технологий.
          </p>
        </motion.div>

        {/* Innovations */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Наши инновации
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {innovations.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-cyan-dark flex items-center justify-center mb-6">
                    <Icon size={28} className="text-deep-dark" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Materials Infographic */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Материалы и комплектация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {materials.map((material, index) => (
              <motion.div
                key={material.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20 text-center"
              >
                <div className="text-6xl mb-4">{material.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-4">{material.name}</h3>
                <p className="text-gray-400">{material.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gallery Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Реализованные проекты
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-video rounded-2xl bg-gradient-to-br from-deep-dark to-black border border-neon-cyan/30 flex items-center justify-center"
              >
                <div className="text-center">
                  <Home size={48} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500">Фото проекта {i}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
