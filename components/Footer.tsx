'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

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

const socialLinks = [
  { name: 'WhatsApp', href: '#', icon: '💬' },
  { name: 'Telegram', href: '#', icon: '✈️' },
  { name: 'VK', href: '#', icon: 'VK' },
  { name: 'Instagram', href: '#', icon: 'IG' },
]

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-neon-cyan/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-gradient">CAPSULE</div>
              <div className="text-sm text-gray-400">HOUSES</div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Инновационные капсульные дома с технологичным дизайном. 
              Быстрая сборка, высокое качество, уникальные решения для современной жизни.
            </p>
          </motion.div>

          {/* Navigation Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-neon-cyan">Навигация</h3>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-gray-400 hover:text-neon-cyan transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-neon-cyan">Контакты</h3>
            <div className="space-y-3">
              <a
                href="tel:+79991234567"
                className="flex items-center space-x-3 text-sm text-gray-400 hover:text-neon-cyan transition-colors"
              >
                <Phone size={18} />
                <span>+7 (999) 123-45-67</span>
              </a>
              <a
                href="mailto:info@capsulehouses.ru"
                className="flex items-center space-x-3 text-sm text-gray-400 hover:text-neon-cyan transition-colors"
              >
                <Mail size={18} />
                <span>info@capsulehouses.ru</span>
              </a>
              <div className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin size={18} className="mt-0.5" />
                <span>г. Москва, ул. Примерная, д. 1</span>
              </div>
            </div>
          </motion.div>

          {/* Social & Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-neon-cyan">Социальные сети</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-sm text-gray-400 hover:text-neon-cyan hover:border-neon-cyan transition-all"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="pt-4 space-y-2 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-neon-cyan transition-colors block">
                Политика конфиденциальности
              </Link>
              <p>ОГРН: 1234567890123</p>
              <p>ИП Иванов Иван Иванович</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-neon-cyan/20 text-center text-sm text-gray-500"
        >
          <p>© {new Date().getFullYear()} Капсульные дома. Все права защищены.</p>
        </motion.div>
      </div>
    </footer>
  )
}
