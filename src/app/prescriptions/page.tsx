'use client'
/**
 * app/prescriptions/page.tsx — نبض للتمريض المنزلي
 * دليل أهم الروشتات الطبية الشائعة لخدمة المريض والتسويق لخدمات التمريض المنزلي
 * مستوحى من كتاب روشتاتولوجي (Roshetatology - د. أحمد عبد الله)
 * يبحث بكلمة من العرض أو الشكوى بالعامية المصرية ويربط كل روشتة بخدمة التمريض المنزلية
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
} from '@heroicons/react/24/solid'
import {
  prescriptionsDatabase,
  PRESCRIPTION_CATEGORIES,
  ABDOMINAL_PAIN_DIAGNOSTIC_GUIDE,
} from '@/data/prescriptionsData'
import { siteConfig } from '@/data/siteConfig'

// Quick complaint search pills
const POPULAR_COMPLAINTS = [
  { label: 'ترجيع مستمر 🤢', query: 'ترجيع' },
  { label: 'إسهال ودوسنتاريا 💧', query: 'اسهال' },
  { label: 'وجع ومغص بطن ⚡', query: 'مغص' },
  { label: 'قولون عصبي وغازات 💨', query: 'قولون' },
  { label: 'إمساك وحقنة شرجية 🧱', query: 'امساك' },
  { label: 'زغطة وسوء هضم 🫄', query: 'زغطة' },
  { label: 'اشتباه زائدة دودية 🚨', query: 'زائدة' },
  { label: 'حموضة وقرحة معدة 🔥', query: 'حموضة' },
  { label: 'مغص مرارة وصفراء 🟡', query: 'مرارة' },
  { label: 'وجع في الزور ولوز 🤒', query: 'الزور' },
  { label: 'حرقان بول وصديد 🚽', query: 'حرقان بول' },
  { label: 'غضروف وعرق النسا 🦴', query: 'عرق النسا' },
  { label: 'جرح قيصرية وعمليات ✂️', query: 'قيصرية' },
  { label: 'حساسية وهرش جلدي 🔴', query: 'حساسية' },
  { label: 'دورة شهرية ومغص 🌸', query: 'الدورة' },
]

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(prescriptionsDatabase[0]?.id || null)
  const [showAbdominalGuide, setShowAbdominalGuide] = useState<boolean>(false)

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

      // Search across medicines trade names
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
    window.scrollTo({ top: 500, behavior: 'smooth' })
  }

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-screen bg-medical-gray pb-24 sm:pb-16">
        {/* ── Marketing Emergency Banner ── */}
        <div className="bg-gradient-to-r from-navy-800 via-navy-700 to-navy-900 text-white py-3 px-4 shadow-md sticky top-16 z-30 border-b border-gold-500/40">
          <div className="section-container flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse" />
              <span>معاك روشتة ومحتاج ممرض يعلق المحلول أو يعطيك الحقن في البيت بدمياط؟</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={getWhatsAppUrl('السلام عليكم، معايا روشتة علاج ومحتاج ممرض منزلي لتنفيذ الحقن والمحاليل بالبيت.')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1 rounded-full text-xs font-black shadow inline-flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <span>طلب ممرض للروشتة 📲</span>
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1"
              >
                <PhoneIcon className="w-3.5 h-3.5 text-gold-300" />
                <span>{siteConfig.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Hero Section ── */}
        <section className="bg-gradient-primary text-white py-10 sm:py-14 text-center">
          <div className="section-container max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4 text-xs sm:text-sm font-bold text-gold-300">
              <SparklesIcon className="w-4 h-4 text-gold-400" />
              <span>دليل الروشتات الطبية الشامل (Roshetatology) والخدمات التمريضية المنزلية</span>
            </div>
            <h1 className="!text-2xl sm:!text-4xl font-extrabold text-white mb-3">
              أهم <span className="text-gold-300">الروشتات الطبية</span> الشائعة 💊
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              دليلك الإكلينيكي المعتمد لتشخيص النزلات المعوية، الترجيع، وجع البطن والمغص، الزائدة، قرحة المعدة، واللوز؛ كل روشتة منفصلة ومترجمة للمريض المصري العامي مع زر طلب ممرض نبض لتنفيذ الحقن والمحاليل بالمنزل.
            </p>

            {/* ── Search Bar by Complaint / Symptom ── */}
            <div className="mt-7 max-w-xl mx-auto relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بكلمة من الشكوى أو العرض... (مثلاً: ترجيع، مغص، زائدة، لوز، حموضة، مرارة، ضغط)"
                  className="w-full py-4 pe-12 ps-12 rounded-2xl bg-white text-navy-800 placeholder-medical-muted text-sm sm:text-base font-bold shadow-2xl border-2 border-transparent focus:border-gold-400 focus:outline-none transition-all"
                  dir="rtl"
                />
                <MagnifyingGlassIcon className="w-6 h-6 text-navy-400 absolute start-4 pointer-events-none" />
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
            <div className="mt-5 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-300 font-bold me-1">أشهر الشكاوى:</span>
              {POPULAR_COMPLAINTS.map((pill) => (
                <button
                  key={pill.query}
                  onClick={() => {
                    setSearchQuery(pill.query)
                    setSelectedCategory('all')
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    searchQuery === pill.query
                      ? 'bg-gold-500 text-navy-950 font-bold shadow'
                      : 'bg-white/10 hover:bg-white/20 text-white/90 border border-white/15'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* ── Abdominal Pain Diagnostic Tool Button ── */}
            <div className="mt-6">
              <button
                onClick={() => setShowAbdominalGuide((prev) => !prev)}
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 px-4 sm:px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-transform active:scale-95"
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

        {/* ── Interactive Abdominal Pain Diagnostic Map (من كتاب روشتاتولوجي ص 14-16) ── */}
        {showAbdominalGuide && (
          <section className="section-container mt-6">
            <div className="max-w-4xl mx-auto bg-white border-2 border-gold-400 rounded-3xl p-5 sm:p-7 shadow-xl">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-gold-700 bg-gold-50 px-3 py-1 rounded-full border border-gold-200 mb-1">
                    <span>📚 مرجع: Roshetatology - Dr / Ahmed Abd Allah</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-navy-800">
                    دليل تشخيص وجع وألم البطن (Abdominal Pain: Search for Cause)
                  </h2>
                  <p className="text-xs sm:text-sm text-medical-muted mt-0.5">
                    حدد مكان الوجع لتعرف سببه المرجح، الفحص الطبي المناسب، وكيفية التصرف السليم:
                  </p>
                </div>
                <button
                  onClick={() => setShowAbdominalGuide(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ABDOMINAL_PAIN_DIAGNOSTIC_GUIDE.map((guide) => (
                  <div
                    key={guide.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      guide.isSurgicalAlert
                        ? 'border-red-300 bg-red-50/70 ring-1 ring-red-200'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-black text-navy-900 flex items-center gap-1">
                        <span>📍</span>
                        <span>{guide.locationName}</span>
                      </span>
                      {guide.isSurgicalAlert && (
                        <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full animate-pulse">
                          طوارئ جراحية
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-navy-800 mb-1">
                      {guide.symptomsAndColic}
                    </p>

                    <div className="text-xs text-slate-700 flex flex-col gap-1 mt-2 pt-2 border-t border-slate-200">
                      <div>
                        <strong className="text-navy-700">الفحص:</strong> {guide.examinationKey}
                      </div>
                      <div>
                        <strong className="text-navy-700">العلاج والإجراء:</strong> {guide.whatToDo}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 flex items-center justify-between gap-2">
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
                        className="text-xs font-bold text-navy-700 hover:text-navy-900 underline flex items-center gap-1"
                      >
                        <span>عرض روشتة الحالة بالتفصيل ⬅️</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Main Content Area ── */}
        <div className="section-container -mt-5">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">

            {/* ── Category Filters ── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {PRESCRIPTION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-navy-700 text-white shadow-md'
                      : 'bg-white text-navy-700 hover:bg-navy-50 border border-medical-border'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* ── Count & Results ── */}
            <div className="flex items-center justify-between text-xs text-medical-muted px-1">
              <span>
                عدد الروشتات المتاحة: <strong className="text-navy-700">{filteredPrescriptions.length}</strong>
              </span>
              {searchQuery && (
                <span>
                  نتائج البحث عن الشكوى: <strong className="text-gold-600">&quot;{searchQuery}&quot;</strong>
                </span>
              )}
            </div>

            {/* ── Prescription Cards ── */}
            {filteredPrescriptions.length === 0 ? (
              <div className="nabd-card p-10 bg-white border border-medical-border text-center">
                <span className="text-4xl mb-3 block">💊</span>
                <h3 className="text-lg font-black text-navy-700 mb-1">
                  لم نجد روشتة تطابق بحثك &quot;{searchQuery}&quot;
                </h3>
                <p className="text-xs sm:text-sm text-medical-muted max-w-md mx-auto mb-4">
                  جرب البحث بكلمة عامية أخرى مثل: (ترجيع، مغص، زائدة، اسهال، لوز، كحة، حموضة، مرارة، قولون، عرق النسا).
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="btn-secondary text-xs px-5 py-2.5"
                >
                  عرض جميع الروشتات
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {filteredPrescriptions.map((prescription) => {
                  const isExpanded = expandedId === prescription.id

                  return (
                    <article
                      key={prescription.id}
                      className={`nabd-card bg-white border transition-all overflow-hidden ${
                        isExpanded
                          ? 'border-navy-400 shadow-xl ring-1 ring-navy-200'
                          : 'border-medical-border shadow-sm hover:border-navy-200'
                      }`}
                    >
                      {/* ── Card Header / Click to expand ── */}
                      <div
                        onClick={() => toggleExpand(prescription.id)}
                        className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-sm bg-navy-50 text-navy-700 border border-navy-100">
                            💊
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full bg-gold-50 text-gold-700 border border-gold-200">
                                {prescription.categoryName}
                              </span>
                              <span className="text-[11px] text-medical-muted font-bold">
                                {prescription.titleEnglish}
                              </span>
                            </div>
                            <h2 className="text-base sm:text-lg font-black text-navy-800 leading-snug">
                              {prescription.titleArabic}
                            </h2>
                            <p className="text-xs sm:text-sm text-medical-muted mt-1 line-clamp-2">
                              {prescription.diagnosisSummary}
                            </p>

                            {/* Complaint Pills */}
                            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
                              {prescription.commonComplaints.slice(0, 4).map((complaint, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                                >
                                  #{complaint}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 pt-1 text-navy-500">
                          {isExpanded ? (
                            <ChevronUpIcon className="w-6 h-6 text-navy-600" />
                          ) : (
                            <ChevronDownIcon className="w-6 h-6" />
                          )}
                        </div>
                      </div>

                      {/* ── Card Expanded Body ── */}
                      {isExpanded && (
                        <div className="p-4 sm:p-6 border-t border-medical-border bg-white flex flex-col gap-6">

                          {/* 1. Diagnosis & Causes */}
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                            <h3 className="text-sm font-black text-navy-800 mb-2 flex items-center gap-1.5">
                              <span>🔍</span>
                              <span>التشخيص والأسباب الشائعة (Causes & Diagnosis):</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-navy-900 leading-relaxed font-medium mb-3">
                              {prescription.diagnosisSummary}
                            </p>
                            <ul className="flex flex-col gap-1.5 ps-3">
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

                          {/* 2. Medical Examination & Warnings */}
                          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-black text-amber-900">
                              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 shrink-0" />
                              <span>الفحص السريري والتنبيهات الطبية والجراحية:</span>
                            </div>
                            {prescription.examinationAndWarnings.surgicalWarning && (
                              <p className="text-xs sm:text-sm text-amber-950 font-semibold mb-2 leading-relaxed">
                                ⚠️ <strong>فحص البطن أو الجراحة:</strong> {prescription.examinationAndWarnings.surgicalWarning}
                              </p>
                            )}
                            {prescription.examinationAndWarnings.dehydrationSigns && (
                              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed mb-2">
                                💧 <strong>مضاعفات يجب الحذر منها:</strong> {prescription.examinationAndWarnings.dehydrationSigns}
                              </p>
                            )}
                            <div className="mt-2 pt-2 border-t border-amber-200/80 text-xs font-bold text-red-700">
                              🚨 <strong>متى يلزم المستشفى فوراً:</strong> {prescription.examinationAndWarnings.redFlags}
                            </div>
                          </div>

                          {/* 3. Detailed Medicines Prescription Table */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm sm:text-base font-black text-navy-800 flex items-center gap-2">
                                <span>📋</span>
                                <span>أدوية الروشتة المقررة وجرعاتها (Treatment):</span>
                              </h3>
                              <span className="text-[11px] bg-navy-50 text-navy-700 font-bold px-2 py-0.5 rounded-full">
                                استشر الطبيب للجرعة الدقيقة
                              </span>
                            </div>

                            <div className="flex flex-col gap-3">
                              {prescription.medicines.map((med, mIdx) => (
                                <div
                                  key={mIdx}
                                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-start justify-between gap-2 flex-wrap">
                                    <div>
                                      <h4 className="text-xs sm:text-sm font-black text-navy-900">
                                        💊 {med.tradeName}
                                      </h4>
                                      <span className="text-[11px] text-medical-muted font-medium block mt-0.5">
                                        الاسم العلمي: {med.genericName}
                                      </span>
                                    </div>
                                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                      موصوف طبياً
                                    </span>
                                  </div>

                                  <div className="mt-2 pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <strong className="text-navy-700">الغرض بالعربي:</strong>{' '}
                                      <span className="text-slate-700">{med.purpose}</span>
                                    </div>
                                    <div>
                                      <strong className="text-navy-700">الجرعة المعتادة:</strong>{' '}
                                      <span className="text-slate-800 font-semibold">{med.dosage}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 4. Home Care & Nutrition Tips */}
                          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
                            <h4 className="text-xs sm:text-sm font-black text-navy-800 mb-2 flex items-center gap-1.5">
                              <span>🥣</span>
                              <span>نصائح التغذية والراحة المنزلية:</span>
                            </h4>
                            <ul className="flex flex-col gap-1.5 ps-3">
                              {prescription.homeCareAndDiet.map((tip, tIdx) => (
                                <li
                                  key={tIdx}
                                  className="text-xs sm:text-sm text-navy-900 list-disc list-inside leading-relaxed"
                                >
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 5. 🌟 GOLDEN MARKETING CARD (نبض للتمريض المنزلي) 🌟 */}
                          <div className="bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 text-white rounded-2xl p-5 shadow-lg border-2 border-gold-400 relative overflow-hidden">
                            <div className="absolute top-0 end-0 bg-gold-500 text-navy-950 text-[10px] font-black px-3 py-1 rounded-es-xl shadow">
                              خدمة تمريض متخصصة لمنزلك
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <ShieldCheckIcon className="w-5 h-5 text-gold-400" />
                              <h4 className="text-sm sm:text-base font-extrabold text-gold-300">
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
                                className="btn-whatsapp text-xs sm:text-sm py-2.5 px-4 justify-center shadow-md active:scale-95 transition-transform"
                              >
                                <span>طلب الخدمة عبر واتساب 📲</span>
                              </a>

                              <div className="flex items-center gap-2">
                                <Link
                                  href="/booking"
                                  className="btn-primary text-xs sm:text-sm py-2 px-4 justify-center bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold border-none"
                                >
                                  احجز ممرض الآن 📅
                                </Link>
                                <a
                                  href={`tel:${siteConfig.contact.phone}`}
                                  className="btn-ghost text-xs text-white/90 hover:text-white px-2 py-1 flex items-center gap-1"
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
            <div className="mt-8 bg-white border border-medical-border rounded-2xl p-6 text-center shadow-sm">
              <ClipboardDocumentCheckIcon className="w-10 h-10 text-navy-600 mx-auto mb-2" />
              <h3 className="text-base font-black text-navy-800 mb-1">
                معاك روشتة مكتوبة من دكتورك ومحتاج حد ينفذها في البيت؟
              </h3>
              <p className="text-xs sm:text-sm text-medical-muted max-w-lg mx-auto mb-4">
                فريق نبض للتمريض المنزلي بدمياط جاهز للوصول إليك في أي وقت لتركيب المحاليل، الكانيولا، إعطاء الحقن العضلية والوريدية، وعمل الغيار المعقم بأعلى درجات الأمان الطبي.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/booking" className="btn-primary text-xs sm:text-sm px-6 py-2.5">
                  احجز زيارة تمريض منزلية الآن
                </Link>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="btn-secondary text-xs sm:text-sm px-5 py-2.5 inline-flex items-center gap-1.5"
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
