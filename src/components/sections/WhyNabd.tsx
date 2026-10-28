'use client'
/**
 * components/sections/WhyNabd.tsx — مميزات نبض
 * إحصائيات ومميزات خدمة التمريض المنزلي
 */

import { useEffect, useRef, useState } from 'react'
import { StaggerContainer, StaggerItem, fadeInUp } from '@/components/ui/AnimatedSection'
import AnimatedSection from '@/components/ui/AnimatedSection'

const stats = [
  { value: 15, suffix: '+', label: 'خدمة تمريضية متخصصة' },
  { value: 100, suffix: '%', label: 'أدوات معقمة وتراخيص رسمية' },
  { value: 24, suffix: '/7', label: 'تغطية مستمرة على مدار الساعة' },
  { value: 5, suffix: '★', label: 'تقييم رضا المرضى' },
]

const features = [
  {
    emoji: '🩺',
    title: 'رعاية تمريضية متكاملة',
    description: 'من الحقن وتركيب الكانيولا إلى رعاية الجروح المعقدة والقرح السريرية.',
    color: 'from-navy-50 to-blue-50 border-navy-100',
    iconBg: 'bg-navy-100',
  },
  {
    emoji: '🛡️',
    title: 'أعلى معايير الأمان',
    description: 'تطبيق أدق معايير مكافحة العدوى والتعقيم الطبي لكل زيارة منزلية.',
    color: 'from-emerald-50 to-teal-50 border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
  {
    emoji: '⚡',
    title: 'سرعة في التنسيق والوصول',
    description: 'فريق متنقل جاهز للوصول إلى منزلك وتلبية الرعاية التمريضية في أسرع وقت.',
    color: 'from-gold-50 to-amber-50 border-gold-100',
    iconBg: 'bg-gold-100',
  },
  {
    emoji: '🤝',
    title: 'اهتمام إنساني فائق',
    description: 'تعامل راقٍ وصبور مع كبار السن والمرضى لتخفيف آلامهم وإراحتهم.',
    color: 'from-sky-50 to-indigo-50 border-sky-100',
    iconBg: 'bg-sky-100',
  },
  {
    emoji: '📋',
    title: 'متابعة طبية دقيقة',
    description: 'قياس العلامات الحيوية وتسجيل تطور الحالة ومشاركتها مع الطبيب المعالج.',
    color: 'from-purple-50 to-violet-50 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    emoji: '💬',
    title: 'حجز مباشر وسهل',
    description: 'تواصل فوري وحجز مباشر عبر واتساب دون الحاجة لملء نماذج معقدة.',
    color: 'from-rose-50 to-pink-50 border-rose-100',
    iconBg: 'bg-rose-100',
  },
]

function useCounter(target: number, duration = 1200, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

function StatCounter({ value, suffix, label, delay = 0, active }: {
  value: number
  suffix: string
  label: string
  delay?: number
  active: boolean
}) {
  const [started, setStarted] = useState(false)
  const count = useCounter(value, 1000, started)
  useEffect(() => {
    if (active) {
      const t = setTimeout(() => setStarted(true), delay)
      return () => clearTimeout(t)
    }
  }, [active, delay])
  return (
    <div className="text-center group">
      <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-gold-300 leading-none">
        {count}{suffix}
      </p>
      <p className="text-white/80 text-xs sm:text-sm mt-1.5 font-medium">{label}</p>
    </div>
  )
}

export default function WhyNabd() {
  const sectionRef = useRef<HTMLElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="why-nabd" ref={sectionRef} className="bg-slate-50 py-10 sm:py-16" aria-labelledby="why-heading">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection direction="up" className="text-center mb-8 sm:mb-10">
          <h2 id="why-heading" className="section-title">
            لماذا تختار نبض؟
          </h2>
          <p className="section-subtitle">
            نجمع بين الخبرة الطبية التمريضية والراحة المنزلية التامة
          </p>
        </AnimatedSection>

        {/* Feature Cards Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-10"
          amount={0.08}
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title} variants={fadeInUp}>
              <div
                className={`rounded-2xl bg-white border border-slate-200/90 p-5 flex items-start gap-3.5 hover:shadow-card-md transition-all duration-300 hover:-translate-y-0.5 h-full`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${feature.iconBg} flex items-center justify-center text-xl shrink-0 shadow-xs`}
                  aria-hidden="true"
                >
                  {feature.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-navy-800 text-sm sm:text-base mb-1">{feature.title}</h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Stats strip */}
        <div className="rounded-3xl bg-gradient-primary p-6 sm:p-8 text-white shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <StatCounter
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={i * 120}
                active={statsVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
