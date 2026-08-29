'use client'
/**
 * app/prescriptions/page.tsx — نبض للتمريض المنزلي
 * تبويب الروشتات الطبية الذكي والأكثر بساطة وتطوراً وسلاسة
 * مستوحى من كتاب روشتاتولوجي (Roshetatology - د. أحمد عبد الله)
 * يجمع بين شكل الروشتة الطبية الأنيقة (Rx Pad) والبحث السريع وإمكانية نسخ وإرسال الروشتة للصيدلية أو طلب ممرض منزلي فوراً
 */

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ShareIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid'
import {
  prescriptionsDatabase,
  PRESCRIPTION_CATEGORIES,
  ABDOMINAL_PAIN_DIAGNOSTIC_GUIDE,
  Prescription,
} from '@/data/prescriptionsData'
import { siteConfig } from '@/data/siteConfig'

// ── Smart Quick Symptom Categories (مساعد الأعراض السريع) ──
const SMART_SYMPTOM_PICKERS = [
  {
    id: 'digestive_vomit_diarrhea',
    title: 'ترجيع وإسهال ومغص',
    icon: '🤢',
    query: 'ترجيع',
    bgGradient: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900',
    count: '12 حالة',
  },
  {
    id: 'respiratory_chest',
    title: 'صدر وكحة وربو ولوز',
    icon: '🫁',
    query: 'كحة',
    bgGradient: 'from-sky-50 to-blue-50 border-sky-200 text-sky-900',
    count: '11 حالة',
  },
  {
    id: 'cardio_pressure',
    title: 'ضغط وقلب وشرايين',
    icon: '❤️',
    query: 'ضغط',
    bgGradient: 'from-rose-50 to-red-50 border-rose-200 text-rose-900',
    count: '7 حالات',
  },
  {
    id: 'endocrine_diabetes',
    title: 'سكر وغدد وأعصاب',
    icon: '🩸',
    query: 'سكر',
    bgGradient: 'from-amber-50 to-orange-50 border-amber-200 text-amber-900',
    count: '10 حالات',
  },
  {
    id: 'bones_joints_sciatica',
    title: 'عظام وغضروف ومفاصل',
    icon: '🦴',
    query: 'عرق النسا',
    bgGradient: 'from-slate-50 to-stone-100 border-slate-200 text-slate-900',
    count: '6 حالات',
  },
  {
    id: 'pediatrics_kids',
    title: 'أطفال وسخونية ورضع',
    icon: '👶',
    query: 'أطفال',
    bgGradient: 'from-indigo-50 to-violet-50 border-indigo-200 text-indigo-900',
    count: '5 حالات',
  },
]

// ── Quick complaint search pills (أشهر الشكاوى السريعة عبر الـ 15 باباً) ──
const POPULAR_COMPLAINTS = [
  { label: 'ترجيع مستمر 🤢', query: 'ترجيع' },
  { label: 'إسهال ودوسنتاريا 💧', query: 'اسهال' },
  { label: 'مغص وتقلصات بطن ⚡', query: 'مغص' },
  { label: 'قولون وغازات 💨', query: 'قولون' },
  { label: 'إمساك وحقنة شرجية 🧱', query: 'امساك' },
  { label: 'ضغط مرتفع وصداع 🩺', query: 'ضغط' },
  { label: 'سكر عالي وتنميل 🩸', query: 'سكر' },
  { label: 'سخونية أطفال وتشنج 👶', query: 'سخونية' },
  { label: 'أزمة ربو وكحة وصدر 🫁', query: 'ربو' },
  { label: 'التهاب لوز وزور 🤒', query: 'الزور' },
  { label: 'شقيقة وصداع نصفي 🧠', query: 'صداع' },
  { label: 'حزام ناري وأعصاب 🔥', query: 'حزام ناري' },
  { label: 'مغص كلوي وحصوات ⚡', query: 'مغص كلوي' },
  { label: 'عرق النسا وغضروف 🦴', query: 'عرق النسا' },
  { label: 'حروق وغيار معقم 🩹', query: 'حروق' },
  { label: 'جرح قيصرية وعمليات ✂️', query: 'قيصرية' },
  { label: 'قرح فراش 🩹', query: 'قرحة' },
  { label: 'رمد واحمرار عين 👁️', query: 'عين' },
  { label: 'تسمم ومبيدات 🚨', query: 'تسمم' },
  { label: 'نقص فيتامين د وب12 💊', query: 'فيتامين' },
  { label: 'مغص الدورة 🌸', query: 'الدورة' },
]

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(prescriptionsDatabase[0]?.id || null)
  const [showAbdominalGuide, setShowAbdominalGuide] = useState<boolean>(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Filter prescriptions by complaint, medicine, title or category
  const filteredPrescriptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return prescriptionsDatabase.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false
      }

      if (!q) return true

      // Search across complaints (عامية مصرية)
      const complaintMatch = item.commonComplaints.some(
        (c) => c.toLowerCase().includes(q) || q.includes(c.toLowerCase())
      )

      // Search across title & diagnosis
      const titleMatch =
        item.titleArabic.toLowerCase().includes(q) ||
        item.titleEnglish.toLowerCase().includes(q)
      const diagnosisMatch = item.diagnosisSummary.toLowerCase().includes(q)

      // Search across medicines trade names & generic names
      const medicineMatch = item.medicines.some(
        (m) =>
          m.tradeName.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.purpose.toLowerCase().includes(q)
      )

      return complaintMatch || titleMatch || diagnosisMatch || medicineMatch
    })
  }, [searchQuery, selectedCategory])

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const getWhatsAppUrl = (text: string) => {
    const cleanPhone = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
  }

  const selectGuideItem = (query: string) => {
    setSearchQuery(query)
    setSelectedCategory('all')
    setShowAbdominalGuide(false)
    const element = document.getElementById('prescriptions-list')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Copy prescription text to clipboard for pharmacy / family
  const copyPrescriptionText = async (item: Prescription) => {
    const medicinesList = item.medicines
      .map((m, idx) => `${idx + 1}. ${m.tradeName} (${m.genericName})\n   • الجرعة: ${m.dosage}\n   • الغرض: ${m.purpose}`)
      .join('\n\n')

    const textToCopy = `📋 روشتة نبض الطبية: ${item.titleArabic} (${item.titleEnglish})\n═══════════════════════\n🔍 التشخيص والأسباب:\n${item.diagnosisSummary}\n\n💊 قائمة الأدوية المقررة:\n${medicinesList}\n\n🥣 نصائح هامة:\n${item.homeCareAndDiet.slice(0, 2).join('\n')}\n\n🩺 لطلب ممرض منزلي لتنفيذ الحقن والمحاليل في دمياط:\nهاتف نبض: ${siteConfig.contact.phone}\nواتساب: https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy)
        setCopiedId(item.id)
        setTimeout(() => setCopiedId(null), 2500)
      }
    } catch {
      // Fallback
    }
  }

  // Share on WhatsApp directly
  const sharePrescriptionWhatsApp = (item: Prescription) => {
    const medicinesSummary = item.medicines.map((m) => `• ${m.tradeName} (${m.dosage})`).join('\n')
    const message = `السلام عليكم، لو سمحت عايز استفسر عن توافر أدوية هذه الروشتة:\n\n*${item.titleArabic}*\n${medicinesSummary}\n\nشكراً لحضرتك.`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 pb-28 sm:pb-20">
        {/* ── Top Floating Notification Bar ── */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white py-2.5 px-4 shadow sticky top-16 z-30 border-b border-gold-500/40 backdrop-blur-md">
          <div className="section-container flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="truncate max-w-[280px] sm:max-w-none">
                معاك روشتة مكتوبة ومحتاج ممرض يعلق المحلول أو يعطيك الحقن في بيتك؟
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={getWhatsAppUrl('السلام عليكم، معايا روشتة علاج ومحتاج ممرض منزلي بدمياط لتنفيذ الحقن والمحاليل بالبيت.')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-black shadow inline-flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <span>طلب ممرض فوري 📲</span>
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"
              >
                <PhoneIcon className="w-3 h-3 text-gold-300" />
                <span className="hidden sm:inline">{siteConfig.contact.phone}</span>
                <span className="sm:hidden">اتصال</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Modern Hero Section ── */}
        <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white pt-8 pb-12 sm:pt-12 sm:pb-16 px-4">
          <div className="section-container max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1 mb-4 text-xs font-bold text-gold-300">
              <SparklesIcon className="w-4 h-4 text-gold-400" />
              <span>دليل الروشتات الطبية الشامل (Roshetatology) لخدمة مريض دمياط</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
              أهم <span className="text-gold-400">الروشتات الطبية</span> الشائعة ℞
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto mb-6">
              دليلك المنظم لجميع الحالات الشائعة بالعامية المصرية؛ أدوية وجرعات واضحة، تشخيص سريع، وإمكانية نسخ الروشتة أو طلب ممرض نبض لتعليق المحاليل والحقن ببيتك.
            </p>

            {/* ── Search Input (Ultra-Clean & Responsive) ── */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالعرض أو الدواء... (مثلاً: ترجيع، اسهال، مغص، قولون، لوز، بول، ضغط)"
                  className="w-full py-4 pe-12 ps-12 bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-bold focus:outline-none focus:ring-4 focus:ring-gold-400/40 border-0 transition-all"
                  dir="rtl"
                />
                <MagnifyingGlassIcon className="w-6 h-6 text-navy-600 absolute start-4 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute end-4 w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
                    aria-label="مسح البحث"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* ── Quick Popular Complaint Pills ── */}
            <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-bold me-1">شكاوى سريعة:</span>
              {POPULAR_COMPLAINTS.slice(0, 10).map((pill) => (
                <button
                  key={pill.query}
                  onClick={() => {
                    setSearchQuery(pill.query)
                    setSelectedCategory('all')
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    searchQuery === pill.query
                      ? 'bg-gold-400 text-navy-950 font-black shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* ── Abdominal Pain Guide Toggle Button ── */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setShowAbdominalGuide((prev) => !prev)}
                className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <span>🧭 خريطة تشخيص وجع البطن والمغص (دور على السبب)</span>
                {showAbdominalGuide ? (
                  <ChevronUpIcon className="w-4 h-4" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ── Smart Symptom Picker Grid (مساعد الأعراض السريع المطور) ── */}
        <section className="section-container max-w-5xl -mt-6 sm:-mt-8 mb-8 px-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🩺</span>
                <h2 className="text-sm sm:text-base font-black text-slate-800">
                  بتشتكي من إيه دلوقتي؟ (اختر العرض للوصول السريع)
                </h2>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-navy-600 hover:text-navy-800 flex items-center gap-1"
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  <span>إلغاء التصفية</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
              {SMART_SYMPTOM_PICKERS.map((picker) => (
                <button
                  key={picker.id}
                  onClick={() => {
                    setSearchQuery(picker.query)
                    setSelectedCategory('all')
                    const el = document.getElementById('prescriptions-list')
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 hover:shadow-md active:scale-95 ${picker.bgGradient} ${
                    searchQuery === picker.query ? 'ring-2 ring-gold-500 shadow-md font-black' : ''
                  }`}
                >
                  <span className="text-2xl">{picker.icon}</span>
                  <span className="text-xs font-extrabold leading-snug">{picker.title}</span>
                  <span className="text-[10px] opacity-75 font-semibold bg-white/70 px-2 py-0.5 rounded-full border border-slate-200">
                    {picker.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Interactive Abdominal Pain Diagnostic Map (خريطة وجع البطن التفاعلية) ── */}
        {showAbdominalGuide && (
          <section className="section-container max-w-5xl mb-8 px-4">
            <div className="bg-white border-2 border-gold-400 rounded-3xl p-5 sm:p-7 shadow-xl animate-fadeIn">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-gold-800 bg-gold-50 px-3 py-1 rounded-full border border-gold-200 mb-1.5">
                    <span>📚 مرجع إكلينيكي معتمد: Roshetatology - Dr / Ahmed Abd Allah</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">
                    دليل تشخيص وجع وألم البطن (Abdominal Pain: Search for Cause)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    حدد مكان الوجع بالظبط لمعرفة سببه المحتمل، الفحص السريري، وكيفية التصرف الطبي الصحيح:
                  </p>
                </div>
                <button
                  onClick={() => setShowAbdominalGuide(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0"
                  aria-label="إغلاق الدليل"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {ABDOMINAL_PAIN_DIAGNOSTIC_GUIDE.map((guide) => (
                  <div
                    key={guide.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      guide.isSurgicalAlert
                        ? 'border-red-300 bg-red-50/70 ring-1 ring-red-200'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <span>📍</span>
                        <span>{guide.locationName}</span>
                      </span>
                      {guide.isSurgicalAlert && (
                        <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full animate-pulse">
                          طوارئ جراحية
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-800 mb-2 leading-relaxed">
                      {guide.symptomsAndColic}
                    </p>

                    <div className="text-xs text-slate-700 flex flex-col gap-1.5 pt-2 border-t border-slate-200">
                      <div>
                        <strong className="text-slate-900">الفحص:</strong> {guide.examinationKey}
                      </div>
                      <div>
                        <strong className="text-slate-900">العلاج والإجراء:</strong> {guide.whatToDo}
                      </div>
                    </div>

                    <div className="mt-3 pt-2">
                      <button
                        onClick={() => {
                          if (guide.id.includes('appendicitis')) selectGuideItem('زائدة')
                          else if (guide.id.includes('renal')) selectGuideItem('مغص كلوي')
                          else if (guide.id.includes('gastritis')) selectGuideItem('حموضة')
                          else if (guide.id.includes('gallbladder')) selectGuideItem('مرارة')
                          else if (guide.id.includes('spastic')) selectGuideItem('قولون')
                          else if (guide.id.includes('menses')) selectGuideItem('الدورة')
                          else selectGuideItem('مغص')
                        }}
                        className="text-xs font-black text-navy-700 hover:text-navy-900 underline flex items-center gap-1"
                      >
                        <span>عرض الروشتة الخاصة بهذه الحالة ⬅️</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Main Prescriptions Container ── */}
        <div id="prescriptions-list" className="section-container max-w-5xl px-4">
          <div className="flex flex-col gap-5">

            {/* ── Category Tabs (Smooth Horizontal Scroll) ── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {PRESCRIPTION_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id)
                      setSearchQuery('')
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                      isActive
                        ? 'bg-navy-900 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>

            {/* ── Filter Counter & Quick Status ── */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                عدد الروشتات المتاحة:{' '}
                <strong className="text-slate-900 font-black">{filteredPrescriptions.length}</strong>
              </span>
              {searchQuery && (
                <div className="flex items-center gap-2">
                  <span>
                    نتائج البحث عن:{' '}
                    <strong className="text-navy-700 font-black">&quot;{searchQuery}&quot;</strong>
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-red-600 hover:text-red-700 font-bold underline"
                  >
                    مسح
                  </button>
                </div>
              )}
            </div>

            {/* ── Prescription Cards List ── */}
            {filteredPrescriptions.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center shadow-sm">
                <span className="text-4xl mb-3 block">💊</span>
                <h3 className="text-base sm:text-lg font-black text-slate-800 mb-1">
                  لم نجد روشتة تطابق بحثك &quot;{searchQuery}&quot;
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
                  جرب البحث بكلمة عامية أخرى مثل: (ترجيع، اسهال، مغص، قولون، امساك، ضغط، سكر، لوز، سخونية، بول، عرق النسا، حروق، تسمم).
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="bg-navy-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:bg-navy-900"
                >
                  عرض جميع الروشتات ({prescriptionsDatabase.length} حالة)
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredPrescriptions.map((prescription) => {
                  const isExpanded = expandedId === prescription.id
                  const isCopied = copiedId === prescription.id

                  return (
                    <article
                      key={prescription.id}
                      className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                        isExpanded
                          ? 'border-navy-400 shadow-xl ring-2 ring-navy-100'
                          : 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      {/* ── Prescription Header (Click to Expand) ── */}
                      <div
                        onClick={() => toggleExpand(prescription.id)}
                        className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none transition-colors hover:bg-slate-50/70"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Rx Stamp Badge */}
                          <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm bg-navy-50 text-navy-800 border border-navy-100">
                            <span className="text-base font-black font-serif leading-none">℞</span>
                            <span className="text-[9px] font-bold text-navy-600 mt-0.5">روشتة</span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-900 border border-gold-200">
                                {prescription.categoryName}
                              </span>
                              {prescription.pageInBook && (
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                  📖 {prescription.pageInBook}
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500 font-bold">
                                {prescription.titleEnglish}
                              </span>
                            </div>

                            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                              {prescription.titleArabic}
                            </h2>

                            <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
                              {prescription.diagnosisSummary}
                            </p>

                            {/* Preview of Key Medicines (Collapsed View) */}
                            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-slate-400 font-bold">أبرز الأدوية:</span>
                              {prescription.medicines.slice(0, 3).map((med, mIdx) => (
                                <span
                                  key={mIdx}
                                  className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold border border-slate-200/60"
                                >
                                  💊 {med.tradeName.split('(')[0].trim()}
                                </span>
                              ))}
                              {prescription.medicines.length > 3 && (
                                <span className="text-[10px] text-navy-600 font-black">
                                  +{prescription.medicines.length - 3} أدوية أخرى
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expand / Collapse Icon */}
                        <div className="shrink-0 pt-1">
                          <button
                            type="button"
                            aria-label={isExpanded ? 'طي الروشتة' : 'عرض الروشتة كاملة'}
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
                              isExpanded ? 'bg-navy-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isExpanded ? (
                              <ChevronUpIcon className="w-5 h-5" />
                            ) : (
                              <ChevronDownIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* ── Expanded Prescription Body (Medical Pad Design) ── */}
                      {isExpanded && (
                        <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-6">

                          {/* Top Quick Actions Bar: Copy / Share / Call */}
                          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copyPrescriptionText(prescription)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 transition-all active:scale-95 ${
                                  isCopied
                                    ? 'bg-emerald-600 text-white shadow'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                                }`}
                              >
                                {isCopied ? (
                                  <>
                                    <CheckIcon className="w-4 h-4" />
                                    <span>تم نسخ الروشتة والأدوية! ✅</span>
                                  </>
                                ) : (
                                  <>
                                    <DocumentDuplicateIcon className="w-4 h-4 text-slate-600" />
                                    <span>نسخ الروشتة للصيدلية 📋</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => sharePrescriptionWhatsApp(prescription)}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all active:scale-95"
                              >
                                <ShareIcon className="w-3.5 h-3.5 text-emerald-700" />
                                <span>إرسال للصيدلية عبر واتساب 💬</span>
                              </button>

                              <button
                                onClick={() => window.print()}
                                className="px-3 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all active:scale-95 no-print"
                                title="طباعة الروشتة أو حفظ كـ PDF"
                              >
                                <span>طباعة 🖨️</span>
                              </button>
                            </div>

                            <a
                              href={getWhatsAppUrl(`السلام عليكم، محتاج تمريض منزلي لحالة ${prescription.titleArabic} لتنفيذ الروشتة بالمنزل.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-black text-navy-800 hover:text-navy-950 underline flex items-center gap-1"
                            >
                              <span>طلب ممرض للروشتة فورا 📲</span>
                            </a>
                          </div>

                          {/* 1. Diagnosis & Causes */}
                          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                            <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-2 flex items-center gap-1.5">
                              <span>🔍</span>
                              <span>التشخيص الإكلينيكي والأسباب الشائعة:</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mb-3">
                              {prescription.diagnosisSummary}
                            </p>
                            <ul className="flex flex-col gap-1.5 ps-3 border-t border-slate-100 pt-2.5">
                              {prescription.causes.map((cause, cIdx) => (
                                <li
                                  key={cIdx}
                                  className="text-xs sm:text-sm text-slate-700 list-disc list-inside leading-relaxed"
                                >
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 2. Clinical Warnings & Red Flags */}
                          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-black text-amber-950">
                              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 shrink-0" />
                              <span>الفحص السريري والتنبيهات الطبية والجراحية:</span>
                            </div>
                            {prescription.examinationAndWarnings.surgicalWarning && (
                              <p className="text-xs sm:text-sm text-amber-950 font-semibold mb-2 leading-relaxed">
                                ⚠️ <strong>فحص البطن أو الجراحة:</strong>{' '}
                                {prescription.examinationAndWarnings.surgicalWarning}
                              </p>
                            )}
                            {prescription.examinationAndWarnings.dehydrationSigns && (
                              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed mb-2">
                                💧 <strong>مضاعفات يجب الحذر منها:</strong>{' '}
                                {prescription.examinationAndWarnings.dehydrationSigns}
                              </p>
                            )}
                            <div className="mt-2.5 pt-2.5 border-t border-amber-200/80 text-xs font-bold text-red-700">
                              🚨 <strong>متى يلزم المستشفى فوراً:</strong>{' '}
                              {prescription.examinationAndWarnings.redFlags}
                            </div>
                          </div>

                          {/* 3. Detailed Medicines Table (Rx) */}
                          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                              <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                                <span className="text-base font-serif font-black text-navy-800">℞</span>
                                <span>قائمة الأدوية والجرعات المقررة:</span>
                              </h3>
                              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full border border-slate-200">
                                استشر الطبيب للجرعة الدقيقة
                              </span>
                            </div>

                            <div className="flex flex-col gap-3">
                              {prescription.medicines.map((med, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1.5">
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                                        💊 {med.tradeName}
                                      </h4>
                                      <span className="text-[11px] text-slate-500 font-medium block">
                                        الاسم العلمي: {med.genericName}
                                      </span>
                                    </div>
                                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                                      موصوف طبياً
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                                    <div>
                                      <strong className="text-navy-800">الغرض بالعربي:</strong>{' '}
                                      <span className="text-slate-700">{med.purpose}</span>
                                    </div>
                                    <div>
                                      <strong className="text-navy-800">الجرعة المقررة:</strong>{' '}
                                      <span className="text-slate-900 font-bold">{med.dosage}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 4. Home Care & Nutrition Tips */}
                          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 sm:p-5 shadow-sm">
                            <h4 className="text-xs sm:text-sm font-black text-blue-950 mb-2 flex items-center gap-1.5">
                              <span>🥣</span>
                              <span>نصائح العناية المنزلية والتغذية:</span>
                            </h4>
                            <ul className="flex flex-col gap-1.5 ps-3">
                              {prescription.homeCareAndDiet.map((tip, tIdx) => (
                                <li
                                  key={tIdx}
                                  className="text-xs sm:text-sm text-blue-900 list-disc list-inside leading-relaxed"
                                >
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 5. 🌟 GOLDEN MARKETING CARD (نبض للتمريض المنزلي بدمياط) 🌟 */}
                          <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white rounded-2xl p-5 sm:p-6 shadow-xl border-2 border-gold-400 relative overflow-hidden">
                            <div className="absolute top-0 end-0 bg-gold-400 text-navy-950 text-[10px] font-black px-3 py-1 rounded-es-xl shadow">
                              خدمة تمريض متخصصة لمنزلك بدمياط
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <ShieldCheckIcon className="w-5 h-5 text-gold-400" />
                              <h4 className="text-sm sm:text-base font-black text-gold-300">
                                {prescription.nursingService.serviceName}
                              </h4>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
                              {prescription.nursingService.serviceDescription}
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                              <a
                                href={getWhatsAppUrl(prescription.nursingService.whatsappText)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl justify-center shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
                              >
                                <span>طلب ممرض للروشتة عبر واتساب 📲</span>
                              </a>

                              <div className="flex items-center gap-2">
                                <Link
                                  href="/booking"
                                  className="bg-gold-400 hover:bg-gold-500 text-navy-950 font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow transition-all"
                                >
                                  احجز ممرض الآن 📅
                                </Link>
                                <a
                                  href={`tel:${siteConfig.contact.phone}`}
                                  className="text-xs text-white/90 hover:text-white px-2 py-1 flex items-center gap-1 font-bold"
                                >
                                  <PhoneIcon className="w-3.5 h-3.5 text-gold-300" />
                                  <span>{siteConfig.contact.phone}</span>
                                </a>
                              </div>
                            </div>
                          </div>

                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}

            {/* ── Bottom Marketing Notice ── */}
            <div className="mt-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 text-center shadow-sm">
              <ClipboardDocumentCheckIcon className="w-12 h-12 text-navy-700 mx-auto mb-2" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1">
                معاك روشتة مكتوبة من دكتورك ومحتاج حد ينفذها في البيت؟
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-5">
                فريق نبض للتمريض المنزلي بدمياط جاهز للوصول إليك في أي وقت لتركيب المحاليل، الكانيولا، إعطاء الحقن العضلية والوريدية، وعمل الغيار المعقم بأعلى درجات الأمان الطبي.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/booking"
                  className="bg-navy-900 hover:bg-navy-800 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95"
                >
                  احجز زيارة تمريض منزلية الآن 🩺
                </Link>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl border border-slate-300 inline-flex items-center gap-1.5 transition-all"
                >
                  <PhoneIcon className="w-4 h-4 text-gold-600" />
                  <span>اتصل بنبض: {siteConfig.contact.phone}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <FloatingActions />
      <Footer />
    </>
  )
}
