'use client'
/**
 * app/medical-record/page.tsx — نبض للتمريض المنزلي
 * ملفي الطبي — السجل الصحي الموحد للمريض مع القالب الطبي الاحترافي بهوية نبض (Navy & Gold)
 * ونظام الإدارة والمزامنة السحابية المباشرة مع Google Sheets للمشرف الطبي (إبراهيم ماهر).
 */

import { useState, useEffect, useMemo } from 'react'
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
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  LockClosedIcon,
  LockOpenIcon,
  CloudArrowUpIcon,
  UserPlusIcon,
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
const ADMIN_STORAGE_KEY = 'nabd_admin_unlocked'

export default function MedicalRecordPage() {
  const { getWhatsAppUrl } = useSettings()
  const [phoneInput, setPhoneInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [savingSync, setSavingSync] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [patient, setPatient] = useState<PatientRecord | null>(null)
  const [reportDate, setReportDate] = useState('')

  // ── Admin State & Security ──
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')

  // ── Modals State ──
  const [isEditBasicModalOpen, setIsEditBasicModalOpen] = useState(false)
  const [isAddVitalModalOpen, setIsAddVitalModalOpen] = useState(false)
  const [isAddVisitModalOpen, setIsAddVisitModalOpen] = useState(false)
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false)
  const [isAddLabModalOpen, setIsAddLabModalOpen] = useState(false)
  const [isEditAlertsModalOpen, setIsEditAlertsModalOpen] = useState(false)
  const [isEditNextVisitModalOpen, setIsEditNextVisitModalOpen] = useState(false)
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)

  // ── Share & Toast State ──
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedSummary, setCopiedSummary] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setShareToast(msg)
    setTimeout(() => setShareToast(null), 3500)
  }

  useEffect(() => {
    setReportDate(formatArabicDateWithDay(new Date()))
    try {
      const savedAdmin = sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true'
      if (savedAdmin) setIsAdmin(true)

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

  // ── Save & Sync Patient to Google Sheets ──
  async function syncPatientToSheets(updatedPatient: PatientRecord, customSuccessMsg?: string) {
    setSavingSync(true)
    try {
      const res = await fetch('/api/patient-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updatePatient',
          patient: updatedPatient,
          adminPin: '2026',
        }),
      })

      const data = await res.json()
      if (data.success) {
        setPatient(updatedPatient)
        showToast(customSuccessMsg || 'تمت مزامنة وحفظ التعديلات في Google Sheets بنجاح! ☁️')
      } else {
        showToast(`⚠️ تنبيه: ${data.message || 'حدث خطأ أثناء المزامنة'}`)
      }
    } catch (err) {
      showToast('⚠️ تعذر إتمام المزامنة مع الخادم، يرجى المحاولة ثانية')
    } finally {
      setSavingSync(false)
    }
  }

  // ── Delete Patient from Google Sheets ──
  async function handleDeleteEntirePatient() {
    if (!patient) return
    setSavingSync(true)
    try {
      const res = await fetch('/api/patient-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deletePatient',
          patientId: patient.patientId,
          phone: patient.phone,
          adminPin: '2026',
        }),
      })

      const data = await res.json()
      if (data.success) {
        showToast('تم حذف الملف الطبي بنجاح من Google Sheets 🗑️')
        handleLogout()
      } else {
        showToast(`⚠️ ${data.message || 'فشل حذف الملف الطبي'}`)
      }
    } catch {
      showToast('⚠️ حدث خطأ أثناء الحذف')
    } finally {
      setSavingSync(false)
      setIsDeleteConfirmModalOpen(false)
    }
  }

  // ── Admin PIN Verification ──
  function verifyAdminPin(e: React.FormEvent) {
    e.preventDefault()
    if (pinInput === '2026' || pinInput === '01001097896') {
      setIsAdmin(true)
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true')
      setIsPinModalOpen(false)
      setPinInput('')
      setPinError('')
      showToast('تم تفعيل وضع المشرف الطبي بنجاح 👑')
    } else {
      setPinError('رمز المشرف غير صحيح')
    }
  }

  function handleAdminLogout() {
    setIsAdmin(false)
    sessionStorage.removeItem(ADMIN_STORAGE_KEY)
    showToast('تم إغلاق وضع المشرف والعودة لوضع العرض 🔒')
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

  // ── Parsers ──
  const parsedVitals = useMemo(() => {
    return patient?.vitalsHistory
      ? patient.vitalsHistory
          .split('\n\n')
          .map((entry) => cleanDateAndTimeString(entry.trim()))
          .filter(Boolean)
      : []
  }, [patient?.vitalsHistory])

  const parsedVisits = useMemo(() => {
    return patient?.visitsHistory
      ? patient.visitsHistory
          .split('\n\n')
          .map((entry) => cleanDateAndTimeString(entry.trim()))
          .filter(Boolean)
      : []
  }, [patient?.visitsHistory])

  const parsedLabs = useMemo(() => {
    return patient?.labTestsHistory
      ? patient.labTestsHistory
          .split('\n\n')
          .map((entry) => cleanDateAndTimeString(entry.trim()))
          .filter(Boolean)
      : []
  }, [patient?.labTestsHistory])

  const cleanedNextVisit = cleanDateAndTimeString(patient?.nextVisit)

  // ── Item Deletions for Admin ──
  function deleteVitalItem(index: number) {
    if (!patient) return
    const current = patient.vitalsHistory ? patient.vitalsHistory.split('\n\n').filter(Boolean) : []
    current.splice(index, 1)
    const updated = { ...patient, vitalsHistory: current.join('\n\n') }
    syncPatientToSheets(updated, 'تم حذف قراءة العلامات الحيوية وتحديث الشيت 🗑️')
  }

  function deleteVisitItem(index: number) {
    if (!patient) return
    const current = patient.visitsHistory ? patient.visitsHistory.split('\n\n').filter(Boolean) : []
    current.splice(index, 1)
    const updated = { ...patient, visitsHistory: current.join('\n\n') }
    syncPatientToSheets(updated, 'تم حذف الزيارة وتحديث الشيت 🗑️')
  }

  function deleteLabItem(index: number) {
    if (!patient) return
    const current = patient.labTestsHistory ? patient.labTestsHistory.split('\n\n').filter(Boolean) : []
    current.splice(index, 1)
    const updated = { ...patient, labTestsHistory: current.join('\n\n') }
    syncPatientToSheets(updated, 'تم حذف التحليل وتحديث الشيت 🗑️')
  }

  // ── Sharing Helpers ──
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
      } catch (err) {}
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
        {/* ── Admin Mode Top Alert Banner ── */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-navy-950 font-black px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs sm:text-sm print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <span><strong>وضع المشرف الطبي نشط:</strong> يمكنك تعديل كافة بيانات المريض، الحذف، الإضافة والمزامنة المباشرة مع Google Sheets.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsNewPatientModalOpen(true)}
                className="bg-navy-900 text-white hover:bg-navy-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <UserPlusIcon className="w-3.5 h-3.5 text-gold-400" />
                <span>إضافة مريض جديد</span>
              </button>
              <button
                onClick={handleAdminLogout}
                className="bg-black/20 hover:bg-black/30 text-navy-950 px-2.5 py-1.5 rounded-lg text-xs font-bold"
              >
                إغلاق وضع المشرف 🔒
              </button>
            </div>
          </div>
        )}

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
              <div className="flex items-center gap-3">
                {!isAdmin ? (
                  <button
                    onClick={() => setIsPinModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300 bg-navy-800/80 border border-gold-500/30 px-3 py-1.5 rounded-xl"
                  >
                    <LockClosedIcon className="w-3.5 h-3.5" />
                    <span>دخول المشرف الطبي 🔐</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                    <LockOpenIcon className="w-3.5 h-3.5" />
                    <span>المشرف الطبي نشط</span>
                  </span>
                )}
                <Link
                  href="/booking"
                  className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline hidden sm:inline"
                >
                  احجز خدمة جديدة 📅
                </Link>
              </div>
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

              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setIsNewPatientModalOpen(true)}
                    className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <UserPlusIcon className="w-4 h-4 text-amber-700" />
                    <span>إنشاء ملف طبي جديد لمريض (خاص بالمشرف)</span>
                  </button>
                </div>
              )}

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
                  {/* Admin Edit Trigger */}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => setIsEditBasicModalOpen(true)}
                        className="btn-primary py-2 px-3 bg-amber-500 hover:bg-amber-600 text-navy-950 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm"
                        title="تعديل البيانات الأساسية"
                      >
                        <PencilSquareIcon className="w-4 h-4 text-navy-950" />
                        <span>تعديل البيانات</span>
                      </button>

                      <button
                        onClick={() => syncPatientToSheets(patient)}
                        disabled={savingSync}
                        className="btn-primary py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                        title="مزامنة فورية مع Google Sheets"
                      >
                        <CloudArrowUpIcon className={`w-4 h-4 ${savingSync ? 'animate-bounce' : ''}`} />
                        <span>{savingSync ? 'جار المزامنة…' : 'مزامنة الشيت ☁️'}</span>
                      </button>

                      <button
                        onClick={() => setIsDeleteConfirmModalOpen(true)}
                        className="py-2 px-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1"
                        title="حذف الملف الطبي بالكامل"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </>
                  )}

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
                        <span>نسخ ملخص كامل</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════════
                  THE MASTERPIECE REPORT CARD (Printable Document)
              ══════════════════════════════════════════════════════════════ */}
              <div className="bg-white border-2 border-slate-200 print:border-none rounded-3xl p-6 sm:p-10 shadow-xl print:shadow-none space-y-8">
                {/* ── Document Header ── */}
                <div className="border-b-2 border-navy-900 pb-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md border-2 border-gold-400 shrink-0">
                        <Image
                          src="/logo.jpg"
                          alt="شعار نبض للتمريض المنزلي"
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-navy-900 leading-tight">
                          نبض للتمريض المنزلي
                        </h2>
                        <p className="text-xs font-bold text-gold-600">
                          Nabd Home Nursing — Damietta
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          رعاية صحية وتمريضية معتمدة داخل دمياط
                        </p>
                      </div>
                    </div>

                    <div className="text-left">
                      <div className="inline-block bg-navy-900 text-gold-300 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm tracking-wider shadow-sm">
                        {patient.patientId || 'NABD-0001'}
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1">
                        تاريخ الإصدار: {reportDate}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-extrabold">
                        ● السجل معتمد ونشط
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Patient Personal Information ── */}
                <div className="bg-gradient-to-br from-slate-50 to-navy-50/30 border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-navy-700" />
                      <h3 className="text-sm font-black text-navy-900">
                        البيانات الأساسية للمريض
                      </h3>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setIsEditBasicModalOpen(true)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1 print:hidden"
                      >
                        <PencilSquareIcon className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium block mb-0.5">اسم المريض:</span>
                      <strong className="text-sm font-black text-navy-950">{patient.name}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block mb-0.5">اسم الحاجز / العميل:</span>
                      <strong className="text-slate-800 font-bold">{patient.customerName || patient.name}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block mb-0.5">رقم الهاتف:</span>
                      <strong className="text-slate-800 font-bold" dir="ltr">{patient.phone}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium block mb-0.5">المدينة والمنطقة:</span>
                      <strong className="text-slate-800 font-bold">{patient.city || 'دمياط'}</strong>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-slate-500 font-medium block mb-0.5">العنوان بالتفصيل:</span>
                      <strong className="text-slate-800 font-bold">{patient.address || 'دمياط ومحيطها'}</strong>
                    </div>
                  </div>
                </div>

                {/* ── Next Scheduled Visit Card ── */}
                {patient.nextVisit && (
                  <div className="bg-gradient-to-r from-navy-900 to-navy-950 text-white rounded-2xl p-5 shadow-lg border border-gold-500/40 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-gold-400" />
                        <h3 className="text-sm font-black text-gold-300">
                          موعد الزيارة القادمة المجدولة
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-gold-500 text-navy-950 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                          مؤكدة ومسجلة
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => setIsEditNextVisitModalOpen(true)}
                            className="text-xs font-bold text-gold-300 hover:text-white bg-white/10 px-2 py-0.5 rounded border border-white/20 print:hidden"
                          >
                            تعديل الموعد
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-100 font-bold whitespace-pre-line leading-relaxed">
                      {cleanedNextVisit}
                    </p>
                  </div>
                )}

                {/* ── Latest Vitals Card (Timeline) ── */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b-2 border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <HeartIcon className="w-5 h-5 text-red-500" />
                      <h3 className="text-base font-black text-navy-900">
                        سجل العلامات الحيوية والقياسات
                      </h3>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setIsAddVitalModalOpen(true)}
                        className="btn-primary py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 print:hidden shadow-sm"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span>إضافة قراءة علامات حيوية</span>
                      </button>
                    )}
                  </div>

                  {parsedVitals.length > 0 ? (
                    <div className="space-y-3">
                      {parsedVitals.map((entry, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 transition-colors relative group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs text-slate-800 font-bold whitespace-pre-line leading-relaxed">
                              {entry}
                            </p>
                            {isAdmin && (
                              <button
                                onClick={() => deleteVitalItem(idx)}
                                className="opacity-70 hover:opacity-100 text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-opacity print:hidden"
                                title="حذف هذه القراءة"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
                      لم يتم تسجيل قراءات علامات حيوية بعد. سيتم تحديثها تلقائياً بعد كل زيارة تمريضية.
                    </div>
                  )}
                </div>

                {/* ── Visits & Clinical History ── */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b-2 border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="text-base font-black text-navy-900">
                        سجل الزيارات والإجراءات التمريضية
                      </h3>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setIsAddVisitModalOpen(true)}
                        className="btn-primary py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 print:hidden shadow-sm"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span>إضافة تقرير زيارة</span>
                      </button>
                    )}
                  </div>

                  {parsedVisits.length > 0 ? (
                    <div className="space-y-3">
                      {parsedVisits.map((entry, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 transition-colors relative group"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs text-slate-800 font-bold whitespace-pre-line leading-relaxed">
                              {entry}
                            </p>
                            {isAdmin && (
                              <button
                                onClick={() => deleteVisitItem(idx)}
                                className="opacity-70 hover:opacity-100 text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-opacity print:hidden"
                                title="حذف هذه الزيارة"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
                      لا توجد زيارات سابقة مسجلة.
                    </div>
                  )}
                </div>

                {/* ── Lab Tests History ── */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b-2 border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <BeakerIcon className="w-5 h-5 text-amber-600" />
                      <h3 className="text-base font-black text-navy-900">
                        سجل التحاليل والفحوصات المخبرية
                      </h3>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => setIsAddLabModalOpen(true)}
                        className="btn-primary py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 print:hidden shadow-sm"
                      >
                        <PlusIcon className="w-3.5 h-3.5" />
                        <span>إضافة تحليل / فحص</span>
                      </button>
                    )}
                  </div>

                  {parsedLabs.length > 0 ? (
                    <div className="space-y-3">
                      {parsedLabs.map((entry, idx) => (
                        <div
                          key={idx}
                          className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-4 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs text-amber-950 font-bold whitespace-pre-line leading-relaxed">
                              {entry}
                            </p>
                            {isAdmin && (
                              <button
                                onClick={() => deleteLabItem(idx)}
                                className="opacity-70 hover:opacity-100 text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-opacity print:hidden"
                                title="حذف هذا التحليل"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
                      لا توجد تحاليل مسجلة حالياً.
                    </div>
                  )}
                </div>

                {/* ── Medications & Instructions ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                      <h4 className="text-xs font-black text-navy-900 flex items-center gap-1.5">
                        <span>💊</span>
                        <span>الأدوية والعلاجات المجدولة</span>
                      </h4>
                      {isAdmin && (
                        <button
                          onClick={() => setIsAddMedModalOpen(true)}
                          className="text-[11px] font-bold text-blue-600 hover:underline print:hidden"
                        >
                          + تعديل الأدوية
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-semibold">
                      {patient.medications || 'لا توجد أدوية مضافة حالياً.'}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                      <h4 className="text-xs font-black text-navy-900 flex items-center gap-1.5">
                        <span>⚠️</span>
                        <span>التعليمات والتنبيهات الخاصة</span>
                      </h4>
                      {isAdmin && (
                        <button
                          onClick={() => setIsEditAlertsModalOpen(true)}
                          className="text-[11px] font-bold text-blue-600 hover:underline print:hidden"
                        >
                          + تعديل التنبيهات
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-semibold">
                      {patient.alerts || 'لا توجد تنبيهات خاصة مسجلة للحالة.'}
                    </p>
                  </div>
                </div>

                {/* ── Document Footer Signature ── */}
                <div className="mt-8 pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
                  <div>
                    <p className="font-bold text-navy-950 text-sm">
                      المشرف العام لمؤسسة نبض للتمريض المنزلي
                    </p>
                    <p className="text-gold-600 font-bold">
                      أخصائي التمريض: إبراهيم ماهر
                    </p>
                    <p className="text-[11px] text-slate-400">
                      دمياط ومحيطها • هاتف: 01001097896 / 01099667065
                    </p>
                  </div>

                  <div className="text-center sm:text-left border sm:border-0 border-slate-200 p-3 sm:p-0 rounded-xl bg-slate-50 sm:bg-transparent">
                    <p className="font-bold text-navy-900 text-xs">
                      الختم والاعتماد الطبي الرقمي
                    </p>
                    <p className="text-[11px] text-emerald-600 font-extrabold mt-0.5">
                      ✓ معتمد وموثق سحابياً في Google Sheets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════
          ADMIN PIN VERIFICATION MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-scale-up">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-4 border border-amber-200">
              🔐
            </div>
            <h3 className="text-base font-black text-navy-900 text-center mb-1">
              تسجيل دخول المشرف الطبي
            </h3>
            <p className="text-xs text-slate-500 text-center mb-5">
              أدخل رمز المرور السري الخاص بإدارة وتعديل السجلات الطبية
            </p>

            <form onSubmit={verifyAdminPin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value)
                    setPinError('')
                  }}
                  placeholder="رمز المشرف (2026)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-lg font-black tracking-widest text-navy-900 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-red-600 font-bold mt-1 text-center">
                    ⚠️ {pinError}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3 bg-amber-500 hover:bg-amber-600 text-navy-950 font-black text-xs rounded-xl shadow"
                >
                  تأكيد الدخول
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPinModalOpen(false)
                    setPinInput('')
                    setPinError('')
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EDIT BASIC INFO MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isEditBasicModalOpen && patient && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-navy-900 flex items-center gap-2">
                <PencilSquareIcon className="w-5 h-5 text-amber-500" />
                <span>تعديل البيانات الأساسية للمريض</span>
              </h3>
              <button
                onClick={() => setIsEditBasicModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const updated: PatientRecord = {
                  ...patient,
                  name: (form.elements.namedItem('pName') as HTMLInputElement).value,
                  customerName: (form.elements.namedItem('cName') as HTMLInputElement).value,
                  phone: (form.elements.namedItem('pPhone') as HTMLInputElement).value,
                  whatsapp: (form.elements.namedItem('pWa') as HTMLInputElement).value,
                  city: (form.elements.namedItem('pCity') as HTMLInputElement).value,
                  address: (form.elements.namedItem('pAddress') as HTMLInputElement).value,
                  status: (form.elements.namedItem('pStatus') as HTMLSelectElement).value,
                }
                syncPatientToSheets(updated, 'تم تحديث البيانات الأساسية ومزامنة الشيت بنجاح! ☁️')
                setIsEditBasicModalOpen(false)
              }}
              className="space-y-3.5 text-xs font-bold"
            >
              <div>
                <label className="text-slate-700 block mb-1">اسم المريض بالكامل:</label>
                <input
                  name="pName"
                  defaultValue={patient.name}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-navy-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">اسم الحاجز / العميل:</label>
                <input
                  name="cName"
                  defaultValue={patient.customerName || patient.name}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">رقم الهاتف:</label>
                  <input
                    name="pPhone"
                    defaultValue={patient.phone}
                    required
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-navy-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">رقم الواتساب:</label>
                  <input
                    name="pWa"
                    defaultValue={patient.whatsapp || patient.phone}
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-navy-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">المدينة / المنطقة:</label>
                  <input
                    name="pCity"
                    defaultValue={patient.city || 'دمياط'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-navy-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">حالة الملف:</label>
                  <select
                    name="pStatus"
                    defaultValue={patient.status || 'نشط'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-navy-900"
                  >
                    <option value="نشط">نشط</option>
                    <option value="متابعة دورية">متابعة دورية</option>
                    <option value="مكتمل / غير نشط">مكتمل / غير نشط</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">العنوان بالتفصيل:</label>
                <input
                  name="pAddress"
                  defaultValue={patient.address || ''}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-navy-900"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  disabled={savingSync}
                  className="flex-1 btn-primary py-3 bg-navy-700 hover:bg-navy-800 text-white font-bold rounded-xl"
                >
                  {savingSync ? 'جار المزامنة…' : 'حفظ ومزامنة الشيت 💾'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditBasicModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ADD VITAL READING MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isAddVitalModalOpen && patient && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-navy-900 flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-red-500" />
                <span>إضافة قراءة علامات حيوية جديدة</span>
              </h3>
              <button
                onClick={() => setIsAddVitalModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const bp = (form.elements.namedItem('vBP') as HTMLInputElement).value
                const sugar = (form.elements.namedItem('vSugar') as HTMLInputElement).value
                const o2 = (form.elements.namedItem('vO2') as HTMLInputElement).value
                const pulse = (form.elements.namedItem('vPulse') as HTMLInputElement).value
                const temp = (form.elements.namedItem('vTemp') as HTMLInputElement).value
                const notes = (form.elements.namedItem('vNotes') as HTMLInputElement).value
                const nowStr = formatArabicDateWithDay(new Date())

                let newEntry = `${nowStr}\n• ضغط الدم: ${bp || '120/80'} | السكر: ${sugar || 'طبيعي'} | الأكسجين: ${o2 || '98%'} | النبض: ${pulse || '75'} | الحرارة: ${temp || '37 °C'}`
                if (notes) newEntry += `\n• ملاحظة: ${notes}`

                const prev = patient.vitalsHistory ? patient.vitalsHistory.trim() : ''
                const updatedHistory = prev ? `${prev}\n\n${newEntry}` : newEntry
                const updated: PatientRecord = { ...patient, vitalsHistory: updatedHistory }

                syncPatientToSheets(updated, 'تمت إضافة قراءة العلامات الحيوية ومزامنتها بنجاح! 🩺')
                setIsAddVitalModalOpen(false)
              }}
              className="space-y-3 text-xs font-bold"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">ضغط الدم (BP):</label>
                  <input
                    name="vBP"
                    placeholder="120/80"
                    defaultValue="120/80"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">سكر الدم (mg/dL):</label>
                  <input
                    name="vSugar"
                    placeholder="110 mg/dL"
                    defaultValue="110 mg/dL"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-700 block mb-1">الأكسجين (SpO2):</label>
                  <input
                    name="vO2"
                    placeholder="98%"
                    defaultValue="98%"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-navy-900"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">النبض (bpm):</label>
                  <input
                    name="vPulse"
                    placeholder="75 bpm"
                    defaultValue="75 bpm"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-navy-900"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">الحرارة (°C):</label>
                  <input
                    name="vTemp"
                    placeholder="36.8 °C"
                    defaultValue="36.8 °C"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-navy-900"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">ملاحظات التمريض السريرية:</label>
                <input
                  name="vNotes"
                  placeholder="حالة المريض مستقرة ومطمئنة..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingSync}
                  className="flex-1 btn-primary py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  {savingSync ? 'جار المزامنة…' : 'حفظ وإضافة القراءة 💾'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddVitalModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ADD VISIT REPORT MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isAddVisitModalOpen && patient && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-navy-900 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                <span>إضافة تقرير زيارة تمريضية جديدة</span>
              </h3>
              <button
                onClick={() => setIsAddVisitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const service = (form.elements.namedItem('vService') as HTMLInputElement).value
                const status = (form.elements.namedItem('vStatus') as HTMLSelectElement).value
                const notes = (form.elements.namedItem('vReport') as HTMLTextAreaElement).value
                const nowStr = formatArabicDateWithDay(new Date())

                let newEntry = `${nowStr} | الخدمة: ${service}\nالحالة: ${status}\nالتقرير: ${notes || 'تم تقديم الرعاية التمريضية بنجاح وفق أعلى معايير التعقيم.'}`

                const prev = patient.visitsHistory ? patient.visitsHistory.trim() : ''
                const updatedHistory = prev ? `${prev}\n\n${newEntry}` : newEntry
                const updated: PatientRecord = { ...patient, visitsHistory: updatedHistory }

                syncPatientToSheets(updated, 'تمت إضافة تقرير الزيارة ومزامنته بنجاح! 🩺')
                setIsAddVisitModalOpen(false)
              }}
              className="space-y-3 text-xs font-bold"
            >
              <div>
                <label className="text-slate-700 block mb-1">الخدمة التمريضية المقدمة:</label>
                <input
                  name="vService"
                  placeholder="مثال: غيار معقم على الجرح أو تركيب كانيولا"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">حالة الزيارة:</label>
                <select
                  name="vStatus"
                  defaultValue="مكتملة بنجاح"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                >
                  <option value="مكتملة بنجاح">مكتملة بنجاح</option>
                  <option value="قيد المتابعة الدورية">قيد المتابعة الدورية</option>
                  <option value="زيارة طوارئ عاجلة">زيارة طوارئ عاجلة</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">تقرير وملاحظات التمريض:</label>
                <textarea
                  name="vReport"
                  rows={3}
                  placeholder="تفاصيل الإجراء وحالة المريض بعد الجلسة..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingSync}
                  className="flex-1 btn-primary py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  {savingSync ? 'جار المزامنة…' : 'حفظ وإضافة الزيارة 💾'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddVisitModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EDIT MEDICATIONS MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isAddMedModalOpen && patient && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-black text-navy-900 mb-3 flex items-center gap-2">
              <span>💊</span>
              <span>تعديل قائمة الأدوية والعلاجات</span>
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const meds = (form.elements.namedItem('medsText') as HTMLTextAreaElement).value
                const updated: PatientRecord = { ...patient, medications: meds }
                syncPatientToSheets(updated, 'تم تحديث قائمة الأدوية ومزامنتها بنجاح! 💊')
                setIsAddMedModalOpen(false)
              }}
              className="space-y-3 text-xs font-bold"
            >
              <div>
                <label className="text-slate-700 block mb-1">الأدوية والجرعات ومواعيدها:</label>
                <textarea
                  name="medsText"
                  defaultValue={patient.medications || ''}
                  rows={6}
                  placeholder="مثال:&#10;• كونكور 5 مجم (قرص صباحاً بعد الفطار)&#10;• جلوكوفاج 1000 مجم (قرص بعد الغداء)&#10;• رينجر محلول وريدي 500 مل"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingSync}
                  className="flex-1 btn-primary py-2.5 bg-navy-700 hover:bg-navy-800 text-white font-bold rounded-xl"
                >
                  حفظ ومزامنة الأدوية 💾
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddMedModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          ADD LAB TEST MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isAddLabModalOpen && patient && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-black text-navy-900 mb-3 flex items-center gap-2">
              <BeakerIcon className="w-5 h-5 text-amber-600" />
              <span>إضافة فحص أو تحليل مخبري جديد</span>
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const labName = (form.elements.namedItem('lName') as HTMLInputElement).value
                const labResult = (form.elements.namedItem('lResult') as HTMLInputElement).value
                const nowStr = formatArabicDateWithDay(new Date())

                const newEntry = `${nowStr}\n• التحليل: ${labName} | النتيجة: ${labResult || 'تم السحب والإرسال للمعامل'}`
                const prev = patient.labTestsHistory ? patient.labTestsHistory.trim() : ''
                const updatedHistory = prev ? `${prev}\n\n${newEntry}` : newEntry
                const updated: PatientRecord = { ...patient, labTestsHistory: updatedHistory }

                syncPatientToSheets(updated, 'تمت إضافة الفحص المخبري ومزامنته بنجاح! 🧪')
                setIsAddLabModalOpen(false)
              }}
              className="space-y-3 text-xs font-bold"
            >
              <div>
                <label className="text-slate-700 block mb-1">اسم التحليل أو الفحص:</label>
                <input
                  name="lName"
                  placeholder="مثال: صورة دم كاملة CBC، سكر تراكمي HbA1c، وظائف كبد"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">النتيجة أو الملاحظة:</label>
                <input
                  name="lResult"
                  placeholder="مثال: طبيعي أو قيد التحليل بالمعمل"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingSync}
                  className="flex-1 btn-primary py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
                >
                  حفظ التحليل 💾
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddLabModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EDIT ALERTS & INSTRUCTIONS MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isEditAlertsModalOpen && patient && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-black text-navy-900 mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>تعديل التعليمات والتنبيهات الخاصة</span>
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const alertsText = (form.elements.namedItem('alertsText') as HTMLTextAreaElement).value
                const updated: PatientRecord = { ...patient, alerts: alertsText }
                syncPatientToSheets(updated, 'تم تحديث التنبيهات ومزامنتها بنجاح! ⚠️')
                setIsEditAlertsModalOpen(false)
              }}
              className="space-y-3 text-xs font-bold"
            >
              <div>
                <label className="text-slate-700 block mb-1">التعليمات والتنبيهات الخاصة بالحالة:</label>
                <textarea
                  name="alertsText"
                  defaultValue={patient.alerts || ''}
                  rows={5}
                  placeholder="مثال: حساسية شديدة من البنسلين، ضرورة تقليب المريض كل ساعتين لمنع قرح الفراش، قياس السكر قبل الوجبات..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingSync}
                  className="flex-1 btn-primary py-2.5 bg-navy-700 hover:bg-navy-800 text-white font-bold rounded-xl"
                >
                  حفظ ومزامنة 💾
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditAlertsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          EDIT NEXT VISIT MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isEditNextVisitModalOpen && patient && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-black text-navy-900 mb-3 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-gold-500" />
              <span>تعديل موعد الزيارة القادمة</span>
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const vDate = (form.elements.namedItem('vDate') as HTMLInputElement).value
                const vTime = (form.elements.namedItem('vTime') as HTMLInputElement).value
                const vService = (form.elements.namedItem('vService') as HTMLInputElement).value
                const vFollowUp = (form.elements.namedItem('vFollowUp') as HTMLInputElement).value

                let nextVisitStr = `${vDate} - ${vTime}\nالخدمة: ${vService}\nالحالة: مؤكدة`
                if (vFollowUp) nextVisitStr += `\n🔄 المتابعة القادمة: ${vFollowUp}`

                const updated: PatientRecord = { ...patient, nextVisit: nextVisitStr }
                syncPatientToSheets(updated, 'تم تحديث موعد الزيارة القادمة ومزامنة الشيت والتقويم! 📅')
                setIsEditNextVisitModalOpen(false)
              }}
              className="space-y-3 text-xs font-bold"
            >
              <div>
                <label className="text-slate-700 block mb-1">تاريخ الزيارة القادمة:</label>
                <input
                  name="vDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">وقت الزيارة:</label>
                <input
                  name="vTime"
                  type="time"
                  required
                  defaultValue="10:00"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">الخدمة المطلوبة:</label>
                <input
                  name="vService"
                  defaultValue="متابعة تمريضية"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">موعد المتابعة والتغيير الدوري القادم (اختياري):</label>
                <input
                  name="vFollowUp"
                  type="date"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingSync}
                  className="flex-1 btn-primary py-2.5 bg-navy-700 hover:bg-navy-800 text-white font-bold rounded-xl"
                >
                  حفظ الموعد والمزامنة 💾
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditNextVisitModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CREATE NEW PATIENT MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isNewPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-navy-900 flex items-center gap-2">
                <UserPlusIcon className="w-5 h-5 text-amber-600" />
                <span>إنشاء وتسجيل ملف طبي لمريض جديد</span>
              </h3>
              <button
                onClick={() => setIsNewPatientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const newId = `NABD-${Math.floor(1000 + Math.random() * 9000)}`
                const newRecord: PatientRecord = {
                  patientId: newId,
                  name: (form.elements.namedItem('nName') as HTMLInputElement).value,
                  customerName: (form.elements.namedItem('nCust') as HTMLInputElement).value,
                  phone: (form.elements.namedItem('nPhone') as HTMLInputElement).value,
                  whatsapp: (form.elements.namedItem('nPhone') as HTMLInputElement).value,
                  city: (form.elements.namedItem('nCity') as HTMLInputElement).value || 'دمياط',
                  address: (form.elements.namedItem('nAddress') as HTMLInputElement).value || '',
                  status: 'نشط',
                  medications: (form.elements.namedItem('nMeds') as HTMLTextAreaElement).value || '',
                  alerts: (form.elements.namedItem('nAlerts') as HTMLTextAreaElement).value || '',
                  vitalsHistory: '',
                  visitsHistory: '',
                  labTestsHistory: '',
                }
                syncPatientToSheets(newRecord, 'تم تسجيل المريض الجديد وحفظه في Google Sheets بنجاح! 👑')
                setIsNewPatientModalOpen(false)
              }}
              className="space-y-3 text-xs font-bold"
            >
              <div>
                <label className="text-slate-700 block mb-1">اسم المريض بالكامل:</label>
                <input
                  name="nName"
                  required
                  placeholder="مثال: محمود الشوبكي"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">اسم الحاجز / المتواصل:</label>
                <input
                  name="nCust"
                  placeholder="مثال: أحمد الشوبكي"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">رقم الهاتف:</label>
                  <input
                    name="nPhone"
                    required
                    placeholder="010XXXXXXXX"
                    dir="ltr"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">المنطقة بدمياط:</label>
                  <input
                    name="nCity"
                    defaultValue="دمياط"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">العنوان بالتفصيل:</label>
                <input
                  name="nAddress"
                  placeholder="الشارع، العلامة المميزة..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">الأدوية والعلاجات الأولية (اختياري):</label>
                <textarea
                  name="nMeds"
                  rows={2}
                  placeholder="قائمة الأدوية والجرعات..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">التنبيهات والملاحظات السريرية (اختياري):</label>
                <textarea
                  name="nAlerts"
                  rows={2}
                  placeholder="حساسية، أمراض مزمنة..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-navy-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingSync}
                  className="flex-1 btn-primary py-3 bg-amber-500 hover:bg-amber-600 text-navy-950 font-bold rounded-xl"
                >
                  حفظ وتسجيل المريض 💾
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewPatientModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ══════════════════════════════════════════════════════════════ */}
      {isDeleteConfirmModalOpen && patient && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4">
              🗑️
            </div>
            <h3 className="text-base font-black text-navy-900 mb-2">
              تأكيد حذف الملف الطبي
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              هل أنت متأكد من حذف الملف الطبي للمريض <strong>{patient.name}</strong> ({patient.patientId}) نهائياً من Google Sheets؟ لا يمكن التراجع عن هذا الإجراء.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleDeleteEntirePatient}
                disabled={savingSync}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-black text-xs shadow"
              >
                {savingSync ? 'جار الحذف…' : 'نعم، احذف الملف'}
              </button>
              <button
                onClick={() => setIsDeleteConfirmModalOpen(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SHARE MODAL & TOAST
      ══════════════════════════════════════════════════════════════ */}
      {isShareModalOpen && patient && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ShareIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-navy-900">
                  مشاركة الملف الطبي الموحد
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleWhatsAppShare}
                className="w-full btn-primary py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>إرسال مباشر عبر واتساب</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="w-full bg-slate-100 hover:bg-slate-200 text-navy-900 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-navy-700" />
                <span>نسخ نص التقرير الطبي كاملاً</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full bg-slate-100 hover:bg-slate-200 text-navy-900 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <DocumentDuplicateIcon className="w-4 h-4 text-navy-700" />
                <span>نسخ رابط الصفحة المباشر</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {shareToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy-950 text-white border border-gold-500/50 px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-fade-in no-print">
          <SparklesIcon className="w-4 h-4 text-gold-400" />
          <span>{shareToast}</span>
        </div>
      )}

      <Footer />
      <FloatingActions />
    </>
  )
}
