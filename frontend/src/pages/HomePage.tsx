import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { MobileCtaBar } from '../components/layout/MobileCtaBar'
import { WhatsAppFloat } from '../components/contact/WhatsAppFloat'
import { LoginModal } from '../components/auth/LoginModal'
import { Hero } from '../components/home/Hero'
import { TrustStrip } from '../components/home/TrustStrip'
import { Services } from '../components/home/Services'
import { WhySS } from '../components/home/WhySS'
import { OurWork } from '../components/home/OurWork'
import { ProjectFeature } from '../components/home/ProjectFeature'
import { Quote } from '../components/home/Quote'
import { About } from '../components/home/About'
import { FAQ } from '../components/home/FAQ'
import { FinalCTA } from '../components/home/FinalCTA'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const loginOpen = searchParams.get('login') === '1'

  const closeLogin = useCallback(() => {
    const next = new URLSearchParams(searchParams)
    next.delete('login')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <Services />
        <WhySS />
        <OurWork />
        <ProjectFeature />
        <Quote />
        <About />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileCtaBar />
      <WhatsAppFloat />
      <LoginModal open={loginOpen} onClose={closeLogin} />
    </>
  )
}
