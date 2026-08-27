'use client'
/**
 * components/booking/BookingSuccess.tsx — نبض للتمريض المنزلي
 * شاشة تأكيد الحجز وإرسال التفاصيل مباشرة للواتساب
 */

import Link from 'next/link'
import { CheckCircleIcon, PhoneIcon } from '@heroicons/react/24/solid'
import { siteConfig } from '@/data/siteConfig'
import { useSettings } from '@/context/SettingsContext'

interface BookingSuccessProps {
  bookingId: string
  serviceName: string
  customerName?: string
  customerPhone?: string
  patientName?: string
  city?: string
  address?: string
  preferredDate?: string
  preferredTime?: string
  notes?: string
  whatsappUrl?: string
}

export default function BookingSuccess({
  bookingId,
  serviceName,
  customerName,
  customerPhone,
  patientName,
  city,
  address,
  preferredDate,
  preferredTime,
  notes,
  whatsappUrl: initialWhatsappUrl,
}: BookingSuccessProps) {
  const { settings, getCallUrl } = useSettings()

  // Clean WhatsApp number
  const rawWa = settings.whatsapp || siteConfig.contact.whatsapp || '201099667065'
  const cleanNumber = rawWa.startsWith('0')
    ? `2${rawWa}`
    : rawWa.startsWith('+')
    ? rawWa.replace('+', '')
    : rawWa

  // Build message with full customer details if whatsappUrl is not passed
  let targetWhatsappUrl = initialWhatsappUrl
  if (!targetWhatsappUrl) {
    const lines = [
      '🔔 *طلب حجز خدمة تمريضية — نبض*',
      '─────────────────────',
      `🆔 *رقم الحجز:* ${bookingId}`,
      `🏥 *الخدمة:* ${serviceName}`,
      '─────────────────────',
      ...(customerName ? [`👤 *اسم العميل:* ${customerName}`] : []),
      ...(patientName ? [`🤒 *اسم المريض:* ${patientName}`] : []),
      ...(customerPhone ? [`📞 *رقم الهاتف:* ${customerPhone}`] : []),
      '─────────────────────',
      ...(city ? [`🏙️ *المنطقة:* ${city}`] : []),
      ...(address ? [`🏠 *العنوان بالتفصيل:* ${address}`] : []),
      ...(preferredDate ? [`📅 *التاريخ:* ${preferredDate}`] : []),
      ...(preferredTime ? [`🕐 *الوقت:* ${preferredTime}`] : []),
      ...(notes ? ['─────────────────────', `📝 *ملاحظات:* ${notes}`] : []),
      '─────────────────────',
      'برجاء تأكيد الموعد والتفاصيل. شكراً لكم.',
    ]
    targetWhatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(lines.join('\n'))}`
  }

  return (
    <div className="max-w-lg mx-auto text-center px-2">
      <div className="nabd-card p-6 sm:p-8 border border-medical-border/80 shadow-card-lg">
        {/* Success icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" aria-hidden="true" />
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-navy-700 mb-2">
          تم استلام طلب الحجز بنجاح
        </h1>

        {/* Booking ID badge */}
        <div className="bg-navy-50 border border-navy-200/70 rounded-2xl p-3 sm:p-4 mb-5">
          <p className="text-medical-muted text-xs mb-1">رقم الحجز الخاص بك</p>
          <p className="font-extrabold text-navy-700 text-lg sm:text-2xl tracking-wider" dir="ltr">
            {bookingId}
          </p>
        </div>

        {/* Notice to complete via WhatsApp */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-4 mb-5 text-start flex items-start gap-3">
          <span className="text-xl shrink-0">📲</span>
          <div className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
            <p className="font-bold mb-0.5">خطوة أخيرة لتأكيد حجزك فوراً:</p>
            <p className="text-emerald-800">
              اضغط على الزر الأخضر بالأسفل لإرسال بيانات الحجز مباشرة على واتساب إدارة نبض لتثبيت الموعد.
            </p>
          </div>
        </div>

        {/* Booking Details Summary */}
        <div className="bg-medical-gray/50 rounded-xl p-4 text-start text-xs sm:text-sm mb-6 border border-medical-border/60">
          <p className="font-bold text-navy-700 mb-3 border-b border-medical-border/60 pb-2">
            تفاصيل الطلب:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-medical-muted">
            <div>
              <span className="font-semibold text-navy-700">الخدمة: </span>
              {serviceName}
            </div>
            {customerName && (
              <div>
                <span className="font-semibold text-navy-700">الاسم: </span>
                {customerName}
              </div>
            )}
            {customerPhone && (
              <div>
                <span className="font-semibold text-navy-700">الهاتف: </span>
                <span dir="ltr">{customerPhone}</span>
              </div>
            )}
            {preferredDate && (
              <div>
                <span className="font-semibold text-navy-700">التاريخ: </span>
                {preferredDate}
              </div>
            )}
            {preferredTime && (
              <div>
                <span className="font-semibold text-navy-700">الوقت: </span>
                {preferredTime}
              </div>
            )}
            {city && (
              <div>
                <span className="font-semibold text-navy-700">المنطقة: </span>
                {city}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <a
            href={targetWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full py-3.5 text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            إرسال تفاصيل الحجز الآن عبر واتساب
          </a>

          {/* 📅 Add to Google Calendar Button */}
          {(() => {
            const title = encodeURIComponent(`موعد تمريض منزلي — نبض (${serviceName})`)
            const details = encodeURIComponent(
              `موعد زيارة التمريض المنزلي من نبض للتمريض المنزلي دمياط.\nالخدمة: ${serviceName}\nرقم الحجز: ${bookingId}\nللتواصل: 01001097896 - واتساب: 01099667065`
            )
            const loc = encodeURIComponent(address || 'دمياط، مصر')
            let calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}`
            if (preferredDate) {
              const [y, m, d] = preferredDate.split('-').map(Number)
              const [h, min] = (preferredTime || '10:00').split(':').map(Number)
              const pad = (n: number) => n.toString().padStart(2, '0')
              const startStr = `${y}${pad(m)}${pad(d)}T${pad(h || 10)}${pad(min || 0)}00`
              const endStr = `${y}${pad(m)}${pad(d)}T${pad(((h || 10) + 1) % 24)}${pad(min || 0)}00`
              calUrl += `&dates=${startStr}/${endStr}`
            }
            return (
              <a
                href={calUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-800 border border-navy-200 font-bold rounded-2xl py-3 px-4 text-xs sm:text-sm transition-all"
              >
                <span>📅</span>
                <span>إضافة الموعد لتقويم الهاتف (تذكير بالزيارة)</span>
              </a>
            )
          })()}

          {/* 📋 Go to Medical Record Button */}
          <Link
            href="/medical-record"
            className="inline-flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold rounded-2xl py-3 px-4 text-xs sm:text-sm transition-all"
          >
            <span>📋</span>
            <span>متابعة ملفي الطبي والقياسات</span>
          </Link>

          <a
            href={getCallUrl()}
            className="btn-call w-full py-3 text-sm sm:text-base"
          >
            <PhoneIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
            اتصال هاتفي مباشر
          </a>

          <Link href="/" className="btn-ghost w-full justify-center text-sm mt-1">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
