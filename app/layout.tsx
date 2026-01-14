import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ToastProvider from '@/components/ToastProvider'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Капсульные дома | Инновационные решения для жизни',
  description: 'Современные капсульные дома с технологичным дизайном. Быстрая сборка, высокое качество, уникальные решения.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className={inter.className}>
        <ToastProvider />
        {children}
      </body>
    </html>
  )
}
