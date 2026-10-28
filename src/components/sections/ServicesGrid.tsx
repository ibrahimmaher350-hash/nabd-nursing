'use client'
/**
 * components/sections/ServicesGrid.tsx — شبكة الخدمات
 * بطاقات مربعة في صفين على الموبايل، الضغط يوسّع التفاصيل كاملاً
 */

import { useState } from 'react'
import Link from 'next/link'
import { services, type NabdService } from '@/data/services'
import { getWhatsAppUrl } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useSettings } from '@/context/SettingsContext'

interface ServicesGridProps {
  featured?: boolean
  showFilter?: boolean
  category?: string
}

// ── Modal تفاصيل الخدمة ──
function ServiceModal({ service, onClose }: { service: NabdService; onClose: () => void }) {
  const { getWhatsAppUrl: getWAUrl } = useSettings()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={service.name}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm flex items-center justify-between p-5 border-b border-slate-100 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{service.iconEmoji}</span>
            <div>
              <h3 className="font-extrabold text-navy-900 text-base leading-tight">{service.name}</h3>
              <span className="text-xs text-slate-500 font-medium">{service.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
            aria-label="إغلاق"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-5">
          {/* Description */}
          <p className="text-slate-700 text-sm leading-relaxed">
            {service.description || service.shortDescription}
          </p>

          {/* What we offer */}
          {service.whatWeOffer && service.whatWeOffer.length > 0 && (
            <div>
              <h4 className="font-bold text-navy-800 text-sm mb-2">ما نقدمه:</h4>
              <ul className="flex flex-col gap-1.5">
                {service.whatWeOffer.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            <a
              href={getWAUrl ? getWAUrl(service.name) : getWhatsAppUrl(service.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center py-3.5 text-sm"
              onClick={() => analytics.clickWhatsApp('service_modal', service.name)}
            >
              💬 احجز هذه الخدمة عبر واتساب
            </a>
            <Link
              href={`/services/${service.slug}`}
              className="btn-ghost w-full justify-center py-3 text-sm"
              onClick={() => {
                analytics.viewService(service.id, service.name)
                onClose()
              }}
            >
              عرض الصفحة الكاملة
              <ChevronLeftIcon className="w-3.5 h-3.5 ms-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── بطاقة الخدمة المربعة ──
function ServiceCard({ service, onClick }: { service: NabdService; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_12px_rgba(11,27,61,0.06)] hover:shadow-[0_8px_24px_rgba(11,27,61,0.12)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4 aspect-square text-center cursor-pointer overflow-hidden"
      aria-label={`${service.name} — اضغط لعرض التفاصيل`}
    >
      {/* Gradient blob */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Icon */}
      <span className="relative z-10 text-3xl sm:text-4xl leading-none" aria-hidden="true">
        {service.iconEmoji}
      </span>

      {/* Title */}
      <h3 className="relative z-10 text-xs sm:text-sm font-bold text-navy-800 leading-snug line-clamp-2 group-hover:text-gold-700 transition-colors">
        {service.name}
      </h3>

      {/* Tap hint */}
      <span className="relative z-10 text-[10px] text-slate-400 font-medium group-hover:text-emerald-500 transition-colors">
        اضغط للتفاصيل
      </span>
    </button>
  )
}

// Skeleton card
export function ServiceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 aspect-square flex flex-col items-center justify-center gap-2">
      <div className="skeleton w-12 h-12 rounded-2xl" />
      <div className="skeleton w-3/4 h-4 rounded-lg" />
      <div className="skeleton w-1/2 h-3 rounded-lg" />
    </div>
  )
}

export default function ServicesGrid({
  featured = false,
  showFilter = false,
  category,
}: ServicesGridProps) {
  const { isServiceActive } = useSettings()
  const [selectedService, setSelectedService] = useState<NabdService | null>(null)

  const displayedServices = featured
    ? services.filter((s) => isServiceActive(s.id, s.active)).slice(0, 6)
    : category
    ? services.filter((s) => isServiceActive(s.id, s.active) && s.category === category)
    : services.filter((s) => isServiceActive(s.id, s.active))

  return (
    <>
      <section
        id="services"
        className={`${featured ? 'bg-gradient-section' : 'bg-white'}`}
        aria-labelledby="services-heading"
      >
        <div className="section-container section-padding">
          {/* Header */}
          <AnimatedSection direction="up" className="text-center mb-8">
            <h2 id="services-heading" className="section-title">
              {featured ? 'أبرز خدماتنا التمريضية' : 'جميع خدمات التمريض المنزلي'}
            </h2>
            <p className="section-subtitle">
              اختر الخدمة التي تحتاجها واحجز فوراً عبر واتساب
            </p>
          </AnimatedSection>

          {/* Grid — 2 cols mobile, 3 desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {displayedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => {
                  setSelectedService(service)
                  analytics.viewService(service.id, service.name)
                }}
              />
            ))}
          </div>

          {/* View all link (homepage only) */}
          {featured && (
            <AnimatedSection direction="up" delay={0.1} className="text-center mt-8">
              <Link
                href="/services"
                className="btn-secondary inline-flex items-center gap-2"
              >
                عرض جميع الخدمات (15 خدمة)
                <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
              </Link>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  )
}
