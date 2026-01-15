'use client'

import { usePathname } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ToastProvider from '@/components/ToastProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <>
      <ToastProvider />
      {isLoginPage ? children : <AdminLayout>{children}</AdminLayout>}
    </>
  )
}
