'use client'

import { useState } from 'react'
import { Menu, X, Phone, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useSettingsStore } from '@/store/settingsStore'

const menuItems = [
  { name: 'Главная', href: '/' },
  { name: 'О продукте', href: '/about' },
  { name: 'Каталог', href: '/catalog' },
  { name: 'Комплектация', href: '/equipment' },
  { name: 'Оплата и доставка', href: '/payment' },
  { name: 'Акции', href: '/promotions' },
  { name: 'Партнёрам', href: '/partners' },
  { name: 'Контакты', href: '/contacts' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const designSettings = useSettingsStore((state) => state.designSettings)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glassmorphism"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 -ml-2 lg:-ml-4" suppressHydrationWarning>
            {designSettings.logoImage && designSettings.logoImage.trim() !== '' && (designSettings.logoImage.startsWith('data:') || designSettings.logoImage.startsWith('http') || designSettings.logoImage.startsWith('/')) ? (
              <div className="relative h-12 w-48 flex items-center sm:h-16 sm:w-64">
                <img 
                  src={designSettings.logoImage} 
                  alt={designSettings.logoText || 'Лого'} 
                  className="h-full w-full object-contain object-left"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent && !parent.querySelector('.logo-text-fallback')) {
                      const fallback = document.createElement('div')
                      fallback.className = 'text-3xl sm:text-4xl font-bold text-gradient logo-text-fallback'
                      fallback.textContent = designSettings.logoText || 'Капсульные дома'
                      parent.appendChild(fallback)
                    }
                  }}
                />
              </div>
            ) : (
              <>
                <div className="text-3xl sm:text-4xl font-bold text-gradient" suppressHydrationWarning>{designSettings.logoText || 'Капсульные дома'}</div>
                <div className="hidden sm:block text-base text-gray-400">Инновации</div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-300 hover:text-neon-cyan transition-colors duration-300 whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-300 hover:text-neon-cyan transition-colors"
              aria-label="Корзина"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-neon-cyan text-deep-dark text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </Link>

            {/* Phone Number - Desktop */}
            {designSettings.phoneNumber && (
              <a
                href={`tel:${designSettings.phoneNumber.replace(/\s|\(|\)|-/g, '')}`}
                className="hidden lg:flex items-center space-x-2 text-gray-300 hover:text-neon-cyan transition-colors"
              >
                <Phone size={18} />
                <span className="text-sm">{designSettings.phoneNumber}</span>
              </a>
            )}

            {/* Callback Button - Desktop */}
            <Link
              href="/callback"
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all duration-300"
            >
              <Phone size={18} />
              <span className="text-sm">Заказать звонок</span>
            </Link>

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
              <Link
                href="/callback"
                onClick={() => setIsMenuOpen(false)}
                className="w-full mt-3 px-4 py-2 text-sm bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Заказать звонок
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
