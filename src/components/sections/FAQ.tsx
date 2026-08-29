'use client'
/**
 * components/sections/FAQ.tsx — نبض للتمريض المنزلي
 * Includes FAQPage JSON-LD Schema for Google rich results
 */
import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

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
    a: 'تواصل معنا للاستفسار عن المواعيد المتاحة حسب الخدمة المطلوبة.',
  },
  {
    q: 'ما هو سعر الخدمة؟',
    a: 'السعر يحدد حسب الخدمة والحالة والموقع. تواصل معنا لمعرفة تكلفة الخدمة.',
  },
  {
    q: 'هل يلزم وجود وصفة طبية؟',
    a: 'بعض الخدمات تتطلب وصفة طبية أو توجيه طبي. سيوضح مقدم الخدمة ذلك عند التنسيق.',
  },
  {
    q: 'هل بياناتي الطبية آمنة؟',
    a: 'نعم، نلتزم بالخصوصية الكاملة ولا نشارك بياناتك مع أي طرف ثالث.',
  },
  {
    q: 'ماذا لو أردت تغيير الموعد؟',
    a: 'تواصل معنا عبر واتساب أو مكالمة وسنرتب الأمر معك.',
  },
  {
    q: 'هل يمكنني الحجز لأحد والديّ؟',
    a: 'بالتأكيد، يمكن لأي فرد من العائلة الحجز نيابة عن المريض.',
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
    <div className={`nabd-card overflow-hidden transition-all duration-200 ${isOpen ? 'ring-1 ring-navy-200' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-start"
        aria-expanded={isOpen}
        id={`faq-btn-${index}`}
        aria-controls={`faq-panel-${index}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-6 h-6 rounded-full bg-navy-50 text-navy-600 font-black text-xs flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <span className="font-semibold text-navy-700 text-sm sm:text-base leading-snug text-start">
            {q}
          </span>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-gold-500 shrink-0 transition-transform duration-300 ${
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
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-medical-border">
          <p className="text-medical-muted text-sm leading-relaxed pt-3 ps-9">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      className="bg-gradient-section"
      aria-labelledby="faq-heading"
    >
      {/* FAQ Schema for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h2 id="faq-heading" className="section-title">
            أسئلة شائعة
          </h2>
          <p className="section-subtitle">
            إجابات على أكثر الأسئلة اللي بتتسألوها
          </p>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
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
      </div>
    </section>
  )
}
