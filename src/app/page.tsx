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
import BlogSection from '@/components/sections/BlogSection'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import { getBlogProvider } from '@/lib/providers/BloggerProvider'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: { canonical: '/' },
}

// Revalidate every hour
export const revalidate = 3600

export default async function HomePage() {
  // Fetch blog posts server-side (with fallback)
  const blogProvider = getBlogProvider()
  const blogPosts = await blogProvider.getPosts(3)

  return (
    <>
      <Header />

      <main id="main-content">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Quick Actions */}
        <QuickActions />

        {/* 3. Featured Services */}
        <ServicesGrid featured />

        {/* 4. Nurse Promo — صورة الممرض الاحترافية */}
        <NursePromo />

        {/* 5. Why Nabd */}
        <WhyNabd />

        {/* 5. How It Works */}
        <HowItWorks />

        {/* 6. Blog Section */}
        <BlogSection posts={blogPosts} />

        {/* 7. FAQ */}
        <FAQ />

        {/* 8. Final CTA */}
        <FinalCTA />
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
