'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useContentStore } from '@/store/contentStore'

export default function Reviews() {
  const reviews = useContentStore((state) => state.reviews.filter((r) => r.approved))

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
            <span className="text-gradient">Отзывы клиентов</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Что говорят наши клиенты о капсульных домах
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote size={32} className="text-neon-cyan/50" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {review.text}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between pt-4 border-t border-neon-cyan/20">
                <div>
                  <div className="text-white font-semibold">{review.author}</div>
                  {review.location && (
                    <div className="text-sm text-gray-400">{review.location}</div>
                  )}
                </div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
