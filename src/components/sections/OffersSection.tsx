'use client'
/**
 * components/sections/OffersSection.tsx — نبض للتمريض المنزلي
 * قسم العروض والخصومات — يظهر في الصفحة الرئيسية بتصميم عالي التباين
 */

import Link from 'next/link'
import { type NabdOffer } from '@/data/offers'
import { siteConfig } from '@/data/siteConfig'
import { CalendarDaysIcon, SparklesIcon } from '@heroicons/react/24/solid'

const BADGE_COLORS = {
  gold: 'bg-gold-500 text-white shadow-gold',
  emerald: 'bg-emerald-500 text-white',
  red: 'bg-red-500 text-white',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric', year: 'numeric' })
}

function OfferCard({ offer }: { offer: NabdOffer }) {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(offer.whatsappMessage)}`

  return (
    <article
      className="relative rounded-3xl overflow-hidden shadow-2xl border border-navy-700/80 text-white"
      style={{
        backgroundColor: '#0B122E',
        backgroundImage: 'linear-gradient(145deg, #0B122E 0%, #162357 55%, #0B122E 100%)',
      }}
      aria-label={offer.title}
    >
      {/* Decorative glow */}
      <div
        className="absolute top-0 end-0 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 p-5 sm:p-7">
        {/* Header: Emoji, Title, Badges */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#121B42] border border-navy-500/60 flex items-center justify-center text-3xl shrink-0 shadow-md">
              {offer.emoji}
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <SparklesIcon className="w-4 h-4 text-gold-400" aria-hidden="true" />
                <span className="text-gold-400 text-xs font-black uppercase tracking-wide">
                  عرض لفترة محدودة
                </span>
              </div>
              <h3 className="text-white font-extrabold text-base sm:text-lg lg:text-xl leading-tight">
                {offer.title}
              </h3>
            </div>
          </div>

          {/* Validity badge */}
          <div className="flex items-center gap-1.5 bg-[#121B42] border border-navy-500/50 rounded-xl px-3 py-1.5 shrink-0 self-start sm:self-auto text-gold-300 text-xs font-semibold">
            <CalendarDaysIcon className="w-3.5 h-3.5 text-gold-400" aria-hidden="true" />
            <span>حتى {formatDate(offer.validUntil)}</span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-slate-200 text-sm leading-relaxed mb-6">
          {offer.subtitle}
        </p>

        {/* Packages grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          {offer.packages.map((pkg, i) => (
            <div
              key={i}
              className="relative bg-[#121B42] border border-navy-500/60 hover:border-gold-500/50 rounded-2xl p-4 flex flex-col gap-2.5 shadow-lg transition-colors"
            >
              {/* Badge */}
              {pkg.badge && (
                <span
                  className={`self-start text-xs font-black px-2.5 py-1 rounded-full ${
                    BADGE_COLORS[pkg.badgeColor ?? 'gold']
                  }`}
                >
                  {pkg.badge}
                </span>
              )}

              {/* Main label */}
              <div>
                {pkg.highlight && (
                  <span className="text-gold-400 text-3xl font-black block leading-none mb-1">
                    {pkg.highlight}
                  </span>
                )}
                <p className="text-white font-extrabold text-sm sm:text-base leading-snug">
                  {pkg.label}
                </p>
              </div>

              {/* Gift line */}
              {pkg.gift && (
                <div className="flex items-start gap-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-2.5 mt-auto">
                  <span className="text-lg shrink-0" aria-hidden="true">
                    🎁
                  </span>
                  <p className="text-emerald-300 text-xs leading-relaxed font-bold">
                    {pkg.gift}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col xs:flex-row gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp flex-1 justify-center text-sm sm:text-base font-bold py-3.5 shadow-lg"
          >
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            احجز العرض عبر واتساب
          </a>
          <Link
            href={`/services/${offer.serviceSlug}`}
            className="inline-flex items-center justify-center gap-2 bg-[#121B42] hover:bg-navy-700 border border-navy-500/70 text-white font-bold rounded-2xl px-5 py-3.5 text-sm transition-colors"
          >
            تفاصيل الخدمة ←
          </Link>
        </div>
      </div>
    </article>
  )
}

interface OffersSectionProps {
  offers: NabdOffer[]
}

export default function OffersSection({ offers }: OffersSectionProps) {
  if (!offers || offers.length === 0) return null

  return (
    <section
      className="bg-medical-gray border-b border-medical-border"
      aria-labelledby="offers-heading"
      id="offers"
    >
      <div className="section-container section-padding">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-gold-100 border border-gold-300 rounded-full px-4 py-1.5 mb-3">
            <SparklesIcon className="w-4 h-4 text-gold-600" aria-hidden="true" />
            <span className="text-gold-800 text-xs sm:text-sm font-extrabold">
              عروض حصرية لفترة محدودة
            </span>
          </div>
          <h2 id="offers-heading" className="section-title">
            عروض وخصومات نبض 🎁
          </h2>
          <p className="section-subtitle">
            استفد من عروضنا المميزة على خدمات التمريض المنزلي داخل دمياط
          </p>
        </div>

        {/* Offers grid */}
        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>

        {/* CTA footer */}
        <div className="text-center mt-8">
          <Link
            href="/offers"
            className="btn-secondary inline-flex items-center gap-2 font-bold px-6 py-3"
          >
            <SparklesIcon className="w-4 h-4 text-gold-500" aria-hidden="true" />
            عرض جميع العروض والخصومات
          </Link>
        </div>
      </div>
    </section>
  )
}
