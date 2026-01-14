import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CatalogGrid from '@/components/CatalogGrid'

export default function CatalogPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <CatalogGrid />
      <Footer />
    </main>
  )
}
