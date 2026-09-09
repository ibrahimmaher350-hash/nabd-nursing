import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
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
        <section className="bg-gradient-primary py-8 sm:py-12">
          <div className="section-container">
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-xl transition-all group"
              >
                <ArrowRightIcon className="w-4 h-4 text-gold-400 transition-transform group-hover:translate-x-1" />
                <span>العودة للرئيسية</span>
              </Link>
              <Link
                href="/booking"
                className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline"
              >
                احجز خدمة الآن 📅
              </Link>
            </div>

            <div className="text-center">
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
