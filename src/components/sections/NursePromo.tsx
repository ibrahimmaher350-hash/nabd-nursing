'use client'
/**
 * components/sections/NursePromo.tsx — قسم التمريض المتخصص
 * يبرز كفاءة الطاقم التمريضي مع زر حجز واتساب مباشر
 */
import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeInLeft, fadeInRight } from '@/components/ui/AnimatedSection'
import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useSettings } from '@/context/SettingsContext'

const features = [
  {
    icon: '🩺',
    title: 'طاقم تمريضي مرخص',
    desc: 'ممرضون مؤهلون يمتلكون تراخيص مزاولة المهنة وخبرة سريرية واسعة.',
  },
  {
    icon: '🛡️',
    title: 'أعلى معايير التعقيم',
    desc: 'بروتوكولات مكافحة عدوى صارمة واستخدام أدوات معقمة مخصصة لكل مريض.',
  },
  {
    icon: '⏱️',
    title: 'استجابة سريعة على مدار الساعة',
    desc: 'تنسيق فوري للمواعيد وزيارات تمريضية منزلية منتظمة أو طارئة.',
  },
]

export default function NursePromo() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const { getWhatsAppUrl } = useSettings()

  return (
    <section
      className="bg-gradient-primary overflow-hidden py-12 sm:py-16 text-white"
      aria-labelledby="nurse-promo-heading"
    >
      <div className="section-container" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

          {/* Image (hidden on very small mobile for clutter reduction, shown on sm+) */}
          <motion.div
            className="hidden sm:flex justify-center lg:justify-start order-2 lg:order-1"
            variants={fadeInRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/15">
              <Image
                src="/nabd-hero.jpg"
                alt="ممرض نبض للتمريض المنزلي"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
                quality={90}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 to-transparent p-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <p className="text-white font-bold text-sm">طاقم تمريضي متاح الآن</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="order-1 lg:order-2 text-center lg:text-start"
            variants={fadeInLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-4">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              <span className="text-white/90 text-xs font-bold">نبض — خبرة ورعاية</span>
            </div>

            <h2
              id="nurse-promo-heading"
              className="!text-2xl sm:!text-3xl lg:!text-4xl font-extrabold text-white leading-tight mb-4"
            >
              رعاية تمريضية متخصصة{' '}
              <span className="text-gold-300">في منزلك</span>
            </h2>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
              نهتم بأدق التفاصيل الطبية لراحتكم وسلامتكم، ونوفر أفضل الكفاءات التمريضية للمتابعة اليومية وإدارة العلاجات.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-3.5 mb-7 text-start">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 hover:bg-white/10 transition-colors"
                >
                  <span className="text-2xl shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{f.title}</p>
                    <p className="text-white/70 text-xs leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action CTA */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp px-7 py-3.5 text-sm sm:text-base font-bold shadow-lg active:scale-95 transition-all"
              >
                💬 احجز زيارة ممرض عبر واتساب
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
