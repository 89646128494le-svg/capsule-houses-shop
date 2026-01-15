import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/sections/Hero'
import StepsInfographic from '@/components/sections/StepsInfographic'
import BestSellers from '@/components/sections/BestSellers'
import Advantages from '@/components/sections/Advantages'
import ConsultationForm from '@/components/sections/ConsultationForm'
import Reviews from '@/components/sections/Reviews'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <StepsInfographic />
      <Advantages />
      <BestSellers />
      <ConsultationForm />
      <Reviews />
      <Footer />
    </main>
  )
}
