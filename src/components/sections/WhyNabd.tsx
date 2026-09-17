/**
 * components/sections/WhyNabd.tsx — نبض للتمريض المنزلي
 * تصميم محسّن بعدادات متحركة وبطاقات احترافية
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import { StaggerContainer, StaggerItem, fadeInUp } from '@/components/ui/AnimatedSection'
import AnimatedSection from '@/components/ui/AnimatedSection'

const stats = [
  { value: 15, suffix: '+', label: 'خدمة تمريضية' },
  { value: 100, suffix: '%', label: 'رضا العملاء' },
  { value: 24, suffix: '/7', label: 'تواصل مستمر' },
  { value: 5, suffix: '+', label: 'سنوات خبرة' },
]

const features = [
  {
    emoji: '🏠',
    title: 'رعاية كاملة في بيتك',
    description: 'احنا بنجيلك لحد عندك، مش محتاج تنزل وتتبهدل.',
    color: 'from-navy-50 to-blue-50 border-navy-100',
    iconBg: 'bg-navy-100',
  },
  {
    emoji: '📞',
    title: 'تواصل مباشر',
    description: 'كلمنا في أي وقت عبر واتساب أو مكالمة.',
    color: 'from-emerald-50 to-teal-50 border-emerald-100',
    iconBg: 'bg-emerald-100',
  },
  {
    emoji: '🎯',
    title: 'حسب احتياج المريض',
    description: 'كل خدمة بنقدمها حسب الحالة والتوجيه الطبي.',
    color: 'from-gold-50 to-amber-50 border-gold-100',
    iconBg: 'bg-gold-100',
  },
  {
    emoji: '📋',
    title: 'سهولة الحجز',
    description: 'احجز خدمتك في دقيقتين من هاتفك.',
    color: 'from-sky-50 to-indigo-50 border-sky-100',
    iconBg: 'bg-sky-100',
  },
  {
    emoji: '🔔',
    title: 'متابعة المواعيد',
    description: 'بنذكرك بموعدك ومستعدين لأي تعديل.',
    color: 'from-purple-50 to-violet-50 border-purple-100',
    iconBg: 'bg-purple-100',
  },
  {
    emoji: '🔒',
    title: 'خصوصية المريض',
    description: 'بياناتك وبيانات مريضك في أمان تام.',
    color: 'from-rose-50 to-pink-50 border-rose-100',
    iconBg: 'bg-rose-100',
  },
]

// Animated counter hook
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
      <p className="text-3xl sm:text-4xl font-black text-gold-300 leading-none group-hover:text-gold-200 transition-colors">
        {count}{suffix}
      </p>
      <p className="text-white/60 text-xs sm:text-sm mt-1 font-medium">{label}</p>
    </div>
  )
}

export default function WhyNabd() {
  const sectionRef = useRef<HTMLElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="why-nabd" ref={sectionRef} className="bg-gradient-section" aria-labelledby="why-heading">
      <div className="section-container section-padding">
        {/* Header */}
        <AnimatedSection direction="up" className="text-center mb-10">
          <h2 id="why-heading" className="section-title">
            ليه تختار نبض؟
          </h2>
          <p className="section-subtitle">
            عشان بنهتم بيك وبنوصلك لحد باب بيتك بأعلى معايير الأمان
          </p>
        </AnimatedSection>

        {/* Feature Cards Grid */}
        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          amount={0.08}
        >
          {features.map((feature) => (
            <StaggerItem key={feature.title} variants={fadeInUp}>
              <div
                className={`rounded-2xl bg-gradient-to-br ${feature.color} border p-5 flex items-start gap-4 hover:shadow-card-md transition-all duration-300 hover:-translate-y-1 h-full`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center text-2xl shrink-0 shadow-sm`}
                  aria-hidden="true"
                >
                  {feature.emoji}
                </div>
                <div>
                  <h3 className="font-bold text-navy-700 text-base mb-1">{feature.title}</h3>
                  <p className="text-medical-muted text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Stats strip */}
        <AnimatedSection direction="up" delay={0.1} className="mt-10">
          <div className="rounded-3xl bg-gradient-primary p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <StatCounter
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  delay={i * 150}
                  active={statsVisible}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
