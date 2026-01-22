import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CatalogsContent from '@/components/pages/CatalogsContent'

export default function CatalogsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <CatalogsContent />
      <Footer />
    </main>
  )
}
