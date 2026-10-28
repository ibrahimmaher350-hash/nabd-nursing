'use client'
/**
 * components/sections/HeroSection.tsx — واجهة البداية
 * تصميم احترافي مركز على الموبايل بدون ازدحام مع حجز مباشر عبر واتساب
 */

import Image from 'next/image'
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  PhoneIcon,
} from '@heroicons/react/24/solid'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'

export default function HeroSection() {
  const { getWhatsAppUrl, getCallUrl, settings } = useSettings()

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-b from-[#050D24] via-[#091A3E] to-[#0E285C] text-white overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 border-b border-navy-800"
      aria-label="الواجهة الرئيسية"
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 start-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="absolute bottom-10 end-10 w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column (Content) */}
          <div className="lg:col-span-7 text-center lg:text-start">

            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5 backdrop-blur-md shadow-sm">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-white text-xs sm:text-sm font-bold">
                تمريض منزلي متخصص على مدار 24 ساعة
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="!text-3xl sm:!text-4xl lg:!text-5xl font-black text-white leading-[1.3] mb-4 tracking-tight">
              نبض للتمريض المنزلي{' '}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-amber-200 to-gold-400">
                رعاية طبية في راحة بيتك
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
              طاقم تمريضي مرخص ومؤهل لتقديم أعلى مستويات الرعاية السريرية والمتابعة الطبية لك ولعائلتك في المنزل.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-7">
              {[
                'تمريض منزلي معتمد',
                'خدمة سريعة 24/7',
                'رعاية كبار السن والعمليات',
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-xs text-white/90 font-medium"
                >
                  <span className="text-emerald-400 text-xs">✓</span>
                  <span>{badge}</span>
                </span>
              ))}
            </div>

            {/* Action Buttons — Direct WhatsApp + Call */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.clickWhatsApp('hero_cta')}
                className="btn-whatsapp text-sm sm:text-base py-3.5 px-6 justify-center shadow-lg active:scale-95 transition-all"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>احجز عبر واتساب الآن</span>
              </a>

              <a
                href={getCallUrl()}
                onClick={() => analytics.clickCall('hero_call')}
                className="inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 py-3.5 px-6 rounded-2xl transition-all"
              >
                <PhoneIcon className="w-5 h-5 text-gold-400" />
                <span dir="ltr">{settings.phone}</span>
              </a>
            </div>

          </div>

          {/* Right Column: Visual Card (Desktop only for reduced mobile clutter) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center">
            <div className="relative w-full max-w-sm rounded-3xl bg-white/10 border border-white/15 p-4 backdrop-blur-xl shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/4.5] shadow-lg border border-white/20">
                <Image
                  src="/nabd-hero.jpg"
                  alt="ممرض نبض للتمريض المنزلي"
                  fill
                  className="object-cover object-center"
                  priority
                  quality={90}
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07132B] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 inset-x-3 bg-navy-950/80 backdrop-blur-md border border-white/15 rounded-xl p-3 text-center">
                  <p className="text-white font-extrabold text-sm">طاقم تمريض متمرس</p>
                  <p className="text-gold-300 text-xs">رعاية دقيقة وأمان تام لمنزلك</p>
                </div>
              </div>

              <div className="mt-3 bg-white/10 border border-white/15 rounded-xl p-2.5 flex items-center justify-center gap-2">
                <CheckBadgeIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-white">ترخيص وتأهيل طبي كامل</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
