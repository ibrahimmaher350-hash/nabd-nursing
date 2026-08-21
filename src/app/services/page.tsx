/**
 * app/services/page.tsx — نبض للتمريض المنزلي
 * /services — All services listing with filter
 */

import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import ServicesGrid from '@/components/sections/ServicesGrid'
import ServicesFilter from '@/components/services/ServicesFilter'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'جميع الخدمات التمريضية المنزلية',
  description:
    'استعرض جميع خدمات التمريض المنزلي التي تقدمها نبض في دمياط — حقن، محاليل، جروح، قسطرة، كانيولا، قياسات، ورعاية كبار السن.',
  alternates: { canonical: '/services' },
}

// Structured data for services page
const servicesPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'خدمات نبض للتمريض المنزلي',
  description: 'قائمة خدمات التمريض المنزلي في دمياط',
  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/services`,
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }}
      />
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-primary py-10 sm:py-14">
          <div className="section-container text-center">
            <span className="badge bg-white/20 text-white mb-3">15 خدمة متاحة</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              خدمات نبض للتمريض المنزلي
            </h1>
            <p className="text-white/75 text-base sm:text-lg max-w-xl mx-auto">
              خدمات تمريضية وطبية منزلية حسب احتياج المريض وحالته في دمياط.
            </p>
            <p className="text-white/50 text-sm mt-3">
              {siteConfig.booking.pricingNote}
            </p>
          </div>
        </section>

        {/* Filter + Grid */}
        <ServicesFilter />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
