'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MoreVertical, CheckCircle, XCircle, Truck, Package } from 'lucide-react'
import { useOrdersStore, Order } from '@/store/ordersStore'
import { useToastStore } from '@/store/toastStore'

const statusOptions: Order['status'][] = ['new', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersPage() {
  const orders = useOrdersStore((state) => state.orders)
  const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus)
  const deleteOrder = useOrdersStore((state) => state.deleteOrder)
  const addToast = useToastStore((state) => state.addToast)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery)
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      new: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30',
      processing: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
      shipped: 'bg-purple-400/20 text-purple-400 border-purple-400/30',
      delivered: 'bg-green-400/20 text-green-400 border-green-400/30',
      cancelled: 'bg-red-400/20 text-red-400 border-red-400/30',
    }
    return colors[status]
  }

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      new: 'Новый',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен',
    }
    return labels[status]
  }

  const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus)
    addToast('Статус заказа обновлен', 'success')
  }

  const handleDelete = (orderId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
      deleteOrder(orderId)
      addToast('Заказ удален', 'info')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gradient mb-2">Заказы</h1>
        <p className="text-gray-400">Управление заказами и их статусами</p>
      </div>

      {/* Filters */}
      <div className="glassmorphism-light rounded-xl p-6 border border-neon-cyan/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по номеру, имени, телефону..."
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'all')}
              className="px-4 py-2 bg-black/50 border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
            >
              <option value="all">Все статусы</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="glassmorphism-light rounded-xl border border-neon-cyan/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/30">
              <tr>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Номер</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Клиент</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Товары</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Сумма</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Статус</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Дата</th>
                <th className="text-left py-4 px-6 text-sm text-gray-400 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-neon-cyan/10 hover:bg-black/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <span className="text-neon-cyan font-medium">{order.orderNumber}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white">{order.customerName}</div>
                    <div className="text-sm text-gray-400">{order.customerPhone}</div>
                    {order.customerEmail && (
                      <div className="text-sm text-gray-400">{order.customerEmail}</div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-300 text-sm">
                    {order.items.map((item) => (
                      <div key={item.id}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="py-4 px-6 text-white font-semibold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={`px-3 py-1 rounded-full text-xs font-medium border bg-transparent ${getStatusColor(order.status)} cursor-pointer`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6 text-gray-400 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Удалить"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            Заказы не найдены
          </div>
        )}
      </div>
    </div>
  )
}
