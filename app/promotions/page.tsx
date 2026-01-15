import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PromotionsContent from '@/components/pages/PromotionsContent'

export default function PromotionsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <PromotionsContent />
      <Footer />
    </main>
  )
}
