'use client'
/**
 * components/sections/HeroSection.tsx — نبض للتمريض المنزلي
 */

import Link from 'next/link'
import { PhoneIcon } from '@heroicons/react/24/solid'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'

// Pulse/heartbeat SVG illustration
function MedicalIllustration() {
  return (
    <div className="relative flex items-center justify-center w-full h-72 sm:h-80 lg:h-full min-h-64 rounded-3xl overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 border border-white/10">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden="true">
          <circle cx="200" cy="200" r="150" fill="none" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="200" cy="200" r="50" fill="none" stroke="#F59E0B" strokeWidth="1" />
        </svg>
      </div>

      {/* Main icon */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Heart + House logo reference */}
        <div className="w-28 h-28 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-6xl backdrop-blur-sm shadow-lg">
          🏥
        </div>

        {/* Heartbeat line */}
        <svg viewBox="0 0 200 60" className="w-48 h-12" aria-hidden="true">
          <polyline
            points="0,30 30,30 45,10 60,50 75,15 90,45 105,30 200,30"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Badge */}
        <div className="glass-dark px-4 py-2 rounded-full">
          <p className="text-white text-sm font-bold">نبض للتمريض المنزلي</p>
          <p className="text-gold-300 text-xs text-center">دمياط — مصر</p>
        </div>
      </div>

      {/* Floating stats */}
      <div className="absolute top-4 start-4 glass-dark rounded-xl px-3 py-2">
        <p className="text-gold-300 text-xs font-bold">15+ خدمة</p>
        <p className="text-white/60 text-xs">تمريضية متخصصة</p>
      </div>

      <div className="absolute bottom-4 end-4 glass-dark rounded-xl px-3 py-2">
        <p className="text-gold-300 text-xs font-bold">دمياط</p>
        <p className="text-white/60 text-xs">منطقة الخدمة</p>
      </div>
    </div>
  )
}

export default function HeroSection() {
  const { getWhatsAppUrl } = useSettings()

  return (
    <section
      className="relative bg-gradient-primary overflow-hidden"
      aria-label="القسم الرئيسي"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 end-0 w-96 h-96 rounded-full bg-gold-400 blur-3xl" />
        <div className="absolute bottom-0 start-0 w-64 h-64 rounded-full bg-navy-300 blur-2xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 py-14 sm:py-20 lg:py-24 items-center">

          {/* ── Text Content ── */}
          <div className="order-2 lg:order-1 text-center lg:text-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse-slow" aria-hidden="true" />
              <span className="text-white/90 text-sm font-medium">
                خدمات تمريضية منزلية — دمياط
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
              الرعاية التمريضية اللي محتاجها…{' '}
              <span className="text-gold-300">لحد باب بيتك</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/75 text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              خدمات تمريض ورعاية منزلية باهتمام، أمان، ومهنية داخل دمياط.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-6">
              <Link
                href="/booking"
                className="btn-primary w-full sm:w-auto px-8 py-4 text-base"
                onClick={() => analytics.startBooking('general', 'general')}
              >
                احجز خدمة الآن
              </Link>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full sm:w-auto px-8 py-4 text-base"
                onClick={() => analytics.clickWhatsApp('hero')}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                تواصل عبر واتساب
              </a>
            </div>

            {/* Emergency notice */}
            <div className="flex items-start gap-2 bg-red-900/30 border border-red-400/30 rounded-xl p-3 max-w-lg mx-auto lg:mx-0">
              <ExclamationTriangleIcon
                className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-red-300 text-xs leading-relaxed">
                في الحالات الطارئة — اتصل بخدمات الطوارئ أو اذهب لأقرب مستشفى.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-lg mx-auto lg:mx-0">
              {[
                { value: '15+', label: 'خدمة تمريضية' },
                { value: 'دمياط', label: 'منطقة الخدمة' },
                { value: 'متابعة', label: 'مستمرة للمريض' },
              ].map((stat) => (
                <div
                  key={stat.value}
                  className="bg-white/10 border border-white/15 rounded-2xl p-3 text-center"
                >
                  <p className="text-gold-300 font-extrabold text-lg leading-tight">{stat.value}</p>
                  <p className="text-white/60 text-xs mt-0.5 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Visual ── */}
          <div className="order-1 lg:order-2">
            <MedicalIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}
