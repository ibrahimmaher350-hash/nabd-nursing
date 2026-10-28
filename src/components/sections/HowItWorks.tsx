'use client'
/**
 * components/sections/HowItWorks.tsx — كيف نعمل؟
 * عرض مبسط ومختصر بدون تفاصيل زائدة
 */

import { useSettings } from '@/context/SettingsContext'
import AnimatedSection from '@/components/ui/AnimatedSection'

const steps = [
  { number: 1, emoji: '🔍', title: 'اختر الخدمة' },
  { number: 2, emoji: '💬', title: 'تواصل عبر واتساب' },
  { number: 3, emoji: '📋', title: 'تأكيد الموعد' },
  { number: 4, emoji: '🏠', title: 'الممرض في منزلك' },
]

export default function HowItWorks() {
  const { getWhatsAppUrl } = useSettings()

  return (
    <section id="how-it-works" className="bg-white" aria-labelledby="how-heading">
      <div className="section-container section-padding">
        <AnimatedSection direction="up" delay={0} className="text-center mb-8">
          <h2 id="how-heading" className="section-title">
            كيف تحجز خدمتك؟
          </h2>
        </AnimatedSection>

        {/* Steps Row */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center text-center gap-2">
              {/* Number + connector */}
              <div className="relative w-full flex items-center justify-center">
                {index < steps.length - 1 && (
                  <div className="absolute top-5 start-1/2 w-full h-0.5 bg-gradient-to-r from-gold-300 to-gold-100 rtl:bg-gradient-to-l" aria-hidden="true" />
                )}
                <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold shrink-0">
                  <span className="text-white font-extrabold text-sm">{step.number}</span>
                </div>
              </div>
              {/* Emoji */}
              <span className="text-2xl" aria-hidden="true">{step.emoji}</span>
              {/* Title */}
              <p className="text-xs sm:text-sm font-bold text-navy-700 leading-tight">{step.title}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp inline-flex items-center gap-2 px-8 py-4 text-base"
          >
            💬 احجز الآن عبر واتساب
          </a>
        </div>
      </div>
    </section>
  )
}
