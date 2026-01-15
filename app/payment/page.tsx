import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PaymentContent from '@/components/pages/PaymentContent'

export default function PaymentPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <PaymentContent />
      <Footer />
    </main>
  )
}
