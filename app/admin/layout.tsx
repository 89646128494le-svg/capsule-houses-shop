import AdminLayout from '@/components/admin/AdminLayout'
import ToastProvider from '@/components/ToastProvider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider />
      <AdminLayout>{children}</AdminLayout>
    </>
  )
}
