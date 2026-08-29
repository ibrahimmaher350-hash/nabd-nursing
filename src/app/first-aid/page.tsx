'use client'
/**
 * app/first-aid/page.tsx — نبض للتمريض المنزلي
 * دليل الإسعافات الأولية التفاعلي الذكي باللغة العربية واللهجة المصرية
 * يبحث بكلمة واحدة من الإصابة ويوضح الفروق العمرية (رضيع، طفل، بالغ، حامل، كبار السن)
 */

import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid'
import {
  firstAidDatabase,
  FIRST_AID_CATEGORIES,
  type FirstAidItem,
} from '@/data/firstAidData'
import { siteConfig } from '@/data/siteConfig'

// Quick slang search buttons
const POPULAR_SEARCHES = [
  { label: 'شرقة واختناق 🫁', query: 'شرقة' },
  { label: 'إنعاش CPR ❤️', query: 'cpr' },
  { label: 'بلع لسانه / إغماء 💫', query: 'اغماء' },
  { label: 'حروق ومياه سخنة 🔥', query: 'حرق' },
  { label: 'نزيف وجروح 🩸', query: 'نزيف' },
  { label: 'تشنجات وصرع ⚡', query: 'تشنج' },
  { label: 'جلطة مخ FAST 🧠', query: 'جلطة' },
  { label: 'نوبة قلبية وجع صدر 💔', query: 'قلبية' },
  { label: 'هبوط السكر 🍬', query: 'سكر' },
  { label: 'كسر في العظم 🦴', query: 'كسر' },
  { label: 'دخول مسمار 🔩', query: 'مسمار' },
  { label: 'تسمم وكلور 🧪', query: 'تسمم' },
  { label: 'لدغة ثعبان أو عقرب 🦂', query: 'عقرب' },
  { label: 'طوارئ الحامل 🤰', query: 'حامل' },
  { label: 'أخطاء شائعة ❌', query: 'اخطاء' },
  { label: 'شنطة الإسعاف 🧰', query: 'شنطة' },
]

export default function FirstAidPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(firstAidDatabase[0]?.id || null)
  const [activeAgeGroup, setActiveAgeGroup] = useState<Record<string, string>>({})

  // Intelligent filter by Arabic / Egyptian slang query
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return firstAidDatabase.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false
      }

      // If no search query, match category
      if (!q) return true

      // Slang / Egyptian keyword match
      const keywordMatch = item.egyptianKeywords.some((kw) =>
        kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())
      )

      // Title & summary match
      const titleMatch = item.title.toLowerCase().includes(q)
      const summaryMatch = item.summary.toLowerCase().includes(q)
      const stepsMatch = item.generalSteps.some((s) => s.toLowerCase().includes(q))

      return keywordMatch || titleMatch || summaryMatch || stepsMatch
    })
  }, [searchQuery, selectedCategory])

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const setItemAge = (itemId: string, age: string) => {
    setActiveAgeGroup((prev) => ({ ...prev, [itemId]: age }))
  }

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-screen bg-medical-gray pb-24 sm:pb-16">
        {/* ── Emergency Quick Call Ribbon ── */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white py-2.5 px-4 sticky top-16 z-30 shadow-md">
          <div className="section-container flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>طوارئ فورية خطيرة تهدد الحياة؟ اتصل بالإسعاف فوراً:</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="tel:123"
                className="bg-white text-red-600 hover:bg-red-50 px-3 py-1 rounded-full text-xs font-black shadow inline-flex items-center gap-1.5 active:scale-95 transition-transform"
              >
                <PhoneIcon className="w-3.5 h-3.5" />
                <span>الإسعاف 123</span>
              </a>
              <a
                href="tel:+201001097896"
                className="bg-navy-900/80 hover:bg-navy-900 text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
              >
                <span>تمريض نبض: 01001097896</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Hero Banner ── */}
        <section className="bg-gradient-primary text-white py-10 sm:py-14 text-center">
          <div className="section-container max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4 text-xs sm:text-sm font-bold text-gold-300">
              <SparklesIcon className="w-4 h-4 text-gold-400" />
              <span>دليل الطوارئ التفاعلي المعتمد عالمياً والمبسط للمواطن</span>
            </div>
            <h1 className="!text-2xl sm:!text-4xl font-extrabold text-white mb-3">
              دليل <span className="text-gold-300">الإسعافات الأولية</span> الذكي 🚑
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              اكتب كلمة واحدة من الإصابة بأي لغة أو لهجة مصرية (زي: شرقة، حرق، بلع لسانه، مسمار، سخونية)، وهتظهر لك خطوات الإنقاذ فوراً مع مراعاة السن والرضع والحوامل.
            </p>

            {/* ── Search Input Box ── */}
            <div className="mt-7 max-w-xl mx-auto relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بكلمة من الإصابة... (مثلاً: شرقة، حرق، إغماء، سكر، كسر)"
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

            {/* ── Popular Slang Pills ── */}
            <div className="mt-5 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-300 font-bold me-1">شائع الآن:</span>
              {POPULAR_SEARCHES.map((pill) => (
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
          </div>
        </section>

        {/* ── Main Content Area ── */}
        <div className="section-container -mt-5">
          <div className="max-w-4xl mx-auto flex flex-col gap-6">

            {/* ── Category Filters Scroll ── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {FIRST_AID_CATEGORIES.map((cat) => (
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

            {/* ── Search Results Count ── */}
            <div className="flex items-center justify-between text-xs text-medical-muted px-1">
              <span>
                عدد البروتوكولات المتاحة: <strong className="text-navy-700">{filteredItems.length}</strong>
              </span>
              {searchQuery && (
                <span>
                  نتائج البحث عن: <strong className="text-gold-600">&quot;{searchQuery}&quot;</strong>
                </span>
              )}
            </div>

            {/* ── Protocol Cards ── */}
            {filteredItems.length === 0 ? (
              <div className="nabd-card p-10 bg-white border border-medical-border text-center">
                <span className="text-4xl mb-3 block">🔍</span>
                <h3 className="text-lg font-black text-navy-700 mb-1">
                  لم نجد حالة تطابق بحثك &quot;{searchQuery}&quot;
                </h3>
                <p className="text-xs sm:text-sm text-medical-muted max-w-md mx-auto mb-4">
                  جرب البحث بكلمات عامية أخرى مثل: (حرق، شرقة، جرح، سكر، مغمى عليه، دوخة، كسر).
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="btn-secondary text-xs px-5 py-2.5"
                >
                  عرض جميع الإسعافات
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredItems.map((item) => {
                  const isExpanded = expandedId === item.id
                  const currentAge = activeAgeGroup[item.id] || 'general'
                  const selectedAgeProtocol = item.ageVariations?.find(
                    (v) => v.ageGroup === currentAge
                  )

                  return (
                    <article
                      key={item.id}
                      className={`nabd-card bg-white border transition-all overflow-hidden ${
                        item.severity === 'critical'
                          ? 'border-red-200/80 shadow-md hover:border-red-300'
                          : 'border-medical-border shadow-sm hover:border-navy-200'
                      }`}
                    >
                      {/* ── Card Header (Click to toggle) ── */}
                      <div
                        onClick={() => toggleExpand(item.id)}
                        className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Severity Indicator */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg shadow-sm ${
                              item.severity === 'critical'
                                ? 'bg-red-100 text-red-600'
                                : item.severity === 'urgent'
                                ? 'bg-amber-100 text-amber-600'
                                : 'bg-blue-100 text-blue-600'
                            }`}
                          >
                            {item.severity === 'critical' ? '🚨' : item.severity === 'urgent' ? '⚠️' : 'ℹ️'}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span
                                className={`text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full ${
                                  item.severity === 'critical'
                                    ? 'bg-red-600 text-white'
                                    : item.severity === 'urgent'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-navy-600 text-white'
                                }`}
                              >
                                {item.severity === 'critical'
                                  ? 'طوارئ قصوى 123'
                                  : item.severity === 'urgent'
                                  ? 'إصابة عاجلة'
                                  : 'إسعافات أولية'}
                              </span>
                              <span className="text-[11px] text-medical-muted font-bold">
                                {item.categoryName}
                              </span>
                            </div>

                            <h2 className="text-base sm:text-lg font-black text-navy-800 leading-snug">
                              {item.title}
                            </h2>
                            <p className="text-xs sm:text-sm text-medical-muted mt-1 line-clamp-2">
                              {item.summary}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 pt-1 text-navy-500">
                          {isExpanded ? (
                            <ChevronUpIcon className="w-6 h-6" />
                          ) : (
                            <ChevronDownIcon className="w-6 h-6" />
                          )}
                        </div>
                      </div>

                      {/* ── Expanded Content ── */}
                      {isExpanded && (
                        <div className="p-4 sm:p-6 border-t border-medical-border bg-white flex flex-col gap-5">
                          {/* ── Age Variations Selector (If available) ── */}
                          {item.ageVariations && item.ageVariations.length > 0 && (
                            <div className="bg-navy-50/80 border border-navy-100 rounded-2xl p-3.5">
                              <div className="flex items-center gap-2 mb-2 text-xs font-black text-navy-800">
                                <UserGroupIcon className="w-4 h-4 text-navy-600" />
                                <span>اختر الفئة العمرية لمشاهدة التعليمات الخاصة:</span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => setItemAge(item.id, 'general')}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    currentAge === 'general'
                                      ? 'bg-navy-700 text-white shadow-sm'
                                      : 'bg-white text-navy-700 hover:bg-navy-100/60 border border-navy-200'
                                  }`}
                                >
                                  🧑 البالغين والجميع
                                </button>
                                {item.ageVariations.map((v) => (
                                  <button
                                    key={v.ageGroup}
                                    onClick={() => setItemAge(item.id, v.ageGroup)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                      currentAge === v.ageGroup
                                        ? 'bg-gold-500 text-navy-950 shadow-sm font-black'
                                        : 'bg-white text-navy-700 hover:bg-navy-100/60 border border-navy-200'
                                    }`}
                                  >
                                    {v.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* ── Steps Section ── */}
                          <div>
                            <h3 className="text-sm sm:text-base font-black text-navy-700 mb-3 flex items-center gap-2">
                              <span>📋</span>
                              <span>
                                {selectedAgeProtocol
                                  ? `خطوات الإسعاف الخاصة بـ (${selectedAgeProtocol.label}):`
                                  : 'خطوات الإسعاف السريعة (خطوة بخطوة):'}
                              </span>
                            </h3>

                            <ol className="flex flex-col gap-2.5">
                              {(selectedAgeProtocol
                                ? selectedAgeProtocol.steps
                                : item.generalSteps
                              ).map((step, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-navy-900 leading-relaxed font-medium"
                                >
                                  <span className="w-6 h-6 rounded-full bg-navy-700 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Age specific warnings */}
                          {selectedAgeProtocol?.warnings && (
                            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 text-xs sm:text-sm leading-relaxed">
                              <strong>⚠️ تنبيه خاص:</strong> {selectedAgeProtocol.warnings.join(' ')}
                            </div>
                          )}

                          {/* ── DON'TS / Common Mistakes to Avoid (Crucial) ── */}
                          {item.donts && item.donts.length > 0 && (
                            <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4">
                              <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-black text-red-800">
                                <ShieldExclamationIcon className="w-5 h-5 text-red-600 shrink-0" />
                                <span>إياك تفعل الآتي ❌ (أخطاء شائعة قاتلة):</span>
                              </div>
                              <ul className="flex flex-col gap-1.5 ps-2">
                                {item.donts.map((dont, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs sm:text-sm text-red-900 leading-relaxed font-semibold list-disc list-inside"
                                  >
                                    {dont}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* ── Red Flags / When to Call 123 ── */}
                          {item.redFlags && (
                            <div className="bg-rose-950 text-white rounded-2xl p-4 flex items-start gap-3">
                              <ExclamationTriangleIcon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-xs text-rose-300 font-bold block mb-0.5">
                                  علامات الخطر القصوى:
                                </span>
                                <p className="text-xs sm:text-sm leading-relaxed text-white font-medium">
                                  {item.redFlags}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* ── Action Buttons ── */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-medical-border">
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href="tel:123"
                                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                              >
                                <PhoneIcon className="w-4 h-4" />
                                <span>طلب الإسعاف 123</span>
                              </a>
                              <a
                                href={siteConfig.contact.callUrl}
                                className="btn-call text-xs sm:text-sm py-2 px-3 flex-1 sm:flex-none justify-center"
                              >
                                <PhoneIcon className="w-4 h-4" />
                                <span>نبض: 01001097896</span>
                              </a>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Share protocol via WhatsApp */}
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(
                                  `🚑 بروتوكول إسعاف: ${item.title}\n\n📋 الخطوات السريعة:\n${item.generalSteps.slice(0, 4).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n🏥 نبض للتمريض المنزلي - دمياط\n📞 01001097896\nwa.me/201099667065`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 px-3 py-2 rounded-xl text-xs active:scale-95 transition-all"
                                aria-label="شارك هذا البروتوكول عبر واتساب"
                                title="شارك مع عيلتك أو أصحابك"
                              >
                                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span>شارك</span>
                              </a>

                              <a
                                href={`https://wa.me/201099667065?text=${encodeURIComponent(
                                  `استشارة إسعافية عاجلة بخصوص حالة: ${item.title}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-whatsapp text-xs sm:text-sm py-2 px-4 justify-center flex-1 sm:flex-none"
                              >
                                استشارة تمريض نبض عاجلة
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}

            {/* ── Medical Disclaimer Box ── */}
            <div className="bg-navy-50 border border-navy-100 rounded-2xl p-5 text-center text-xs text-medical-muted leading-relaxed">
              <p className="font-bold text-navy-800 mb-1">
                ⚕️ إخلاء مسؤولية طبي من فريق نبض للتمريض المنزلي
              </p>
              <p>
                هذا الدليل يهدف لتقديم الإسعافات الأولية السريعة والإنقاذية لحين وصول الرعاية الطبية المتخصصة، ولا يُعد بديلاً عن استدعاء سيارة الإسعاف 123 أو التوجه الفوري لأقسام الطوارئ بالمستشفيات في الحالات الحرجة.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
