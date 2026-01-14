import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetails from '@/components/ProductDetails'

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <ProductDetails productId={parseInt(params.id)} />
      <Footer />
    </main>
  )
}
