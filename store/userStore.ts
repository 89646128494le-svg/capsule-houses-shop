import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: number
  email: string
  name: string
  phone: string
  createdAt: string
}

interface UserStore {
  user: User | null
  isAuthenticated: boolean
  register: (email: string, password: string, name: string, phone: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      register: async (email, password, name, phone) => {
        // TODO: Интеграция с API
        const newUser: User = {
          id: Date.now(),
          email,
          name,
          phone,
          createdAt: new Date().toISOString(),
        }
        set({ user: newUser, isAuthenticated: true })
        return true
      },
      
      login: async (email, password) => {
        // TODO: Интеграция с API
        // Для демо: любой email/пароль работает
        const user: User = {
          id: 1,
          email,
          name: email.split('@')[0],
          phone: '+7 (999) 123-45-67',
          createdAt: new Date().toISOString(),
        }
        set({ user, isAuthenticated: true })
        return true
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false })
      },
      
      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },
    }),
    {
      name: 'user-storage',
    }
  )
)
