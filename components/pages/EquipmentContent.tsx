'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function EquipmentContent() {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([])

  const baseEquipment = [
    { id: 1, name: 'Алюминиевый каркас', included: true },
    { id: 2, name: 'Утепление эковатой', included: true },
    { id: 3, name: 'Внутренняя отделка', included: true },
    { id: 4, name: 'Окна и двери', included: true },
    { id: 5, name: 'Электрика', included: true },
    { id: 6, name: 'Сантехника', included: true },
  ]

  const additionalOptions = [
    { id: 101, name: 'Умный дом (управление через смартфон)', price: 50000 },
    { id: 102, name: 'Солнечные панели', price: 150000 },
    { id: 103, name: 'Система вентиляции с рекуперацией', price: 80000 },
    { id: 104, name: 'Теплый пол', price: 60000 },
    { id: 105, name: 'Мебель в комплекте', price: 200000 },
    { id: 106, name: 'Дополнительное утепление', price: 40000 },
  ]

  const toggleOption = (id: number) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((opt) => opt !== id) : [...prev, id]
    )
  }

  const totalAdditional = additionalOptions
    .filter((opt) => selectedOptions.includes(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Комплектация</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Выберите базовую комплектацию и дополнительные опции для вашего дома
          </p>
        </motion.div>

        {/* Base Equipment */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Базовая комплектация</h2>
          <div className="space-y-4">
            {baseEquipment.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-4 bg-black/30 rounded-lg border border-neon-cyan/10"
              >
                <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Дополнительные опции</h2>
          <div className="space-y-4">
            {additionalOptions.map((option) => {
              const isSelected = selectedOptions.includes(option.id)
              return (
                <label
                  key={option.id}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-neon-cyan/10 border-neon-cyan'
                      : 'bg-black/30 border-neon-cyan/10 hover:border-neon-cyan/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOption(option.id)}
                      className="w-5 h-5 rounded border-neon-cyan/30 bg-black/50 text-neon-cyan focus:ring-neon-cyan"
                    />
                    <span className="text-gray-300">{option.name}</span>
                  </div>
                  <span className="text-neon-cyan font-semibold">{formatPrice(option.price)}</span>
                </label>
              )
            })}
          </div>
        </motion.div>

        {/* Total */}
        {totalAdditional > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl text-gray-300">Дополнительные опции:</span>
              <span className="text-3xl font-bold text-neon-cyan">{formatPrice(totalAdditional)}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
