'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/sections/Hero'
import StepsInfographic from '@/components/sections/StepsInfographic'
import BestSellers from '@/components/sections/BestSellers'
import Advantages from '@/components/sections/Advantages'
import ConsultationForm from '@/components/sections/ConsultationForm'
import Reviews from '@/components/sections/Reviews'
import { useContentStore } from '@/store/contentStore'

const blockComponents: Record<string, React.ComponentType> = {
  hero: Hero,
  steps: StepsInfographic,
  advantages: Advantages,
  bestSellers: BestSellers,
  consultation: ConsultationForm,
  reviews: Reviews,
}

export default function Home() {
  const blocks = useContentStore((state) => 
    state.homePageBlocks
      .filter((block) => block.enabled)
      .sort((a, b) => a.order - b.order)
  )

  return (
    <main className="min-h-screen">
      <Header />
      {blocks.map((block) => {
        const Component = blockComponents[block.type]
        if (!Component) return null
        return <Component key={block.id} />
      })}
      <Footer />
    </main>
  )
}
