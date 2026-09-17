'use client'
/**
 * components/sections/QuickActions.tsx — نبض للتمريض المنزلي
 * CareHub-style spacious action cards without negative margins or collisions
 */

import Link from 'next/link'
import {
  CalendarDaysIcon,
  PhoneIcon,
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
      className="bg-slate-50 py-8 sm:py-10 border-b border-slate-200/80 no-print"
      aria-label="إجراءات سريعة"
    >
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">

          {/* 1. Book Now */}
          <Link
            href="/booking"
            onClick={() => analytics.startBooking('quick_action', 'general')}
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(11,27,61,0.05)] hover:shadow-[0_12px_30px_rgba(11,27,61,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-navy-50 text-navy-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-navy-700 group-hover:text-white transition-all shadow-sm shrink-0">
                <CalendarDaysIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-navy-600 bg-navy-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                حجز فوري
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm lg:text-base font-extrabold text-navy-900 group-hover:text-gold-600 transition-colors leading-snug">
                احجز ممرض يجيلك
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                حدد ميعادك والخدمة ونوصلك لبيتك
              </p>
            </div>
          </Link>

          {/* 2. Direct WhatsApp */}
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.clickWhatsApp('quick_actions')}
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(11,27,61,0.05)] hover:shadow-[0_12px_30px_rgba(11,27,61,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm shrink-0">
                <WhatsAppIcon />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                مباشر
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm lg:text-base font-extrabold text-navy-900 group-hover:text-emerald-600 transition-colors leading-snug">
                كلمنا واتساب فوري
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                محادثة مباشرة مع الممرض المناوب
              </p>
            </div>
          </a>

          {/* 3. Fast Phone Call */}
          <a
            href={getCallUrl()}
            onClick={() => analytics.clickCall('quick_actions')}
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(11,27,61,0.05)] hover:shadow-[0_12px_30px_rgba(11,27,61,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold-500 group-hover:text-white transition-all shadow-sm shrink-0">
                <PhoneIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-700 bg-amber-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                24/7
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm lg:text-base font-extrabold text-navy-900 group-hover:text-amber-600 transition-colors leading-snug">
                كلمنا تليفون
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed" dir="ltr">
                {settings.phone}
              </p>
            </div>
          </a>

          {/* 4. Services List */}
          <Link
            href="/services"
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200/80 shadow-[0_4px_16px_rgba(11,27,61,0.05)] hover:shadow-[0_12px_30px_rgba(11,27,61,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-sm shrink-0">
                <ListBulletIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-sky-700 bg-sky-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                15+ خدمة
              </span>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm lg:text-base font-extrabold text-navy-900 group-hover:text-sky-600 transition-colors leading-snug">
                كل خدماتنا الطبية
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                استعرض تفاصيل وأسعار جميع الخدمات
              </p>
            </div>
          </Link>

        </div>
      </div>
    </section>
  )
}
