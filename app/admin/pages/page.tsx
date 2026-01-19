'use client'

import { motion } from 'framer-motion'
import { Edit, FileText } from 'lucide-react'
import { useContentStore } from '@/store/contentStore'
import Link from 'next/link'

export default function PagesManagement() {
  const pages = useContentStore((state) => state.pages)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Управление страницами</h1>
        <p className="text-gray-400">Редактирование контента страниц сайта</p>
      </div>

      <div className="grid gap-6">
        {pages.map((page) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText size={24} className="text-neon-cyan" />
                <div>
                  <h3 className="text-xl font-semibold text-white">{page.title}</h3>
                  <p className="text-sm text-gray-400">{page.slug}</p>
                </div>
              </div>
              <Link
                href={`/admin/pages/${page.slug.replace('/', '')}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all"
              >
                <Edit size={18} />
                Редактировать
              </Link>
            </div>

            <div className="p-4 bg-black/30 rounded-lg border border-neon-cyan/10">
              <p className="text-gray-300 whitespace-pre-wrap">{page.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
