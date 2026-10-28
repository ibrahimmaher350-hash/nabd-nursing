'use client'
/**
 * components/services/ServicesFilter.tsx
 * تصفح وتصفية الخدمات — بطاقات مربعة متجاورة، والضغط يفتح التفاصيل كاملاً وحجز الواتساب
 */

import { useState } from 'react'
import Link from 'next/link'
import { services, serviceCategories, type ServiceCategory, type NabdService } from '@/data/services'
import { getWhatsAppUrl } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

// ── نافذة تفاصيل الخدمة ──
function ServiceModal({ service, onClose }: { service: NabdService; onClose: () => void }) {
  const waUrl = getWhatsAppUrl(service.name)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={service.name}
    >
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

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

        {/* Content */}
        <div className="p-5 flex flex-col gap-5">
          <p className="text-slate-700 text-sm leading-relaxed">
            {service.description || service.shortDescription}
          </p>

          {service.whatWeOffer && service.whatWeOffer.length > 0 && (
            <div>
              <h4 className="font-bold text-navy-800 text-sm mb-2">ما يشمله الإجراء التمريضي:</h4>
              <ul className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp w-full justify-center py-3.5 text-sm font-bold shadow-md"
              onClick={() => analytics.clickWhatsApp('services_filter_modal', service.name)}
            >
              💬 احجز الخدمة عبر واتساب الآن
            </a>
            <Link
              href={`/services/${service.slug}`}
              className="btn-ghost w-full justify-center py-3 text-sm font-bold"
              onClick={() => {
                analytics.viewService(service.id, service.name)
                onClose()
              }}
            >
              عرض الصفحة الكاملة للخدمة
              <ChevronLeftIcon className="w-3.5 h-3.5 ms-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ServicesFilter() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all')
  const [selectedService, setSelectedService] = useState<NabdService | null>(null)

  const filtered = activeCategory === 'all'
    ? services.filter((s) => s.active)
    : services.filter((s) => s.active && s.category === activeCategory)

  return (
    <div className="bg-slate-50 min-h-[70vh]">
      {/* Category filter pills */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-xs">
        <div className="section-container py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`shrink-0 rounded-full text-xs sm:text-sm font-bold px-4 py-2 transition-all ${
                activeCategory === 'all'
                  ? 'bg-navy-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              aria-pressed={activeCategory === 'all'}
            >
              الكل ({services.filter((s) => s.active).length})
            </button>
            {serviceCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full text-xs sm:text-sm font-bold px-4 py-2 transition-all ${
                  activeCategory === cat
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services square grid */}
      <div className="section-container section-padding">
        <p className="text-slate-500 text-xs sm:text-sm mb-5 font-medium">
          عرض {filtered.length} خدمة {activeCategory !== 'all' ? `ضمن تصنيف "${activeCategory}"` : ''} · اضغط على أي بطاقة لعرض تفاصيلها والحجز
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => {
                setSelectedService(service)
                analytics.viewService(service.id, service.name)
              }}
              className="group relative bg-white rounded-2xl border border-slate-200 shadow-[0_2px_12px_rgba(11,27,61,0.05)] hover:shadow-[0_8px_24px_rgba(11,27,61,0.1)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-200 flex flex-col items-center justify-center gap-2 p-4 aspect-square text-center cursor-pointer overflow-hidden"
              aria-label={`${service.name} — اضغط لعرض التفاصيل`}
            >
              {/* Background accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white opacity-80 group-hover:opacity-100 transition-opacity" />

              {/* Icon */}
              <span className="relative z-10 text-3xl sm:text-4xl leading-none" aria-hidden="true">
                {service.iconEmoji}
              </span>

              {/* Title */}
              <h3 className="relative z-10 text-xs sm:text-sm font-bold text-navy-800 leading-snug line-clamp-2 group-hover:text-gold-700 transition-colors">
                {service.name}
              </h3>

              {/* Tap hint */}
              <span className="relative z-10 text-[10px] text-slate-400 font-medium group-hover:text-emerald-600 transition-colors">
                اضغط للتفاصيل
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modal on click */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  )
}
