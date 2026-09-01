'use client'
/**
 * app/medical-record/page.tsx — نبض للتمريض المنزلي
 * ملفي الطبي — السجل الصحي الموحد للمريض مع الجدول الزمني الرأسي وتصدير PDF
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import {
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentCheckIcon,
  HeartIcon,
  ShieldCheckIcon,
  PrinterIcon,
  BeakerIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/solid'
import { useSettings } from '@/context/SettingsContext'
import { formatTo12HourArabic, formatArabicDateWithDay } from '@/lib/timeUtils'

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
  const printRef = useRef<HTMLDivElement>(null)

  // Check saved phone on mount
  useEffect(() => {
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

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY)
    setPatient(null)
    setPhoneInput('')
    setErrorMsg('')
  }

  function handlePrintPdf() {
    window.print()
  }

  // Helper parser for multi-line vitals history
  const parsedVitals = patient?.vitalsHistory
    ? patient.vitalsHistory
        .split('\n\n')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : []

  // Helper parser for multi-line visits history
  const parsedVisits = patient?.visitsHistory
    ? patient.visitsHistory
        .split('\n\n')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : []

  // Helper parser for lab tests
  const parsedLabs = patient?.labTestsHistory
    ? patient.labTestsHistory
        .split('\n\n')
        .map((entry) => entry.trim())
        .filter(Boolean)
    : []

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-[80vh] bg-slate-50 pb-24 sm:pb-16 print:bg-white print:p-0">
        {/* ── Hero Section (Hidden on print) ── */}
        <section className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 py-10 sm:py-14 text-white print:hidden">
          <div className="section-container text-center">
            <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/30 rounded-full px-4 py-1.5 mb-4">
              <ShieldCheckIcon className="w-4 h-4 text-gold-400" />
              <span className="text-gold-200 text-xs sm:text-sm font-black">
                السجل الطبي الموحد للمريض
              </span>
            </div>
            <h1 className="!text-2xl sm:!text-3xl lg:!text-4xl font-extrabold text-white mb-2">
              ملفي <span className="text-gold-400">الطبي</span> 📋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              سجلك الصحي المتكامل مع نبض: العلامات الحيوية، مواعيد الزيارات، التحاليل الطبية، والأدوية في جدول زمني مرتب.
            </p>
          </div>
        </section>

        <div className="section-container -mt-6">
          {/* ══════════════════════════════════════════════════════════════
              STATE 1: LOGIN / SEARCH CARD
          ══════════════════════════════════════════════════════════════ */}
          {!patient ? (
            <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in print:hidden">
              <div className="w-14 h-14 rounded-2xl bg-navy-50 text-navy-700 flex items-center justify-center text-2xl mx-auto mb-4">
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
                    'عرض ملفي الطبي 📄'
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
                STATE 2: PATIENT MEDICAL RECORD & TIMELINE
            ══════════════════════════════════════════════════════════════ */
            <div ref={printRef} className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              {/* Patient Profile Header Card */}
              <div className="bg-white border-2 border-navy-100 rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden print:border print:shadow-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-navy-700 text-gold-400 flex items-center justify-center text-3xl font-black shadow-inner">
                      👤
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="badge bg-gold-500 text-navy-950 font-mono text-xs font-black px-2.5 py-0.5">
                          {patient.patientId || 'NABD-0001'}
                        </span>
                        <span className="badge bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5">
                          {patient.status || 'نشط'}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-navy-900 mt-1">
                        {patient.name}
                      </h2>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>📞 {patient.phone}</span>
                        <span>•</span>
                        <span>📍 دمياط — {patient.city || patient.address}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions Header (Hidden on Print) */}
                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      onClick={handlePrintPdf}
                      className="btn-secondary py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-navy-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      title="طباعة أو تصدير كـ PDF"
                    >
                      <PrinterIcon className="w-4 h-4 text-navy-600" />
                      طباعة / PDF
                    </button>

                    <button
                      onClick={handleLogout}
                      className="btn-secondary py-2 px-3.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      خروج
                    </button>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[11px]">تاريخ إنشاء الملف:</span>
                    <strong className="text-navy-900">{patient.createdAt || '01/09/2026'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">آخر تحديث:</span>
                    <strong className="text-navy-900">{patient.updatedAt || 'اليوم'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">المدينة:</span>
                    <strong className="text-navy-900">{patient.city || 'دمياط'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">مقدم الرعاية:</span>
                    <strong className="text-navy-900">نبض للتمريض المنزلي</strong>
                  </div>
                </div>
              </div>

              {/* Next Upcoming Visit Card */}
              {patient.nextVisit && (
                <div className="bg-gradient-to-r from-navy-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border-2 border-gold-400/40">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="w-6 h-6 text-gold-400" />
                      <h3 className="text-base font-black text-white">
                        موعد الزيارة القادمة
                      </h3>
                    </div>
                    <span className="badge bg-gold-500 text-navy-950 text-xs font-black px-3 py-1">
                      مؤكدة ⏰
                    </span>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 text-sm space-y-1">
                    <p className="font-bold text-gold-300 text-base">
                      {patient.nextVisit}
                    </p>
                    <p className="text-xs text-slate-200">
                      📍 مكان الزيارة: {patient.address || patient.city || 'دمياط'}
                    </p>
                  </div>
                </div>
              )}

              {/* Grid: Timeline Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ── Section 1: Vital Signs Timeline ── */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      <h3 className="text-base font-black text-navy-900">
                        سجل العلامات الحيوية
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      {parsedVitals.length} قياسات مسجلة
                    </span>
                  </div>

                  {parsedVitals.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                      لا توجد قياسات مسجلة بعد. يتم تسجيل الضغط والسكر والنبض تلقائياً مع كل زيارة تمريضية.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {parsedVitals.map((vEntry, idx) => (
                        <div
                          key={idx}
                          className="bg-navy-50/60 border border-navy-100 rounded-2xl p-4 text-xs font-bold text-navy-900 space-y-1"
                        >
                          <div className="flex items-center gap-2 text-emerald-700 mb-1">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>{vEntry.split('\n')[0]}</span>
                          </div>
                          <p className="text-slate-800 font-mono leading-relaxed">
                            {vEntry.split('\n').slice(1).join('\n')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Section 2: Visits History Timeline ── */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🩺</span>
                      <h3 className="text-base font-black text-navy-900">
                        سجل الزيارات والخدمات
                      </h3>
                    </div>
                    <span className="text-xs text-slate-400">
                      {parsedVisits.length} زيارات
                    </span>
                  </div>

                  {parsedVisits.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                      لا توجد زيارات سابقة مكتملة بعد.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {parsedVisits.map((vis, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-navy-900 font-black">
                            <span>{vis.split('\n')[0]}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                              تم التنفيذ
                            </span>
                          </div>
                          <div className="text-slate-700 whitespace-pre-line leading-relaxed pt-1">
                            {vis.split('\n').slice(1).join('\n')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Lab Tests & Diagnostic Reports Section */}
              {parsedLabs.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-card space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <BeakerIcon className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-black text-navy-900">
                      سجل التحاليل والفحوصات الطبية
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parsedLabs.map((lab, idx) => (
                      <div
                        key={idx}
                        className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-1"
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

              {/* Medications & Medical Instructions */}
              {(patient.medications || patient.instructions || patient.alerts) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {patient.medications && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs space-y-2">
                      <h4 className="font-black text-navy-900 flex items-center gap-1.5 text-sm">
                        💊 الأدوية والمواعيد:
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                        {patient.medications}
                      </p>
                    </div>
                  )}

                  {patient.instructions && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs space-y-2">
                      <h4 className="font-black text-navy-900 flex items-center gap-1.5 text-sm">
                        📝 تعليمات التمريض:
                      </h4>
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                        {patient.instructions}
                      </p>
                    </div>
                  )}

                  {patient.alerts && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs space-y-2">
                      <h4 className="font-black text-amber-900 flex items-center gap-1.5 text-sm">
                        ⚠️ تنبيهات خاصة:
                      </h4>
                      <p className="text-amber-800 whitespace-pre-line leading-relaxed">
                        {patient.alerts}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Official Stamp & Contact Footer for Print */}
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-6 text-center space-y-2 text-xs text-slate-500">
                <p className="font-black text-navy-900 text-sm">
                  🏥 نبض للتمريض المنزلي — دمياط
                </p>
                <p>
                  رعايتك الصحية تبدأ من مكانك، ونحن أقرب إليك. 💙
                </p>
                <p className="font-mono text-[11px] text-slate-400">
                  للتواصل والاستفسار: 01001097896 / 01099667065
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <FloatingActions />
      <Footer />
    </>
  )
}
