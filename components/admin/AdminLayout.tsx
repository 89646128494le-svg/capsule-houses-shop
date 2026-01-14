'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  FileText, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useAdminStore } from '@/store/adminStore'
import { useState } from 'react'

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Товары', href: '/admin/products', icon: Package },
  { name: 'Заказы', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Аналитика', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Контент', href: '/admin/content', icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated)
  const user = useAdminStore((state) => state.user)
  const logout = useAdminStore((state) => state.logout)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
  }, [isAuthenticated, router, pathname])

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-deep-dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glassmorphism border-r border-neon-cyan/20 z-40">
        <div className="p-6 border-b border-neon-cyan/20">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="text-xl font-bold text-gradient">CAPSULE</div>
            <div className="text-xs text-gray-400">ADMIN</div>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'text-gray-400 hover:text-neon-cyan hover:bg-black/30'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neon-cyan/20">
          <div className="mb-4 px-4 py-2 text-sm text-gray-400">
            {user?.name}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-black/30 transition-all"
          >
            <LogOut size={20} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 glassmorphism rounded-lg border border-neon-cyan/30"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 glassmorphism border-r border-neon-cyan/20">
            <div className="p-6 border-b border-neon-cyan/20">
              <div className="flex items-center space-x-2">
                <div className="text-xl font-bold text-gradient">CAPSULE</div>
                <div className="text-xs text-gray-400">ADMIN</div>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                        : 'text-gray-400 hover:text-neon-cyan hover:bg-black/30'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-4 px-4 sm:px-6 lg:px-8 pb-8">
        {children}
      </main>
    </div>
  )
}
