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
  inStock: boolean
}

// 30 товаров для каталога
const mockProducts: Product[] = [
  // Мини (2 гостя)
  { id: 1, name: 'Capsule Mini', price: 890000, dimensions: '3×2×2.5 м', guests: 2, description: 'Компактное решение для двоих', category: 'mini', images: [], inStock: true },
  { id: 2, name: 'Capsule Mini Plus', price: 950000, dimensions: '3.5×2.5×2.5 м', guests: 2, description: 'Улучшенная версия мини-модели', category: 'mini', images: [], inStock: true },
  { id: 3, name: 'Capsule Mini Lux', price: 1100000, dimensions: '4×2.5×2.8 м', guests: 2, description: 'Премиум мини с расширенной комплектацией', category: 'mini', images: [], inStock: true },
  
  // Стандарт (4 гостя)
  { id: 4, name: 'Capsule Standard', price: 1290000, dimensions: '4×3×2.8 м', guests: 4, description: 'Идеальный вариант для семьи', category: 'standard', images: [], inStock: true },
  { id: 5, name: 'Capsule Standard Plus', price: 1450000, dimensions: '4.5×3.5×2.8 м', guests: 4, description: 'Увеличенная стандартная модель', category: 'standard', images: [], inStock: true },
  { id: 6, name: 'Capsule Standard Pro', price: 1590000, dimensions: '5×3.5×3 м', guests: 4, description: 'Профессиональная версия стандарта', category: 'standard', images: [], inStock: true },
  { id: 7, name: 'Capsule Family', price: 1390000, dimensions: '4.5×3×2.9 м', guests: 4, description: 'Специально для семей с детьми', category: 'standard', images: [], inStock: true },
  { id: 8, name: 'Capsule Comfort', price: 1490000, dimensions: '5×3×3 м', guests: 4, description: 'Максимальный комфорт для четверых', category: 'standard', images: [], inStock: true },
  
  // Премиум (6 гостей)
  { id: 9, name: 'Capsule Premium', price: 1890000, dimensions: '5×4×3 м', guests: 6, description: 'Просторное жильё с премиум-комплектацией', category: 'premium', images: [], inStock: true },
  { id: 10, name: 'Capsule Premium Plus', price: 2090000, dimensions: '6×4×3 м', guests: 6, description: 'Расширенная премиум модель', category: 'premium', images: [], inStock: true },
  { id: 11, name: 'Capsule Premium Max', price: 2290000, dimensions: '6×4.5×3.2 м', guests: 6, description: 'Максимальная премиум комплектация', category: 'premium', images: [], inStock: true },
  { id: 12, name: 'Capsule Executive', price: 1990000, dimensions: '5.5×4×3 м', guests: 6, description: 'Эксклюзивная модель для бизнеса', category: 'premium', images: [], inStock: true },
  
  // Люкс (8+ гостей)
  { id: 13, name: 'Capsule Luxe', price: 2490000, dimensions: '6×5×3.5 м', guests: 8, description: 'Максимальный комфорт и роскошь', category: 'luxe', images: [], inStock: true },
  { id: 14, name: 'Capsule Luxe Plus', price: 2790000, dimensions: '7×5×3.5 м', guests: 8, description: 'Расширенная люкс модель', category: 'luxe', images: [], inStock: true },
  { id: 15, name: 'Capsule Luxe Grand', price: 3190000, dimensions: '8×6×3.8 м', guests: 10, description: 'Гранд люкс для больших компаний', category: 'luxe', images: [], inStock: true },
  
  // Студия
  { id: 16, name: 'Capsule Studio', price: 1590000, dimensions: '5×3×3 м', guests: 4, description: 'Студийное пространство для творчества', category: 'studio', images: [], inStock: true },
  { id: 17, name: 'Capsule Studio Pro', price: 1790000, dimensions: '6×3.5×3 м', guests: 4, description: 'Профессиональная студия', category: 'studio', images: [], inStock: true },
  { id: 18, name: 'Capsule Art Studio', price: 1690000, dimensions: '5.5×3×3 м', guests: 4, description: 'Студия для художников', category: 'studio', images: [], inStock: true },
  
  // Офис
  { id: 19, name: 'Capsule Office', price: 1690000, dimensions: '4×4×3 м', guests: 2, description: 'Рабочее пространство нового уровня', category: 'office', images: [], inStock: true },
  { id: 20, name: 'Capsule Office Pro', price: 1890000, dimensions: '5×4×3 м', guests: 4, description: 'Профессиональный офис', category: 'office', images: [], inStock: true },
  { id: 21, name: 'Capsule CoWorking', price: 1990000, dimensions: '6×4×3 м', guests: 6, description: 'Коворкинг пространство', category: 'office', images: [], inStock: true },
  
  // Модульные комплексы
  { id: 22, name: 'Capsule Complex 2', price: 2490000, dimensions: '8×6×3.5 м', guests: 8, description: 'Комплекс из 2 модулей', category: 'complex', images: [], inStock: true },
  { id: 23, name: 'Capsule Complex 3', price: 3490000, dimensions: '12×6×3.5 м', guests: 12, description: 'Комплекс из 3 модулей', category: 'complex', images: [], inStock: true },
  { id: 24, name: 'Capsule Complex 4', price: 4490000, dimensions: '16×6×3.5 м', guests: 16, description: 'Комплекс из 4 модулей', category: 'complex', images: [], inStock: true },
  { id: 25, name: 'Capsule Village', price: 5990000, dimensions: '20×10×3.5 м', guests: 20, description: 'Целый посёлок из модулей', category: 'complex', images: [], inStock: true },
  
  // Специальные
  { id: 26, name: 'Capsule Eco', price: 1190000, dimensions: '4×3×2.8 м', guests: 4, description: 'Экологичная модель с солнечными панелями', category: 'eco', images: [], inStock: true },
  { id: 27, name: 'Capsule Smart', price: 1790000, dimensions: '5×4×3 м', guests: 6, description: 'Умный дом с полной автоматизацией', category: 'smart', images: [], inStock: true },
  { id: 28, name: 'Capsule Mobile', price: 1390000, dimensions: '4×3×2.8 м', guests: 4, description: 'Мобильная версия на колёсах', category: 'mobile', images: [], inStock: true },
  { id: 29, name: 'Capsule Winter', price: 1590000, dimensions: '4.5×3.5×3 м', guests: 4, description: 'Усиленная теплоизоляция для зимы', category: 'winter', images: [], inStock: true },
  { id: 30, name: 'Capsule Beach', price: 1490000, dimensions: '4×3×2.8 м', guests: 4, description: 'Специальная модель для прибрежной зоны', category: 'beach', images: [], inStock: true },
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
    (set, get) => ({
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
    }),
    {
      name: 'capsule-products-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
