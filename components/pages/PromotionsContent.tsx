'use client'

import { motion } from 'framer-motion'
import { Percent, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useContentStore } from '@/store/contentStore'

export default function PromotionsContent() {
  const promotions = useContentStore((state) => state.promotions.filter((p) => p.active))

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
            <span className="text-gradient">Акции</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Специальные предложения и выгодные условия для наших клиентов
          </p>
        </motion.div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassmorphism-light rounded-2xl overflow-hidden border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300 group"
            >
              {/* Image/Icon */}
              <div className="aspect-video bg-gradient-to-br from-deep-dark to-black flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl z-10">{promo.image}</div>
                <div className="absolute top-4 right-4">
                  <div className="px-4 py-2 bg-neon-cyan text-deep-dark rounded-full font-bold text-lg">
                    {promo.discount}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-neon-cyan transition-colors">
                  {promo.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{promo.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-neon-cyan/20">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar size={16} />
                    <span>До {promo.validUntil}</span>
                  </div>
                  <Link
                    href="/catalog"
                    className="flex items-center gap-2 text-neon-cyan hover:text-neon-cyan-light transition-colors text-sm font-medium"
                  >
                    Подробнее
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
