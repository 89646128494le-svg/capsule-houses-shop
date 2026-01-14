'use client'

import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import CallbackModal from './modals/CallbackModal'

const menuItems = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/catalog' },
  { name: 'О продукте', href: '/about' },
  { name: 'Контакты', href: '/contacts' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glassmorphism"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gradient">CAPSULE</div>
            <div className="hidden sm:block text-sm text-gray-400">HOUSES</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-300 hover:text-neon-cyan transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Callback Button - Desktop */}
            <button
              onClick={() => setIsCallbackModalOpen(true)}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all duration-300"
            >
              <Phone size={18} />
              <span className="text-sm">Заказать звонок</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-neon-cyan transition-colors"
              aria-label="Меню"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-neon-cyan/20"
          >
            <nav className="container mx-auto px-4 py-4 space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-300 hover:text-neon-cyan transition-colors py-2"
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsCallbackModalOpen(true)
                  setIsMenuOpen(false)
                }}
                className="w-full mt-3 px-4 py-2 text-sm bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Заказать звонок
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Callback Modal */}
      <CallbackModal
        isOpen={isCallbackModalOpen}
        onClose={() => setIsCallbackModalOpen(false)}
      />
    </motion.header>
  )
}
