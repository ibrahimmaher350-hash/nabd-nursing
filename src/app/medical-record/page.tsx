'use client'
/**
 * app/medical-record/page.tsx — نبض للتمريض المنزلي
 * ملفي الطبي — بوابة المريض الخاصة لمتابعة القياسات الحيوية والزيارات والتحاليل
 */

import { useState, useEffect } from 'react'
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
} from '@heroicons/react/24/solid'
import { useSettings } from '@/context/SettingsContext'

interface PatientData {
  name: string
  customerName?: string
  phone: string
  whatsapp?: string
  city?: string
  address?: string
  nextVisit?: string
  nextService?: string
  vitals?: {
    bloodPressure?: string
    bloodSugar?: string
    oxygen?: string
    pulse?: string
    temperature?: string
  }
  medicalFilesUrl?: string
  medicalNotes?: string
  visits?: Array<{
    bookingId: string
    serviceName: string
    date: string
    time: string
    status: string
    city?: string
  }>
}

function formatArabicDate(rawStr?: string): string {
  if (!rawStr) return ''
  try {
    // If it already looks clean
    if (rawStr.includes('صباح') || rawStr.includes('مساء')) return rawStr
    const d = new Date(rawStr)
    if (isNaN(d.getTime())) return rawStr
    return d.toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return rawStr
  }
}

const STORAGE_KEY = 'nabd_patient_phone'

export default function MedicalRecordPage() {
  const { getWhatsAppUrl } = useSettings()
  const [phoneInput, setPhoneInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [patient, setPatient] = useState<PatientData | null>(null)

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem(STORAGE_KEY)
      if (savedPhone) {
        setPhoneInput(savedPhone)
        fetchPatientData(savedPhone)
      }
    } catch {
      // ignore
    }
  }, [])

  async function fetchPatientData(phone: string) {
    if (!phone || phone.trim().length < 9) {
      setErrorMsg('يرجى كتابة رقم هاتف مصري صحيح')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch(`/api/patient-record?phone=${encodeURIComponent(phone.trim())}`)
      const data = await res.json()

      if (data.success && data.patient) {
        setPatient(data.patient)
        localStorage.setItem(STORAGE_KEY, phone.trim())
      } else {
        setErrorMsg(
          data.message ||
            'لم يتم العثور على ملف طبي مسجل بهذا الرقم. تأكد من استخدام نفس الرقم المسجل بالحجز.'
        )
      }
    } catch {
      setErrorMsg('تعذر الاتصال بقاعدة البيانات. تحقق من اتصال الإنترنت وحاول ثانية.')
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

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-[80vh] bg-medical-gray pb-24 sm:pb-16">
        {/* ── Page Hero ── */}
        <section className="bg-gradient-primary py-10 sm:py-14 text-white" aria-label="ملفي الطبي">
          <div className="section-container text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <ShieldCheckIcon className="w-4 h-4 text-gold-400" aria-hidden="true" />
              <span className="text-white text-xs sm:text-sm font-extrabold">بوابة المريض الخاصة</span>
            </div>
            <h1 className="!text-2xl sm:!text-3xl lg:!text-4xl font-extrabold text-white mb-2">
              ملفي <span className="text-gold-300">الطبي</span> 📋
            </h1>
            <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              تابع قياساتك الحيوية، مواعيد زيارات التمريض القادمة، وتقارير التحاليل الطبية بسهولة وأمان.
            </p>
          </div>
        </section>

        <div className="section-container -mt-6">
          {/* ── STATE 1: Not Logged In / Login Card ── */}
          {!patient ? (
            <div className="max-w-md mx-auto">
              <div className="nabd-card p-6 sm:p-8 shadow-2xl border border-medical-border bg-white text-center">
                <div className="w-16 h-16 rounded-2xl bg-navy-50 text-navy-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                  🩺
                </div>

                <h2 className="text-xl font-black text-navy-700 mb-2">
                  تسجيل الدخول للملف الطبي
                </h2>
                <p className="text-medical-muted text-xs sm:text-sm leading-relaxed mb-6">
                  خاص بعملاء نبض: أدخل رقم الهاتف الذي قمت بالحجز به للاطلاع على سجلك الصحي.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    fetchPatientData(phoneInput)
                  }}
                  className="flex flex-col gap-4 text-start"
                >
                  <div>
                    <label htmlFor="phone" className="nabd-label">
                      رقم الهاتف المسجل <span className="text-medical-danger">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      dir="ltr"
                      placeholder="مثال: 01001097896"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="nabd-input text-base text-center font-bold tracking-wider"
                      required
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs leading-relaxed">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-base font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <ArrowPathIcon className="w-5 h-5 animate-spin" />
                        جارٍ التحقق وجلب الملف…
                      </span>
                    ) : (
                      'عرض ملفي الطبي ←'
                    )}
                  </button>
                </form>

                {/* Not registered notice */}
                <div className="mt-6 pt-5 border-t border-medical-border text-center">
                  <p className="text-xs text-medical-muted mb-3">
                    أول مرة معنا ولم تحجز خدمة تمريضية بعد؟
                  </p>
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-1.5 text-gold-600 hover:text-gold-700 font-bold text-xs sm:text-sm"
                  >
                    احجز أول زيارة منزلية لإنشاء ملفك الطبي مجاناً 🚀
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ── STATE 2: Logged In / Full Medical Dashboard ── */
            <div className="flex flex-col gap-6 max-w-4xl mx-auto">
              {/* Profile Card & Actions */}
              <div className="nabd-card p-5 sm:p-7 shadow-xl border border-medical-border bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
                      {patient.name ? patient.name.charAt(0) : 'م'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-black text-navy-700">
                          {patient.name}
                        </h2>
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                          عميل نشط
                        </span>
                      </div>
                      <p className="text-medical-muted text-xs sm:text-sm mt-0.5" dir="ltr">
                        {patient.phone} {patient.city && `• ${patient.city}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => fetchPatientData(patient.phone)}
                      disabled={loading}
                      className="p-2.5 rounded-xl border border-medical-border text-navy-600 hover:bg-navy-50 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="تحديث البيانات"
                    >
                      <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      <span className="hidden xs:inline">تحديث</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="تسجيل الخروج"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>خروج</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Next Visit Banner */}
              {patient.nextVisit && (
                <div
                  className="rounded-3xl p-6 text-white shadow-xl relative overflow-hidden"
                  style={{
                    backgroundColor: '#0B122E',
                    backgroundImage: 'linear-gradient(135deg, #0B122E 0%, #162357 60%, #0B122E 100%)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-400/40 text-gold-300 flex items-center justify-center text-2xl shrink-0">
                        <CalendarDaysIcon className="w-6 h-6 text-gold-400" />
                      </div>
                      <div>
                        <span className="text-gold-400 text-xs font-black">موعد الزيارة القادمة</span>
                        <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                          {formatArabicDate(patient.nextVisit)}
                        </h3>
                        {patient.nextService && (
                          <p className="text-slate-300 text-xs sm:text-sm mt-1">
                            الخدمة: <span className="text-white font-bold">{patient.nextService}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <a
                      href={getWhatsAppUrl(`تأكيد موعد زيارتي القادمة (${patient.nextVisit})`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp text-xs sm:text-sm py-2.5 px-4 self-start sm:self-center font-bold"
                    >
                      تأكيد أو تعديل الموعد
                    </a>
                  </div>
                </div>
              )}

              {/* ── Vital Signs Dashboard ── */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <HeartIcon className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-black text-navy-700">
                    أحدث القياسات الحيوية
                  </h3>
                  <span className="text-xs text-medical-muted ms-auto">
                    (تُسجَّل بواسطة التمريض)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* Blood Pressure */}
                  <div className="bg-white rounded-2xl p-4 border border-medical-border shadow-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-medical-muted font-bold">
                      <span>ضغط الدم</span>
                      <span>🩸</span>
                    </div>
                    <p className="text-lg sm:text-xl font-black text-navy-700 mt-1" dir="ltr">
                      {patient.vitals?.bloodPressure || '—'}
                    </p>
                    <span className="text-[11px] text-medical-muted">
                      {patient.vitals?.bloodPressure ? 'mmHg' : 'بانتظار الزيارة'}
                    </span>
                  </div>

                  {/* Blood Sugar */}
                  <div className="bg-white rounded-2xl p-4 border border-medical-border shadow-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-medical-muted font-bold">
                      <span>سكر الدم</span>
                      <span>🍬</span>
                    </div>
                    <p className="text-lg sm:text-xl font-black text-navy-700 mt-1" dir="ltr">
                      {patient.vitals?.bloodSugar || '—'}
                    </p>
                    <span className="text-[11px] text-medical-muted">
                      {patient.vitals?.bloodSugar ? 'mg/dL' : 'بانتظار الزيارة'}
                    </span>
                  </div>

                  {/* Oxygen SpO2 */}
                  <div className="bg-white rounded-2xl p-4 border border-medical-border shadow-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-medical-muted font-bold">
                      <span>الأكسجين SpO2</span>
                      <span>🫁</span>
                    </div>
                    <p className="text-lg sm:text-xl font-black text-navy-700 mt-1" dir="ltr">
                      {patient.vitals?.oxygen || '—'}
                    </p>
                    <span className="text-[11px] text-medical-muted">
                      {patient.vitals?.oxygen ? '%' : 'بانتظار الزيارة'}
                    </span>
                  </div>

                  {/* Pulse */}
                  <div className="bg-white rounded-2xl p-4 border border-medical-border shadow-sm flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-medical-muted font-bold">
                      <span>معدل النبض</span>
                      <span>❤️</span>
                    </div>
                    <p className="text-lg sm:text-xl font-black text-navy-700 mt-1" dir="ltr">
                      {patient.vitals?.pulse || '—'}
                    </p>
                    <span className="text-[11px] text-medical-muted">
                      {patient.vitals?.pulse ? 'bpm' : 'بانتظار الزيارة'}
                    </span>
                  </div>

                  {/* Temperature */}
                  <div className="bg-white rounded-2xl p-4 border border-medical-border shadow-sm flex flex-col gap-1 col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between text-xs text-medical-muted font-bold">
                      <span>حرارة الجسم</span>
                      <span>🌡️</span>
                    </div>
                    <p className="text-lg sm:text-xl font-black text-navy-700 mt-1" dir="ltr">
                      {patient.vitals?.temperature || '—'}
                    </p>
                    <span className="text-[11px] text-medical-muted">
                      {patient.vitals?.temperature ? '°C' : 'بانتظار الزيارة'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Medical Files & Lab Reports ── */}
              <div className="nabd-card p-5 sm:p-6 bg-white border border-medical-border shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <DocumentArrowDownIcon className="w-5 h-5 text-navy-600" />
                    <h3 className="text-base sm:text-lg font-black text-navy-700">
                      التحاليل والتقارير الطبية
                    </h3>
                  </div>
                  <span className="text-xs text-medical-muted">Google Drive 🔒</span>
                </div>

                {patient.medicalFilesUrl ? (
                  <div className="bg-navy-50/70 border border-navy-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📁</span>
                      <div>
                        <p className="font-bold text-sm text-navy-800">
                          مجلد التحاليل والروشتات والتقارير
                        </p>
                        <p className="text-xs text-medical-muted">
                          يحتوي على كافة ملفاتك الطبية المرفوعة بواسطة فريق نبض
                        </p>
                      </div>
                    </div>
                    <a
                      href={patient.medicalFilesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs sm:text-sm py-2.5 px-5 font-bold shrink-0 text-center"
                    >
                      فتح وتنزيل الملفات 📥
                    </a>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-medical-border rounded-2xl p-6 text-center text-medical-muted">
                    <p className="text-2xl mb-1.5">📑</p>
                    <p className="text-sm font-bold text-navy-700 mb-1">
                      لا توجد ملفات تحاليل مرفوعة حالياً
                    </p>
                    <p className="text-xs text-medical-muted max-w-md mx-auto mb-3">
                      يقوم ممرض نبض برفع صور التحاليل والتقارير الطبية الخاصة بك في ملفك بعد انتهاء الزيارة.
                    </p>
                    <a
                      href={getWhatsAppUrl('أريد إرفاق تحاليل جديدة في ملفي الطبي')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-600 font-bold hover:underline"
                    >
                      إرسال تحاليلك عبر واتساب لإضافتها لملفك ←
                    </a>
                  </div>
                )}
              </div>

              {/* ── Nurse Recommendations & Notes ── */}
              {patient.medicalNotes && (
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-black text-amber-900 mb-1.5 flex items-center gap-2">
                    <span>📝</span>
                    توصيات وملاحظات التمريض:
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                    {patient.medicalNotes}
                  </p>
                </div>
              )}

              {/* ── Past Visits History ── */}
              <div className="nabd-card p-5 sm:p-6 bg-white border border-medical-border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardDocumentCheckIcon className="w-5 h-5 text-navy-600" />
                  <h3 className="text-base sm:text-lg font-black text-navy-700">
                    سجل الزيارات والخدمات
                  </h3>
                </div>

                {patient.visits && patient.visits.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {patient.visits.map((v, i) => (
                      <div
                        key={i}
                        className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 p-3.5 rounded-xl border border-medical-border hover:border-navy-200 transition-colors"
                      >
                        <div>
                          <p className="font-bold text-sm text-navy-800">
                            {v.serviceName}
                          </p>
                          <p className="text-xs text-medical-muted mt-0.5">
                            الموعد: {formatArabicDate(v.date)}
                          </p>
                        </div>
                        <span className="self-start xs:self-center text-xs font-bold px-2.5 py-1 rounded-full bg-navy-50 text-navy-700 border border-navy-100">
                          {v.status || 'مسجلة'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-medical-muted text-center py-4">
                    لا توجد زيارات سابقة مسجلة.
                  </p>
                )}
              </div>

              {/* Book another service button */}
              <div className="text-center pt-2">
                <Link
                  href="/booking"
                  className="btn-primary py-3.5 px-8 text-base font-bold shadow-lg inline-flex items-center gap-2"
                >
                  حجز زيارة تمريضية جديدة +
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
