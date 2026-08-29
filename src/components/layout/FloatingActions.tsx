'use client'
/**
 * components/layout/FloatingActions.tsx — نبض للتمريض المنزلي
 * زر واتساب العائم الذكي مع زر back-to-top وانتقال سلس عند الظهور
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { PhoneIcon, CalendarDaysIcon, XMarkIcon, ChevronUpIcon } from '@heroicons/react/24/solid'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'

export default function FloatingActions() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { getCallUrl, getWhatsAppUrl } = useSettings()

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    setIsVisible(scrollY > 150)
    setShowBackToTop(scrollY > 600)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Back to Top button — appears independently */}
      <div
        className={`fixed z-40 transition-all duration-300 no-print ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          bottom: 'max(5.5rem, calc(env(safe-area-inset-bottom, 0px) + 5rem))',
          insetInlineEnd: '1.25rem',
        }}
      >
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white border border-medical-border shadow-card-md text-navy-700 flex items-center justify-center hover:bg-navy-50 hover:border-navy-200 transition-all active:scale-95"
          aria-label="العودة لأعلى الصفحة"
          title="العودة لأعلى الصفحة"
        >
          <ChevronUpIcon className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Main FAB cluster */}
      <div
        className={`fixed z-40 flex flex-col items-center gap-2.5 no-print transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
        style={{
          bottom: 'max(1.25rem, calc(env(safe-area-inset-bottom, 0px) + 0.5rem))',
          insetInlineEnd: '1.25rem',
        }}
        role="complementary"
        aria-label="أزرار التواصل السريع"
      >
        {/* Expanded actions (vertical stack upward) */}
        {isExpanded && (
          <div className="flex flex-col items-center gap-2 mb-1 animate-fade-in-up">
            {/* Quick Call */}
            <a
              href={getCallUrl()}
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-full px-4 py-2.5 shadow-lg text-xs sm:text-sm active:scale-95 transition-transform whitespace-nowrap"
              aria-label="اتصال هاتفي"
              onClick={() => {
                analytics.clickCall('fab')
                setIsExpanded(false)
              }}
            >
              <PhoneIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
              اتصال هاتفي
            </a>

            {/* Quick Telegram */}
            <a
              href="https://t.me/Ibrahim5k"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#229ED9] hover:bg-[#1e8bc0] text-white font-bold rounded-full px-4 py-2.5 shadow-lg text-xs sm:text-sm active:scale-95 transition-transform whitespace-nowrap"
              aria-label="تليجرام"
              onClick={() => setIsExpanded(false)}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
              </svg>
              تليجرام
            </a>

            {/* Quick Book */}
            <Link
              href="/booking"
              className="flex items-center gap-2 bg-navy-700 hover:bg-navy-800 text-white font-bold rounded-full px-4 py-2.5 shadow-lg text-xs sm:text-sm active:scale-95 transition-transform whitespace-nowrap"
              aria-label="احجز خدمة الآن"
              onClick={() => setIsExpanded(false)}
            >
              <CalendarDaysIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
              احجز الآن
            </Link>
          </div>
        )}

        {/* Main Single FAB Cluster */}
        <div className="relative flex items-center justify-center">
          {/* Toggle options button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -top-2 -start-2 w-6 h-6 rounded-full bg-navy-800 text-white border-2 border-white flex items-center justify-center text-xs font-black shadow-md z-10 hover:bg-navy-900 transition-all active:scale-90"
            aria-label={isExpanded ? 'إغلاق الخيارات' : 'خيارات إضافية'}
            title={isExpanded ? 'إغلاق الخيارات' : 'خيارات إضافية'}
          >
            {isExpanded ? (
              <XMarkIcon className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              '+'
            )}
          </button>

          {/* WhatsApp Button */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_6px_24px_rgba(37,211,102,0.45)] active:scale-95 transition-transform"
            aria-label="تواصل عبر واتساب"
            onClick={() => analytics.clickWhatsApp('fab')}
          >
            <span className="sr-only">تواصل عبر واتساب</span>
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  )
}
