/**
 * app/offers/page.tsx — نبض للتمريض المنزلي
 * صفحة العروض والخصومات
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { SparklesIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import { offers, getActiveOffers, type NabdOffer } from '@/data/offers'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'عروض وخصومات نبض للتمريض المنزلي — دمياط',
  description: 'اكتشف أحدث عروض وخصومات نبض للتمريض المنزلي على خدمات الرعاية الصحية في دمياط.',
  alternates: { canonical: '/offers' },
}

export const revalidate = 3600

const BADGE_COLORS = {
  gold: 'bg-gold-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  red: 'bg-red-500 text-white',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
}

function OfferDetailCard({ offer }: { offer: NabdOffer }) {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(offer.whatsappMessage)}`
  const isActive = (() => {
    const now = new Date()
    const from = new Date(offer.validFrom)
    const until = new Date(offer.validUntil)
    until.setHours(23, 59, 59, 999)
    return now >= from && now <= until
  })()

  return (
    <article
      className={`relative rounded-3xl overflow-hidden border shadow-[0_8px_48px_rgba(11,18,46,0.3)] ${
        isActive ? 'border-gold-400/30' : 'border-medical-border opacity-70'
      }`}
      aria-label={offer.title}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${offer.bgGradient}`} />
      <div className="absolute top-0 end-0 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 p-6 sm:p-8">
        {/* Status + date */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
            isActive ? 'bg-emerald-500 text-white' : 'bg-medical-border text-medical-muted'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-medical-muted'}`} />
            {isActive ? 'العرض سارٍ الآن' : 'العرض منتهٍ'}
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white/70 text-xs">
            <CalendarDaysIcon className="w-3.5 h-3.5 text-gold-400" aria-hidden="true" />
            من {formatDate(offer.validFrom)} حتى {formatDate(offer.validUntil)}
          </span>
          <Link
            href={`/services/${offer.serviceSlug}`}
            className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-white/70 text-xs hover:bg-white/20 transition-colors"
          >
            خدمة: {offer.serviceName} ←
          </Link>
        </div>

        {/* Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl shrink-0">
            {offer.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SparklesIcon className="w-4 h-4 text-gold-400" aria-hidden="true" />
              <span className="text-gold-300 text-xs font-bold">عرض حصري</span>
            </div>
            <h2 className="!text-xl sm:!text-2xl font-extrabold text-white leading-tight">
              {offer.title}
            </h2>
          </div>
        </div>
        <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
          {offer.subtitle}
        </p>

        {/* Packages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
          {offer.packages.map((pkg, i) => (
            <div
              key={i}
              className="relative bg-white/8 border border-white/15 rounded-2xl p-5 flex flex-col gap-3"
            >
              {pkg.badge && (
                <span className={`self-start text-xs font-extrabold px-3 py-1 rounded-full ${BADGE_COLORS[pkg.badgeColor ?? 'gold']}`}>
                  {pkg.badge}
                </span>
              )}
              <div>
                {pkg.highlight && (
                  <p className="text-gold-300 text-4xl font-black leading-none mb-1">{pkg.highlight}</p>
                )}
                <p className="text-white font-bold text-base sm:text-lg leading-snug">{pkg.label}</p>
              </div>
              {pkg.gift && (
                <div className="flex items-start gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-3 mt-auto">
                  <span className="text-xl shrink-0" aria-hidden="true">🎁</span>
                  <p className="text-emerald-200 text-xs leading-relaxed font-medium">{pkg.gift}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        {isActive && (
          <div className="flex flex-col xs:flex-row gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp flex-1 justify-center py-4 text-base"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              احجز العرض عبر واتساب
            </a>
            <Link
              href={`/services/${offer.serviceSlug}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-bold rounded-2xl px-6 py-4 text-sm hover:bg-white/10 transition-colors"
            >
              تفاصيل الخدمة ←
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}

export default async function OffersPage() {
  const activeOffers = getActiveOffers()
  const expiredOffers = offers.filter((o) => !activeOffers.find((a) => a.id === o.id))

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-primary py-12 sm:py-16" aria-label="عروض نبض">
          <div className="section-container text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-4">
              <SparklesIcon className="w-4 h-4 text-gold-400" aria-hidden="true" />
              <span className="text-white/90 text-sm font-medium">عروض وخصومات</span>
            </div>
            <h1 className="!text-2xl sm:!text-3xl lg:!text-4xl font-extrabold text-white mb-3">
              عروض وخصومات <span className="text-gold-300">نبض</span> 🎁
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto">
              استفد من عروضنا الحصرية على خدمات التمريض المنزلي — نحرص دائماً على تقديم أفضل قيمة لصحتك.
            </p>
          </div>
        </section>

        {/* Active Offers */}
        <section className="bg-gradient-section py-10 sm:py-14" aria-labelledby="active-offers-heading">
          <div className="section-container">
            {activeOffers.length > 0 ? (
              <>
                <div className="flex items-center gap-3 mb-7">
                  <h2 id="active-offers-heading" className="text-xl sm:text-2xl font-extrabold text-navy-700">
                    العروض الحالية 🔥
                  </h2>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">
                    {activeOffers.length} عرض سارٍ
                  </span>
                </div>
                <div className="flex flex-col gap-8">
                  {activeOffers.map((offer) => (
                    <OfferDetailCard key={offer.id} offer={offer} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🔔</p>
                <h2 className="text-xl font-bold text-navy-700 mb-2">لا توجد عروض حالية</h2>
                <p className="text-medical-muted text-sm mb-6">
                  تابعنا دائماً لمعرفة أحدث عروضنا وخصوماتنا
                </p>
                <Link href="/" className="btn-primary px-8 py-3">
                  العودة للرئيسية
                </Link>
              </div>
            )}

            {/* Expired offers */}
            {expiredOffers.length > 0 && (
              <div className="mt-12">
                <h2 className="text-lg font-bold text-medical-muted mb-5">
                  عروض سابقة
                </h2>
                <div className="flex flex-col gap-6 opacity-60">
                  {expiredOffers.map((offer) => (
                    <OfferDetailCard key={offer.id} offer={offer} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
