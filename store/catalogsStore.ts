import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Catalog {
  id: number
  title: string
  description: string
  coverImage: string // URL или base64
  pdfUrl: string // URL или base64 для PDF
  pdfFileName?: string // Имя файла для скачивания
}

interface CatalogsStore {
  catalogs: Catalog[]
  getCatalogs: () => Catalog[]
  getCatalogById: (id: number) => Catalog | undefined
  addCatalog: (catalog: Omit<Catalog, 'id'>) => void
  updateCatalog: (id: number, catalog: Partial<Catalog>) => void
  deleteCatalog: (id: number) => void
}

const initialCatalogs: Catalog[] = [
  {
    id: 1,
    title: 'Каталог капсульных домов 2024',
    description: 'Полный каталог наших капсульных домов с техническими характеристиками',
    coverImage: '/bright-1.jpg',
    pdfUrl: '/catalogs/catalog.pdf',
    pdfFileName: 'catalog-2024.pdf',
  },
  {
    id: 2,
    title: 'Премиум серия',
    description: 'Эксклюзивные модели премиум класса',
    coverImage: '/bright-2.jpg',
    pdfUrl: '/catalogs/catalog.pdf',
    pdfFileName: 'premium-series.pdf',
  },
  {
    id: 3,
    title: 'Модульные комплексы',
    description: 'Решения для создания модульных комплексов',
    coverImage: '/hero-bg.jpg',
    pdfUrl: '/catalogs/catalog.pdf',
    pdfFileName: 'modular-complexes.pdf',
  },
]

export const useCatalogsStore = create<CatalogsStore>()(
  persist(
    (set, get) => ({
      catalogs: initialCatalogs,
      
      getCatalogs: () => get().catalogs,
      
      getCatalogById: (id) => {
        return get().catalogs.find((c) => c.id === id)
      },
      
      addCatalog: (catalog) => {
        const newId = Math.max(...get().catalogs.map((c) => c.id), 0) + 1
        const newCatalog: Catalog = { ...catalog, id: newId }
        set((state) => ({
          catalogs: [...state.catalogs, newCatalog],
        }))
      },
      
      updateCatalog: (id, updatedCatalog) => {
        set((state) => ({
          catalogs: state.catalogs.map((c) =>
            c.id === id ? { ...c, ...updatedCatalog } : c
          ),
        }))
      },
      
      deleteCatalog: (id) => {
        set((state) => ({
          catalogs: state.catalogs.filter((c) => c.id !== id),
        }))
      },
    }),
    {
      name: 'capsule-catalogs-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
