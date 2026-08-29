'use client'
/**
 * components/sections/ServicesGrid.tsx — نبض للتمريض المنزلي
 * Services grid — featured (homepage) + full listing.
 */

import Link from 'next/link'
import { services, type NabdService } from '@/data/services'
import { getWhatsAppUrl } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import SocialShareButton from '@/components/ui/SocialShareButton'

import { useSettings } from '@/context/SettingsContext'

interface ServicesGridProps {
  featured?: boolean     // true = show 6 on homepage
  showFilter?: boolean   // true = show category filter
  category?: string      // filter by category
}

// Service Card
function ServiceCard({ service }: { service: NabdService }) {
  const { getServicePrice, getServiceBadge, isServiceBookingEnabled } = useSettings()

  const price = getServicePrice(service.id, '')
  const customBadge = getServiceBadge(service.id)
  const bookingEnabled = isServiceBookingEnabled(service.id, service.bookingEnabled)

  return (
    <article
      className="nabd-card p-5 flex flex-col gap-3.5 group"
      aria-label={service.name}
    >
      {/* Icon */}
      <div className="service-icon text-3xl" aria-hidden="true">
        {service.iconEmoji}
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="badge-navy text-xs">
          {service.category}
        </span>
        {customBadge && (
          <span className="badge-gold text-xs font-bold">
            {customBadge}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-navy-700 leading-snug line-clamp-2">
        {service.name}
      </h3>

      {/* Description */}
      <p className="text-medical-muted text-sm leading-relaxed line-clamp-2 flex-1">
        {service.shortDescription}
      </p>

      {/* Price tag if set */}
      {price && (
        <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100">
          <span className="text-medical-muted font-medium">السعر:</span>
          <span className="font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded-lg">{price}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        {bookingEnabled ? (
          <Link
            href={`/booking?service=${service.id}`}
            className="btn-primary text-sm py-2.5 px-4 w-full"
            onClick={() => analytics.startBooking(service.id, service.name)}
            aria-label={`احجز خدمة ${service.name}`}
          >
            احجز الخدمة
          </Link>
        ) : (
          <a
            href={getWhatsAppUrl(service.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-sm py-2.5 px-4 w-full"
            onClick={() => analytics.clickWhatsApp('service_card', service.name)}
            aria-label={`تواصل لحجز ${service.name}`}
          >
            تواصل لمعرفة التفاصيل
          </a>
        )}
        <div className="flex items-center gap-2">
          <Link
            href={`/services/${service.slug}`}
            className="btn-ghost text-sm flex-1 justify-center"
            onClick={() => analytics.viewService(service.id, service.name)}
          >
            التفاصيل
            <ChevronLeftIcon className="w-3.5 h-3.5 ms-1" aria-hidden="true" />
          </Link>
          <SocialShareButton
            title={service.name}
            description={service.shortDescription}
            url={`/services/${service.slug}`}
            image={service.id === 'medical-supplies' ? '/vivachek.png' : '/og-image.jpg'}
            variant="compact"
            buttonText="مشاركة"
            detailsList={service.whatWeOffer}
            deliveryNote="خدمات تمريضية ورعاية منزلية باهتمام وأمان داخل دمياط."
            analyticsContext={`card_${service.id}`}
          />
        </div>
      </div>
    </article>
  )
}

// Skeleton card
function ServiceCardSkeleton() {
  return (
    <div className="nabd-card p-5 flex flex-col gap-3.5">
      <div className="skeleton w-14 h-14 rounded-2xl" />
      <div className="skeleton w-20 h-5 rounded-full" />
      <div className="skeleton w-3/4 h-5 rounded-lg" />
      <div className="skeleton w-full h-8 rounded-lg" />
      <div className="skeleton w-full h-10 rounded-xl" />
    </div>
  )
}

export default function ServicesGrid({
  featured = false,
  showFilter = false,
  category,
}: ServicesGridProps) {
  const displayedServices = featured
    ? services.filter((s) => s.active).slice(0, 6)
    : category
    ? services.filter((s) => s.active && s.category === category)
    : services.filter((s) => s.active)

  return (
    <section
      className={`${featured ? 'bg-gradient-section' : 'bg-white'}`}
      aria-labelledby="services-heading"
    >
      <div className="section-container section-padding">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 id="services-heading" className="section-title">
            {featured ? 'أهم خدمات نبض' : 'خدمات نبض للتمريض المنزلي'}
          </h2>
          <p className="section-subtitle">
            خدمات تمريضية وطبية منزلية حسب احتياج المريض وحالته.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {displayedServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* View all link (homepage only) */}
        {featured && (
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="btn-secondary inline-flex items-center gap-2"
            >
              عرض جميع الخدمات (15 خدمة)
              <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export { ServiceCardSkeleton }
