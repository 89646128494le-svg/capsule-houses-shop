import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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

export interface HomePageBlock {
  id: string
  type: 'hero' | 'steps' | 'advantages' | 'bestSellers' | 'consultation' | 'reviews'
  enabled: boolean
  order: number
  config?: Record<string, any>
}

export interface Advantage {
  id: string
  icon: string
  title: string
  description: string
  color: string
}

export interface HeroContent {
  title: string
  subtitle: string
  ctaText: string
}

export interface PageBlock {
  id: string
  type: string
  enabled: boolean
  order: number
  config: Record<string, any>
}

export interface InnovationItem {
  id: string
  icon: string
  title: string
  description: string
}

export interface MaterialItem {
  id: string
  name: string
  description: string
  icon: string
}

export interface StageItem {
  id: string
  icon: string
  title: string
  description: string
  time: string
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
}

export interface PageBlocks {
  [pageSlug: string]: PageBlock[]
}

export interface PageCustomData {
  about?: {
    heroTitle: string
    heroSubtitle: string
    innovations: InnovationItem[]
    materials: MaterialItem[]
    galleryTitle: string
  }
  equipment?: {
    heroTitle: string
    heroSubtitle: string
    baseEquipment: Array<{ id: string; name: string; included: boolean }>
    additionalOptions: Array<{ id: string; name: string; price: number }>
  }
  payment?: {
    heroTitle: string
    heroSubtitle: string
    stages: StageItem[]
    paymentMethods: PaymentMethod[]
  }
  partners?: {
    heroTitle: string
    heroSubtitle: string
    benefits: Array<{ id: string; title: string; description: string; icon?: string }>
    requirements: Array<{ id: string; text: string }>
  }
  promotions?: {
    heroTitle: string
    heroSubtitle: string
  }
}

interface ContentStore {
  pages: PageContent[]
  reviews: Review[]
  promotions: Promotion[]
  footerContent: FooterContent
  homePageBlocks: HomePageBlock[]
  advantages: Advantage[]
  heroContent: HeroContent
  pageBlocks: PageBlocks
  pageCustomData: PageCustomData
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
  updateHomePageBlocks: (blocks: HomePageBlock[]) => void
  toggleBlock: (id: string, enabled: boolean) => void
  updateAdvantages: (advantages: Advantage[]) => void
  updateHeroContent: (content: Partial<HeroContent>) => void
  updatePageBlocks: (pageSlug: string, blocks: PageBlock[]) => void
  updatePageCustomData: (pageSlug: string, data: any) => void
  togglePageBlock: (pageSlug: string, blockId: string, enabled: boolean) => void
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
  {
    id: 'partners',
    title: 'Партнёрам',
    slug: '/partners',
    content: 'Станьте нашим партнером и получите выгодные условия сотрудничества. Мы предлагаем эксклюзивные условия для дилеров и дистрибьюторов.',
  },
  {
    id: 'promotions',
    title: 'Акции',
    slug: '/promotions',
    content: 'Специальные предложения и акции для наших клиентов. Следите за обновлениями!',
  },
  {
    id: 'contacts',
    title: 'Контакты',
    slug: '/contacts',
    content: 'Свяжитесь с нами любым удобным способом. Мы всегда готовы ответить на ваши вопросы.',
  },
  {
    id: 'catalog',
    title: 'Каталог',
    slug: '/catalog',
    content: 'Выберите идеальный капсульный дом из нашего каталога. Разнообразие моделей для любых потребностей.',
  },
  {
    id: 'cart',
    title: 'Корзина',
    slug: '/cart',
    content: 'Ваша корзина покупок. Здесь вы можете управлять выбранными товарами перед оформлением заказа.',
  },
  {
    id: 'callback',
    title: 'Обратный звонок',
    slug: '/callback',
    content: 'Оставьте заявку на обратный звонок, и наш менеджер свяжется с вами в ближайшее время.',
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

const initialHomePageBlocks: HomePageBlock[] = [
  { id: 'hero', type: 'hero', enabled: true, order: 0 },
  { id: 'steps', type: 'steps', enabled: true, order: 1 },
  { id: 'advantages', type: 'advantages', enabled: true, order: 2 },
  { id: 'bestSellers', type: 'bestSellers', enabled: true, order: 3 },
  { id: 'consultation', type: 'consultation', enabled: true, order: 4 },
  { id: 'reviews', type: 'reviews', enabled: true, order: 5 },
]

const initialAdvantages: Advantage[] = [
  { id: '1', icon: 'Zap', title: 'Быстрая сборка', description: 'Монтаж за 1-3 дня без сложных фундаментов', color: 'from-yellow-400 to-orange-500' },
  { id: '2', icon: 'Shield', title: 'Высокое качество', description: 'Современные материалы и технологии производства', color: 'from-blue-400 to-cyan-500' },
  { id: '3', icon: 'Clock', title: 'Экономия времени', description: 'От заказа до заселения всего 2-4 недели', color: 'from-green-400 to-emerald-500' },
  { id: '4', icon: 'Leaf', title: 'Экологичность', description: 'Экологичные материалы, безопасные для здоровья', color: 'from-green-500 to-teal-600' },
  { id: '5', icon: 'Wrench', title: 'Простота монтажа', description: 'Не требует специальных навыков для установки', color: 'from-purple-400 to-pink-500' },
  { id: '6', icon: 'TrendingUp', title: 'Рентабельность', description: 'Низкие затраты на эксплуатацию и обслуживание', color: 'from-cyan-400 to-blue-500' },
]

const initialHeroContent: HeroContent = {
  title: 'Капсульные дома будущего уже здесь',
  subtitle: 'Инновационные решения для комфортной жизни. Быстрая сборка, экологичные материалы, умные технологии. Создайте свой идеальный дом за считанные дни.',
  ctaText: 'В каталог',
}

const initialPageCustomData: PageCustomData = {
  about: {
    heroTitle: 'О продукте',
    heroSubtitle: 'Инновационные капсульные дома — это будущее комфортного и экологичного жилья. Мы создаем дома нового поколения с использованием передовых технологий.',
    innovations: [
      { id: '1', icon: 'Zap', title: 'Инновационные технологии', description: 'Использование современных материалов и технологий производства для создания долговечных и энергоэффективных домов.' },
      { id: '2', icon: 'Shield', title: 'Высокое качество', description: 'Строгий контроль качества на всех этапах производства. Гарантия на все материалы и работы.' },
      { id: '3', icon: 'Leaf', title: 'Экологичность', description: 'Использование экологически чистых материалов, безопасных для здоровья человека и окружающей среды.' },
      { id: '4', icon: 'Wrench', title: 'Простота монтажа', description: 'Модульная конструкция позволяет собрать дом за 1-3 дня без специальных навыков и сложного оборудования.' },
    ],
    materials: [
      { id: '1', name: 'Каркас', description: 'Прочный алюминиевый каркас с антикоррозийным покрытием', icon: '🏗️' },
      { id: '2', name: 'Утепление', description: 'Эковата и современные теплоизоляционные материалы', icon: '🧱' },
      { id: '3', name: 'Умный замок', description: 'Система умного дома с управлением через смартфон', icon: '🔐' },
    ],
    galleryTitle: 'Реализованные проекты',
  },
  equipment: {
    heroTitle: 'Комплектация',
    heroSubtitle: 'Выберите базовую комплектацию и дополнительные опции для вашего дома.',
    baseEquipment: [
      { id: '1', name: 'Алюминиевый каркас', included: true },
      { id: '2', name: 'Утепление эковатой', included: true },
      { id: '3', name: 'Внутренняя отделка', included: true },
      { id: '4', name: 'Окна и двери', included: true },
      { id: '5', name: 'Электрика', included: true },
      { id: '6', name: 'Сантехника', included: true },
    ],
    additionalOptions: [
      { id: '101', name: 'Умный дом (управление через смартфон)', price: 50000 },
      { id: '102', name: 'Солнечные панели', price: 150000 },
      { id: '103', name: 'Система вентиляции с рекуперацией', price: 80000 },
      { id: '104', name: 'Теплый пол', price: 60000 },
      { id: '105', name: 'Мебель в комплекте', price: 200000 },
      { id: '106', name: 'Дополнительное утепление', price: 40000 },
    ],
  },
  payment: {
    heroTitle: 'Оплата и доставка',
    heroSubtitle: 'Прозрачные условия оплаты и быстрая доставка по всей России.',
    stages: [
      { id: '1', icon: 'CreditCard', title: 'Предоплата', description: '30% от стоимости при оформлении заказа', time: 'Сразу' },
      { id: '2', icon: 'Calendar', title: 'Производство', description: 'Изготовление модулей на производстве', time: '2-3 недели' },
      { id: '3', icon: 'Truck', title: 'Доставка', description: 'Доставка до вашего участка', time: '1-3 дня' },
      { id: '4', icon: 'Wrench', title: 'Сборка', description: 'Профессиональная сборка нашими специалистами', time: '1-3 дня' },
    ],
    paymentMethods: [
      { id: '1', name: 'Банковские карты', icon: '💳' },
      { id: '2', name: 'Рассрочка', icon: '📅' },
      { id: '3', name: 'СБП (Система быстрых платежей)', icon: '📱' },
      { id: '4', name: 'Банковский перевод', icon: '🏦' },
    ],
  },
  partners: {
    heroTitle: 'Партнёрам',
    heroSubtitle: 'Станьте нашим партнером и получите выгодные условия сотрудничества.',
    benefits: [
      { id: '1', title: 'Выгодные цены', description: 'Специальные оптовые цены для партнеров', icon: 'TrendingUp' },
      { id: '2', title: 'Маркетинговая поддержка', description: 'Готовые материалы для продвижения', icon: 'Users' },
      { id: '3', title: 'Обучение персонала', description: 'Программы обучения для вашей команды', icon: 'Award' },
    ],
    requirements: [
      { id: '1', text: 'Опыт работы в строительной отрасли' },
      { id: '2', text: 'Стабильный денежный поток' },
      { id: '3', text: 'Готовность инвестировать в развитие' },
    ],
  },
  promotions: {
    heroTitle: 'Акции',
    heroSubtitle: 'Специальные предложения и скидки на капсульные дома.',
  },
  contacts: {
    heroTitle: 'Контакты',
    heroSubtitle: 'Свяжитесь с нами любым удобным способом. Мы всегда готовы ответить на ваши вопросы.',
  },
  catalog: {
    heroTitle: 'Каталог',
    heroSubtitle: 'Выберите идеальный капсульный дом из нашего каталога. Разнообразие моделей для любых потребностей.',
  },
  cart: {
    heroTitle: 'Корзина',
    heroSubtitle: 'Ваша корзина покупок. Здесь вы можете управлять выбранными товарами перед оформлением заказа.',
  },
  callback: {
    heroTitle: 'Обратный звонок',
    heroSubtitle: 'Оставьте заявку на обратный звонок, и наш менеджер свяжется с вами в ближайшее время.',
  },
}

const initialPageBlocks: PageBlocks = {
  '/about': [
    { id: 'hero', type: 'hero', enabled: true, order: 0, config: {} },
    { id: 'innovations', type: 'innovations', enabled: true, order: 1, config: {} },
    { id: 'materials', type: 'materials', enabled: true, order: 2, config: {} },
    { id: 'gallery', type: 'gallery', enabled: true, order: 3, config: {} },
  ],
  '/equipment': [
    { id: 'hero', type: 'hero', enabled: true, order: 0, config: {} },
    { id: 'baseEquipment', type: 'baseEquipment', enabled: true, order: 1, config: {} },
    { id: 'additionalOptions', type: 'additionalOptions', enabled: true, order: 2, config: {} },
  ],
  '/payment': [
    { id: 'hero', type: 'hero', enabled: true, order: 0, config: {} },
    { id: 'stages', type: 'stages', enabled: true, order: 1, config: {} },
    { id: 'paymentMethods', type: 'paymentMethods', enabled: true, order: 2, config: {} },
  ],
  '/partners': [
    { id: 'hero', type: 'hero', enabled: true, order: 0, config: {} },
    { id: 'benefits', type: 'benefits', enabled: true, order: 1, config: {} },
    { id: 'requirements', type: 'requirements', enabled: true, order: 2, config: {} },
  ],
  '/promotions': [
    { id: 'hero', type: 'hero', enabled: true, order: 0, config: {} },
  ],
  '/contacts': [
    { id: 'hero', type: 'hero', enabled: true, order: 0, config: {} },
    { id: 'contactInfo', type: 'contactInfo', enabled: true, order: 1, config: {} },
    { id: 'map', type: 'map', enabled: true, order: 2, config: {} },
  ],
  '/catalog': [
    { id: 'hero', type: 'hero', enabled: true, order: 0, config: {} },
    { id: 'products', type: 'products', enabled: true, order: 1, config: {} },
    { id: 'filters', type: 'filters', enabled: true, order: 2, config: {} },
  ],
  '/cart': [
    { id: 'hero', type: 'hero', enabled: true, order: 0, config: {} },
    { id: 'cartItems', type: 'cartItems', enabled: true, order: 1, config: {} },
    { id: 'checkout', type: 'checkout', enabled: true, order: 2, config: {} },
  ],
  '/callback': [
    { id: 'hero', type: 'hero', enabled: true, order: 0, config: {} },
    { id: 'form', type: 'form', enabled: true, order: 1, config: {} },
  ],
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set) => ({
  pages: initialPages,
  reviews: initialReviews,
  promotions: initialPromotions,
  footerContent: initialFooterContent,
  homePageBlocks: initialHomePageBlocks,
  advantages: initialAdvantages,
  heroContent: initialHeroContent,
  pageBlocks: initialPageBlocks,
  pageCustomData: initialPageCustomData,
  
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
  
  updateHomePageBlocks: (blocks) => {
    set({ homePageBlocks: blocks })
  },
  
  toggleBlock: (id, enabled) => {
    set((state) => ({
      homePageBlocks: state.homePageBlocks.map((block) =>
        block.id === id ? { ...block, enabled } : block
      ),
    }))
  },
  
  updateAdvantages: (advantages) => {
    set({ advantages })
  },
  
  updateHeroContent: (content) => {
    set((state) => ({
      heroContent: { ...state.heroContent, ...content },
    }))
  },
  
  updatePageBlocks: (pageSlug, blocks) => {
    set((state) => ({
      pageBlocks: {
        ...state.pageBlocks,
        [pageSlug]: blocks,
      },
    }))
  },
  
  updatePageCustomData: (pageSlug, data) => {
    set((state) => ({
      pageCustomData: {
        ...state.pageCustomData,
        [pageSlug]: {
          ...state.pageCustomData[pageSlug as keyof typeof state.pageCustomData],
          ...data,
        },
      },
    }))
  },
  
  togglePageBlock: (pageSlug, blockId, enabled) => {
    set((state) => {
      const currentBlocks = state.pageBlocks[pageSlug] || []
      return {
        pageBlocks: {
          ...state.pageBlocks,
          [pageSlug]: currentBlocks.map((block) =>
            block.id === blockId ? { ...block, enabled } : block
          ),
        },
      }
    })
  },
    }),
    {
      name: 'capsule-content-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
