'use client'

import { motion } from 'framer-motion'
import { Package, ShoppingBag, TrendingUp, Users, DollarSign, Clock } from 'lucide-react'
import { useOrdersStore } from '@/store/ordersStore'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'

export default function AdminDashboard() {
  const orders = useOrdersStore((state) => state.orders)
  const totalRevenue = useOrdersStore((state) => state.getTotalRevenue())
  const ordersCount = useOrdersStore((state) => state.getOrdersCount())
  const newOrders = useOrdersStore((state) => state.getOrdersByStatus('new'))
  const processingOrders = useOrdersStore((state) => state.getOrdersByStatus('processing'))

  const stats = [
    {
      name: 'Всего заказов',
      value: ordersCount,
      icon: ShoppingBag,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      href: '/admin/orders',
    },
    {
      name: 'Новые заказы',
      value: newOrders.length,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      href: '/admin/orders?status=new',
    },
    {
      name: 'В обработке',
      value: processingOrders.length,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      href: '/admin/orders?status=processing',
    },
    {
      name: 'Общая выручка',
      value: `${(totalRevenue / 1000000).toFixed(1)}М ₽`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      href: '/admin/analytics',
    },
  ]

  const recentOrders = orders.slice(0, 5)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
      processing: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
      shipped: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
      delivered: 'bg-green-400/20 text-green-400 border-green-400/30',
      cancelled: 'bg-red-400/20 text-red-400 border-red-400/30',
    }
    return colors[status as keyof typeof colors] || colors.new
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      new: 'Новый',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-gray-400">Обзор статистики и последних заказов</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={stat.name} href={stat.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon size={24} className={stat.color} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.name}</div>
              </motion.div>
            </Link>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Последние заказы</h2>
          <Link
            href="/admin/orders"
            className="text-neon-cyan hover:text-neon-cyan-light transition-colors text-sm"
          >
            Все заказы →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neon-cyan/20">
                <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Номер</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Клиент</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Товары</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Сумма</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Статус</th>
                <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-neon-cyan/10 hover:bg-black/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-neon-cyan hover:text-neon-cyan-light transition-colors font-medium"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-white">
                    <div>{order.customerName}</div>
                    <div className="text-sm text-gray-400">{order.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-300 text-sm">
                    {order.items.map((item) => `${item.name} (${item.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 px-4 text-white font-semibold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
