import { create } from 'zustand'

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
}

interface OrdersStore {
  orders: Order[]
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => void
  updateOrderStatus: (id: number, status: Order['status']) => void
  deleteOrder: (id: number) => void
  getOrdersByStatus: (status: Order['status']) => Order[]
  getTotalRevenue: () => number
  getOrdersCount: () => number
}

// Mock данные для демонстрации
const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customerName: 'Иван Иванов',
    customerPhone: '+7 (999) 123-45-67',
    customerEmail: 'ivan@example.com',
    items: [
      { id: 1, name: 'Capsule Mini', quantity: 1, price: 890000 },
    ],
    total: 890000,
    status: 'new',
    createdAt: '2024-01-15T10:30:00',
    deliveryAddress: 'г. Москва, ул. Примерная, д. 1',
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    customerName: 'Мария Петрова',
    customerPhone: '+7 (999) 234-56-78',
    customerEmail: 'maria@example.com',
    items: [
      { id: 2, name: 'Capsule Standard', quantity: 1, price: 1290000 },
    ],
    total: 1290000,
    status: 'processing',
    createdAt: '2024-01-14T14:20:00',
    deliveryAddress: 'г. Санкт-Петербург, пр. Невский, д. 10',
  },
  {
    id: 3,
    orderNumber: 'ORD-003',
    customerName: 'Алексей Смирнов',
    customerPhone: '+7 (999) 345-67-89',
    items: [
      { id: 3, name: 'Capsule Premium', quantity: 1, price: 1890000 },
    ],
    total: 1890000,
    status: 'shipped',
    createdAt: '2024-01-13T09:15:00',
  },
]

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: mockOrders,
  
  addOrder: (order) => {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      orderNumber: `ORD-${String(get().orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    }
    set((state) => ({
      orders: [newOrder, ...state.orders],
    }))
  },
  
  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, status } : order
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
}))
