'use client'
/**
 * components/sections/HowItWorks.tsx — نبض للتمريض المنزلي
 * Steps section with scroll-triggered stagger animations
 */

import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import { StaggerContainer, StaggerItem, fadeInUp } from '@/components/ui/AnimatedSection'
import AnimatedSection from '@/components/ui/AnimatedSection'

const steps = [
  {
    number: 1,
    title: 'اختار الخدمة',
    description: 'اختار الخدمة اللي محتاجها من قائمة خدماتنا.',
    Icon: MagnifyingGlassIcon,
    color: 'from-blue-50 to-navy-50',
    iconColor: 'text-navy-600',
  },
  {
    number: 2,
    title: 'حدد الموعد',
    description: 'اختار اليوم والوقت المناسبين ليك.',
    Icon: CalendarDaysIcon,
    color: 'from-gold-50 to-amber-50',
    iconColor: 'text-gold-600',
  },
  {
    number: 3,
    title: 'أكد بياناتك',
    description: 'أدخل بيانات التواصل والعنوان بسهولة.',
    Icon: ClipboardDocumentCheckIcon,
    color: 'from-emerald-50 to-teal-50',
    iconColor: 'text-emerald-600',
  },
  {
    number: 4,
    title: 'يصلك مقدم الخدمة',
    description: 'مقدم الخدمة يوصلك في الموعد المتفق.',
    Icon: HomeIcon,
    color: 'from-purple-50 to-violet-50',
    iconColor: 'text-purple-600',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-white" aria-labelledby="how-heading">
      <div className="section-container section-padding">
        <AnimatedSection direction="up" delay={0} className="text-center mb-10">
          <h2 id="how-heading" className="section-title">
            إزاي بتشتغل الخدمة؟
          </h2>
          <p className="section-subtitle">
            4 خطوات بسيطة ووصلنالك
          </p>
        </AnimatedSection>

        {/* Steps */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10"
          amount={0.1}
        >
          {steps.map((step, index) => (
            <StaggerItem key={step.number} variants={fadeInUp}>
              <div className={`relative flex flex-col items-center text-center gap-3 rounded-2xl bg-gradient-to-br ${step.color} border border-slate-100 p-5 hover:shadow-card-md hover:-translate-y-1 transition-all duration-300`}>
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 start-0 translate-x-full w-full h-0.5 bg-gradient-to-r from-gold-300 via-gold-200 to-transparent rtl:bg-gradient-to-l z-0"
                    aria-hidden="true"
                  />
                )}

                {/* Step number circle */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                  <span className="text-white font-extrabold text-xl">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                  <step.Icon className={`w-5 h-5 ${step.iconColor}`} aria-hidden="true" />
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
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <AnimatedSection direction="up" delay={0.1} className="text-center">
          <Link href="/booking" className="btn-primary px-8 py-4 text-base">
            احجز الآن
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
