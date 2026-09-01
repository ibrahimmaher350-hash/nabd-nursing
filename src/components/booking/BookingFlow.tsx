'use client'
/**
 * components/booking/BookingFlow.tsx — نبض للتمريض المنزلي
 * Dynamic Multi-step booking form:
 * - Lab tests & diagnostics appear ONLY when "سحب عينات وتحاليل منزلية" (home-sample-collection) is selected.
 * - 12-Hour format (AM/PM & ص/م) everywhere.
 * - "Other" (أخرى) custom service support.
 */

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  XMarkIcon,
  BeakerIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid'
import { services } from '@/data/services'
import { siteConfig } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import {
  TIME_SLOTS_12H,
  FOLLOW_UP_INTERVALS,
  calculateNextFollowUpDate,
  formatTo12HourArabic,
  formatArabicDateWithDay,
} from '@/lib/timeUtils'
import { ALL_LAB_TEST_NAMES } from '@/data/labTestsData'
import BookingSuccess from './BookingSuccess'

// ── Validation schema ────────────────────────────────────────
const bookingSchema = z.object({
  serviceId:         z.string().min(1, 'اختر الخدمة المطلوبة'),
  customServiceName: z.string().optional(),
  customerName:      z.string().min(2, 'أدخل الاسم الكامل (حرفان على الأقل)'),
  customerPhone:     z.string().regex(/^01[0-9]{9}$/, 'أدخل رقم هاتف مصري صحيح (مثال: 01099667065)'),
  whatsapp:          z.string().regex(/^01[0-9]{9}$/, 'أدخل رقم واتساب صحيح').optional().or(z.literal('')),
  patientName:       z.string().optional(),
  governorate:       z.literal('دمياط'),
  city:              z.string().min(2, 'أدخل المدينة أو المنطقة'),
  address:           z.string().min(5, 'أدخل العنوان بالتفصيل'),
  landmark:          z.string().optional(),
  preferredDate:     z.string().min(1, 'اختر التاريخ'),
  preferredTime:     z.string().min(1, 'اختر الوقت'),
  notes:             z.string().max(500, 'الملاحظات لا تتجاوز 500 حرف').optional(),
  labNotes:          z.string().max(500).optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

// Progress indicator
function StepIndicator({
  currentStep,
  steps,
}: {
  currentStep: number
  steps: Array<{ id: number; label: string }>
}) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8" role="list" aria-label="خطوات الحجز">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center" role="listitem">
          <div className={`flex flex-col items-center gap-1 ${index < steps.length - 1 ? 'me-1' : ''}`}>
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${currentStep > step.id
                  ? 'bg-medical-success text-white'
                  : currentStep === step.id
                  ? 'bg-navy-700 text-white shadow-cta ring-2 ring-gold-400'
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
            <span className={`text-[11px] sm:text-xs font-semibold ${currentStep === step.id ? 'text-navy-700 font-black' : 'text-medical-muted'}`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-6 sm:w-10 h-0.5 mb-5 transition-colors ${currentStep > step.id ? 'bg-medical-success' : 'bg-medical-border'}`}
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

  // Lab tests state (active exclusively for sample collection)
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([])
  const [labSearchQuery, setLabSearchQuery] = useState('')
  const [customLabTestInput, setCustomLabTestInput] = useState('')

  // Follow-up interval & next visit scheduling
  const [followUpInterval, setFollowUpInterval] = useState('none')

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
    selectedLabTests?: string[]
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
      customServiceName: '',
      governorate: 'دمياط',
    },
    mode: 'onBlur',
  })

  const selectedServiceId = watch('serviceId')
  const customServiceName = watch('customServiceName')
  const selectedService = services.find((s) => s.id === selectedServiceId)

  // Flag: Lab tests appear exclusively for home-sample-collection
  const isLabService = selectedServiceId === 'home-sample-collection'

  // Dynamic steps based on service
  const dynamicSteps = isLabService
    ? [
        { id: 1, label: 'الخدمة' },
        { id: 2, label: 'التحاليل المطلوبة' },
        { id: 3, label: 'البيانات والموقع' },
        { id: 4, label: 'الموعد وتأكيد' },
      ]
    : [
        { id: 1, label: 'الخدمة' },
        { id: 2, label: 'البيانات والموقع' },
        { id: 3, label: 'الموعد وتأكيد' },
      ]

  const totalSteps = dynamicSteps.length

  // Computed effective service name
  const effectiveServiceName =
    selectedServiceId === 'other'
      ? (customServiceName?.trim() || 'خدمة تمريضية مخصصة')
      : (selectedService?.name || selectedServiceId)

  // Min date (today)
  const minDate = new Date().toISOString().split('T')[0]

  // Filter lab tests
  const filteredLabTests = ALL_LAB_TEST_NAMES.filter((t) =>
    t.toLowerCase().includes(labSearchQuery.trim().toLowerCase())
  )

  const toggleLabTest = (testName: string) => {
    setSelectedLabTests((prev) =>
      prev.includes(testName)
        ? prev.filter((t) => t !== testName)
        : [...prev, testName]
    )
  }

  const addCustomLabTest = () => {
    const trimmed = customLabTestInput.trim()
    if (!trimmed) return
    if (!selectedLabTests.includes(trimmed)) {
      setSelectedLabTests((prev) => [...prev, trimmed])
    }
    setCustomLabTestInput('')
  }

  // Step navigation
  const goNext = async () => {
    if (step === 1) {
      const valid = await trigger(['serviceId'])
      if (!valid) return
      if (selectedServiceId === 'other' && !customServiceName?.trim()) {
        alert('يرجى كتابة اسم الخدمة المطلوبة')
        return
      }
      setStep(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (isLabService) {
      if (step === 2) {
        // Lab step (optional or selection)
        setStep(3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (step === 3) {
        const valid = await trigger(['customerName', 'customerPhone', 'governorate', 'city', 'address'])
        if (!valid) return
        analytics.startBooking(selectedServiceId, effectiveServiceName)
        setStep(4)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    } else {
      if (step === 2) {
        // Contact Data step
        const valid = await trigger(['customerName', 'customerPhone', 'governorate', 'city', 'address'])
        if (!valid) return
        analytics.startBooking(selectedServiceId, effectiveServiceName)
        setStep(3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }
  }

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Submit
  const handleSubmit = async () => {
    const valid = await trigger(['preferredDate', 'preferredTime'])
    if (!valid) return

    setIsSubmitting(true)
    setSubmitError(null)
    analytics.submitBooking(selectedServiceId)

    try {
      const data = getValues()
      const nextFollowUpDate = calculateNextFollowUpDate(data.preferredDate, followUpInterval)

      const payload = {
        ...data,
        serviceName: effectiveServiceName,
        selectedLabTests: isLabService ? selectedLabTests : [],
        preferredTime12: data.preferredTime, // In 12-hour format
        followUpInterval,
        nextFollowUpDate,
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? 'حدث خطأ أثناء إرسال الطلب')
      }

      analytics.bookingSuccess(json.bookingId, selectedServiceId)

      // Auto-open WhatsApp notification
      if (json.whatsappUrl) {
        window.open(json.whatsappUrl, '_blank', 'noopener,noreferrer')
      }

      setSuccessData({
        bookingId:        json.bookingId,
        serviceName:      effectiveServiceName,
        customerName:     data.customerName,
        customerPhone:    data.customerPhone,
        patientName:      data.patientName,
        city:             data.city,
        address:          data.address,
        preferredDate:    data.preferredDate,
        preferredTime:    data.preferredTime,
        notes:            data.notes,
        selectedLabTests: isLabService ? selectedLabTests : [],
        whatsappUrl:      json.whatsappUrl,
      })
    } catch {
      setSubmitError(
        'تعذر إرسال الطلب حالياً. حاول مرة أخرى أو تواصل معنا مباشرة عبر واتساب.'
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
    <div className="max-w-xl mx-auto">
      {/* ── Top Navigation Bar (سهم الرجوع والتنقل العلوي) ── */}
      <div className="flex items-center justify-between mb-4 px-1">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-navy-700 hover:text-navy-900 bg-white hover:bg-navy-50 border border-slate-200 hover:border-navy-300 rounded-xl px-3.5 py-2 transition-all shadow-xs group cursor-pointer"
            aria-label="الرجوع للخطوة السابقة"
          >
            <ArrowRightIcon className="w-4 h-4 text-navy-600 transition-transform group-hover:translate-x-1" />
            <span>الرجوع للخطوة السابقة</span>
          </button>
        ) : (
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-navy-700 hover:text-navy-900 bg-white hover:bg-navy-50 border border-slate-200 hover:border-navy-300 rounded-xl px-3.5 py-2 transition-all shadow-xs group cursor-pointer"
            aria-label="الرجوع لكافة الخدمات"
          >
            <ArrowRightIcon className="w-4 h-4 text-navy-600 transition-transform group-hover:translate-x-1" />
            <span>تصفح كافة الخدمات</span>
          </Link>
        )}
        <span className="text-[11px] sm:text-xs font-bold text-medical-muted bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
          الخطوة {step} من {totalSteps}
        </span>
      </div>

      <StepIndicator currentStep={step} steps={dynamicSteps} />

      {/* ══════════════════════════════════════════════════════════════
          STEP 1: SERVICE SELECTION + "OTHER"
      ══════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="nabd-card p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-navy-700">
              اختر الخدمة المطلوبة 🩺
            </h2>
            <span className="text-xs text-medical-muted">الخطوة 1 من {totalSteps}</span>
          </div>

          <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
            {/* 15 Official Services */}
            {services
              .filter((s) => s.active && s.bookingEnabled)
              .map((service) => (
                <label
                  key={service.id}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedServiceId === service.id
                      ? 'border-navy-600 bg-navy-50/70 shadow-sm'
                      : 'border-medical-border hover:border-navy-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    value={service.id}
                    {...register('serviceId')}
                    className="w-4 h-4 accent-navy-600 cursor-pointer"
                    aria-label={service.name}
                  />
                  <span className="text-2xl shrink-0" aria-hidden="true">
                    {service.iconEmoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy-800 text-sm">{service.name}</p>
                    <p className="text-medical-muted text-xs leading-tight line-clamp-1">
                      {service.shortDescription}
                    </p>
                  </div>
                </label>
              ))}

            {/* ➕ "أخرى" (Custom Service) Option */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedServiceId === 'other'
                  ? 'border-gold-500 bg-gold-50/60 shadow-sm'
                  : 'border-dashed border-medical-border hover:border-gold-400 bg-white'
              }`}
            >
              <input
                type="radio"
                value="other"
                {...register('serviceId')}
                className="w-4 h-4 accent-gold-500 cursor-pointer mt-1"
                aria-label="أخرى — كتابة خدمة مخصصة"
              />
              <span className="text-2xl shrink-0" aria-hidden="true">
                ✨
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-navy-900 text-sm">
                  أخرى (كتابة خدمة أو إجراء تمريضي مخصص)
                </p>
                <p className="text-medical-muted text-xs">
                  حدد اسم الخدمة أو الإجراء الطبي الذي تحتاجه يدوياً.
                </p>

                {selectedServiceId === 'other' && (
                  <div className="mt-3 animate-fade-in">
                    <input
                      type="text"
                      placeholder="اكتب اسم الخدمة المطلوبة هنا بالتفصيل..."
                      {...register('customServiceName')}
                      className="w-full bg-white border border-gold-400 rounded-xl px-3 py-2 text-sm font-semibold text-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </label>
          </div>

          <FieldError message={errors.serviceId?.message} />

          <p className="text-medical-muted text-xs text-center pt-2">
            💡 {siteConfig.booking.pricingNote}
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          STEP 2 (EXCLUSIVELY FOR LABS): LAB TESTS CHECKLIST (🧪 التحاليل المطلوبة)
      ══════════════════════════════════════════════════════════════ */}
      {isLabService && step === 2 && (
        <div className="nabd-card p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧪</span>
              <div>
                <h2 className="text-lg font-extrabold text-navy-700">
                  التحاليل والفحوصات المطلوبة
                </h2>
                <p className="text-xs text-medical-muted">
                  حدد التحاليل المطلوبة لسحب العينات المنزلية وإرسال التقرير لملفك الطبي
                </p>
              </div>
            </div>
            <span className="text-xs text-medical-muted">الخطوة 2 من {totalSteps}</span>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              value={labSearchQuery}
              onChange={(e) => setLabSearchQuery(e.target.value)}
              placeholder="ابحث عن تحليل (مثال: CBC، سكر، كبد، كلى، هرمونات...)"
              className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-navy-500"
            />
          </div>

          {/* Selected Badges Preview */}
          {selectedLabTests.length > 0 && (
            <div className="bg-navy-50/80 border border-navy-100 rounded-2xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-navy-800">
                  التحاليل المحددة ({selectedLabTests.length}):
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedLabTests([])}
                  className="text-[11px] text-red-500 hover:underline font-bold"
                >
                  مسح الكل
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedLabTests.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 bg-navy-700 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => toggleLabTest(t)}
                      className="hover:text-red-300"
                    >
                      <XMarkIcon className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Catalog Checkbox List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {filteredLabTests.map((testName) => {
              const isSelected = selectedLabTests.includes(testName)
              return (
                <label
                  key={testName}
                  onClick={() => toggleLabTest(testName)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
                  />
                  <span className="flex-1 leading-snug">{testName}</span>
                </label>
              )
            })}
          </div>

          {/* Add Custom Test Input */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={customLabTestInput}
              onChange={(e) => setCustomLabTestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomLabTest()
                }
              }}
              placeholder="تحليل غير موجود بالقائمة؟ اكتبه هنا..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-navy-500"
            />
            <button
              type="button"
              onClick={addCustomLabTest}
              className="btn-secondary py-2 px-3 text-xs bg-navy-100 hover:bg-navy-200 text-navy-800 rounded-xl font-bold flex items-center gap-1 shrink-0"
            >
              <PlusCircleIcon className="w-4 h-4" />
              إضافة
            </button>
          </div>

          {/* Lab Notes */}
          <div>
            <label htmlFor="labNotes" className="nabd-label text-xs">
              ملاحظات إضافية للتحاليل (مثل: صائم 8 ساعات، تكرار دوري...)
            </label>
            <input
              id="labNotes"
              type="text"
              placeholder="مثال: يرجى إحضار أنبوب تحليل السكر وسحب العينة صائم"
              {...register('labNotes')}
              className="nabd-input text-xs"
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CONTACT DATA & LOCATION:
          - Step 3 if isLabService
          - Step 2 if normal service
      ══════════════════════════════════════════════════════════════ */}
      {((isLabService && step === 3) || (!isLabService && step === 2)) && (
        <div className="nabd-card p-5 sm:p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-navy-700">
              بيانات المريض والموقع 📍
            </h2>
            <span className="text-xs text-medical-muted">
              الخطوة {isLabService ? 3 : 2} من {totalSteps}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="customerName" className="nabd-label">
                الاسم الكامل للحاجز <span className="text-medical-danger">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                autoComplete="name"
                placeholder="مثال: أحمد محمد إبراهيم"
                {...register('customerName')}
                className="nabd-input"
                aria-required="true"
              />
              <FieldError message={errors.customerName?.message} />
            </div>

            <div>
              <label htmlFor="patientName" className="nabd-label">
                اسم المريض <span className="text-medical-muted text-xs">(اختياري — إذا كان غير الحاجز)</span>
              </label>
              <input
                id="patientName"
                type="text"
                placeholder="اسم المريض الفعلي لتسجيله بالملف الطبي"
                {...register('patientName')}
                className="nabd-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="customerPhone" className="nabd-label">
                  رقم الهاتف <span className="text-medical-danger">*</span>
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  placeholder="01001097896"
                  {...register('customerPhone')}
                  className="nabd-input"
                  dir="ltr"
                  aria-required="true"
                />
                <FieldError message={errors.customerPhone?.message} />
              </div>

              <div>
                <label htmlFor="whatsapp" className="nabd-label">
                  رقم واتساب <span className="text-medical-muted text-xs">(لإرسال التذكيرات)</span>
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  placeholder="01099667065"
                  {...register('whatsapp')}
                  className="nabd-input"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="nabd-label">المحافظة</label>
              <div className="nabd-input bg-medical-gray text-medical-muted flex items-center font-bold">
                دمياط (نغطي كافة مناطق ومدن المحافظة)
              </div>
            </div>

            <div>
              <label htmlFor="city" className="nabd-label">
                المدينة / المنطقة <span className="text-medical-danger">*</span>
              </label>
              <input
                id="city"
                type="text"
                placeholder="مثال: دمياط القديمة، دمياط الجديدة، رأس البر، كفر سعد"
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
                placeholder="الشارع، رقم العمارة، رقم الشقة، الدور..."
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
                placeholder="مثال: بجوار مسجد السلام أو صيدلية الأمل"
                {...register('landmark')}
                className="nabd-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          12-HOUR TIME, DATE & FINAL REVIEW:
          - Step 4 if isLabService
          - Step 3 if normal service
      ══════════════════════════════════════════════════════════════ */}
      {((isLabService && step === 4) || (!isLabService && step === 3)) && (
        <div className="nabd-card p-5 sm:p-6 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-navy-700">
              تحديد الموعد ومراجعة الطلب ⏰
            </h2>
            <span className="text-xs text-medical-muted">
              الخطوة {totalSteps} من {totalSteps}
            </span>
          </div>

          {/* Date & 12-Hour Time Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-navy-50/60 p-4 rounded-2xl border border-navy-100">
            <div>
              <label htmlFor="preferredDate" className="nabd-label font-bold text-navy-800">
                📅 تاريخ الزيارة <span className="text-medical-danger">*</span>
              </label>
              <input
                id="preferredDate"
                type="date"
                min={minDate}
                {...register('preferredDate')}
                className="nabd-input font-bold"
                dir="ltr"
                aria-required="true"
              />
              <FieldError message={errors.preferredDate?.message} />
            </div>

            <div>
              <label htmlFor="preferredTime" className="nabd-label font-bold text-navy-800">
                ⏰ وقت الزيارة (نظام 12 ساعة) <span className="text-medical-danger">*</span>
              </label>
              <select
                id="preferredTime"
                {...register('preferredTime')}
                className="nabd-input font-bold text-navy-900"
                aria-required="true"
              >
                <option value="">اختر وقت الزيارة...</option>
                {TIME_SLOTS_12H.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label12} ({slot.labelAr})
                  </option>
                ))}
              </select>
              <FieldError message={errors.preferredTime?.message} />
            </div>
          </div>

          {/* Follow-up & Next Visit Scheduling */}
          {(() => {
            const preferredDateVal = watch('preferredDate')
            const calculatedNextDate = calculateNextFollowUpDate(preferredDateVal, followUpInterval)
            return (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <label htmlFor="followUpInterval" className="nabd-label text-xs font-bold text-navy-800 mb-1 block">
                  🔄 تكرار أو موعد الزيارة القادمة (المتابعة الدورية):
                </label>
                <select
                  id="followUpInterval"
                  value={followUpInterval}
                  onChange={(e) => setFollowUpInterval(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-navy-900 focus:outline-none focus:border-navy-600"
                >
                  {FOLLOW_UP_INTERVALS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>

                {followUpInterval !== 'none' && calculatedNextDate && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-1.5 animate-fade-in">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      سيتم جدولة موعد المتابعة القادمة تلقائياً بتاريخ: {formatArabicDateWithDay(calculatedNextDate)}
                    </span>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="nabd-label">
              ملاحظات إضافية عن حالة المريض <span className="text-medical-muted text-xs">(اختياري)</span>
            </label>
            <textarea
              id="notes"
              rows={2}
              placeholder="أي تفاصيل طبية تساعد فريق التمريض في تقديم أفضل رعاية"
              {...register('notes')}
              className="nabd-input resize-none"
            />
          </div>

          {/* Summary Box */}
          {(() => {
            const v = getValues()
            return (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
                <h3 className="font-black text-navy-800 text-sm border-b border-slate-200 pb-2">
                  ملخص بيانات الحجز:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-medical-muted">الخدمة: </span>
                    <strong className="text-navy-900">{effectiveServiceName}</strong>
                  </div>
                  <div>
                    <span className="text-medical-muted">الاسم: </span>
                    <strong>{v.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-medical-muted">الهاتف: </span>
                    <strong dir="ltr">{v.customerPhone}</strong>
                  </div>
                  <div>
                    <span className="text-medical-muted">الموقع: </span>
                    <strong>دمياط — {v.city}</strong>
                  </div>
                  {v.preferredDate && (
                    <div>
                      <span className="text-medical-muted">التاريخ واليوم: </span>
                      <strong>{formatArabicDateWithDay(v.preferredDate)}</strong>
                    </div>
                  )}
                  {v.preferredTime && (
                    <div>
                      <span className="text-medical-muted">الوقت: </span>
                      <strong className="text-emerald-700 font-bold">
                        {v.preferredTime} ({formatTo12HourArabic(v.preferredTime)})
                      </strong>
                    </div>
                  )}
                </div>

                {isLabService && selectedLabTests.length > 0 && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-medical-muted font-bold block mb-1">
                      🧪 التحاليل المطلوبة ({selectedLabTests.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedLabTests.map((t) => (
                        <span key={t} className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Medical Disclaimer */}
          <div className="medical-disclaimer text-[11px] text-slate-600 bg-amber-50/70 border border-amber-200 rounded-xl p-3">
            <p>
              🛡️ تُنفَّذ خدمات نبض بواسطة كادر تمريضي مؤهل ووفق التوجيه الطبي. نلتزم بالخصوصية الكاملة لبيانات المريض.
            </p>
          </div>

          {submitError && (
            <div className="emergency-notice">
              <ExclamationCircleIcon className="w-4 h-4 shrink-0 text-red-500" />
              <p className="text-xs">{submitError}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Navigation Buttons (أزرار التقدم والرجوع) ── */}
      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={goBack}
            disabled={isSubmitting}
            className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm sm:text-base font-bold disabled:opacity-50 cursor-pointer shadow-xs hover:bg-slate-100"
          >
            <ArrowRightIcon className="w-4 h-4 text-navy-600" />
            <span>الرجوع</span>
          </button>
        )}

        {step === 1 && (
          <Link
            href="/services"
            className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-slate-700 hover:text-navy-900 shadow-xs"
          >
            <ArrowRightIcon className="w-4 h-4 text-navy-600" />
            <span>قائمة الخدمات</span>
          </Link>
        )}

        {step < totalSteps ? (
          <button
            type="button"
            onClick={goNext}
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm sm:text-base font-bold cursor-pointer"
          >
            <span>التالي</span>
            <ArrowLeftIcon className="w-4 h-4 text-white" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed bg-emerald-600 hover:bg-emerald-700 font-black cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                جار تأكيد وإرسال الحجز…
              </span>
            ) : (
              <>
                <span>تأكيد وحجز الزيارة الآن 📅</span>
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
