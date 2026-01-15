'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Edit, FileText } from 'lucide-react'
import { useContentStore } from '@/store/contentStore'
import { useToastStore } from '@/store/toastStore'

export default function PagesManagement() {
  const pages = useContentStore((state) => state.pages)
  const updatePage = useContentStore((state) => state.updatePage)
  const addToast = useToastStore((state) => state.addToast)
  
  const [editingPage, setEditingPage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const handleEdit = (page: typeof pages[0]) => {
    setEditingPage(page.slug)
    setEditContent(page.content)
  }

  const handleSave = () => {
    if (!editingPage) return
    
    updatePage(editingPage, { content: editContent })
    addToast('Страница обновлена', 'success')
    setEditingPage(null)
    setEditContent('')
  }

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
              {editingPage !== page.slug ? (
                <button
                  onClick={() => handleEdit(page)}
                  className="flex items-center gap-2 px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all"
                >
                  <Edit size={18} />
                  Редактировать
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(0,242,255,0.5)] transition-all"
                  >
                    <Save size={18} />
                    Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setEditingPage(null)
                      setEditContent('')
                    }}
                    className="px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all"
                  >
                    Отмена
                  </button>
                </div>
              )}
            </div>

            {editingPage === page.slug ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none font-mono text-sm"
              />
            ) : (
              <div className="p-4 bg-black/30 rounded-lg border border-neon-cyan/10">
                <p className="text-gray-300 whitespace-pre-wrap">{page.content}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
