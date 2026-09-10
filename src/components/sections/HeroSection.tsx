'use client'
/**
 * components/sections/HeroSection.tsx — نبض للتمريض المنزلي
 * Hero section with Framer Motion entrance animations
 */

import Link from 'next/link'
import Image from 'next/image'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const imageVariants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 },
  },
}

export default function HeroSection() {
  const { getWhatsAppUrl } = useSettings()

  return (
    <section
      className="relative bg-gradient-primary overflow-hidden"
      aria-label="القسم الرئيسي"
    >
      {/* Animated background decorations */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute top-0 end-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gold-400 opacity-[0.07] blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.07, 0.1, 0.07] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 start-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-navy-300 opacity-[0.06] blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.09, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-10 sm:py-16 lg:py-20 items-center">

          {/* ── Text Content ── */}
          <motion.div
            className="text-center lg:text-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6"
            >
              <motion.span
                className="w-2 h-2 rounded-full bg-gold-400 shrink-0"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              />
              <span className="text-white/90 text-xs sm:text-sm font-medium">
                خدمات تمريضية منزلية — دمياط
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={itemVariants}
              className="!text-2xl sm:!text-3xl lg:!text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4"
            >
              الرعاية التمريضية اللي محتاجها…{' '}
              <span className="text-gold-300">لحد باب بيتك</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-white/75 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0"
            >
              خدمات تمريض ورعاية منزلية باهتمام، أمان، ومهنية داخل دمياط.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6 sm:mb-8"
            >
              {[
                { icon: '🛡️', text: 'رعاية آمنة' },
                { icon: '👨‍⚕️', text: 'فريق متخصص' },
                { icon: '🏠', text: 'راحة في بيتك' },
              ].map((pill, i) => (
                <motion.span
                  key={pill.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                  className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs sm:text-sm text-white/90 font-medium hover:bg-white/15 transition-colors cursor-default"
                >
                  <span>{pill.icon}</span>
                  {pill.text}
                </motion.span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center lg:justify-start gap-3 mb-5 sm:mb-6"
            >
              <Link
                href="/booking"
                className="btn-primary w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-4"
                onClick={() => analytics.startBooking('general', 'general')}
              >
                احجز خدمة الآن
              </Link>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-4"
                onClick={() => analytics.clickWhatsApp('hero')}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                تواصل عبر واتساب
              </a>
            </motion.div>

            {/* Emergency notice */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between gap-2 bg-red-900/30 border border-red-400/30 rounded-xl p-3 max-w-lg mx-auto lg:mx-0 text-start"
            >
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon
                  className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <p className="text-red-300 text-xs leading-relaxed">
                  في الحالات الطارئة — اتصل بـ 123 أو اتبع
                </p>
              </div>
              <Link
                href="/first-aid"
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg shrink-0 transition-colors shadow"
              >
                دليل الإسعافات 🚑
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 sm:mt-8 max-w-sm sm:max-w-lg mx-auto lg:mx-0"
            >
              {[
                { value: '15+', label: 'خدمة تمريضية' },
                { value: 'دمياط', label: 'منطقة الخدمة' },
                { value: 'متابعة', label: 'مستمرة للمريض' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                  className="bg-white/10 border border-white/15 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center hover:bg-white/15 transition-colors"
                >
                  <p className="text-gold-300 font-extrabold text-sm sm:text-lg leading-tight">{stat.value}</p>
                  <p className="text-white/60 text-xs mt-0.5 leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Hero Image — Desktop ── */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full max-w-md xl:max-w-lg">
              {/* Glow ring behind image */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold-400/20 to-navy-500/20 blur-2xl scale-110"
                animate={{ scale: [1.1, 1.15, 1.1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              {/* Image container */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10">
                <Image
                  src="/nabd-hero.jpg"
                  alt="ممرض نبض المحترف يقدم الرعاية الصحية المنزلية في دمياط"
                  width={520}
                  height={520}
                  className="w-full h-auto object-cover"
                  priority
                  quality={90}
                />
                {/* Overlay badge — bottom */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 to-transparent p-5">
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="w-3 h-3 rounded-full bg-emerald-400 shrink-0"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div>
                      <p className="text-white font-bold text-sm">فريق نبض متاح الآن</p>
                      <p className="text-white/60 text-xs">تمريض منزلي داخل دمياط</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
