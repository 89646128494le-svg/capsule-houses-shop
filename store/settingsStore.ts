import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface DesignSettings {
  primaryColor: string
  secondaryColor: string
  textColor: string
  logoImage: string // URL или base64
  logoText: string
  phoneNumber: string // Номер телефона для шапки
}

interface SettingsStore {
  designSettings: DesignSettings
  updateDesignSettings: (settings: Partial<DesignSettings>) => void
}

const initialDesignSettings: DesignSettings = {
  primaryColor: '#00f2ff', // neon-cyan
  secondaryColor: '#000814', // deep-dark
  textColor: '#ffffff',
  logoImage: '/logo.svg', // Дефолтный логотип
  logoText: 'Modus Tech',
  phoneNumber: '+7 (999) 123-45-67', // Дефолтный номер телефона
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      designSettings: initialDesignSettings,
      
      updateDesignSettings: (settings) => {
        set((state) => ({
          designSettings: { ...state.designSettings, ...settings },
        }))
      },
    }),
    {
      name: 'capsule-settings-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
