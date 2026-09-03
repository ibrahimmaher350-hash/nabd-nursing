'use client'
/**
 * components/medical-guide/PrescriptionsSection.tsx — نبض للتمريض المنزلي
 * قسم دليل الروشتات الطبية والأدوية الشائعة (Roshetatology)
 */

import { useState, useMemo } from 'react'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
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
]

export default function PrescriptionsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(prescriptionsDatabase[0]?.id || null)
  const [showAbdominalGuide, setShowAbdominalGuide] = useState<boolean>(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredPrescriptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return prescriptionsDatabase.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false
      }
      if (!q) return true

      const complaintMatch = item.commonComplaints.some(
        (c) => c.toLowerCase().includes(q) || q.includes(c.toLowerCase())
      )
      const titleMatch =
        item.titleArabic.toLowerCase().includes(q) ||
        item.titleEnglish.toLowerCase().includes(q)
      const diagnosisMatch = item.diagnosisSummary.toLowerCase().includes(q)
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
  }

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

  const sharePrescriptionWhatsApp = (item: Prescription) => {
    const medicinesSummary = item.medicines.map((m) => `• ${m.tradeName} (${m.dosage})`).join('\n')
    const message = `السلام عليكم، لو سمحت عايز استفسر عن توافر أدوية هذه الروشتة:\n\n*${item.titleArabic}*\n${medicinesSummary}\n\nشكراً لحضرتك.`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Floating Notification ── */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white p-3 sm:p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold border-b border-gold-500/40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>معاك روشتة مكتوبة ومحتاج ممرض يعلق المحلول أو يعطيك الحقن في بيتك بدمياط؟</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={getWhatsAppUrl('السلام عليكم، معايا روشتة علاج ومحتاج ممرض منزلي بدمياط لتنفيذ الحقن والمحاليل بالبيت.')}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-full text-xs font-black shadow inline-flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <span>طلب ممرض فوري 📲</span>
          </a>
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1"
          >
            <PhoneIcon className="w-3 h-3 text-gold-300" />
            <span>اتصال: {siteConfig.contact.phone}</span>
          </a>
        </div>
      </div>

      {/* ── Section Title & Search ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm text-center">
        <div className="inline-flex items-center gap-1.5 bg-gold-50 border border-gold-200 text-gold-900 px-3 py-1 rounded-full text-xs font-bold mb-3">
          <SparklesIcon className="w-3.5 h-3.5 text-gold-500" />
          <span>دليل الروشتات الطبية الشامل (Roshetatology) — دمياط</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-navy-800 mb-2">
          أهم <span className="text-gold-600">الروشتات والأدوية الطبية</span> الشائعة ℞
        </h2>
        <p className="text-xs sm:text-sm text-medical-muted max-w-xl mx-auto mb-5 leading-relaxed">
          دليلك المنظم لجميع الحالات الشائعة بالعامية المصرية؛ أدوية وجرعات واضحة، تشخيص سريع، وإمكانية نسخ الروشتة أو طلب ممرض نبض لتعليق المحاليل بالمنزل.
        </p>

        {/* Search Input */}
        <div className="max-w-xl mx-auto relative mb-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعرض أو الدواء... (مثلاً: ترجيع، اسهال، مغص، قولون، ضغط)"
              className="w-full py-3.5 pe-12 ps-12 rounded-2xl bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-bold border-2 border-slate-200 focus:border-navy-600 focus:bg-white focus:outline-none transition-all"
              dir="rtl"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute start-4 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-4 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center"
                aria-label="مسح البحث"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Popular Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-bold me-1">شكاوى:</span>
          {POPULAR_COMPLAINTS.slice(0, 8).map((pill) => (
            <button
              key={pill.query}
              onClick={() => {
                setSearchQuery(pill.query)
                setSelectedCategory('all')
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                searchQuery === pill.query
                  ? 'bg-navy-800 text-white font-bold shadow'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Abdominal Map Button */}
        <div className="mt-4">
          <button
            onClick={() => setShowAbdominalGuide((prev) => !prev)}
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95"
          >
            <span>🧭 خريطة تشخيص وجع البطن والمغص</span>
            {showAbdominalGuide ? (
              <ChevronUpIcon className="w-3.5 h-3.5" />
            ) : (
              <ChevronDownIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Symptom Picker Grid ── */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5">
            <span>🩺</span>
            <span>بتشتكي من إيه دلوقتي؟ (اختر العرض للوصول السريع)</span>
          </h3>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-navy-600 hover:text-navy-800 flex items-center gap-1"
            >
              <ArrowPathIcon className="w-3 h-3" />
              <span>إلغاء التصفية</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SMART_SYMPTOM_PICKERS.map((picker) => (
            <button
              key={picker.id}
              onClick={() => {
                setSearchQuery(picker.query)
                setSelectedCategory('all')
              }}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 hover:shadow-sm active:scale-95 ${picker.bgGradient} ${
                searchQuery === picker.query ? 'ring-2 ring-gold-500 shadow-sm font-black' : ''
              }`}
            >
              <span className="text-xl">{picker.icon}</span>
              <span className="text-xs font-extrabold leading-snug">{picker.title}</span>
              <span className="text-[10px] opacity-75 font-semibold bg-white/70 px-2 py-0.5 rounded-full border border-slate-200">
                {picker.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Abdominal Pain Guide ── */}
      {showAbdominalGuide && (
        <div className="bg-white border-2 border-gold-400 rounded-3xl p-5 shadow-md">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-800">
                دليل تشخيص وجع وألم البطن (Search for Cause)
              </h4>
              <p className="text-xs text-slate-600">
                حدد مكان الوجع بالظبط لمعرفة سببه المحتمل وكيفية التصرف الطبي:
              </p>
            </div>
            <button
              onClick={() => setShowAbdominalGuide(false)}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ABDOMINAL_PAIN_DIAGNOSTIC_GUIDE.map((guide) => (
              <div
                key={guide.id}
                className={`p-3.5 rounded-2xl border ${
                  guide.isSurgicalAlert
                    ? 'border-red-300 bg-red-50/70'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-black text-slate-900">📍 {guide.locationName}</span>
                  {guide.isSurgicalAlert && (
                    <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full">
                      طوارئ جراحية
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-800 mb-1.5">{guide.symptomsAndColic}</p>
                <p className="text-[11px] text-slate-600 mb-1"><strong>الفحص:</strong> {guide.examinationKey}</p>
                <button
                  onClick={() => selectGuideItem(guide.locationName.split(' ')[0])}
                  className="text-xs font-black text-navy-700 hover:underline mt-1 block"
                >
                  عرض الروشتة الخاصة بهذه الحالة ⬅️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Category Tabs ── */}
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

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          عدد الروشتات المتاحة: <strong className="text-slate-900 font-black">{filteredPrescriptions.length}</strong>
        </span>
        {searchQuery && (
          <div className="flex items-center gap-2">
            <span>
              نتائج البحث عن: <strong className="text-navy-700 font-black">&quot;{searchQuery}&quot;</strong>
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

      {/* ── Prescriptions List ── */}
      {filteredPrescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center shadow-xs">
          <span className="text-4xl mb-3 block">💊</span>
          <h3 className="text-base sm:text-lg font-black text-slate-800 mb-1">
            لم نجد روشتة تطابق بحثك &quot;{searchQuery}&quot;
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
            جرب البحث بكلمة عامية أخرى مثل: (ترجيع، اسهال، مغص، قولون، ضغط، سكر، لوز).
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
                    : 'border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Header */}
                <div
                  onClick={() => toggleExpand(prescription.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none transition-colors hover:bg-slate-50/70"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-xs bg-navy-50 text-navy-800 border border-navy-100">
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

                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {prescription.titleArabic}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-1">
                        {prescription.diagnosisSummary}
                      </p>

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

                {/* Expanded Rx Body */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-5">
                    {/* Quick Actions Bar */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
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
                              <span>تم نسخ الروشتة! ✅</span>
                            </>
                          ) : (
                            <>
                              <DocumentDuplicateIcon className="w-4 h-4 text-slate-600" />
                              <span>نسخ للصيدلية 📋</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => sharePrescriptionWhatsApp(prescription)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all active:scale-95"
                        >
                          <ShareIcon className="w-3.5 h-3.5 text-emerald-700" />
                          <span>إرسال عبر واتساب 💬</span>
                        </button>
                      </div>

                      <a
                        href={getWhatsAppUrl(`السلام عليكم، محتاج تمريض منزلي لحالة ${prescription.titleArabic} لتنفيذ الروشتة بالمنزل.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-black text-navy-800 hover:text-navy-950 underline flex items-center gap-1"
                      >
                        <span>طلب ممرض للروشتة فوراً 📲</span>
                      </a>
                    </div>

                    {/* Diagnosis */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-2 flex items-center gap-1.5">
                        <span>🔍</span>
                        <span>التشخيص الإكلينيكي والأسباب:</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mb-3">
                        {prescription.diagnosisSummary}
                      </p>
                      <ul className="flex flex-col gap-1 ps-3 border-t border-slate-100 pt-2">
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

                    {/* Warnings */}
                    <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 shadow-xs">
                      <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-black text-amber-950">
                        <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>الفحص السريري والتنبيهات:</span>
                      </div>
                      {prescription.examinationAndWarnings.surgicalWarning && (
                        <p className="text-xs text-amber-950 font-semibold mb-1.5 leading-relaxed">
                          ⚠️ <strong>فحص البطن أو الجراحة:</strong> {prescription.examinationAndWarnings.surgicalWarning}
                        </p>
                      )}
                      <div className="mt-2 pt-2 border-t border-amber-200/80 text-xs font-bold text-red-700">
                        🚨 <strong>متى يلزم المستشفى فوراً:</strong> {prescription.examinationAndWarnings.redFlags}
                      </div>
                    </div>

                    {/* Medicines */}
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                          <span className="text-base font-serif font-black text-navy-800">℞</span>
                          <span>قائمة الأدوية والجرعات المقررة:</span>
                        </h4>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {prescription.medicines.map((med, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3 rounded-xl border border-slate-200 bg-slate-50/60"
                          >
                            <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                              <div>
                                <h5 className="text-xs sm:text-sm font-black text-slate-900">
                                  💊 {med.tradeName}
                                </h5>
                                <span className="text-[11px] text-slate-500 block">
                                  الاسم العلمي: {med.genericName}
                                </span>
                              </div>
                              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-black px-2 py-0.5 rounded-full border border-emerald-200">
                                موصوف طبياً
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs pt-2 border-t border-slate-200/60">
                              <div>
                                <strong className="text-navy-800">الغرض:</strong> <span className="text-slate-700">{med.purpose}</span>
                              </div>
                              <div>
                                <strong className="text-navy-800">الجرعة:</strong> <span className="text-slate-900 font-bold">{med.dosage}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nursing Service Card */}
                    <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-gold-400">
                      <div className="flex items-center gap-2 mb-1.5">
                        <ShieldCheckIcon className="w-5 h-5 text-gold-400" />
                        <h5 className="text-sm font-black text-gold-300">
                          {prescription.nursingService.serviceName}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed mb-3">
                        {prescription.nursingService.serviceDescription}
                      </p>
                      <a
                        href={getWhatsAppUrl(prescription.nursingService.whatsappText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow"
                      >
                        <span>طلب هذه الخدمة من نبض عبر واتساب 📲</span>
                      </a>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
