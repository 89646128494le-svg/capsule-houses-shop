import { create } from 'zustand'

export interface PageContent {
  id: string
  title: string
  content: string
  slug: string
}

export interface Review {
  id: number
  author: string
  rating: number
  text: string
  date: string
  location?: string
  approved: boolean
}

export interface Promotion {
  id: number
  title: string
  description: string
  discount: string
  validUntil: string
  image: string
  active: boolean
}

export interface ContactInfo {
  phone: string
  email: string
  address: string
}

export interface SocialLink {
  id: string
  name: string
  href: string
  icon: string
}

export interface LegalInfo {
  privacyPolicyText: string
  ogrn: string
  companyName: string
}

export interface FooterContent {
  logoText: string
  description: string
  contacts: ContactInfo
  socialLinks: SocialLink[]
  legalInfo: LegalInfo
}

interface ContentStore {
  pages: PageContent[]
  reviews: Review[]
  promotions: Promotion[]
  footerContent: FooterContent
  updatePage: (slug: string, content: Partial<PageContent>) => void
  addReview: (review: Omit<Review, 'id' | 'date' | 'approved'>) => void
  updateReview: (id: number, review: Partial<Review>) => void
  deleteReview: (id: number) => void
  addPromotion: (promotion: Omit<Promotion, 'id'>) => void
  updatePromotion: (id: number, promotion: Partial<Promotion>) => void
  deletePromotion: (id: number) => void
  updateFooterContent: (content: Partial<FooterContent>) => void
  updateContactInfo: (contacts: Partial<ContactInfo>) => void
  updateSocialLink: (id: string, link: Partial<SocialLink>) => void
  updateLegalInfo: (legal: Partial<LegalInfo>) => void
}

const initialPages: PageContent[] = [
  {
    id: 'about',
    title: 'О продукте',
    slug: '/about',
    content: 'Инновационные капсульные дома — это будущее комфортного и экологичного жилья. Мы создаем дома нового поколения с использованием передовых технологий.',
  },
  {
    id: 'equipment',
    title: 'Комплектация',
    slug: '/equipment',
    content: 'Выберите базовую комплектацию и дополнительные опции для вашего дома.',
  },
  {
    id: 'payment',
    title: 'Оплата и доставка',
    slug: '/payment',
    content: 'Прозрачные условия оплаты и быстрая доставка по всей России.',
  },
]

const initialReviews: Review[] = [
  {
    id: 1,
    author: 'Иван Петров',
    rating: 5,
    text: 'Отличный дом! Очень доволен покупкой. Качество на высшем уровне, сборка заняла всего 2 дня. Рекомендую!',
    date: '15.01.2024',
    location: 'Москва',
    approved: true,
  },
  {
    id: 2,
    author: 'Мария Смирнова',
    rating: 5,
    text: 'Мечтали о собственном доме, и вот он! Современный, стильный, уютный. Всё продумано до мелочей.',
    date: '10.01.2024',
    location: 'Санкт-Петербург',
    approved: true,
  },
  {
    id: 3,
    author: 'Алексей Козлов',
    rating: 5,
    text: 'Прекрасное решение для дачи. Быстро, качественно, недорого. Очень доволен результатом!',
    date: '05.01.2024',
    location: 'Казань',
    approved: false,
  },
]

const initialPromotions: Promotion[] = [
  {
    id: 1,
    title: 'Скидка 15% на все модели',
    description: 'При заказе до конца месяца получите скидку 15% на любую модель капсульного дома',
    discount: '15%',
    validUntil: '31.01.2024',
    image: '🏠',
    active: true,
  },
  {
    id: 2,
    title: 'Рассрочка 0%',
    description: 'Оформите рассрочку на 12 месяцев без переплат и первоначального взноса',
    discount: '0%',
    validUntil: '29.02.2024',
    image: '💳',
    active: true,
  },
]

const initialFooterContent: FooterContent = {
  logoText: 'CAPSULE',
  description: 'Инновационные капсульные дома с технологичным дизайном. Быстрая сборка, высокое качество, уникальные решения для современной жизни.',
  contacts: {
    phone: '+7 (999) 123-45-67',
    email: 'info@capsulehouses.ru',
    address: 'г. Москва, ул. Примерная, д. 1',
  },
  socialLinks: [
    { id: 'whatsapp', name: 'WhatsApp', href: '#', icon: '💬' },
    { id: 'telegram', name: 'Telegram', href: '#', icon: '✈️' },
    { id: 'vk', name: 'VK', href: '#', icon: 'VK' },
    { id: 'instagram', name: 'Instagram', href: '#', icon: 'IG' },
  ],
  legalInfo: {
    privacyPolicyText: 'Политика конфиденциальности',
    ogrn: '1234567890123',
    companyName: 'ИП Иванов Иван Иванович',
  },
}

export const useContentStore = create<ContentStore>((set) => ({
  pages: initialPages,
  reviews: initialReviews,
  promotions: initialPromotions,
  footerContent: initialFooterContent,
  
  updatePage: (slug, content) => {
    set((state) => ({
      pages: state.pages.map((page) =>
        page.slug === slug ? { ...page, ...content } : page
      ),
    }))
  },
  
  addReview: (review) => {
    const newReview: Review = {
      ...review,
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU'),
      approved: false,
    }
    set((state) => ({
      reviews: [newReview, ...state.reviews],
    }))
  },
  
  updateReview: (id, review) => {
    set((state) => ({
      reviews: state.reviews.map((r) =>
        r.id === id ? { ...r, ...review } : r
      ),
    }))
  },
  
  deleteReview: (id) => {
    set((state) => ({
      reviews: state.reviews.filter((r) => r.id !== id),
    }))
  },
  
  addPromotion: (promotion) => {
    const newPromotion: Promotion = {
      ...promotion,
      id: Date.now(),
    }
    set((state) => ({
      promotions: [...state.promotions, newPromotion],
    }))
  },
  
  updatePromotion: (id, promotion) => {
    set((state) => ({
      promotions: state.promotions.map((p) =>
        p.id === id ? { ...p, ...promotion } : p
      ),
    }))
  },
  
  deletePromotion: (id) => {
    set((state) => ({
      promotions: state.promotions.filter((p) => p.id !== id),
    }))
  },
  
  updateFooterContent: (content) => {
    set((state) => ({
      footerContent: { ...state.footerContent, ...content },
    }))
  },
  
  updateContactInfo: (contacts) => {
    set((state) => ({
      footerContent: {
        ...state.footerContent,
        contacts: { ...state.footerContent.contacts, ...contacts },
      },
    }))
  },
  
  updateSocialLink: (id, link) => {
    set((state) => ({
      footerContent: {
        ...state.footerContent,
        socialLinks: state.footerContent.socialLinks.map((l) =>
          l.id === id ? { ...l, ...link } : l
        ),
      },
    }))
  },
  
  updateLegalInfo: (legal) => {
    set((state) => ({
      footerContent: {
        ...state.footerContent,
        legalInfo: { ...state.footerContent.legalInfo, ...legal },
      },
    }))
  },
}))
