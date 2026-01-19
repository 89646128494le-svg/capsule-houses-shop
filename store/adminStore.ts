import { create } from 'zustand'

interface AdminStore {
  isAuthenticated: boolean
  user: {
    email: string
    name: string
  } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAdminStore = create<AdminStore>((set) => ({
  isAuthenticated: false,
  user: null,
  
  login: async (email: string, password: string) => {
    // В продакшене замените на запрос к API
    // Для безопасности используйте переменные окружения
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@capsule.ru'
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    
    if (email === adminEmail && password === adminPassword) {
      set({
        isAuthenticated: true,
        user: {
          email,
          name: 'Администратор',
        },
      })
      return true
    }
    return false
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
    })
  },
}))
