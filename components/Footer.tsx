'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useContentStore } from '@/store/contentStore'

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

export default function Footer() {
  const footerContent = useContentStore((state) => state.footerContent)
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
              <div className="text-2xl font-bold text-gradient">{footerContent.logoText}</div>
              <div className="text-sm text-gray-400">HOUSES</div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {footerContent.description}
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
                href={`tel:${footerContent.contacts.phone.replace(/\s/g, '')}`}
                className="flex items-center space-x-3 text-sm text-gray-400 hover:text-neon-cyan transition-colors"
              >
                <Phone size={18} />
                <span>{footerContent.contacts.phone}</span>
              </a>
              <a
                href={`mailto:${footerContent.contacts.email}`}
                className="flex items-center space-x-3 text-sm text-gray-400 hover:text-neon-cyan transition-colors"
              >
                <Mail size={18} />
                <span>{footerContent.contacts.email}</span>
              </a>
              <div className="flex items-start space-x-3 text-sm text-gray-400">
                <MapPin size={18} className="mt-0.5" />
                <span>{footerContent.contacts.address}</span>
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
              {footerContent.socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-sm text-gray-400 hover:text-neon-cyan hover:border-neon-cyan transition-all"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="pt-4 space-y-2 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-neon-cyan transition-colors block">
                {footerContent.legalInfo.privacyPolicyText}
              </Link>
              <p>ОГРН: {footerContent.legalInfo.ogrn}</p>
              <p>{footerContent.legalInfo.companyName}</p>
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
