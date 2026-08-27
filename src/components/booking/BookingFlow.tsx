'use client'
/**
 * components/booking/BookingFlow.tsx — نبض للتمريض المنزلي
 * Multi-step booking form — 4 steps.
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { services } from '@/data/services'
import { siteConfig } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import BookingSuccess from './BookingSuccess'

// ── Validation schema ────────────────────────────────────────
const bookingSchema = z.object({
  serviceId:     z.string().min(1, 'اختر الخدمة المطلوبة'),
  customerName:  z.string().min(2, 'أدخل الاسم الكامل (حرفان على الأقل)'),
  customerPhone: z.string().regex(/^01[0-9]{9}$/, 'أدخل رقم هاتف مصري صحيح (مثال: 01099667065)'),
  whatsapp:      z.string().regex(/^01[0-9]{9}$/, 'أدخل رقم واتساب صحيح').optional().or(z.literal('')),
  patientName:   z.string().optional(),
  governorate:   z.literal('دمياط'),
  city:          z.string().min(2, 'أدخل المدينة أو المنطقة'),
  address:       z.string().min(5, 'أدخل العنوان بالتفصيل'),
  landmark:      z.string().optional(),
  preferredDate: z.string().min(1, 'اختر التاريخ'),
  preferredTime: z.string().min(1, 'اختر الوقت'),
  notes:         z.string().max(500, 'الملاحظات لا تتجاوز 500 حرف').optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

// ── Steps config ─────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'الخدمة' },
  { id: 2, label: 'البيانات' },
  { id: 3, label: 'الموعد' },
  { id: 4, label: 'تأكيد' },
]

// Time slots
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00',
  '20:00',
]

// Progress indicator
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8" role="list" aria-label="خطوات الحجز">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex items-center" role="listitem">
          <div className={`flex flex-col items-center gap-1 ${index < STEPS.length - 1 ? 'me-1' : ''}`}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              ${currentStep > step.id
                ? 'bg-medical-success text-white'
                : currentStep === step.id
                ? 'bg-navy-700 text-white shadow-cta'
                : 'bg-medical-border text-medical-muted'}
            `}
              aria-current={currentStep === step.id ? 'step' : undefined}
            >
              {currentStep > step.id ? (
                <CheckCircleIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                step.id
              )}
            </div>
            <span className={`text-xs font-medium ${currentStep === step.id ? 'text-navy-700' : 'text-medical-muted'}`}>
              {step.label}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={`w-10 h-0.5 mb-5 transition-colors ${currentStep > step.id ? 'bg-medical-success' : 'bg-medical-border'}`}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  )
}

// Field error
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="nabd-error" role="alert">
      <ExclamationCircleIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}

// ── Main Component ────────────────────────────────────────────
interface BookingFlowProps {
  defaultServiceId?: string
}

export default function BookingFlow({ defaultServiceId }: BookingFlowProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{
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
  } | null>(null)

  const {
    register,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: defaultServiceId ?? '',
      governorate: 'دمياط',
    },
    mode: 'onBlur',
  })

  const selectedServiceId = watch('serviceId')
  const selectedService = services.find((s) => s.id === selectedServiceId)

  // Get min date (today)
  const minDate = new Date().toISOString().split('T')[0]

  // Step navigation
  const goNext = async () => {
    let fieldsToValidate: (keyof BookingFormData)[] = []

    if (step === 1) fieldsToValidate = ['serviceId']
    if (step === 2) fieldsToValidate = ['customerName', 'customerPhone']
    if (step === 3) fieldsToValidate = ['governorate', 'city', 'address', 'preferredDate', 'preferredTime']

    const valid = await trigger(fieldsToValidate)
    if (valid) {
      if (step === 3) analytics.startBooking(selectedServiceId, selectedService?.name ?? '')
      setStep((s) => Math.min(s + 1, 4))
    }
  }

  const goBack = () => setStep((s) => Math.max(s - 1, 1))

  // Submit
  const handleSubmit = async () => {
    const valid = await trigger()
    if (!valid) return

    setIsSubmitting(true)
    setSubmitError(null)
    analytics.submitBooking(selectedServiceId)

    try {
      const data = getValues()
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          serviceName: selectedService?.name ?? data.serviceId,
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'حدث خطأ')
      }

      analytics.bookingSuccess(json.bookingId, selectedServiceId)

      // Auto-open WhatsApp to notify admin (opens in new tab)
      if (json.whatsappUrl) {
        window.open(json.whatsappUrl, '_blank', 'noopener,noreferrer')
      }

      setSuccessData({
        bookingId:     json.bookingId,
        serviceName:   selectedService?.name ?? data.serviceId,
        customerName:  data.customerName,
        customerPhone: data.customerPhone,
        patientName:   data.patientName,
        city:          data.city,
        address:       data.address,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes:         data.notes,
        whatsappUrl:   json.whatsappUrl,
      })
    } catch {
      setSubmitError(
        'تعذر إرسال الطلب حالياً. حاول مرة أخرى أو تواصل معنا عبر واتساب.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show success screen
  if (successData) {
    return (
      <BookingSuccess
        bookingId={successData.bookingId}
        serviceName={successData.serviceName}
        customerName={successData.customerName}
        customerPhone={successData.customerPhone}
        patientName={successData.patientName}
        city={successData.city}
        address={successData.address}
        preferredDate={successData.preferredDate}
        preferredTime={successData.preferredTime}
        notes={successData.notes}
        whatsappUrl={successData.whatsappUrl}
      />
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator currentStep={step} />

      {/* ── Step 1: Service ── */}
      {step === 1 && (
        <div className="nabd-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy-700 mb-5">اختر الخدمة المطلوبة</h2>

          <div className="flex flex-col gap-2 max-h-80 overflow-y-auto scrollbar-hide">
            {services.filter((s) => s.active && s.bookingEnabled).map((service) => (
              <label
                key={service.id}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedServiceId === service.id
                    ? 'border-navy-600 bg-navy-50'
                    : 'border-medical-border hover:border-navy-300'
                }`}
              >
                <input
                  type="radio"
                  value={service.id}
                  {...register('serviceId')}
                  className="w-4 h-4 accent-navy-600"
                  aria-label={service.name}
                />
                <span className="text-xl shrink-0" aria-hidden="true">{service.iconEmoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-700 text-sm">{service.name}</p>
                  <p className="text-medical-muted text-xs leading-tight line-clamp-1">{service.shortDescription}</p>
                </div>
              </label>
            ))}
          </div>

          <FieldError message={errors.serviceId?.message} />

          {/* Pricing note */}
          <p className="text-medical-muted text-xs mt-4 text-center">
            {siteConfig.booking.pricingNote}
          </p>
        </div>
      )}

      {/* ── Step 2: Customer Data ── */}
      {step === 2 && (
        <div className="nabd-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy-700 mb-5">بيانات التواصل</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="customerName" className="nabd-label">
                الاسم الكامل <span className="text-medical-danger">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                inputMode="text"
                autoComplete="name"
                placeholder="مثال: أحمد محمد علي"
                {...register('customerName')}
                className="nabd-input"
                aria-required="true"
                aria-invalid={!!errors.customerName}
              />
              <FieldError message={errors.customerName?.message} />
            </div>

            <div>
              <label htmlFor="customerPhone" className="nabd-label">
                رقم الهاتف <span className="text-medical-danger">*</span>
              </label>
              <input
                id="customerPhone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="01001097896"
                {...register('customerPhone')}
                className="nabd-input"
                dir="ltr"
                aria-required="true"
                aria-invalid={!!errors.customerPhone}
              />
              <FieldError message={errors.customerPhone?.message} />
            </div>

            <div>
              <label htmlFor="whatsapp" className="nabd-label">
                رقم واتساب <span className="text-medical-muted text-xs">(اختياري)</span>
              </label>
              <input
                id="whatsapp"
                type="tel"
                inputMode="numeric"
                placeholder="01099667065"
                {...register('whatsapp')}
                className="nabd-input"
                dir="ltr"
                aria-invalid={!!errors.whatsapp}
              />
              <FieldError message={errors.whatsapp?.message} />
            </div>

            <div>
              <label htmlFor="patientName" className="nabd-label">
                اسم المريض <span className="text-medical-muted text-xs">(اختياري — إذا كان غير الحاجز)</span>
              </label>
              <input
                id="patientName"
                type="text"
                placeholder="إذا كان مختلفاً عن اسمك"
                {...register('patientName')}
                className="nabd-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Location + Appointment ── */}
      {step === 3 && (
        <div className="nabd-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy-700 mb-5">الموقع والموعد</h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="nabd-label">المحافظة</label>
              <div className="nabd-input bg-medical-gray text-medical-muted cursor-not-allowed flex items-center">
                دمياط
              </div>
            </div>

            <div>
              <label htmlFor="city" className="nabd-label">
                المدينة / المنطقة <span className="text-medical-danger">*</span>
              </label>
              <input
                id="city"
                type="text"
                placeholder="مثال: دمياط الجديدة، رأس البر"
                {...register('city')}
                className="nabd-input"
                aria-required="true"
              />
              <FieldError message={errors.city?.message} />
            </div>

            <div>
              <label htmlFor="address" className="nabd-label">
                العنوان بالتفصيل <span className="text-medical-danger">*</span>
              </label>
              <textarea
                id="address"
                rows={2}
                placeholder="مثال: شارع الجمهورية، عمارة 12، شقة 3"
                {...register('address')}
                className="nabd-input resize-none"
                aria-required="true"
              />
              <FieldError message={errors.address?.message} />
            </div>

            <div>
              <label htmlFor="landmark" className="nabd-label">
                علامة مميزة <span className="text-medical-muted text-xs">(اختياري)</span>
              </label>
              <input
                id="landmark"
                type="text"
                placeholder="مثال: بجانب مسجد النور"
                {...register('landmark')}
                className="nabd-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="preferredDate" className="nabd-label">
                  التاريخ <span className="text-medical-danger">*</span>
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  min={minDate}
                  {...register('preferredDate')}
                  className="nabd-input"
                  dir="ltr"
                  aria-required="true"
                />
                <FieldError message={errors.preferredDate?.message} />
              </div>

              <div>
                <label htmlFor="preferredTime" className="nabd-label">
                  الوقت <span className="text-medical-danger">*</span>
                </label>
                <select
                  id="preferredTime"
                  {...register('preferredTime')}
                  className="nabd-input"
                  dir="ltr"
                  aria-required="true"
                >
                  <option value="">اختر الوقت</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <FieldError message={errors.preferredTime?.message} />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="nabd-label">
                ملاحظات <span className="text-medical-muted text-xs">(اختياري)</span>
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="أي معلومات إضافية عن الحالة أو الخدمة المطلوبة"
                {...register('notes')}
                className="nabd-input resize-none"
              />
              <p className="text-medical-muted text-xs mt-1">
                ⚠️ {siteConfig.booking.sensitiveDataWarning}
              </p>
              <FieldError message={errors.notes?.message} />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Review ── */}
      {step === 4 && (
        <div className="nabd-card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-navy-700 mb-5">مراجعة الطلب</h2>

          {/* Summary */}
          {(() => {
            const v = getValues()
            return (
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { label: 'الخدمة', value: selectedService?.name ?? v.serviceId },
                  { label: 'الاسم', value: v.customerName },
                  { label: 'الهاتف', value: v.customerPhone },
                  v.patientName ? { label: 'اسم المريض', value: v.patientName } : null,
                  { label: 'المدينة', value: `دمياط — ${v.city}` },
                  { label: 'العنوان', value: v.address },
                  v.landmark ? { label: 'علامة مميزة', value: v.landmark } : null,
                  { label: 'التاريخ', value: v.preferredDate },
                  { label: 'الوقت', value: v.preferredTime },
                  v.notes ? { label: 'ملاحظات', value: v.notes } : null,
                ].filter(Boolean).map((item) => (
                  <div key={item!.label} className="flex gap-3 text-sm">
                    <span className="text-medical-muted shrink-0 w-24">{item!.label}:</span>
                    <span className="text-navy-700 font-medium">{item!.value}</span>
                  </div>
                ))}
              </div>
            )
          })()}

          {/* Medical disclaimer */}
          <div className="medical-disclaimer mb-5">
            <p className="text-xs leading-relaxed">
              هذه الخدمة تُنفَّذ بواسطة مقدم خدمة مؤهل. أي علاج أو دواء يتم وفق وصف الطبيب أو التقييم الطبي المناسب. لا يُقدِّم الموقع تشخيصات أو وصفات دوائية.
            </p>
          </div>

          {/* Error */}
          {submitError && (
            <div className="emergency-notice mb-4">
              <ExclamationCircleIcon className="w-4 h-4 shrink-0 text-red-500" aria-hidden="true" />
              <p className="text-sm">{submitError}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Navigation Buttons ── */}
      <div className={`flex gap-3 mt-4 ${step > 1 ? 'flex-row-reverse' : ''}`}>
        {/* Submit / Next */}
        {step < 4 ? (
          <button
            onClick={goNext}
            className="btn-primary flex-1"
          >
            التالي
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                جار إرسال الطلب…
              </span>
            ) : (
              'إرسال الطلب'
            )}
          </button>
        )}

        {/* Back */}
        {step > 1 && (
          <button
            onClick={goBack}
            disabled={isSubmitting}
            className="btn-secondary flex-1 disabled:opacity-50"
          >
            رجوع
          </button>
        )}
      </div>
    </div>
  )
}
