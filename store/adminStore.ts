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
    // TODO: В реальном приложении здесь будет запрос к API
    // Для демо используем простую проверку
    if (email === 'admin@capsule.ru' && password === 'admin123') {
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
