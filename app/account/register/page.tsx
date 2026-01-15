import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <RegisterForm />
      <Footer />
    </main>
  )
}
