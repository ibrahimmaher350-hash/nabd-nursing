/**
 * app/booking/page.tsx — نبض للتمريض المنزلي
 * /booking — Booking page
 */

import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingFlow from '@/components/booking/BookingFlow'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'احجز خدمة تمريضية',
  description: 'احجز خدمة التمريض المنزلي التي تحتاجها في دمياط مع نبض للتمريض المنزلي.',
  alternates: { canonical: '/booking' },
}

interface BookingPageProps {
  searchParams: { service?: string }
}

export default function BookingPage({ searchParams }: BookingPageProps) {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-gradient-section min-h-screen">
          <div className="section-container py-10 sm:py-14">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="badge-navy mb-3">احجز الآن</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-700 mb-2">
                احجز خدمة تمريضية
              </h1>
              <p className="text-medical-muted text-sm sm:text-base max-w-md mx-auto">
                أكمل الخطوات التالية لحجز الخدمة التي تحتاجها
              </p>

              {/* Emergency notice */}
              <div className="emergency-notice max-w-lg mx-auto mt-4 text-start">
                <span className="text-lg shrink-0" aria-hidden="true">⚠️</span>
                <p className="text-xs">
                  {siteConfig.booking.emergencyNotice}
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <BookingFlow defaultServiceId={searchParams?.service} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
