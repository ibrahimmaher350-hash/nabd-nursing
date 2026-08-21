'use client'
/**
 * components/sections/ServicesGrid.tsx — نبض للتمريض المنزلي
 * Services grid — featured (homepage) + full listing.
 */

import Link from 'next/link'
import { services, type NabdService } from '@/data/services'
import { getWhatsAppUrl } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface ServicesGridProps {
  featured?: boolean     // true = show 6 on homepage
  showFilter?: boolean   // true = show category filter
  category?: string      // filter by category
}

// Service Card
function ServiceCard({ service }: { service: NabdService }) {
  return (
    <article
      className="nabd-card p-5 flex flex-col gap-3.5 group"
      aria-label={service.name}
    >
      {/* Icon */}
      <div className="service-icon text-3xl" aria-hidden="true">
        {service.iconEmoji}
      </div>

      {/* Category badge */}
      <span className="badge-navy self-start text-xs">
        {service.category}
      </span>

      {/* Title */}
      <h3 className="text-base font-bold text-navy-700 leading-snug line-clamp-2">
        {service.name}
      </h3>

      {/* Description */}
      <p className="text-medical-muted text-sm leading-relaxed line-clamp-2 flex-1">
        {service.shortDescription}
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-1">
        {service.bookingEnabled ? (
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
        <Link
          href={`/services/${service.slug}`}
          className="btn-ghost text-sm w-full justify-center"
          onClick={() => analytics.viewService(service.id, service.name)}
        >
          التفاصيل
          <ArrowLeftIcon className="w-3.5 h-3.5 ms-1 rtl:rotate-180" aria-hidden="true" />
        </Link>
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
              <ArrowLeftIcon className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export { ServiceCardSkeleton }
