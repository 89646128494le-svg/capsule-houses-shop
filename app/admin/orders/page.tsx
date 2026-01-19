'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, XCircle, X, Send } from 'lucide-react'
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
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [pendingStatusChange, setPendingStatusChange] = useState<{ orderId: number; status: Order['status'] } | null>(null)
  const [isSendingEmail, setIsSendingEmail] = useState(false)

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

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) return

    // Если статус меняется на "отменен", показываем модальное окно для причины
    if (newStatus === 'cancelled') {
      setPendingStatusChange({ orderId, status: newStatus })
      setShowCancelModal(true)
      return
    }

    // Обновляем статус
    updateOrderStatus(orderId, newStatus)
    
    // Отправляем email покупателю, если есть email и статус не "новый"
    if (order.customerEmail && newStatus !== 'new') {
      setIsSendingEmail(true)
      try {
        const response = await fetch('/api/send-order-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: {
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              items: order.items,
              total: order.total,
            },
            status: newStatus,
            customerEmail: order.customerEmail,
          }),
        })

        if (response.ok) {
          addToast('Статус заказа обновлен и письмо отправлено покупателю', 'success')
        } else {
          addToast('Статус заказа обновлен, но не удалось отправить письмо', 'warning')
        }
      } catch (error) {
        addToast('Статус заказа обновлен, но произошла ошибка при отправке письма', 'warning')
      } finally {
        setIsSendingEmail(false)
      }
    } else {
      addToast('Статус заказа обновлен', 'success')
    }
  }

  const handleCancelOrder = async () => {
    if (!pendingStatusChange || !cancelReason.trim()) {
      addToast('Пожалуйста, укажите причину отмены', 'error')
      return
    }

    const order = orders.find(o => o.id === pendingStatusChange.orderId)
    if (!order) return

    // Обновляем статус с причиной
    updateOrderStatus(pendingStatusChange.orderId, 'cancelled', cancelReason)
    
    // Отправляем email покупателю
    if (order.customerEmail) {
      setIsSendingEmail(true)
      try {
        const response = await fetch('/api/send-order-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order: {
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              items: order.items,
              total: order.total,
            },
            status: 'cancelled',
            cancellationReason: cancelReason,
            customerEmail: order.customerEmail,
          }),
        })

        if (response.ok) {
          addToast('Заказ отменен и письмо отправлено покупателю', 'success')
        } else {
          addToast('Заказ отменен, но не удалось отправить письмо', 'warning')
        }
      } catch (error) {
        addToast('Заказ отменен, но произошла ошибка при отправке письма', 'warning')
      } finally {
        setIsSendingEmail(false)
      }
    } else {
      addToast('Заказ отменен', 'success')
    }

    setShowCancelModal(false)
    setCancelReason('')
    setPendingStatusChange(null)
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
                        aria-label={`Удалить заказ ${order.orderNumber}`}
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

      {/* Модальное окно для отмены заказа */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => {
                setShowCancelModal(false)
                setCancelReason('')
                setPendingStatusChange(null)
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative glassmorphism-light rounded-2xl p-8 max-w-md w-full border border-neon-cyan/30"
            >
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason('')
                  setPendingStatusChange(null)
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-neon-cyan transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-gradient mb-2">Отмена заказа</h2>
              <p className="text-gray-400 mb-6">
                Пожалуйста, укажите причину отмены заказа. Письмо с этой информацией будет отправлено покупателю.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Причина отмены *</label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Например: Товар временно отсутствует на складе..."
                    className="w-full px-4 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors min-h-[120px] resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowCancelModal(false)
                      setCancelReason('')
                      setPendingStatusChange(null)
                    }}
                    className="flex-1 px-6 py-3 bg-black/50 border border-neon-cyan/30 rounded-lg text-white hover:bg-black/70 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={!cancelReason.trim() || isSendingEmail}
                    className="flex-1 px-6 py-3 bg-gradient-hero text-deep-dark font-semibold rounded-lg hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSendingEmail ? (
                      <>
                        <div className="w-5 h-5 border-2 border-deep-dark border-t-transparent rounded-full animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Отменить заказ
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
