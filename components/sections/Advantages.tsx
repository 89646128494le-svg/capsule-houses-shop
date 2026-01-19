'use client'

import { motion } from 'framer-motion'
import { Zap, Shield, Clock, Leaf, Wrench, TrendingUp, LucideIcon } from 'lucide-react'
import { useContentStore } from '@/store/contentStore'

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Shield,
  Clock,
  Leaf,
  Wrench,
  TrendingUp,
}

export default function Advantages() {
  const advantages = useContentStore((state) => state.advantages)
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
            <span className="text-gradient">Преимущества</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Почему выбирают наши капсульные дома
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {advantages.map((advantage, index) => {
            const Icon = iconMap[advantage.icon] || Zap
            return (
              <motion.div
                key={advantage.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="glassmorphism-light rounded-2xl p-6 h-full border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${advantage.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
