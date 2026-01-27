import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Product {
  id: number
  name: string
  price: number
  dimensions: string
  guests: number
  description: string
  category: string
  images: string[]
  video?: string // URL видео (YouTube, Vimeo или прямой URL)
  inStock: boolean
}

// 30 товаров для каталога
const mockProducts: Product[] = [
  // Двухэтажные капсульные дома
  { id: 1, name: 'Capsule Two-Story Basic', price: 1890000, dimensions: '4×3×5 м', guests: 4, description: 'Двухэтажный дом базовой комплектации', category: 'two-story', images: ['/bright-1.jpg', '/bright-2.jpg'], video: 'https://www.youtube.com/watch?v=ysz5S6PUM-U', inStock: true },
  { id: 2, name: 'Capsule Two-Story Premium', price: 2490000, dimensions: '5×4×6 м', guests: 6, description: 'Двухэтажный дом премиум класса', category: 'two-story', images: ['/bright-2.jpg', '/hero-bg.jpg'], inStock: true },
  { id: 3, name: 'Capsule Two-Story Luxe', price: 3190000, dimensions: '6×5×7 м', guests: 8, description: 'Роскошный двухэтажный дом', category: 'two-story', images: ['/hero-bg.jpg', '/bright-1.jpg'], inStock: true },
  
  // Раздвижные капсульные дома
  { id: 4, name: 'Capsule Sliding Compact', price: 1290000, dimensions: '4×3×2.8 м', guests: 4, description: 'Компактный раздвижной дом', category: 'sliding', images: ['/bright-1.jpg'], inStock: true },
  { id: 5, name: 'Capsule Sliding Standard', price: 1590000, dimensions: '5×4×3 м', guests: 6, description: 'Стандартный раздвижной дом', category: 'sliding', images: ['/bright-2.jpg'], inStock: true },
  { id: 6, name: 'Capsule Sliding Pro', price: 1990000, dimensions: '6×4.5×3.5 м', guests: 8, description: 'Профессиональный раздвижной дом', category: 'sliding', images: ['/hero-bg.jpg'], inStock: true },
  
  // Вертикальные
  { id: 7, name: 'Capsule Vertical Basic', price: 1490000, dimensions: '3×3×4.5 м', guests: 4, description: 'Вертикальный дом базовой комплектации', category: 'vertical', images: [], inStock: true },
  { id: 8, name: 'Capsule Vertical Plus', price: 1790000, dimensions: '3.5×3.5×5 м', guests: 6, description: 'Вертикальный дом улучшенной комплектации', category: 'vertical', images: [], inStock: true },
  { id: 9, name: 'Capsule Vertical Max', price: 2290000, dimensions: '4×4×6 м', guests: 8, description: 'Максимальный вертикальный дом', category: 'vertical', images: [], inStock: true },
  
  // Мини капсульные дома
  { id: 10, name: 'Capsule Mini', price: 890000, dimensions: '3×2×2.5 м', guests: 2, description: 'Компактное решение для двоих', category: 'mini', images: [], inStock: true },
  { id: 11, name: 'Capsule Mini Plus', price: 950000, dimensions: '3.5×2.5×2.5 м', guests: 2, description: 'Улучшенная версия мини-модели', category: 'mini', images: [], inStock: true },
  { id: 12, name: 'Capsule Mini Lux', price: 1100000, dimensions: '4×2.5×2.8 м', guests: 2, description: 'Премиум мини с расширенной комплектацией', category: 'mini', images: [], inStock: true },
  
  // Дизайнерские капсульные дома
  { id: 13, name: 'Capsule Designer Classic', price: 2190000, dimensions: '5×4×3 м', guests: 6, description: 'Классический дизайнерский дом', category: 'designer', images: [], inStock: true },
  { id: 14, name: 'Capsule Designer Modern', price: 2490000, dimensions: '5.5×4.5×3.5 м', guests: 6, description: 'Современный дизайнерский дом', category: 'designer', images: [], inStock: true },
  { id: 15, name: 'Capsule Designer Exclusive', price: 3490000, dimensions: '6×5×4 м', guests: 8, description: 'Эксклюзивный дизайнерский дом', category: 'designer', images: [], inStock: true },
  
  // Новый раздел 1
  { id: 16, name: 'Capsule New Model 1', price: 1390000, dimensions: '4×3×2.8 м', guests: 4, description: 'Новая модель 1', category: 'new-section-1', images: [], inStock: true },
  { id: 17, name: 'Capsule New Model 2', price: 1590000, dimensions: '4.5×3.5×3 м', guests: 4, description: 'Новая модель 2', category: 'new-section-1', images: [], inStock: true },
  
  // Новый раздел 2
  { id: 18, name: 'Capsule New Model 3', price: 1690000, dimensions: '5×3×3 м', guests: 4, description: 'Новая модель 3', category: 'new-section-2', images: [], inStock: true },
  { id: 19, name: 'Capsule New Model 4', price: 1890000, dimensions: '5×4×3 м', guests: 6, description: 'Новая модель 4', category: 'new-section-2', images: [], inStock: true },
  
  // Дополнительные товары для заполнения
  { id: 20, name: 'Capsule Two-Story Compact', price: 1690000, dimensions: '3.5×3×4.5 м', guests: 4, description: 'Компактный двухэтажный дом', category: 'two-story', images: [], inStock: true },
  { id: 21, name: 'Capsule Sliding Mini', price: 1090000, dimensions: '3.5×2.5×2.5 м', guests: 2, description: 'Мини раздвижной дом', category: 'sliding', images: [], inStock: true },
  { id: 22, name: 'Capsule Vertical Compact', price: 1290000, dimensions: '2.5×2.5×3.5 м', guests: 2, description: 'Компактный вертикальный дом', category: 'vertical', images: [], inStock: true },
  { id: 23, name: 'Capsule Mini Pro', price: 1050000, dimensions: '3.5×2.5×2.6 м', guests: 2, description: 'Профессиональная мини модель', category: 'mini', images: [], inStock: true },
  { id: 24, name: 'Capsule Designer Minimal', price: 1990000, dimensions: '4.5×3.5×3 м', guests: 4, description: 'Минималистичный дизайнерский дом', category: 'designer', images: [], inStock: true },
  { id: 25, name: 'Capsule Two-Story Family', price: 2790000, dimensions: '5.5×4.5×6.5 м', guests: 8, description: 'Семейный двухэтажный дом', category: 'two-story', images: [], inStock: true },
  { id: 26, name: 'Capsule Sliding Max', price: 2290000, dimensions: '7×5×4 м', guests: 10, description: 'Максимальный раздвижной дом', category: 'sliding', images: [], inStock: true },
  { id: 27, name: 'Capsule Vertical Premium', price: 1990000, dimensions: '3.5×3.5×5.5 м', guests: 6, description: 'Премиум вертикальный дом', category: 'vertical', images: [], inStock: true },
  { id: 28, name: 'Capsule Mini Deluxe', price: 1150000, dimensions: '4×2.8×3 м', guests: 2, description: 'Делюкс мини дом', category: 'mini', images: [], inStock: true },
  { id: 29, name: 'Capsule Designer Art', price: 2990000, dimensions: '5.5×4.5×3.5 м', guests: 6, description: 'Арт-дизайнерский дом', category: 'designer', images: [], inStock: true },
  { id: 30, name: 'Capsule Two-Story Grand', price: 3990000, dimensions: '7×6×8 м', guests: 12, description: 'Гранд двухэтажный дом', category: 'two-story', images: [], inStock: true },
]

interface ProductsStore {
  products: Product[]
  getProducts: () => Product[]
  getProductById: (id: number) => Product | undefined
  getProductsByCategory: (category: string) => Product[]
  getProductsByGuests: (guests: number) => Product[]
  getProductsByPriceRange: (min: number, max: number) => Product[]
  updateProduct: (id: number, product: Partial<Product>) => void
  addProduct: (product: Omit<Product, 'id'>) => void
  deleteProduct: (id: number) => void
}

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => {
      return {
        products: mockProducts,
        
        getProducts: () => get().products,
      
      getProductById: (id) => {
        return get().products.find((p) => p.id === id)
      },
      
      getProductsByCategory: (category) => {
        if (category === 'all') return get().products
        return get().products.filter((p) => p.category === category)
      },
      
      getProductsByGuests: (guests) => {
        return get().products.filter((p) => p.guests === guests)
      },
      
      getProductsByPriceRange: (min, max) => {
        return get().products.filter((p) => p.price >= min && p.price <= max)
      },
      
      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedProduct } : p
          ),
        }))
      },
      
      addProduct: (product) => {
        const newId = Math.max(...get().products.map((p) => p.id), 0) + 1
        const newProduct: Product = { ...product, id: newId }
        set((state) => ({
          products: [...state.products, newProduct],
        }))
      },
      
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }))
      },
      };
    },
    {
      name: 'capsule-products-storage-v3',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
