'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, ShoppingBag, Heart, Settings, LogOut, Package } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { useRouter } from 'next/navigation'
import { useOrdersStore } from '@/store/ordersStore'
import { useToastStore } from '@/store/toastStore'
import Link from 'next/link'

export default function AccountContent() {
  const user = useUserStore((state) => state.user)
  const isAuthenticated = useUserStore((state) => state.isAuthenticated)
  const logout = useUserStore((state) => state.logout)
  const updateProfile = useUserStore((state) => state.updateProfile)
  const orders = useOrdersStore((state) => state.orders)
  const router = useRouter()
  const addToast = useToastStore((state) => state.addToast)
  
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'favorites'>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  if (!isAuthenticated || !user) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-md">
          <div className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20 text-center">
            <User size={64} className="mx-auto text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Вход в личный кабинет</h2>
            <p className="text-gray-400 mb-6">Войдите или зарегистрируйтесь для доступа к личному кабинету</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/account/login"
                className="px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all"
              >
                Войти
              </Link>
              <Link
                href="/account/register"
                className="px-6 py-3 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all"
              >
                Зарегистрироваться
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
    addToast('Профиль обновлен', 'success')
  }

  const handleLogout = () => {
    logout()
    router.push('/')
    addToast('Вы вышли из аккаунта', 'info')
  }

  const userOrders = orders.filter((order) => order.customerEmail === user.email || order.customerPhone === user.phone)

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gradient mb-8">Личный кабинет</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="glassmorphism-light rounded-2xl p-6 border border-neon-cyan/20 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'profile'
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'text-gray-400 hover:text-neon-cyan hover:bg-black/30'
                }`}
              >
                <User size={20} />
                Профиль
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'orders'
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'text-gray-400 hover:text-neon-cyan hover:bg-black/30'
                }`}
              >
                <ShoppingBag size={20} />
                Заказы ({userOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'text-gray-400 hover:text-neon-cyan hover:bg-black/30'
                }`}
              >
                <Heart size={20} />
                Избранное
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-black/30 transition-all mt-4"
              >
                <LogOut size={20} />
                Выйти
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Профиль</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all"
                    >
                      Редактировать
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Имя</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-neon-cyan transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-neon-cyan transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-neon-cyan transition-colors"
                    />
                  </div>
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all"
                      >
                        Сохранить
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                          })
                        }}
                        className="px-6 py-3 bg-transparent border border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-deep-dark transition-all"
                      >
                        Отмена
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20"
              >
                <h2 className="text-2xl font-bold text-white mb-6">История заказов</h2>
                {userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-6 bg-black/30 rounded-lg border border-neon-cyan/10"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="text-neon-cyan font-semibold mb-1">{order.orderNumber}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold mb-1">
                              {new Intl.NumberFormat('ru-RU', {
                                style: 'currency',
                                currency: 'RUB',
                                minimumFractionDigits: 0,
                              }).format(order.total)}
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                              order.status === 'delivered' ? 'bg-green-400/20 text-green-400' :
                              order.status === 'processing' ? 'bg-blue-400/20 text-blue-400' :
                              'bg-yellow-400/20 text-yellow-400'
                            }`}>
                              {order.status === 'new' ? 'Новый' :
                               order.status === 'processing' ? 'В обработке' :
                               order.status === 'shipped' ? 'Отправлен' :
                               order.status === 'delivered' ? 'Доставлен' : 'Отменен'}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                    <p>У вас пока нет заказов</p>
                    <Link
                      href="/catalog"
                      className="mt-4 inline-block px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all"
                    >
                      Перейти в каталог
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphism-light rounded-2xl p-8 border border-neon-cyan/20"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Избранное</h2>
                <div className="text-center py-12 text-gray-400">
                  <Heart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Список избранного пуст</p>
                  <Link
                    href="/catalog"
                    className="mt-4 inline-block px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all"
                  >
                    Перейти в каталог
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
