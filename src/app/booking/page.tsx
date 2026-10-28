/**
 * app/booking/page.tsx — حجز الخدمة عبر واتساب
 * حجز فوري ومباشر عبر واتساب دون نماذج مطولة
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRightIcon, PhoneIcon } from '@heroicons/react/24/solid'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import { services } from '@/data/services'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'حجز خدمة تمريضية | نبض للتمريض المنزلي',
  description: 'احجز خدمتك التمريضية المنزلية مباشرة وبكل سهولة عبر محادثة واتساب الرسمية.',
  alternates: { canonical: 'https://nabd-nursing.vercel.app/booking' },
}

interface BookingPageProps {
  searchParams: { service?: string }
}

export default function BookingPage({ searchParams }: BookingPageProps) {
  const selectedService = services.find((s) => s.id === searchParams?.service)
  const serviceName = selectedService ? selectedService.name : 'خدمة تمريضية منزلية'
  const waMessage = encodeURIComponent(`السلام عليكم، أود حجز ${serviceName} من نبض للتمريض المنزلي`)
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${waMessage}`

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-slate-50 min-h-[80vh] py-8 sm:py-14">
          <div className="section-container">
            {/* Top Navigation */}
            <div className="max-w-md mx-auto mb-6 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-navy-900 bg-white hover:bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-xl transition-all shadow-xs group"
              >
                <ArrowRightIcon className="w-4 h-4 text-navy-600 transition-transform group-hover:translate-x-1" />
                <span>الرئيسية</span>
              </Link>
              <Link
                href="/services"
                className="text-xs font-bold text-navy-600 hover:text-navy-800 hover:underline"
              >
                تصفح جميع الخدمات
              </Link>
            </div>

            {/* Direct Booking Card */}
            <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 text-center">
              {/* Badge */}
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                💬
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-navy-900 mb-2">
                حجز موعد عبر واتساب
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                احجز خدمتك التمريضية الآن مباشرة وبأسرع وقت من خلال محادثة واتساب الرسمية مع فريق نبض.
              </p>

              {selectedService && (
                <div className="mb-6 bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3 text-start">
                  <span className="text-2xl">{selectedService.iconEmoji}</span>
                  <div>
                    <span className="text-xs text-slate-500 block">الخدمة المختارة:</span>
                    <strong className="text-sm font-bold text-navy-900">{selectedService.name}</strong>
                  </div>
                </div>
              )}

              {/* Main Booking Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center py-4 text-base font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all mb-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>بدء المحادثة على واتساب</span>
              </a>

              {/* Direct Call Button */}
              <a
                href={siteConfig.contact.callUrl}
                className="btn-call w-full justify-center py-3 text-sm font-bold"
              >
                <PhoneIcon className="w-4 h-4 text-gold-600" />
                <span>أو اتصل بنا مباشرةً ({siteConfig.contact.phone})</span>
              </a>

              {/* Trust Features */}
              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs text-slate-500 font-medium">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-emerald-500">✓</span>
                  <span>رد فوري 24 ساعة</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-emerald-500">✓</span>
                  <span>طاقم تمريضي مرخص</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
