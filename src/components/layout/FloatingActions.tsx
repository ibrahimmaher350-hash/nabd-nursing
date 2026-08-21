'use client'
/**
 * components/layout/FloatingActions.tsx — نبض للتمريض المنزلي
 * Floating action buttons: WhatsApp + Call + Book.
 * Smart positioning — doesn't cover content.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PhoneIcon, CalendarDaysIcon } from '@heroicons/react/24/solid'
import { siteConfig, getWhatsAppUrl } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Show FAB after scrolling 200px
  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed bottom-6 start-4 z-40 flex flex-col items-start gap-3 no-print"
      role="complementary"
      aria-label="أزرار التواصل السريع"
    >
      {/* Expanded actions */}
      {isExpanded && (
        <div className="flex flex-col gap-2 animate-slide-up">
          {/* Book */}
          <Link
            href="/booking"
            className="flex items-center gap-2.5 bg-navy-700 text-white font-bold rounded-2xl px-4 py-3 shadow-cta text-sm transition-all hover:bg-navy-800 active:scale-95"
            aria-label="احجز خدمة الآن"
          >
            <CalendarDaysIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
            احجز الآن
          </Link>

          {/* Call */}
          <a
            href={siteConfig.contact.callUrl}
            className="flex items-center gap-2.5 bg-gold-500 text-white font-bold rounded-2xl px-4 py-3 shadow-gold text-sm transition-all hover:bg-gold-600 active:scale-95"
            aria-label="اتصل بنا الآن"
            onClick={() => analytics.clickCall('fab')}
          >
            <PhoneIcon className="w-5 h-5 shrink-0" aria-hidden="true" />
            اتصل الآن
          </a>
        </div>
      )}

      {/* WhatsApp FAB (always visible) */}
      <div className="flex items-center gap-2">
        {/* Toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-11 h-11 rounded-full shadow-card-md transition-all duration-200 flex items-center justify-center ${
            isExpanded
              ? 'bg-medical-gray text-medical-muted rotate-45'
              : 'bg-white text-navy-600 border border-medical-border'
          }`}
          aria-label={isExpanded ? 'إخفاء الأزرار' : 'إظهار خيارات التواصل'}
          aria-expanded={isExpanded}
        >
          <span className="text-lg font-bold" aria-hidden="true">
            {isExpanded ? '×' : '+'}
          </span>
        </button>

        {/* WhatsApp main FAB */}
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="fab bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5d]"
          aria-label="تواصل عبر واتساب"
          onClick={() => analytics.clickWhatsApp('fab')}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      </div>
    </div>
  )
}
