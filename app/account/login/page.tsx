import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen pt-20">
      <Header />
      <LoginForm />
      <Footer />
    </main>
  )
}
