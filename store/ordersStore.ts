import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  items: {
    id: number
    name: string
    quantity: number
    price: number
  }[]
  total: number
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: string
  deliveryAddress?: string
  notes?: string
  cancellationReason?: string
}

interface OrdersStore {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'createdAt'> & { orderNumber?: string }) => void
  updateOrderStatus: (id: number, status: Order['status'], cancellationReason?: string) => void
  deleteOrder: (id: number) => void
  getOrdersByStatus: (status: Order['status']) => Order[]
  getTotalRevenue: () => number
  getOrdersCount: () => number
}

// Начальное состояние - пустой список заказов
const initialOrders: Order[] = []

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: initialOrders,
      
      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: Date.now(),
          orderNumber: order.orderNumber || `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }))
      },
      
      updateOrderStatus: (id, status, cancellationReason) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id 
              ? { 
                  ...order, 
                  status,
                  cancellationReason: status === 'cancelled' ? cancellationReason : undefined
                } 
              : order
          ),
        }))
      },
      
      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        }))
      },
      
      getOrdersByStatus: (status) => {
        return get().orders.filter((order) => order.status === status)
      },
      
      getTotalRevenue: () => {
        return get().orders
          .filter((order) => order.status !== 'cancelled')
          .reduce((total, order) => total + order.total, 0)
      },
      
      getOrdersCount: () => {
        return get().orders.length
      },
    }),
    {
      name: 'capsule-orders-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
