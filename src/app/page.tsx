/**
 * app/(main)/page.tsx — نبض للتمريض المنزلي
 * Homepage — Server Component (SSG)
 */

import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import HeroSection from '@/components/sections/HeroSection'
import QuickActions from '@/components/sections/QuickActions'
import ServicesGrid from '@/components/sections/ServicesGrid'
import NursePromo from '@/components/sections/NursePromo'
import WhyNabd from '@/components/sections/WhyNabd'
import HowItWorks from '@/components/sections/HowItWorks'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FacebookPostSection from '@/components/sections/FacebookPostSection'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: { canonical: '/' },
}

// Revalidate every hour
export const revalidate = 3600

export default async function HomePage() {
  return (
    <>
      <Header />

      <main id="main-content">
        {/* 1. Hero with CareHub Live Nurse Badge */}
        <HeroSection />

        {/* 2. Quick Actions */}
        <QuickActions />

        {/* 3. Featured Services */}
        <ServicesGrid featured />

        {/* 4. Nurse Promo — صورة الممرض الاحترافية */}
        <NursePromo />

        {/* 5. Why Nabd */}
        <WhyNabd />

        {/* 6. How It Works */}
        <HowItWorks />

        {/* 7. Patient Testimonials — آراء وتقييمات مرضانا وعائلاتهم */}
        <TestimonialsSection />

        {/* 8. Facebook Post Section — المنشور الرسمي والتفاعل الحي */}
        <FacebookPostSection />

        {/* 9. FAQ */}
        <FAQ />

        {/* 10. Final CTA */}
        <FinalCTA />
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
