import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AccountContent from '@/components/pages/AccountContent'

export default function AccountPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <AccountContent />
      <Footer />
    </main>
  )
}
