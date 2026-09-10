'use client'
/**
 * components/sections/QuickActions.tsx — نبض للتمريض المنزلي
 * CareHub-style spacious action cards with micro-animations
 */

import Link from 'next/link'
import {
  CalendarDaysIcon,
  PhoneIcon,
  SparklesIcon,
  ListBulletIcon,
} from '@heroicons/react/24/solid'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'

const WhatsAppIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function QuickActions() {
  const { settings, getCallUrl, getWhatsAppUrl } = useSettings()

  return (
    <section
      className="relative -mt-6 sm:-mt-8 z-20 pb-8 no-print"
      aria-label="إجراءات سريعة"
    >
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">

          {/* 1. Book Now */}
          <Link
            href="/booking"
            onClick={() => analytics.startBooking('quick_action', 'general')}
            className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(11,27,61,0.08)] hover:shadow-[0_16px_40px_rgba(11,27,61,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-navy-50 text-navy-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-navy-700 group-hover:text-white transition-all shadow-sm">
                <CalendarDaysIcon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-navy-600 bg-navy-50 px-2.5 py-1 rounded-full">
                فوري
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-navy-900 group-hover:text-gold-600 transition-colors">
                طلب زيارة ممرض
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                حدد الموعد والخدمة ونصلك لمنزلك
              </p>
            </div>
          </Link>

          {/* 2. Direct WhatsApp */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.clickWhatsApp('quick_actions')}
            className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(11,27,61,0.08)] hover:shadow-[0_16px_40px_rgba(11,27,61,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                <WhatsAppIcon />
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                مباشر
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-navy-900 group-hover:text-emerald-600 transition-colors">
                واتساب التمريض
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                محادثة فورية مع الممرض المناوب
              </p>
            </div>
          </a>

          {/* 3. Fast Phone Call */}
          <a
            href={getCallUrl()}
            onClick={() => analytics.clickCall('quick_actions')}
            className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(11,27,61,0.08)] hover:shadow-[0_16px_40px_rgba(11,27,61,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-white transition-all shadow-sm">
                <PhoneIcon className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                24/7
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-navy-900 group-hover:text-amber-600 transition-colors">
                اتصال هاتفي
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed" dir="ltr">
                {settings.phone}
              </p>
            </div>
          </a>

          {/* 4. AI Consultation */}
          <a
            href="#ai-consultant"
            className="group relative bg-gradient-to-br from-navy-900 to-[#0B1E48] rounded-3xl p-5 sm:p-6 border border-gold-400/40 shadow-[0_8px_30px_rgba(11,27,61,0.15)] hover:shadow-[0_16px_40px_rgba(245,158,11,0.25)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 text-gold-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-navy-950 transition-all shadow-sm">
                <SparklesIcon className="w-6 h-6 animate-pulse" />
              </div>
              <span className="text-[11px] font-black text-gold-300 bg-white/10 px-2.5 py-1 rounded-full border border-gold-400/30">
                ذكاء اصطناعي
              </span>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-gold-300 transition-colors">
                استشر الذكاء الاصطناعي
              </h3>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                توجيه طبي فوري لحالة المريض
              </p>
            </div>
          </a>

        </div>
      </div>
    </section>
  )
}
