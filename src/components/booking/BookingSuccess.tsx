'use client'
/**
 * components/booking/BookingSuccess.tsx
 */
import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { siteConfig } from '@/data/siteConfig'

interface BookingSuccessProps {
  bookingId: string
  serviceName: string
  customerName?: string
  preferredDate?: string
  preferredTime?: string
}

export default function BookingSuccess({
  bookingId,
  serviceName,
  customerName,
  preferredDate,
  preferredTime,
}: BookingSuccessProps) {
  const messageLines = [
    'مرحبًا، أريد تأكيد طلب الحجز من نبض للتمريض المنزلي:',
    `• رقم الحجز: ${bookingId}`,
    `• الخدمة: ${serviceName}`,
    ...(customerName ? [`• اسم العميل: ${customerName}`] : []),
    ...(preferredDate ? [`• التاريخ: ${preferredDate}`] : []),
    ...(preferredTime ? [`• الوقت: ${preferredTime}`] : []),
    '',
    'برجاء تأكيد الموعد والتفاصيل. شكراً لكم.',
  ]

  const whatsappMsg = encodeURIComponent(messageLines.join('\n'))
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMsg}`

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="nabd-card p-8 sm:p-10">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12 text-emerald-500" aria-hidden="true" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold text-navy-700 mb-2">
          تم استلام طلب الحجز
        </h1>

        {/* Booking ID */}
        <div className="bg-navy-50 border border-navy-200 rounded-2xl px-4 py-3 mb-4">
          <p className="text-medical-muted text-xs mb-1">رقم الحجز</p>
          <p className="font-extrabold text-navy-700 text-xl tracking-wider" dir="ltr">
            {bookingId}
          </p>
        </div>

        {/* Service */}
        <p className="text-medical-muted text-sm mb-2">
          الخدمة المطلوبة: <span className="font-semibold text-navy-700">{serviceName}</span>
        </p>

        {/* Confirmation message */}
        <p className="text-medical-muted text-sm leading-relaxed mb-8">
          {siteConfig.booking.confirmationMessage}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            إرسال تفاصيل الحجز عبر واتساب
          </a>

          <a
            href={siteConfig.contact.callUrl}
            className="btn-call w-full"
          >
            اتصال مباشر
          </a>

          <Link href="/" className="btn-ghost w-full justify-center text-sm">
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
