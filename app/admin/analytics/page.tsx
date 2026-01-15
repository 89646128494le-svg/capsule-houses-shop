'use client'

import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, ShoppingBag, Users, ArrowUp, ArrowDown } from 'lucide-react'
import { useOrdersStore } from '@/store/ordersStore'

export default function AnalyticsPage() {
  const orders = useOrdersStore((state) => state.orders)
  const totalRevenue = useOrdersStore((state) => state.getTotalRevenue())
  const ordersCount = useOrdersStore((state) => state.getOrdersCount())
  
  // Реальная статистика на основе заказов
  const averageOrder = ordersCount > 0 ? Math.round(totalRevenue / ordersCount) : 0
  const stats = [
    {
      name: 'Общая выручка',
      value: totalRevenue > 0 ? `${(totalRevenue / 1000000).toFixed(1)}М ₽` : '0 ₽',
      change: null,
      changeType: null as null,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      name: 'Всего заказов',
      value: ordersCount.toString(),
      change: null,
      changeType: null as null,
      icon: ShoppingBag,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      name: 'Средний чек',
      value: averageOrder > 0 ? `${averageOrder.toLocaleString('ru-RU')} ₽` : '0 ₽',
      change: null,
      changeType: null as null,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
    {
      name: 'Уникальных клиентов',
      value: new Set(orders.map(o => o.customerPhone)).size.toString(),
      change: null,
      changeType: null as null,
      icon: Users,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
  ]

  // Статистика по статусам заказов
  const statusStats = [
    { status: 'new', label: 'Новые', count: orders.filter((o) => o.status === 'new').length, color: 'bg-yellow-400' },
    { status: 'processing', label: 'В обработке', count: orders.filter((o) => o.status === 'processing').length, color: 'bg-blue-400' },
    { status: 'shipped', label: 'Отправлены', count: orders.filter((o) => o.status === 'shipped').length, color: 'bg-purple-400' },
    { status: 'delivered', label: 'Доставлены', count: orders.filter((o) => o.status === 'delivered').length, color: 'bg-green-400' },
  ]

  // Топ товаров (реальные данные из заказов)
  const productStats = new Map<string, { sales: number; revenue: number }>()
  orders.forEach(order => {
    order.items.forEach(item => {
      const existing = productStats.get(item.name) || { sales: 0, revenue: 0 }
      productStats.set(item.name, {
        sales: existing.sales + item.quantity,
        revenue: existing.revenue + (item.price * item.quantity),
      })
    })
  })
  const topProducts = Array.from(productStats.entries())
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Аналитика</h1>
        <p className="text-gray-400">Статистика продаж и показатели эффективности</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 text-sm ${stat.changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.changeType === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {stat.change}
                  </div>
                )}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.name}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20">
          <h2 className="text-2xl font-bold text-white mb-6">Распределение заказов</h2>
          <div className="space-y-4">
            {statusStats.map((stat) => (
              <div key={stat.status} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{stat.label}</span>
                  <span className="text-white font-semibold">{stat.count}</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${stat.color} transition-all`}
                    style={{
                      width: `${(stat.count / ordersCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20">
          <h2 className="text-2xl font-bold text-white mb-6">Топ товаров</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-4 bg-black/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-cyan/20 flex items-center justify-center text-neon-cyan font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{product.name}</div>
                    <div className="text-sm text-gray-400">{product.sales} продаж</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-neon-cyan font-semibold">
                    {product.revenue.toLocaleString('ru-RU')} ₽
                  </div>
                </div>
              </div>
            ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
              <p>Пока нет данных о продажах</p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20">
        <h2 className="text-2xl font-bold text-white mb-6">Динамика выручки</h2>
        <div className="h-64 flex items-center justify-center bg-black/20 rounded-lg border border-neon-cyan/20">
          <div className="text-center text-gray-400">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
            <p>График выручки</p>
            <p className="text-sm mt-2">Интеграция с Google Analytics / Yandex.Metrica</p>
          </div>
        </div>
      </div>
    </div>
  )
}
