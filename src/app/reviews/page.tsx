import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import { testimonialsData } from '@/data/testimonialsData'
import { siteConfig } from '@/data/siteConfig'
import {
  StarIcon,
  ShieldCheckIcon,
  HeartIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/solid'

export const metadata: Metadata = {
  title: 'آراء وتقييمات مرضانا وعائلاتهم | نبض للتمريض المنزلي دمياط',
  description:
    'شهادات حقيقية وتجارب واقعية موثقة من أهالي دمياط الكرام تعكس ثقتهم في خدمات نبض للتمريض المنزلي، رعاية كبار السن، تركيب القسطرة، والمحاليل الطبية.',
  alternates: { canonical: '/reviews' },
}

export default function ReviewsPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="min-h-screen bg-slate-50 pb-24 sm:pb-20">
        {/* ── Hero Section ── */}
        <section className="bg-gradient-primary text-white py-10 sm:py-16 px-4">
          <div className="section-container max-w-4xl text-center">
            {/* Breadcrumb / Back link */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-xl transition-all group"
              >
                <ArrowRightIcon className="w-4 h-4 text-gold-400 transition-transform group-hover:translate-x-1" />
                <span>العودة للرئيسية</span>
              </Link>
              <Link
                href="/services"
                className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline"
              >
                تصفح خدماتنا 🩺
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4 text-xs sm:text-sm font-bold text-gold-300 shadow-sm">
              <HeartIcon className="w-4 h-4 text-rose-400" />
              <span>ثقة غالية نعتز بها من أهالي دمياط الكرام</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
              آراء وتقييمات <span className="text-gold-400">مرضانا وعائلاتهم</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              شهادات واقعية وتجارب موثقة تعكس حرصنا الدائم على توفير رعاية تمريضية آمنة، معقمة، وبأعلى معايير الإنسانية والأمانة داخل منازلكم بدمياط.
            </p>

            {/* Trust Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center">
                <div className="text-xl sm:text-2xl font-black text-gold-400 flex items-center justify-center gap-1">
                  <span>5.0</span>
                  <StarIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 font-bold mt-1">تقييم عام استثنائي</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                  <span>100%</span>
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 font-bold mt-1">تعقيم وأمانة طبية</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center">
                <div className="text-xl sm:text-2xl font-black text-sky-400 flex items-center justify-center gap-1">
                  <span>28+</span>
                  <HeartIcon className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 font-bold mt-1">شهادة موثقة</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/15 text-center">
                <div className="text-xl sm:text-2xl font-black text-rose-400 flex items-center justify-center gap-1">
                  <span>دمياط</span>
                  <MapPinIcon className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-200 font-bold mt-1">تغطية منزلية فورية</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials Grid ── */}
        <section className="section-container max-w-6xl py-12 px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-navy-800">
                جميع التقييمات والشهادات ({testimonialsData.length})
              </h2>
              <p className="text-xs sm:text-sm text-medical-muted mt-1">
                تجارب حقيقية مسجلة من مرضانا ومرافقيهم في محافظة دمياط
              </p>
            </div>
            <Link
              href="/booking"
              className="btn-primary text-xs sm:text-sm px-4 py-2.5 hidden sm:inline-flex"
            >
              احجز ممرض لمنزلك الآن 🩺
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonialsData.map((item) => (
              <article
                key={item.id}
                className="nabd-card p-5 sm:p-6 bg-white border border-medical-border hover:border-gold-400/60 transition-all flex flex-col justify-between shadow-sm hover:shadow-md relative overflow-hidden group"
              >
                {/* Quotation watermark */}
                <div className="absolute top-2 start-4 text-6xl font-serif text-gold-500/10 select-none pointer-events-none group-hover:text-gold-500/20 transition-colors">
                  &ldquo;
                </div>

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-3 mb-3.5">
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
                        <StarIcon key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal relative z-10">
                    {item.text}
                  </p>
                </div>

                {/* Service Tag */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-medical-muted">
                  <span className="bg-slate-100 text-navy-700 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                    {item.serviceMentioned}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheckIcon className="w-3.5 h-3.5" />
                    تجربة معتمدة
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* ── Bottom CTA ── */}
          <div className="mt-14 bg-gradient-primary rounded-3xl p-6 sm:p-10 text-white text-center border-2 border-gold-400 shadow-xl max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-black mb-3">
              محتاج رعاية تمريضية موثوقة في بيتك بدمياط؟
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mb-6">
              انضم لمئات العائلات التي وضعت ثقتها في نبض للتمريض المنزلي. فريقنا جاهز لزيارة مريضك وتقديم الرعاية بأعلى معايير النظافة والتعقيم.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/booking"
                className="btn-primary text-xs sm:text-sm px-6 py-3 font-bold"
              >
                <CalendarDaysIcon className="w-4 h-4" />
                <span>احجز خدمة الآن</span>
              </Link>
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-xs sm:text-sm px-6 py-3 font-bold"
              >
                <span>تواصل عبر واتساب</span>
              </a>
              <a
                href={siteConfig.contact.callUrl}
                className="btn-call text-xs sm:text-sm px-5 py-3"
              >
                <PhoneIcon className="w-4 h-4" />
                <span>01001097896</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
