'use client'
/**
 * components/sections/FAQ.tsx — نبض للتمريض المنزلي
 * بطاقة مدمجة تفتح عند الضغط لعرض الأسئلة والإجابات لتقليل طول الصفحة على الموبايل
 */
import { useState } from 'react'
import { ChevronDownIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    q: 'هل الخدمة متاحة في كل مناطق دمياط؟',
    a: 'نقدم خدماتنا داخل دمياط والمناطق التي يغطيها فريق نبض. تواصل معنا للتأكيد من منطقتك.',
  },
  {
    q: 'هل يمكن حجز خدمة لأكثر من مرة في الأسبوع؟',
    a: 'نعم، يمكن الاتفاق على جدول زيارات منتظمة حسب احتياج المريض.',
  },
  {
    q: 'هل الخدمة متاحة على مدار الساعة؟',
    a: 'نعم، فريقنا متواجد ومتاح للاستفسارات والحالات التمريضية على مدار 24 ساعة.',
  },
  {
    q: 'ما هو سعر الخدمة؟',
    a: 'السعر يحدد حسب نوع الإجراء التمريضي والحالة وموقع الزيارة المنزلية بدقة.',
  },
  {
    q: 'هل يلزم وجود وصفة طبية؟',
    a: 'بعض الخدمات كالمحاليل والأدوية الوريدية تتطلب توجيهاً طبياً لضمان سلامة المريض.',
  },
  {
    q: 'هل بياناتي الطبية آمنة؟',
    a: 'نعم، نلتزم بالخصوصية والسرية الطبية التامة ولا نشارك بياناتك مع أي طرف.',
  },
  {
    q: 'ماذا لو أردت تغيير الموعد؟',
    a: 'تواصل معنا مباشرة عبر واتساب أو الاتصال الهاتفي وسنقوم بإعادة جدولة الموعد فوراً.',
  },
  {
    q: 'هل يمكنني الحجز لأحد أفراد أسرتي؟',
    a: 'بالتأكيد، يمكن لأي فرد من العائلة حجز وتنسيق الزيارة التمريضية نيابة عن المريض.',
  },
]

// FAQPage JSON-LD for Google rich results
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

function FAQItem({ q, a, isOpen, onToggle, index }: {
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 ${isOpen ? 'ring-1 ring-gold-400 shadow-sm' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-4 text-start"
        aria-expanded={isOpen}
        id={`faq-btn-${index}`}
        aria-controls={`faq-panel-${index}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-6 h-6 rounded-full bg-navy-50 text-navy-800 font-black text-xs flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <span className="font-bold text-navy-900 text-sm sm:text-base leading-snug">
            {q}
          </span>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-gold-600 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-btn-${index}`}
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}
      >
        <div className="px-4 pb-4 border-t border-slate-100">
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-3 ps-9">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      className="bg-slate-50 py-10 sm:py-14"
      aria-labelledby="faq-heading"
    >
      {/* FAQ Schema for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          {/* Main Card Trigger */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gold-50 text-gold-600 flex items-center justify-center mx-auto mb-3">
              <QuestionMarkCircleIcon className="w-7 h-7" />
            </div>

            <h2 id="faq-heading" className="text-xl sm:text-2xl font-black text-navy-900 mb-2">
              الأسئلة الشائعة
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              كل ما تحتاج معرفته عن خدمات التمريض المنزلي وطريقة الحجز والمواعيد
            </p>

            {/* Toggle Card Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl py-3.5 px-5 flex items-center justify-between font-bold text-sm text-navy-800 transition-all active:scale-[0.99] shadow-xs"
              aria-expanded={isExpanded}
            >
              <div className="flex items-center gap-2">
                <span>{isExpanded ? 'إخفاء الأسئلة الشائعة' : 'اضغط هنا لعرض الأسئلة والإجابات (8 أسئلة)'}</span>
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 text-gold-600 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Expanded FAQ List */}
            {isExpanded && (
              <div className="flex flex-col gap-3 mt-5 text-start animate-fade-in-up">
                {faqs.map((faq, i) => (
                  <FAQItem
                    key={i}
                    index={i}
                    q={faq.q}
                    a={faq.a}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
