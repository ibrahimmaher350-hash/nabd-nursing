/**
 * components/sections/NursePromo.tsx — قسم الترويج بصورة الممرض المحترف
 * تصميم محسّن مع Social Proof وبطاقات ثقة
 */
import Image from 'next/image'
import Link from 'next/link'

const features = [
  {
    icon: '🛡️',
    title: 'رعاية آمنة ومعتمدة',
    desc: 'خدمات تمريضية وفق أعلى معايير السلامة الطبية.',
  },
  {
    icon: '👨‍⚕️',
    title: 'فريق متخصص ومدرّب',
    desc: 'تمريض محترف بخبرة عالية في الرعاية المنزلية.',
  },
  {
    icon: '🏠',
    title: 'راحة تامة في منزلك',
    desc: 'رعاية متكاملة دون الحاجة للتنقل أو المستشفى.',
  },
]

const trustBadges = [
  { icon: '⭐', label: 'تقييم 5 نجوم' },
  { icon: '🔒', label: 'بيانات آمنة' },
  { icon: '⚡', label: 'استجابة فورية' },
]

export default function NursePromo() {
  return (
    <section
      className="bg-gradient-primary overflow-hidden"
      aria-labelledby="nurse-promo-heading"
    >
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Image Column ── */}
          <div className="flex justify-center lg:justify-start order-1">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gold-400/25 to-navy-400/20 blur-2xl scale-105"
                aria-hidden="true"
              />
              {/* Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.55)] border border-white/10">
                <Image
                  src="/nabd-hero.jpg"
                  alt="ممرض نبض المحترف — رعاية صحية منزلية بأمان واحترافية في دمياط"
                  width={520}
                  height={520}
                  className="w-full h-auto object-cover"
                  quality={90}
                />
                {/* Availability badge */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950/90 to-transparent p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <div>
                      <p className="text-white font-bold text-sm">فريق نبض متاح الآن</p>
                      <p className="text-white/60 text-xs">خدمة تمريض منزلية داخل دمياط</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -top-4 -end-4 glass-dark rounded-2xl px-4 py-3 shadow-card-lg hidden sm:block animate-float">
                <p className="text-gold-300 font-extrabold text-lg leading-none">15+</p>
                <p className="text-white/70 text-xs mt-0.5">خدمة تمريضية</p>
              </div>

              {/* Trust badges strip */}
              <div className="absolute -bottom-4 -start-4 hidden sm:flex flex-col gap-1.5">
                {trustBadges.map((b) => (
                  <div
                    key={b.label}
                    className="glass-dark rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm"
                  >
                    <span className="text-base" aria-hidden="true">{b.icon}</span>
                    <span className="text-white/90 text-xs font-semibold whitespace-nowrap">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Text Column ── */}
          <div className="order-2 text-center lg:text-start">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse-slow shrink-0" />
              <span className="text-white/80 text-xs font-medium">نبض للتمريض المنزلي</span>
            </div>

            <h2
              id="nurse-promo-heading"
              className="!text-2xl sm:!text-3xl lg:!text-4xl font-extrabold text-white leading-tight mb-4"
            >
              رعاية صحية{' '}
              <span className="text-gold-300">في منزلك</span>
              <br />
              بأمان واحترافية
            </h2>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
              فريق نبض من الممرضين المتخصصين يصل إليك في المنزل، ليوفر لك أعلى مستوى من الرعاية الطبية المنزلية دون الحاجة لمغادرة راحتك.
            </p>

            {/* Feature list */}
            <div className="flex flex-col gap-4 mb-8">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-3 text-start">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm sm:text-base">{f.title}</p>
                    <p className="text-white/60 text-xs sm:text-sm mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile trust badges */}
            <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap mb-6 sm:hidden">
              {trustBadges.map((b) => (
                <span
                  key={b.label}
                  className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs text-white/90 font-medium"
                >
                  <span aria-hidden="true">{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </div>

            <Link
              href="/booking"
              className="btn-primary inline-flex px-8 py-3.5 text-sm sm:text-base bg-gold-500 hover:bg-gold-600 shadow-gold"
            >
              احجز الآن 🩺
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
