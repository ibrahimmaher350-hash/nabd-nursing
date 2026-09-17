'use client'
/**
 * components/sections/TestimonialsSection.tsx — نبض للتمريض المنزلي
 * آراء العملاء مع scroll-triggered animations
 */

import Link from 'next/link'
import { testimonialsData } from '@/data/testimonialsData'
import {
  StarIcon,
  ShieldCheckIcon,
  HeartIcon,
  ArrowLeftIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid'
import { StaggerContainer, StaggerItem, fadeInUp } from '@/components/ui/AnimatedSection'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function TestimonialsSection() {
  const featuredReviews = testimonialsData.filter((t) => t.isFeatured).slice(0, 6)

  return (
    <section id="testimonials" className="section-padding bg-gradient-to-b from-white via-slate-50 to-white border-y border-medical-border relative overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <AnimatedSection direction="up" className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-full px-4 py-1 text-xs font-bold mb-3 shadow-sm">
            <HeartIcon className="w-3.5 h-3.5 text-rose-500" />
            <span>ثقة نعتز بها من أهالي دمياط الكرام</span>
          </div>

          <h2 className="section-title">
            كلام الناس عن <span className="text-gold-600">خدمات نبض</span>
          </h2>

          <p className="section-subtitle mt-2">
            شهادات وتجارب حقيقية بنعتز بيها من أهالينا الكرام، ودايماً حريصين نوفرلكم رعاية تمريضية آمنة ومعقمة في بيوتكم داخل دمياط.
          </p>

          {/* Aggregate Rating Badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm">
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-navy-800">
              5.0 من 5.0
            </span>
            <span className="text-xs text-medical-muted">
              (استناداً إلى 28+ تقييماً موثقاً)
            </span>
          </div>
        </AnimatedSection>

        {/* Cards Grid with Stagger */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
          amount={0.06}
        >
          {featuredReviews.map((item) => (
            <StaggerItem key={item.id} variants={fadeInUp}>
              <article className="nabd-card p-5 sm:p-6 bg-white border border-medical-border hover:border-gold-400/60 transition-all flex flex-col justify-between shadow-sm hover:shadow-card-md relative overflow-hidden group h-full">
                {/* Quotation watermark */}
                <div className="absolute top-2 start-4 text-5xl font-serif text-gold-500/10 select-none pointer-events-none group-hover:text-gold-500/20 transition-colors">
                  &ldquo;
                </div>

                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 text-white font-extrabold flex items-center justify-center shrink-0 border-2 border-gold-400 text-sm shadow">
                        {item.author.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-navy-800 truncate">
                          {item.author}
                        </h3>
                        {item.location && (
                          <p className="text-[11px] text-medical-muted truncate font-medium">
                            {item.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 5 Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                      {[...Array(item.rating)].map((_, i) => (
                        <StarIcon key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Body */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal relative z-10">
                    {item.text}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-medical-muted">
                  <span className="bg-slate-100 text-navy-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                    {item.serviceMentioned}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheckIcon className="w-3.5 h-3.5" />
                    تجربة معتمدة
                  </span>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Reviews Button */}
        <AnimatedSection direction="up" delay={0.05} className="text-center">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 bg-gradient-primary hover:opacity-90 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gold-400/50 group"
          >
            <SparklesIcon className="w-4 h-4 text-gold-400" />
            <span>عرض جميع تقييمات المرضى ({testimonialsData.length} رأياً موثقاً)</span>
            <ArrowLeftIcon className="w-4 h-4 text-gold-300 transition-transform group-hover:-translate-x-1" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
