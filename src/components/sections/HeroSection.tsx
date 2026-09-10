'use client'
/**
 * components/sections/HeroSection.tsx — نبض للتمريض المنزلي
 * CareHub-grade cinematic hero with live nurse badge and spacious typography
 */

import Link from 'next/link'
import Image from 'next/image'
import {
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'

export default function HeroSection() {
  const { getWhatsAppUrl, getCallUrl, settings } = useSettings()

  return (
    <section
      id="hero"
      className="relative bg-gradient-to-b from-[#050D24] via-[#091A3E] to-[#0E285C] text-white overflow-hidden pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-navy-800"
      aria-label="القسم الرئيسي"
    >
      {/* ── Ambient Background Glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 start-1/4 w-[500px] h-[500px] rounded-full bg-gold-500/10 blur-[140px]" />
        <div className="absolute bottom-10 end-10 w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* ── Right Column: Text Content (7 cols) ── */}
          <div className="lg:col-span-7 text-center lg:text-start">

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500/20 via-white/10 to-transparent border border-gold-400/40 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md shadow-sm">
              <ShieldCheckIcon className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="text-white/95 text-xs sm:text-sm font-bold tracking-wide">
                المستشفى في منزلك — محافظة دمياط
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            </div>

            {/* Giant Title */}
            <h1 className="!text-3xl sm:!text-4xl lg:!text-5xl xl:!text-[3.3rem] font-black text-white leading-[1.3] mb-6 tracking-tight">
              الرعاية التمريضية الفائقة…{' '}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-amber-200 to-gold-400">
                لحد باب بيتك
              </span>{' '}
              بأعلى معايير الأمان
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-sm sm:text-base lg:text-lg leading-[1.8] mb-8 max-w-2xl mx-auto lg:mx-0 font-normal">
              منظومة تمريض منزلي ورعاية طبية متكاملة تقدمها كوادر تمريضية مرخصة ومعقمة على مدار الساعة داخل كافة مدن وقرى محافظة دمياط، لراحة المريض وأسرته.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-8">
              {[
                { icon: '🛡️', text: 'تعقيم كامل ومكافحة عدوى' },
                { icon: '👨‍⚕️', text: 'طاقم تمريضي متخصص' },
                { icon: '🏠', text: 'رعاية تامة في منزلك' },
              ].map((pill) => (
                <span
                  key={pill.text}
                  className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5 text-xs sm:text-sm text-white/90 font-medium"
                >
                  <span>{pill.icon}</span>
                  <span>{pill.text}</span>
                </span>
              ))}
            </div>

            {/* CTAs Row */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center lg:justify-start gap-3.5 mb-8">
              <Link
                href="/booking"
                className="btn-primary text-sm sm:text-base px-8 py-4 rounded-2xl shadow-[0_8px_25px_rgba(245,158,11,0.35)] bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 border border-gold-300/40 text-white font-black transition-all"
                onClick={() => analytics.startBooking('hero', 'general')}
              >
                <span>احجز خدمة تمريض الآن</span>
                <span className="text-sm">🩺</span>
              </Link>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-sm sm:text-base px-7 py-4 rounded-2xl shadow-[0_8px_25px_rgba(37,211,102,0.35)] font-black transition-all"
                onClick={() => analytics.clickWhatsApp('hero')}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>تواصل واتساب مباشر</span>
              </a>
            </div>

            {/* Emergency Ribbon */}
            <div className="flex items-center justify-between gap-3 bg-red-950/40 border border-red-500/30 rounded-2xl p-3 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400 shrink-0" />
                <span className="text-red-200 text-xs sm:text-sm font-medium">
                  في حالات الطوارئ الحرجة اتصل بـ <span className="font-bold text-white">123</span> أو طاقم نبض:
                </span>
              </div>
              <a
                href={getCallUrl()}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shrink-0 transition-colors shadow-sm"
              >
                {settings.phone} 📞
              </a>
            </div>

            {/* Stats Counter Bar */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 max-w-2xl mx-auto lg:mx-0">
              {[
                { value: '15+', label: 'خدمة تمريضية معتمدة' },
                { value: '100%', label: 'أدوات معقمة ومعايير طبية' },
                { value: '24/7', label: 'جاهزية تغطية دمياط' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-sm"
                >
                  <p className="text-gold-300 font-black text-xl sm:text-2xl leading-none mb-1">{stat.value}</p>
                  <p className="text-white/70 text-[11px] sm:text-xs font-medium">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>

          {/* ── Left Column: Live Nurse Card (CareHub Style) (5 cols) ── */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">

            {/* Main Card */}
            <div className="relative w-full max-w-md rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/15 p-4 sm:p-5 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)]">

              {/* Main Image Container */}
              <div className="relative rounded-[2rem] overflow-hidden aspect-[4/4.5] shadow-2xl border border-white/20">
                <Image
                  src="/nabd-hero.jpg"
                  alt="ممرض نبض المحترف — رعاية صحية منزلية معتمدة داخل دمياط"
                  fill
                  className="object-cover object-center"
                  priority
                  quality={92}
                  sizes="(max-width: 768px) 100vw, 450px"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07132B] via-transparent to-transparent opacity-90" />

                {/* Live Online Badge */}
                <div className="absolute top-4 end-4 bg-navy-950/85 backdrop-blur-md border border-white/20 rounded-full py-1.5 px-3.5 flex items-center gap-2 shadow-lg">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-extrabold text-white">مباشر • طاقم متاح الآن</span>
                </div>

                {/* Bottom Card Info */}
                <div className="absolute bottom-4 inset-x-4">
                  <div className="bg-navy-900/90 backdrop-blur-md border border-white/15 rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-extrabold text-sm sm:text-base">فريق نبض المتخصص</p>
                        <p className="text-gold-300 text-xs font-medium">أخصائي تمريض ورعاية حرجة</p>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
                        مرخص وموثق ✓
                      </span>
                    </div>

                    <p className="text-white/70 text-xs leading-relaxed mb-3">
                      زيارات منزلية فورية مجهزة بكافة الأدوات المعقمة وأجهزة القياس المعتمدة.
                    </p>

                    <a
                      href={getWhatsAppUrl('أحتاج تمريض منزلي عاجل')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                    >
                      <span>طلب الممرض المناوب فوراً</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 text-navy-950 rotate-180" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Quality Stamp inside card bottom */}
              <div className="mt-4 bg-white/10 border border-white/15 rounded-2xl p-3 flex items-center gap-3">
                <CheckBadgeIcon className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="text-start">
                  <p className="text-xs font-extrabold text-white">أعلى معايير مكافحة العدوى والتعقيم</p>
                  <p className="text-[11px] text-white/70">أدوات أحادية الاستخدام معتمدة طبياً</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
