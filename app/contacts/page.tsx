import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactsContent from '@/components/pages/ContactsContent'

export default function ContactsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <ContactsContent />
      <Footer />
    </main>
  )
}
