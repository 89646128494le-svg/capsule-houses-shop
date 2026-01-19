'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, ArrowLeft, GripVertical, Plus, Trash2, Eye, EyeOff, Move, X } from 'lucide-react'
import { useContentStore, PageContent, PageBlock, PageCustomData } from '@/store/contentStore'
import { useToastStore } from '@/store/toastStore'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

interface DraggableItem {
  id: string
  type: string
  enabled: boolean
  order: number
  config: Record<string, any>
}

export default function PageEditor() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const pageSlug = `/${slug}`
  
  const pages = useContentStore((state) => state.pages)
  const pageBlocks = useContentStore((state) => state.pageBlocks)
  const pageCustomData = useContentStore((state) => state.pageCustomData)
  const updatePage = useContentStore((state) => state.updatePage)
  const updatePageBlocks = useContentStore((state) => state.updatePageBlocks)
  const updatePageCustomData = useContentStore((state) => state.updatePageCustomData)
  const togglePageBlock = useContentStore((state) => state.togglePageBlock)
  const addToast = useToastStore((state) => state.addToast)

  const page = pages.find((p) => p.slug === pageSlug)
  
  const [pageData, setPageData] = useState<Partial<PageContent>>({
    title: page?.title || '',
    content: page?.content || '',
  })
  
  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [customData, setCustomData] = useState<any>({})
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)

  useEffect(() => {
    if (page) {
      setPageData({ title: page.title, content: page.content })
    }
    if (pageBlocks[pageSlug]) {
      setBlocks([...pageBlocks[pageSlug]].sort((a, b) => a.order - b.order))
    }
    if (pageCustomData[slug as keyof PageCustomData]) {
      setCustomData(pageCustomData[slug as keyof PageCustomData] || {})
    }
  }, [page, pageSlug, slug, pageBlocks, pageCustomData])

  const handleSave = () => {
    if (!page) return
    
    updatePage(pageSlug, pageData)
    updatePageBlocks(pageSlug, blocks)
    // Используем slug без слеша для pageCustomData, так как в store ключи без слеша
    updatePageCustomData(slug as keyof PageCustomData, customData)
    addToast('Страница успешно сохранена', 'success')
    router.push('/admin/pages')
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedItem(blockId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = blocks.findIndex((b) => b.id === draggedItem)
    const targetIndex = blocks.findIndex((b) => b.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newBlocks = [...blocks]
    const [removed] = newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(targetIndex, 0, removed)

    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index,
    }))

    setBlocks(reorderedBlocks)
    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const toggleBlockVisibility = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (block) {
      togglePageBlock(pageSlug, blockId, !block.enabled)
      setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, enabled: !b.enabled } : b)))
    }
  }

  const updateBlockConfig = (blockId: string, config: Record<string, any>) => {
    setBlocks(blocks.map((b) => (b.id === blockId ? { ...b, config: { ...b.config, ...config } } : b)))
  }

  const updateCustomDataField = (field: string, value: any) => {
    setCustomData({ ...customData, [field]: value })
  }

  const addArrayItem = (field: string, defaultItem: any) => {
    const currentArray = customData[field] || []
    setCustomData({
      ...customData,
      [field]: [...currentArray, { ...defaultItem, id: Date.now().toString() }],
    })
  }

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = customData[field] || []
    setCustomData({
      ...customData,
      [field]: currentArray.filter((_: any, i: number) => i !== index),
    })
  }

  const updateArrayItem = (field: string, index: number, updates: any) => {
    const currentArray = customData[field] || []
    setCustomData({
      ...customData,
      [field]: currentArray.map((item: any, i: number) => (i === index ? { ...item, ...updates } : item)),
    })
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Страница не найдена</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-2 hover:bg-neon-cyan/20 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-neon-cyan" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Редактирование страницы</h1>
            <p className="text-gray-400">{page.title}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all"
        >
          <Save size={20} />
          Сохранить изменения
        </button>
      </div>

      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Основная информация</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Заголовок страницы</label>
            <input
              type="text"
              value={pageData.title || ''}
              onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
              className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Описание</label>
            <textarea
              value={pageData.content || ''}
              onChange={(e) => setPageData({ ...pageData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Главный экран (Hero)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Заголовок Hero</label>
            <input
              type="text"
              value={customData.heroTitle || ''}
              onChange={(e) => updateCustomDataField('heroTitle', e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Подзаголовок Hero</label>
            <textarea
              value={customData.heroSubtitle || ''}
              onChange={(e) => updateCustomDataField('heroSubtitle', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors resize-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Blocks Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Управление блоками</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Перетащите блоки для изменения порядка. Используйте переключатель для показа/скрытия блоков.
        </p>

        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, block.id)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-4 p-4 bg-black/30 rounded-lg border transition-all ${
                draggedItem === block.id
                  ? 'border-neon-cyan opacity-50'
                  : 'border-neon-cyan/20 hover:border-neon-cyan/50'
              } ${!block.enabled ? 'opacity-50' : ''}`}
            >
              <GripVertical size={20} className="text-gray-500 cursor-move" />
              <div className="flex-1">
                <div className="text-white font-medium capitalize">{block.type}</div>
                <div className="text-xs text-gray-400">Порядок: {block.order + 1}</div>
              </div>
              <button
                onClick={() => toggleBlockVisibility(block.id)}
                className={`p-2 rounded-lg transition-colors ${
                  block.enabled
                    ? 'text-green-400 hover:bg-green-400/20'
                    : 'text-gray-500 hover:bg-gray-500/20'
                }`}
                title={block.enabled ? 'Скрыть блок' : 'Показать блок'}
              >
                {block.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              <button
                onClick={() => setEditingBlock(editingBlock === block.id ? null : block.id)}
                className="p-2 text-neon-cyan hover:bg-neon-cyan/20 rounded-lg transition-colors"
                title="Редактировать блок"
              >
                <Move size={20} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dynamic Content Editors based on page type */}
      {slug === 'about' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Инновации</h2>
          <div className="space-y-4">
            {(customData.innovations || []).map((item: any, index: number) => (
              <div key={item.id} className="p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Инновация {index + 1}</span>
                  <button
                    onClick={() => removeArrayItem('innovations', index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={item.icon || ''}
                    onChange={(e) => updateArrayItem('innovations', index, { icon: e.target.value })}
                    className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                    placeholder="Иконка"
                  />
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => updateArrayItem('innovations', index, { title: e.target.value })}
                    className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                    placeholder="Заголовок"
                  />
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => updateArrayItem('innovations', index, { description: e.target.value })}
                    className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                    placeholder="Описание"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('innovations', { icon: '', title: '', description: '' })}
              className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
            >
              <Plus size={16} />
              Добавить инновацию
            </button>
          </div>
        </motion.div>
      )}

      {slug === 'equipment' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Базовая комплектация</h2>
            <div className="space-y-4">
              {(customData.baseEquipment || []).map((item: any, index: number) => (
                <div key={item.id} className="flex items-center gap-3 p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                  <input
                    type="checkbox"
                    checked={item.included || false}
                    onChange={(e) => updateArrayItem('baseEquipment', index, { included: e.target.checked })}
                    className="w-4 h-4 text-neon-cyan"
                  />
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => updateArrayItem('baseEquipment', index, { name: e.target.value })}
                    className="flex-1 px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                    placeholder="Название"
                  />
                  <button
                    onClick={() => removeArrayItem('baseEquipment', index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('baseEquipment', { name: '', included: true })}
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                <Plus size={16} />
                Добавить элемент
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Дополнительные опции</h2>
            <div className="space-y-4">
              {(customData.additionalOptions || []).map((item: any, index: number) => (
                <div key={item.id} className="p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Опция {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('additionalOptions', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => updateArrayItem('additionalOptions', index, { name: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Название"
                    />
                    <input
                      type="number"
                      value={item.price || 0}
                      onChange={(e) => updateArrayItem('additionalOptions', index, { price: parseInt(e.target.value) || 0 })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Цена"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('additionalOptions', { name: '', price: 0 })}
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                <Plus size={16} />
                Добавить опцию
              </button>
            </div>
          </motion.div>
        </>
      )}

      {slug === 'payment' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Этапы оплаты</h2>
            <div className="space-y-4">
              {(customData.stages || []).map((item: any, index: number) => (
                <div key={item.id} className="p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Этап {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('stages', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={item.icon || ''}
                      onChange={(e) => updateArrayItem('stages', index, { icon: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Иконка"
                    />
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateArrayItem('stages', index, { title: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Заголовок"
                    />
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => updateArrayItem('stages', index, { description: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Описание"
                    />
                    <input
                      type="text"
                      value={item.time || ''}
                      onChange={(e) => updateArrayItem('stages', index, { time: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Время"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('stages', { icon: '', title: '', description: '', time: '' })}
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                <Plus size={16} />
                Добавить этап
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Способы оплаты</h2>
            <div className="space-y-4">
              {(customData.paymentMethods || []).map((item: any, index: number) => (
                <div key={item.id} className="p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Способ {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('paymentMethods', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => updateArrayItem('paymentMethods', index, { name: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Название"
                    />
                    <input
                      type="text"
                      value={item.icon || ''}
                      onChange={(e) => updateArrayItem('paymentMethods', index, { icon: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Иконка"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('paymentMethods', { name: '', icon: '💳' })}
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                <Plus size={16} />
                Добавить способ оплаты
              </button>
            </div>
          </motion.div>
        </>
      )}

      {slug === 'partners' && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Преимущества</h2>
            <div className="space-y-4">
              {(customData.benefits || []).map((item: any, index: number) => (
                <div key={item.id} className="p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">Преимущество {index + 1}</span>
                    <button
                      onClick={() => removeArrayItem('benefits', index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={item.icon || ''}
                      onChange={(e) => updateArrayItem('benefits', index, { icon: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Иконка (Lucide)"
                    />
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateArrayItem('benefits', index, { title: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Заголовок"
                    />
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => updateArrayItem('benefits', index, { description: e.target.value })}
                      className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                      placeholder="Описание"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('benefits', { title: '', description: '', icon: 'TrendingUp' })}
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                <Plus size={16} />
                Добавить преимущество
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Требования</h2>
            <div className="space-y-4">
              {(customData.requirements || []).map((item: any, index: number) => (
                <div key={item.id} className="flex items-center gap-3 p-4 bg-black/30 rounded-lg border border-neon-cyan/20">
                  <input
                    type="text"
                    value={item.text || ''}
                    onChange={(e) => updateArrayItem('requirements', index, { text: e.target.value })}
                    className="flex-1 px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded text-white text-sm"
                    placeholder="Текст требования"
                  />
                  <button
                    onClick={() => removeArrayItem('requirements', index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('requirements', { text: '' })}
                className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/20 text-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition-colors"
              >
                <Plus size={16} />
                Добавить требование
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
