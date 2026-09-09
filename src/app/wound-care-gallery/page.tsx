'use client'
/**
 * app/wound-care-gallery/page.tsx — نبض للتمريض المنزلي
 * صفحة ومعرض وتوثيق زيارات غيار الجروح والقرح بالمنزل
 * توثيق مراحل الالتئام، قبل وبعد، المستلزمات الطبية المعقمة، والحفاظ على الخصوصية
 */

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import {
  woundCareCasesData,
  WOUND_CARE_CATEGORIES,
  WoundCareCase,
} from '@/data/woundCareCasesData'
import { siteConfig } from '@/data/siteConfig'
import {
  ShieldCheckIcon,
  SparklesIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  EyeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid'

export default function WoundCareGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeComparison, setActiveComparison] = useState<Record<string, 'both' | 'before' | 'after'>>({})

  const filteredCases = useMemo(() => {
    if (selectedCategory === 'all') return woundCareCasesData
    return woundCareCasesData.filter((item) => item.category === selectedCategory)
  }, [selectedCategory])

  const setViewMode = (id: string, mode: 'both' | 'before' | 'after') => {
    setActiveComparison((prev) => ({ ...prev, [id]: mode }))
  }

  const getWhatsAppUrlForCase = (c: WoundCareCase) => {
    const text = `السلام عليكم، محتاج تمريض منزلي بدمياط لغيار جروح وقرح في المنزل لحالة مشابهة لـ (${c.title} - ${c.categoryLabel}).`
    const cleanPhone = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
  }

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 pb-24 sm:pb-20">
        {/* ── Top Hero Banner ── */}
        <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white pt-6 pb-12 sm:pt-10 sm:pb-16 px-4">
          <div className="section-container max-w-4xl text-center">
            {/* Breadcrumb / Top link */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-xl transition-all group"
              >
                <ArrowRightIcon className="w-4 h-4 text-gold-400 transition-transform group-hover:translate-x-1" />
                <span>العودة للرئيسية</span>
              </Link>
              <Link
                href="/services"
                className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline"
              >
                خدمات التمريض المنزلي 🩺
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-4 text-xs font-bold text-gold-300 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-gold-400" />
              <span>سجل الحالات وتوثيق الزيارات السريرية المعتمدة — دمياط</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
              توثيق <span className="text-gold-400">زيارات غيار الجروح</span> والقرح 🩹
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              سجل سريري حقيقي يوثق مراحل التئام جروح العمليات، قرح الفراش، القدم السكري، والحروق داخل منازل أهالي دمياط الكرام، بتطبيق التقنية اللاتلامسية المعقمة (ANTT) وبأعلى معايير الخصوصية الطبية.
            </p>

            {/* Trust Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center">
                <div className="text-lg sm:text-xl font-black text-emerald-400 flex items-center justify-center gap-1">
                  <span>100%</span>
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 font-bold mt-1">تعقيم جراحي ومكافحة عدوى</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center">
                <div className="text-lg sm:text-xl font-black text-sky-400 flex items-center justify-center gap-1">
                  <span>خصوصية تامة</span>
                  <LockClosedIcon className="w-4 h-4" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 font-bold mt-1">حجب كامل للبيانات الشخصية</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center">
                <div className="text-lg sm:text-xl font-black text-gold-400 flex items-center justify-center gap-1">
                  <span>ضمادات متقدمة</span>
                  <SparklesIcon className="w-4 h-4" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 font-bold mt-1">شاش فضي وفوم وهيدروجيل</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center">
                <div className="text-lg sm:text-xl font-black text-rose-400 flex items-center justify-center gap-1">
                  <span>دمياط</span>
                  <MapPinIcon className="w-4 h-4" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 font-bold mt-1">زيارات منزلية فورية</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Privacy & Medical Protocol Ribbon ── */}
        <section className="section-container max-w-5xl -mt-5 mb-8 px-4">
          <div className="bg-navy-900 text-white rounded-2xl p-4 shadow-lg border border-white/15 flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-200">
              <strong className="text-white font-bold block mb-0.5">
                ميثاق الخصوصية وأخلاقيات التمريض في نبض:
              </strong>
              جميع الصور التوثيقية يتم التقاطها بموافقة أسرة المريض لأغراض المتابعة الطبية وتقييم سرعة الالتئام، مع الحظر التام لإظهار أي ملامح شخصية أو علامات فارقة حفاظاً على الخصوصية والكرامة الإنسانية لمريضنا.
            </div>
          </div>
        </section>

        {/* ── Category Filters Scroll ── */}
        <section className="section-container max-w-5xl mb-6 px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {WOUND_CARE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shrink-0 transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-navy-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── Case Cards List ── */}
        <section className="section-container max-w-5xl px-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
            <span>
              عدد الحالات المعروضة: <strong className="text-slate-900 font-black">{filteredCases.length} حالة موثقة</strong>
            </span>
            <span className="text-navy-700 font-bold">
              يتم تحديث السجل وإضافة الصور الجديدة دورياً 📸
            </span>
          </div>

          <div className="flex flex-col gap-8">
            {filteredCases.map((item) => {
              const currentView = activeComparison[item.id] || 'both'

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-navy-100 text-navy-800 border border-navy-200">
                          {item.categoryLabel}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                          📍 {item.location}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-gold-100 text-gold-900 border border-gold-200">
                          ⏱️ {item.visitNumber}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                        {item.title}
                      </h2>

                      {item.patientAgeGroup && (
                        <p className="text-xs text-slate-500 mt-1">
                          فئة المريض: <strong className="text-slate-700">{item.patientAgeGroup}</strong>
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                        <span>{item.healingStatus}</span>
                      </span>
                    </div>
                  </div>

                  {/* Visual Comparison Area (Before & After Images) */}
                  <div className="p-4 sm:p-6 bg-slate-900/5">
                    {/* View switcher on mobile */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <EyeIcon className="w-4 h-4 text-navy-600" />
                        <span>توثيق الحالة ومراحل التعقيم والالتئام:</span>
                      </span>

                      <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 text-xs font-bold sm:hidden">
                        <button
                          onClick={() => setViewMode(item.id, 'before')}
                          className={`px-2.5 py-1 rounded-lg ${currentView === 'before' ? 'bg-red-600 text-white' : 'text-slate-600'}`}
                        >
                          قبل
                        </button>
                        <button
                          onClick={() => setViewMode(item.id, 'after')}
                          className={`px-2.5 py-1 rounded-lg ${currentView === 'after' ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}
                        >
                          بعد
                        </button>
                        <button
                          onClick={() => setViewMode(item.id, 'both')}
                          className={`px-2.5 py-1 rounded-lg ${currentView === 'both' ? 'bg-navy-800 text-white' : 'text-slate-600'}`}
                        >
                          معاً
                        </button>
                      </div>
                    </div>

                    {/* Images Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Before Frame */}
                      {(currentView === 'both' || currentView === 'before') && (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-red-300 bg-slate-900 shadow-md group">
                          <div className="absolute top-3 start-3 z-20 bg-red-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span>قبل الغيار والتطهير</span>
                          </div>

                          <div className="relative aspect-[4/3] w-full">
                            <Image
                              src={item.beforeImage}
                              alt={`توثيق قبل الغيار - ${item.title}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>

                          <div className="p-2.5 bg-slate-900/90 text-[11px] text-slate-300 text-center border-t border-slate-800">
                            فحص عمق الجرح، الإفرازات، وحواف الأنسجة قبل بدء التعقيم
                          </div>
                        </div>
                      )}

                      {/* After Frame */}
                      {(currentView === 'both' || currentView === 'after') && (
                        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-900 shadow-md group">
                          <div className="absolute top-3 start-3 z-20 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                            <CheckCircleIcon className="w-3.5 h-3.5 text-white" />
                            <span>بعد التعقيم والضماد المعقم</span>
                          </div>

                          <div className="relative aspect-[4/3] w-full">
                            <Image
                              src={item.afterImage}
                              alt={`توثيق بعد الغيار والتعقيم - ${item.title}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>

                          <div className="p-2.5 bg-slate-900/90 text-[11px] text-emerald-300 text-center border-t border-slate-800 font-medium">
                            تطهير جراحي، شاش معقم، وحماية كاملة ضد التلوث الخارجي
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Clinical Details & Supplies */}
                  <div className="p-4 sm:p-6 flex flex-col gap-4">
                    {/* Stage Description */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-1 flex items-center gap-1.5">
                        <span>🔍</span>
                        <span>مرحلة الجرح وحالة الأنسجة:</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {item.woundStage}
                      </p>
                    </div>

                    {/* Supplies Used */}
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 mb-2 flex items-center gap-1.5">
                        <span>🧪</span>
                        <span>المستلزمات الطبية والضمادات المعقمة المستخدمة في هذه الزيارة:</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {item.suppliesUsed.map((sup, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors"
                          >
                            ✓ {sup}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Nursing Clinical Notes */}
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs sm:text-sm text-blue-950 leading-relaxed">
                      <strong>🩺 ملاحظات التمريض وإرشادات الأسرة:</strong> {item.nursingNotes}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500 font-medium">
                        هل لدى مريضك حالة مشابهة وتحتاج ممرضاً متخصصاً لزيارته بالمنزل؟
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href={getWhatsAppUrlForCase(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-xs transition-transform active:scale-95"
                        >
                          <span>طلب غيار مماثل لحالتك عبر واتساب 📲</span>
                        </a>
                        <a
                          href={siteConfig.contact.callUrl}
                          className="btn-call text-xs py-2 px-3 font-bold"
                        >
                          <PhoneIcon className="w-3.5 h-3.5" />
                          <span>01001097896</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* ── Bottom Booking CTA Box ── */}
          <div className="mt-14 bg-gradient-primary rounded-3xl p-6 sm:p-10 text-white text-center border-2 border-gold-400 shadow-xl max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black mb-3">
              محتاج غيار جروح أو متابعة قرحة لمريضك في البيت بدمياط؟
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mb-6">
              فريق نبض يوفر لك أحدث بروتوكولات العناية بالجروح (Wound Care Management)، مع إحضار كافة المستلزمات الطبية والضمادات التخصصية حتى باب منزلك.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/booking"
                className="btn-primary text-xs sm:text-sm px-6 py-3 font-bold"
              >
                <CalendarDaysIcon className="w-4 h-4" />
                <span>احجز موعد غيار الآن</span>
              </Link>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم، محتاج حجز تمريض منزلي لغيار جروح وقرح بدمياط.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs sm:text-sm px-6 py-3 font-bold"
              >
                <span>تواصل عبر واتساب فوراً</span>
              </a>
              <a
                href={siteConfig.contact.callUrl}
                className="btn-call text-xs sm:text-sm px-5 py-3 font-bold"
              >
                <PhoneIcon className="w-4 h-4" />
                <span>01001097896</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
