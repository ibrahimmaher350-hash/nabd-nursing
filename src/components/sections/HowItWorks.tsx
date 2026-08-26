/**
 * components/sections/HowItWorks.tsx
 */
import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'

const steps = [
  {
    number: 1,
    title: 'اختار الخدمة',
    description: 'اختار الخدمة اللي محتاجها من قائمة خدماتنا.',
    Icon: MagnifyingGlassIcon,
  },
  {
    number: 2,
    title: 'حدد الموعد',
    description: 'اختار اليوم والوقت المناسبين ليك.',
    Icon: CalendarDaysIcon,
  },
  {
    number: 3,
    title: 'أكد بياناتك',
    description: 'أدخل بيانات التواصل والعنوان بسهولة.',
    Icon: ClipboardDocumentCheckIcon,
  },
  {
    number: 4,
    title: 'يصلك مقدم الخدمة',
    description: 'مقدم الخدمة يوصلك في الموعد المتفق.',
    Icon: HomeIcon,
  },
]

export default function HowItWorks() {
  return (
    <section
      className="bg-white"
      aria-labelledby="how-heading"
    >
      <div className="section-container section-padding">
        <div className="text-center mb-10">
          <h2 id="how-heading" className="section-title">
            إزاي بتشتغل الخدمة؟
          </h2>
          <p className="section-subtitle">
            4 خطوات بسيطة ووصلنالك
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center gap-3">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-7 end-0 w-1/2 h-0.5 bg-gradient-to-l from-gold-300 to-transparent"
                  aria-hidden="true"
                />
              )}

              {/* Step number circle */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                <span className="text-white font-extrabold text-xl">{step.number}</span>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center">
                <step.Icon className="w-5 h-5 text-navy-600" aria-hidden="true" />
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-navy-700 text-sm sm:text-base mb-1">
                  {step.title}
                </h3>
                <p className="text-medical-muted text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/booking" className="btn-primary px-8 py-4 text-base">
            احجز الآن
          </Link>
        </div>
      </div>
    </section>
  )
}
