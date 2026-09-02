'use client'
/**
 * app/medical-record/page.tsx — نبض للتمريض المنزلي
 * ملفي الطبي — السجل الصحي الموحد للمريض مع القالب الطبي الاحترافي بهوية نبض (Navy & Gold) وتصدير PDF عالي الدقة
 */

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import {
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  PrinterIcon,
  BeakerIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  HeartIcon,
  DocumentTextIcon,
  SparklesIcon,
  ShareIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  XMarkIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/solid'
import { useSettings } from '@/context/SettingsContext'
import {
  formatTo12HourArabic,
  formatArabicDateWithDay,
  cleanDateAndTimeString,
} from '@/lib/timeUtils'

interface PatientRecord {
  patientId: string
  name: string
  customerName?: string
  phone: string
  whatsapp?: string
  city?: string
  address?: string
  status?: string
  createdAt?: string
  updatedAt?: string
  nextVisit?: string
  visitsHistory?: string
  vitalsHistory?: string
  labTestsHistory?: string
  servicesHistory?: string
  medications?: string
  instructions?: string
  alerts?: string
  pdfReportUrl?: string
}

const STORAGE_KEY = 'nabd_patient_phone'

export default function MedicalRecordPage() {
  const { getWhatsAppUrl } = useSettings()
  const [phoneInput, setPhoneInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [patient, setPatient] = useState<PatientRecord | null>(null)
  const [reportDate, setReportDate] = useState('')

  useEffect(() => {
    setReportDate(formatArabicDateWithDay(new Date()))
    try {
      const savedPhone = localStorage.getItem(STORAGE_KEY)
      if (savedPhone) {
        setPhoneInput(savedPhone)
        fetchPatientData(savedPhone)
      }
    } catch {}
  }, [])

  async function fetchPatientData(query: string) {
    if (!query || query.trim().length < 3) {
      setErrorMsg('يرجى إدخال رقم الهاتف أو رقم المريض التعريفي')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch(
        `/api/patient-record?phone=${encodeURIComponent(query.trim())}`
      )
      const data = await res.json()

      if (data.success && data.patient) {
        setPatient(data.patient)
        localStorage.setItem(STORAGE_KEY, query.trim())
      } else {
        setErrorMsg(
          data.message ||
            'لم يتم العثور على ملف طبي مسجل بهذا الرقم. يرجى التأكد من كتابة نفس الرقم المستخدم بالحجز.'
        )
      }
    } catch {
      setErrorMsg('تعذر الاتصال بقاعدة البيانات. يرجى التحقق من الإنترنت والمحاولة ثانية.')
    } finally {
      setLoading(false)
    }
  }

  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedSummary, setCopiedSummary] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setShareToast(msg)
    setTimeout(() => setShareToast(null), 3000)
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY)
    setPatient(null)
    setPhoneInput('')
    setErrorMsg('')
    setIsShareModalOpen(false)
  }

  function handlePrintPdf() {
    window.print()
  }

  // Parse multi-line vitals history and clean dates
  const parsedVitals = patient?.vitalsHistory
    ? patient.vitalsHistory
        .split('\n\n')
        .map((entry) => cleanDateAndTimeString(entry.trim()))
        .filter(Boolean)
    : []

  // Parse multi-line visits history and clean dates
  const parsedVisits = patient?.visitsHistory
    ? patient.visitsHistory
        .split('\n\n')
        .map((entry) => cleanDateAndTimeString(entry.trim()))
        .filter(Boolean)
    : []

  // Parse lab tests and clean dates
  const parsedLabs = patient?.labTestsHistory
    ? patient.labTestsHistory
        .split('\n\n')
        .map((entry) => cleanDateAndTimeString(entry.trim()))
        .filter(Boolean)
    : []

  // Clean next visit string
  const cleanedNextVisit = cleanDateAndTimeString(patient?.nextVisit)

  function generateMedicalSummaryText(): string {
    if (!patient) return ''
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://nabd-nursing.vercel.app'
    const recordUrl = `${baseUrl}/medical-record`

    let text = `📋 *الملف الطبي الموحد — نبض للتمريض المنزلي*\n`
    text += `═══════════════════════════\n`
    text += `👤 *اسم المريض:* ${patient.name}\n`
    text += `🆔 *المعرف الطبي:* ${patient.patientId || 'NABD-0001'}\n`
    if (patient.city || patient.address) {
      text += `📍 *الموقع:* دمياط — ${patient.city || ''} ${patient.address || ''}\n`
    }
    if (patient.phone) {
      text += `📞 *هاتف التواصل:* ${patient.phone}\n`
    }

    if (parsedVisits.length > 0) {
      text += `\n🩺 *سجل الزيارات والإجراءات التمريضية:*\n`
      parsedVisits.slice(-3).forEach((v) => {
        text += `• ${v.replace(/\n+/g, ' — ')}\n`
      })
    }

    if (parsedVitals.length > 0) {
      text += `\n📊 *العلامات الحيوية الأخيرة:*\n`
      parsedVitals.slice(-3).forEach((v) => {
        text += `• ${v.replace(/\n+/g, ' — ')}\n`
      })
    }

    if (parsedLabs.length > 0) {
      text += `\n🧪 *سجل الفحوصات والتحاليل:*\n`
      parsedLabs.slice(-3).forEach((l) => {
        text += `• ${l.replace(/\n+/g, ' — ')}\n`
      })
    }

    if (patient.medications) {
      text += `\n💊 *الأدوية والعلاجات:*\n${patient.medications}\n`
    }

    if (patient.alerts) {
      text += `\n⚠️ *تنبيهات خاصة:* ${patient.alerts}\n`
    }

    text += `\n📄 *رابط استعراض وتصدير التقرير الطبي PDF:*\n${recordUrl}\n`
    text += `\n🏥 *نبض للتمريض المنزلي — دمياط*\n`
    text += `📞 خط الطوارئ والحجز: 01001097896 / 01099667065`

    return text
  }

  async function handleNativeShare() {
    if (!patient) return
    const text = generateMedicalSummaryText()
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://nabd-nursing.vercel.app'

    if (navigator?.share) {
      try {
        await navigator.share({
          title: `الملف الطبي — ${patient.name} | نبض للتمريض المنزلي`,
          text: text,
          url: `${baseUrl}/medical-record`,
        })
        return
      } catch (err) {
        // Fallback to modal if rejected
      }
    }
    setIsShareModalOpen(true)
  }

  function handleWhatsAppShare() {
    if (!patient) return
    const text = generateMedicalSummaryText()
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')
  }

  async function handleCopyLink() {
    const baseUrl =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://nabd-nursing.vercel.app'
    const recordUrl = `${baseUrl}/medical-record`
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(recordUrl)
        setCopiedLink(true)
        showToast('تم نسخ رابط الملف الطبي بنجاح! 📋')
        setTimeout(() => setCopiedLink(false), 2500)
      }
    } catch {}
  }

  async function handleCopySummary() {
    const text = generateMedicalSummaryText()
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        setCopiedSummary(true)
        showToast('تم نسخ ملخص التقرير الطبي كاملاً! 📋')
        setTimeout(() => setCopiedSummary(false), 2500)
      }
    } catch {}
  }

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-[80vh] bg-slate-100 pb-24 sm:pb-16 print:bg-white print:p-0">
        {/* ── Hero Section (Screen only) ── */}
        <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 py-8 sm:py-12 text-white print:hidden">
          <div className="section-container">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-xl transition-all group"
              >
                <ArrowRightIcon className="w-4 h-4 text-gold-400 transition-transform group-hover:translate-x-1" />
                <span>العودة للرئيسية</span>
              </Link>
              <Link
                href="/booking"
                className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline"
              >
                احجز خدمة جديدة 📅
              </Link>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/40 rounded-full px-4 py-1.5 mb-3 shadow-inner">
                <ShieldCheckIcon className="w-4 h-4 text-gold-400" />
                <span className="text-gold-200 text-xs sm:text-sm font-black">
                  السجل الصحي الموحد والملف الطبي الشامل
                </span>
              </div>
            <h1 className="!text-2xl sm:!text-3xl lg:!text-4xl font-extrabold text-white mb-2">
              ملفي <span className="text-gold-400">الطبي</span> 📋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              سجلك الطبي المتكامل مع نبض: تتبع العلامات الحيوية، مواعيد الزيارات والمتابعة الدورية، والتقارير الطبية.
            </p>
            </div>
          </div>
        </section>

        <div className="section-container -mt-6 print:m-0 print:p-0 print:max-w-full">
          {/* ══════════════════════════════════════════════════════════════
              STATE 1: LOGIN / SEARCH (Screen only)
          ══════════════════════════════════════════════════════════════ */}
          {!patient ? (
            <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in print:hidden">
              <div className="w-16 h-16 rounded-2xl bg-navy-50 text-navy-700 flex items-center justify-center text-3xl mx-auto mb-4 border border-navy-100">
                🩺
              </div>

              <h2 className="text-lg font-black text-navy-900 text-center mb-1">
                فتح واستعراض الملف الطبي
              </h2>
              <p className="text-xs text-medical-muted text-center mb-6">
                أدخل رقم هاتفك المسجل أو رقم المريض التعريفي (مثال: 01001097896 أو NABD-0001)
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  fetchPatientData(phoneInput)
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="phoneQuery" className="nabd-label text-xs font-bold">
                    رقم الهاتف أو المعرف الطبي:
                  </label>
                  <input
                    id="phoneQuery"
                    type="text"
                    value={phoneInput}
                    onChange={(e) => {
                      setPhoneInput(e.target.value)
                      setErrorMsg('')
                    }}
                    placeholder="01001097896 أو NABD-0001"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-navy-900 focus:outline-none focus:border-navy-600"
                    dir="ltr"
                    autoFocus
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 bg-navy-700 hover:bg-navy-800 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      جار جلب الملف الطبي…
                    </>
                  ) : (
                    'عرض وتصدير ملفي الطبي 📄'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-xs text-medical-muted mb-2">
                  ليس لديك حجز مسجل بعد؟
                </p>
                <Link
                  href="/booking"
                  className="text-xs text-navy-700 font-extrabold hover:underline"
                >
                  احجز خدمة تمريضية الآن ←
                </Link>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════════
                STATE 2: MASTERPIECE MEDICAL RECORD (SCREEN & PDF PRINT)
            ══════════════════════════════════════════════════════════════ */
            <div className="max-w-4xl mx-auto space-y-6 print:m-0 print:p-0 print:max-w-full">
              {/* Screen Top Action Bar (Hidden on print) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm print:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-700 text-white flex items-center justify-center font-black text-sm shrink-0">
                    {patient.patientId || 'NABD'}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-navy-900">
                      ملف المريض: {patient.name}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      معرف المريض: {patient.patientId || 'NABD-0001'} • دمياط
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Share Button */}
                  <button
                    onClick={handleNativeShare}
                    className="btn-primary py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    aria-label="مشاركة الملف الطبي"
                  >
                    <ShareIcon className="w-4 h-4 text-white" />
                    <span>مشاركة الملف 📲</span>
                  </button>

                  {/* Print / PDF Button */}
                  <button
                    onClick={handlePrintPdf}
                    className="btn-primary py-2 px-3.5 bg-navy-700 hover:bg-navy-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-cta"
                  >
                    <PrinterIcon className="w-4 h-4 text-gold-400" />
                    <span>طباعة وتصدير PDF 📄</span>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="btn-secondary py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1"
                    title="تسجيل الخروج والعودة للبحث"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>خروج</span>
                  </button>
                </div>
              </div>

              {/* ── Quick Share & Clinical Actions Banner ── */}
              <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 border border-gold-500/30 text-white rounded-2xl p-4 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 print:hidden">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShareIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-black text-white">
                      مشاركة التقرير مع الطبيب المعالج أو الأسرة 🩺
                    </p>
                    <p className="text-[11px] text-slate-300">
                      أرسل ملخص الفحوصات والزيارات بضغطة زر عبر واتساب أو انسخ الرابط المباشر
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>واتساب 💬</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <DocumentDuplicateIcon className="w-3.5 h-3.5 text-gold-300" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="flex-1 sm:flex-none bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedSummary ? (
                      <>
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">تم نسخ التقرير!</span>
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentCheckIcon className="w-3.5 h-3.5 text-gold-300" />
                        <span>نسخ التقرير 📋</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="bg-gold-500 hover:bg-gold-600 text-navy-950 px-3.5 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow transition-all"
                  >
                    <ShareIcon className="w-3.5 h-3.5" />
                    <span>خيارات المشاركة</span>
                  </button>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════
                  OFFICIAL MEDICAL REPORT DOCUMENT (High-Fidelity Printable)
              ══════════════════════════════════════════════════════════ */}
              <div className="bg-white border-2 border-navy-900/20 rounded-3xl p-6 sm:p-10 shadow-xl print:border-0 print:p-2 print:shadow-none space-y-6">
                {/* ── 1. Official Header with Nabd Logo ── */}
                <div className="border-b-4 border-navy-900 pb-6 relative">
                  <div className="flex items-center justify-between gap-4">
                    {/* Brand Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="badge bg-gold-500 text-navy-950 text-xs font-black px-3 py-0.5">
                          مؤسسة رسمية معتمدة
                        </span>
                        <span className="text-xs font-bold text-navy-800">دمياط — جمهورية مصر العربية</span>
                      </div>
                      <h1 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                        نبض للتمريض المنزلي والرعاية الصحية
                      </h1>
                      <p className="text-xs font-semibold text-slate-600">
                        NABD Home Nursing &amp; Medical Healthcare Services
                      </p>
                      <p className="text-[11px] text-navy-700 font-bold italic pt-0.5">
                        &quot;رعايتك الصحية تبدأ من مكانك، ونحن أقرب إليك&quot;
                      </p>
                    </div>

                    {/* Official Nabd Logo Image */}
                    <div className="shrink-0 text-center">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-2xl overflow-hidden shadow-md border-2 border-gold-400 bg-white">
                        <Image
                          src="/nabd-logo-official.png"
                          alt="شعار نبض للتمريض المنزلي"
                          fill
                          sizes="(max-width: 768px) 96px, 112px"
                          className="object-contain p-1"
                          priority
                        />
                      </div>
                    </div>
                  </div>

                  {/* Header Gold Bar */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-navy-950 via-navy-800 to-navy-900 text-white rounded-xl px-4 py-2 mt-4 text-xs font-bold shadow-sm">
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="w-4 h-4 text-gold-400" />
                      <span>السجل الطبي الموحد للمريض (Medical Health Record)</span>
                    </div>
                    <div className="flex items-center gap-3 text-gold-300 font-mono text-[11px]">
                      <span>تاريخ التقرير: {reportDate}</span>
                    </div>
                  </div>
                </div>

                {/* ── 2. Patient Profile Identification Matrix ── */}
                <div className="bg-slate-50 border-2 border-navy-900/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-navy-700" />
                      <h3 className="text-sm font-black text-navy-900">
                        بيانات المريض الأساسية (Patient Identification)
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge bg-navy-900 text-gold-300 font-mono text-xs font-black px-3 py-1">
                        {patient.patientId || 'NABD-0001'}
                      </span>
                      <span className="badge bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5">
                        {patient.status || 'نشط'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">اسم المريض بالكامل:</span>
                      <strong className="text-navy-900 text-sm font-black">{patient.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">اسم الحاجز / العميل:</span>
                      <strong className="text-slate-800">{patient.customerName || patient.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">رقم الهاتف للتواصل:</span>
                      <strong className="text-navy-900 font-mono text-xs" dir="ltr">{patient.phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">المدينة / المحافظة:</span>
                      <strong className="text-slate-800">دمياط — {patient.city || 'دمياط'}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 block text-[11px]">العنوان بالتفصيل:</span>
                      <strong className="text-slate-800">{patient.address || 'دمياط'}</strong>
                    </div>
                  </div>
                </div>

                {/* ── 3. Next Upcoming Visit & Scheduled Follow-up ── */}
                {cleanedNextVisit && (
                  <div className="bg-gradient-to-r from-navy-900 to-slate-900 text-white rounded-2xl p-4 border-2 border-gold-400/50 shadow-md page-break-inside-avoid">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-5 h-5 text-gold-400" />
                        <h4 className="text-xs sm:text-sm font-black text-white">
                          موعد الزيارة القادمة والمتابعة المجدولة (Upcoming Scheduled Visit)
                        </h4>
                      </div>
                      <span className="badge bg-gold-500 text-navy-950 text-[10px] font-black px-2.5 py-0.5">
                        مؤكدة ⏰
                      </span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 text-xs space-y-1">
                      <p className="font-black text-gold-300 text-sm whitespace-pre-line">
                        {cleanedNextVisit}
                      </p>
                      <p className="text-slate-200 text-[11px]">
                        📍 مكان الزيارة: {patient.address || patient.city || 'دمياط'}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── 4. Clinical Matrix: Vital Signs & Visits ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 page-break-inside-avoid">
                  {/* Vital Signs Card */}
                  <div className="border-2 border-navy-900/10 rounded-2xl p-4 space-y-3 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <HeartIcon className="w-4 h-4 text-red-500" />
                        <h4 className="text-xs font-black text-navy-900">
                          سجل العلامات الحيوية (Vital Signs Log)
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {parsedVitals.length} قياسات
                      </span>
                    </div>

                    {parsedVitals.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
                        لا توجد قياسات مسجلة بعد. يتم تسجيل الضغط والسكر والنبض تلقائياً عند كل زيارة تمريضية.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {parsedVitals.map((vEntry, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-1"
                          >
                            <p className="font-bold text-navy-900 text-xs">
                              {vEntry.split('\n')[0]}
                            </p>
                            <p className="text-slate-700 font-mono leading-relaxed whitespace-pre-line">
                              {vEntry.split('\n').slice(1).join('\n')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nursing Visits Log Card */}
                  <div className="border-2 border-navy-900/10 rounded-2xl p-4 space-y-3 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-navy-700" />
                        <h4 className="text-xs font-black text-navy-900">
                          سجل الزيارات والخدمات (Nursing Visits Log)
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {parsedVisits.length} زيارات
                      </span>
                    </div>

                    {parsedVisits.length === 0 ? (
                      <p className="text-[11px] text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
                        لا توجد زيارات سابقة مسجلة.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {parsedVisits.map((vis, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-1"
                          >
                            <div className="flex items-center justify-between text-navy-900 font-black">
                              <span>{vis.split('\n')[0]}</span>
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                تم التنفيذ
                              </span>
                            </div>
                            <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                              {vis.split('\n').slice(1).join('\n')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── 5. Lab Tests & Diagnostic History ── */}
                {parsedLabs.length > 0 && (
                  <div className="border-2 border-navy-900/10 rounded-2xl p-4 space-y-3 bg-white page-break-inside-avoid">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <BeakerIcon className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-black text-navy-900">
                        سجل التحاليل والفحوصات المخبرية (Laboratory &amp; Diagnostics)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {parsedLabs.map((lab, idx) => (
                        <div
                          key={idx}
                          className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 text-[11px] space-y-1"
                        >
                          <strong className="text-emerald-900 block font-black">
                            {lab.split('\n')[0]}
                          </strong>
                          <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                            {lab.split('\n').slice(1).join('\n')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 6. Medications, Clinical Instructions & Alerts ── */}
                {(patient.medications || patient.instructions || patient.alerts) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 page-break-inside-avoid">
                    {patient.medications && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-1">
                        <strong className="text-navy-900 block font-black">
                          💊 الأدوية الحالية والمواعيد:
                        </strong>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                          {patient.medications}
                        </p>
                      </div>
                    )}

                    {patient.instructions && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-1">
                        <strong className="text-navy-900 block font-black">
                          📝 تعليمات وتوصيات التمريض:
                        </strong>
                        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                          {patient.instructions}
                        </p>
                      </div>
                    )}

                    {patient.alerts && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] space-y-1">
                        <strong className="text-amber-900 block font-black">
                          ⚠️ التنبيهات والحساسية:
                        </strong>
                        <p className="text-amber-800 whitespace-pre-line leading-relaxed">
                          {patient.alerts}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── 7. Official Seal, Signatures & Footer ── */}
                <div className="pt-6 border-t-2 border-navy-900/20 page-break-inside-avoid space-y-4">
                  <div className="grid grid-cols-2 gap-6 text-center text-xs">
                    {/* Attending Nurse Signature */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                      <p className="font-black text-navy-900">
                        توقيع المشرف التمريضي / مقدم الخدمة:
                      </p>
                      <p className="text-slate-800 font-bold font-serif text-sm">
                        إبراهيم ماهر
                      </p>
                      <p className="text-[10px] text-slate-400">
                        نبض للتمريض المنزلي — دمياط
                      </p>
                    </div>

                    {/* Official Seal / Stamp */}
                    <div className="p-3 bg-navy-50/50 rounded-xl border-2 border-dashed border-navy-300 flex flex-col items-center justify-center space-y-1">
                      <span className="text-2xl">🏛️</span>
                      <p className="font-black text-navy-900 text-xs">
                        الختم الرسمي لمؤسسة نبض
                      </p>
                      <p className="text-[10px] text-navy-600 font-mono">
                        دمياط • معتمد وموثق
                      </p>
                    </div>
                  </div>

                  {/* Legal Medical Disclaimer & Contact */}
                  <div className="bg-navy-950 text-white rounded-xl p-3 text-center text-[10px] space-y-1">
                    <p className="font-bold text-gold-300">
                      نبض للتمريض المنزلي — دمياط | خط الطوارئ والحجوزات: 01001097896 / 01099667065
                    </p>
                    <p className="text-slate-300">
                      هذا التقرير صادر رسميًا عن نظام نبض للسجلات الطبية المنزلية. تُنفذ كافة الإجراءات وفق المعايير الطبية المعتمدة.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Share Modal (نافذة مشاركة الملف الطبي) ── */}
        {isShareModalOpen && patient && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in print:hidden"
            onClick={() => setIsShareModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
          >
            <div
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <ShareIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 id="share-modal-title" className="text-base font-black text-white">
                      مشاركة الملف الطبي الموحد 📋
                    </h3>
                    <p className="text-xs text-gold-300">
                      {patient.name} • {patient.patientId || 'NABD-0001'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsShareModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                  aria-label="إغلاق"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  اختر الطريقة المناسبة لمشاركة ملخص الحالة والتقرير الطبي مع الطبيب المعالج أو أفراد الأسرة:
                </p>

                {/* 1. WhatsApp Button */}
                <button
                  onClick={() => {
                    handleWhatsAppShare()
                    setIsShareModalOpen(false)
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl font-black text-sm flex items-center justify-between shadow-sm transition-transform active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div className="text-start">
                      <span className="block font-black text-sm">مشاركة فورية عبر واتساب</span>
                      <span className="text-[11px] text-emerald-100">إرسال التقرير والملخص لأي محادثة</span>
                    </div>
                  </div>
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full">إرسال ↗</span>
                </button>

                {/* 2. Native Share API */}
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    onClick={() => {
                      handleNativeShare()
                      setIsShareModalOpen(false)
                    }}
                    className="w-full bg-navy-800 hover:bg-navy-900 text-white p-3.5 rounded-2xl font-black text-sm flex items-center justify-between shadow-sm transition-transform active:scale-98"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                        <ShareIcon className="w-5 h-5 text-gold-400" />
                      </div>
                      <div className="text-start">
                        <span className="block font-black text-sm">مشاركة عبر تطبيقات الهاتف</span>
                        <span className="text-[11px] text-slate-300">تليجرام، فيسبوك، رسائل، أو إيميل</span>
                      </div>
                    </div>
                    <span className="text-xs bg-white/15 px-3 py-1 rounded-full">تطبيقات ↗</span>
                  </button>
                )}

                {/* 3. Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 p-3.5 rounded-2xl font-bold text-sm flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700">
                      <DocumentDuplicateIcon className="w-5 h-5" />
                    </div>
                    <div className="text-start">
                      <span className="block font-black text-xs sm:text-sm">نسخ رابط صفحة الملف الطبي</span>
                      <span className="text-[11px] text-slate-500">لفتح واستعراض التقرير من أي جهاز</span>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-black">
                    {copiedLink ? '✓ تم النسخ' : 'نسخ'}
                  </span>
                </button>

                {/* 4. Copy Full Summary */}
                <button
                  onClick={handleCopySummary}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 p-3.5 rounded-2xl font-bold text-sm flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700">
                      <ClipboardDocumentCheckIcon className="w-5 h-5" />
                    </div>
                    <div className="text-start">
                      <span className="block font-black text-xs sm:text-sm">نسخ نص التقرير الطبي كاملاً</span>
                      <span className="text-[11px] text-slate-500">يتضمن التشخيص والزيارات والتحاليل</span>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-black">
                    {copiedSummary ? '✓ تم النسخ' : 'نسخ النص'}
                  </span>
                </button>

                {/* Text Preview Box */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    معاينة نص الرسالة التي ستتم مشاركتها:
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-700 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto font-sans">
                    {generateMedicalSummaryText()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Toast Notification ── */}
        {shareToast && (
          <div className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 bg-navy-950 text-white border border-gold-400/50 shadow-2xl px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 animate-bounce print:hidden">
            <CheckIcon className="w-5 h-5 text-emerald-400" />
            <span>{shareToast}</span>
          </div>
        )}
      </main>

      <FloatingActions />
      <Footer />
    </>
  )
}
