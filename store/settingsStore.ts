import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface DesignSettings {
  primaryColor: string
  secondaryColor: string
  textColor: string
  logoImage: string // URL или base64
  logoText: string
}

interface SettingsStore {
  designSettings: DesignSettings
  updateDesignSettings: (settings: Partial<DesignSettings>) => void
}

const initialDesignSettings: DesignSettings = {
  primaryColor: '#00f2ff', // neon-cyan
  secondaryColor: '#000814', // deep-dark
  textColor: '#ffffff',
  logoImage: '',
  logoText: 'CAPSULE',
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
      name: 'capsule-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
