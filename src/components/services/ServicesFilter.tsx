'use client'
/**
 * components/services/ServicesFilter.tsx
 * Filter services by category — client component.
 */

import { useState } from 'react'
import Link from 'next/link'
import { services, serviceCategories, type ServiceCategory } from '@/data/services'
import { getWhatsAppUrl } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ServicesFilter() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all')

  const filtered = activeCategory === 'all'
    ? services.filter((s) => s.active)
    : services.filter((s) => s.active && s.category === activeCategory)

  return (
    <div className="bg-white">
      {/* Category filter pills */}
      <div className="sticky top-16 z-30 bg-white border-b border-medical-border shadow-sm">
        <div className="section-container py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 badge text-sm px-3 py-1.5 transition-colors ${
                activeCategory === 'all'
                  ? 'bg-navy-700 text-white'
                  : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
              }`}
              aria-pressed={activeCategory === 'all'}
            >
              الكل
            </button>
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 badge text-sm px-3 py-1.5 transition-colors ${
                  activeCategory === cat
                    ? 'bg-navy-700 text-white'
                    : 'bg-navy-50 text-navy-600 hover:bg-navy-100'
                }`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="section-container section-padding">
        <p className="text-medical-muted text-sm mb-5">
          {filtered.length} خدمة متاحة
          {activeCategory !== 'all' && ` في تصنيف "${activeCategory}"`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((service) => (
            <article
              key={service.id}
              className="nabd-card p-5 flex flex-col gap-3.5"
              aria-label={service.name}
            >
              <div className="flex items-start gap-3">
                <div className="service-icon text-3xl shrink-0" aria-hidden="true">
                  {service.iconEmoji}
                </div>
                <div className="min-w-0">
                  <span className="badge-navy text-xs mb-1 inline-block">{service.category}</span>
                  <h2 className="font-bold text-navy-700 text-base leading-snug">
                    {service.name}
                  </h2>
                </div>
              </div>

              <p className="text-medical-muted text-sm leading-relaxed line-clamp-2">
                {service.shortDescription}
              </p>

              <div className="flex flex-col gap-2 pt-1 mt-auto">
                {service.bookingEnabled ? (
                  <Link
                    href="/booking"
                    className="btn-primary text-sm py-2.5 w-full"
                    onClick={() => analytics.startBooking(service.id, service.name)}
                  >
                    احجز الخدمة
                  </Link>
                ) : (
                  <a
                    href={getWhatsAppUrl(service.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp text-sm py-2.5 w-full"
                    onClick={() => analytics.clickWhatsApp('services_filter', service.name)}
                  >
                    استفسر عبر واتساب
                  </a>
                )}
                <Link
                  href={`/services/${service.slug}`}
                  className="btn-ghost text-sm w-full justify-center"
                  onClick={() => analytics.viewService(service.id, service.name)}
                >
                  تفاصيل الخدمة
                  <ArrowLeftIcon className="w-3.5 h-3.5 ms-1 rtl:rotate-180" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
