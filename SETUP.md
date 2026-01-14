# Инструкция по запуску проекта

## Быстрый старт

1. **Установите зависимости:**
```bash
npm install
```

2. **Запустите dev-сервер:**
```bash
npm run dev
```

3. **Откройте браузер:**
```
http://localhost:3000
```

## Что реализовано

### ✅ Phase 1: Архитектура и Layout

- **Next.js 14** с App Router и TypeScript
- **Tailwind CSS** с кастомной темой:
  - Deep Dark (#050505) - основной фон
  - Neon Cyan (#00FFFF) - акценты
  - Glassmorphism эффекты
- **Framer Motion** для плавных анимаций
- **Lucide Icons** для иконок

### ✅ Компоненты

1. **Header** (`components/Header.tsx`)
   - Фиксированная позиция с glassmorphism эффектом
   - Адаптивное меню (desktop/mobile)
   - Поиск по каталогу
   - Интеграция с модальным окном "Заказать звонок"

2. **Footer** (`components/Footer.tsx`)
   - Полная информация согласно ТЗ
   - Контакты, меню, социальные сети
   - Анимации при скролле

3. **Hero секция** (`components/sections/Hero.tsx`)
   - Градиентный заголовок
   - Анимированный фон
   - Кнопка "В каталог"
   - Плейсхолдер для 3D-рендера
   - Индикатор скролла

4. **Инфографика шагов** (`components/sections/StepsInfographic.tsx`)
   - 6 интерактивных карточек
   - Hover эффекты
   - Градиентные иконки

5. **Хиты продаж** (`components/sections/BestSellers.tsx`)
   - Сетка товаров (6 карточек)
   - Hover эффект смены изображения
   - Адаптивная верстка

### ✅ Модальные окна

- **CallbackModal** - форма "Заказать звонок"
- **QuickOrderModal** - форма "Быстрый заказ"

## Адаптивность

Проект полностью адаптивен с Mobile-first подходом:
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1919px  
- **Desktop**: 1920px+

## Следующие шаги (Phase 2)

- [ ] Система корзины (Zustand store)
- [ ] Страница каталога с фильтрами
- [ ] Страница товара с галереей
- [ ] Интеграция форм с бэкендом/CRM

## Структура проекта

```
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── catalog/
│       └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── modals/
│   │   ├── CallbackModal.tsx
│   │   └── QuickOrderModal.tsx
│   └── sections/
│       ├── Hero.tsx
│       ├── StepsInfographic.tsx
│       └── BestSellers.tsx
└── package.json
```
