/**
 * app/(main)/page.tsx — نبض للتمريض المنزلي
 * Homepage — Server Component (SSG)
 */

import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ServicesGrid from '@/components/sections/ServicesGrid'
import NursePromo from '@/components/sections/NursePromo'
import WhyNabd from '@/components/sections/WhyNabd'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FacebookPostSection from '@/components/sections/FacebookPostSection'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: { canonical: 'https://nabd-nursing.vercel.app/' },
}

// Revalidate every hour
export const revalidate = 3600

export default async function HomePage() {
  return (
    <>
      <Header />

      <main id="main-content">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Featured Services (Square cards) */}
        <ServicesGrid featured />

        {/* 3. Nurse Promo */}
        <NursePromo />

        {/* 4. Why Nabd */}
        <WhyNabd />

        {/* 5. Patient Testimonials */}
        <TestimonialsSection />

        {/* 6. Facebook Post Section */}
        <FacebookPostSection />

        {/* 7. FAQ */}
        <FAQ />

        {/* 8. Final CTA */}
        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}
