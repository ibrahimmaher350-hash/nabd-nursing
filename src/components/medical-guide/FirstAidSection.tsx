'use client'
/**
 * components/medical-guide/FirstAidSection.tsx — نبض للتمريض المنزلي
 * قسم دليل الإسعافات الأولية التفاعلي الذكي
 */

import { useState, useMemo } from 'react'
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
} from '@/data/firstAidData'
import { siteConfig } from '@/data/siteConfig'

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

export default function FirstAidSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(firstAidDatabase[0]?.id || null)
  const [activeAgeGroup, setActiveAgeGroup] = useState<Record<string, string>>({})

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return firstAidDatabase.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false
      }
      if (!q) return true

      const keywordMatch = item.egyptianKeywords.some((kw) =>
        kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())
      )
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
    <div className="flex flex-col gap-6">
      {/* ── Emergency Quick Call Ribbon ── */}
      <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white p-3 sm:p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <span>طوارئ فورية خطيرة تهدد الحياة؟ اتصل بالإسعاف فوراً:</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="tel:123"
            className="bg-white text-red-600 hover:bg-red-50 px-3.5 py-1.5 rounded-full text-xs font-black shadow inline-flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <PhoneIcon className="w-3.5 h-3.5" />
            <span>الإسعاف 123</span>
          </a>
          <a
            href="tel:+201001097896"
            className="bg-navy-900/80 hover:bg-navy-900 text-white px-3.5 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
          >
            <span>تمريض نبض: 01001097896</span>
          </a>
        </div>
      </div>

      {/* ── Section Title & Search ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm text-center">
        <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-800 px-3 py-1 rounded-full text-xs font-bold mb-3">
          <SparklesIcon className="w-3.5 h-3.5 text-red-500" />
          <span>دليل الطوارئ التفاعلي المعتمد عالمياً والمبسط</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-navy-800 mb-2">
          دليل <span className="text-red-600">الإسعافات الأولية</span> الذكي 🚑
        </h2>
        <p className="text-xs sm:text-sm text-medical-muted max-w-xl mx-auto mb-5 leading-relaxed">
          اكتب كلمة واحدة من الإصابة بالعامية المصرية (شرقة، حرق، إغماء، سكر، كسر)، وستظهر لك الخطوات فوراً مع مراعاة السن والرضع والحوامل.
        </p>

        {/* Search Input */}
        <div className="max-w-xl mx-auto relative mb-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بكلمة من الإصابة... (مثلاً: شرقة، حرق، إغماء، سكر، كسر)"
              className="w-full py-3.5 pe-12 ps-12 rounded-2xl bg-slate-50 text-navy-800 placeholder-medical-muted text-xs sm:text-sm font-bold border-2 border-slate-200 focus:border-red-500 focus:bg-white focus:outline-none transition-all"
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
          <span className="text-[11px] text-slate-400 font-bold me-1">شائع:</span>
          {POPULAR_SEARCHES.slice(0, 8).map((pill) => (
            <button
              key={pill.query}
              onClick={() => {
                setSearchQuery(pill.query)
                setSelectedCategory('all')
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                searchQuery === pill.query
                  ? 'bg-red-600 text-white font-bold shadow'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category Filters Scroll ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {FIRST_AID_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-navy-700 hover:bg-navy-50 border border-medical-border'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-medical-muted px-1">
        <span>
          عدد البروتوكولات المتاحة: <strong className="text-navy-700">{filteredItems.length}</strong>
        </span>
        {searchQuery && (
          <span>
            نتائج البحث عن: <strong className="text-red-600">&quot;{searchQuery}&quot;</strong>
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
                {/* Header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
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

                      <h3 className="text-base sm:text-lg font-black text-navy-800 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-medical-muted mt-1 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1 text-navy-500">
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-medical-border bg-white flex flex-col gap-5">
                    {/* Age Variations */}
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

                    {/* Steps */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-navy-700 mb-2.5 flex items-center gap-1.5">
                        <span>📋</span>
                        <span>
                          {selectedAgeProtocol
                            ? `خطوات الإسعاف الخاصة بـ (${selectedAgeProtocol.label}):`
                            : 'خطوات الإسعاف السريعة (خطوة بخطوة):'}
                        </span>
                      </h4>

                      <ol className="flex flex-col gap-2">
                        {(selectedAgeProtocol
                          ? selectedAgeProtocol.steps
                          : item.generalSteps
                        ).map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-navy-900 leading-relaxed"
                          >
                            <span className="w-5 h-5 rounded-full bg-navy-700 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Mistakes to Avoid */}
                    {item.donts && item.donts.length > 0 && (
                      <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm font-black text-red-800">
                          <ShieldExclamationIcon className="w-4 h-4 text-red-600 shrink-0" />
                          <span>إياك تفعل الآتي ❌ (أخطاء شائعة قاتلة):</span>
                        </div>
                        <ul className="flex flex-col gap-1 ps-2">
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

                    {/* Red Flags */}
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

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-medical-border">
                      <div className="flex items-center gap-2 flex-wrap">
                        <a
                          href="tel:123"
                          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
                        >
                          <PhoneIcon className="w-3.5 h-3.5" />
                          <span>الإسعاف 123</span>
                        </a>
                        <a
                          href={siteConfig.contact.callUrl}
                          className="btn-call text-xs py-2 px-3"
                        >
                          <PhoneIcon className="w-3.5 h-3.5" />
                          <span>نبض: 01001097896</span>
                        </a>
                      </div>

                      <a
                        href={`https://wa.me/201099667065?text=${encodeURIComponent(
                          `استشارة إسعافية عاجلة بخصوص حالة: ${item.title}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp text-xs py-2 px-4"
                      >
                        استشارة تمريض نبض عبر واتساب
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
