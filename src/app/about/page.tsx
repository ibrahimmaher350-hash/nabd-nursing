/**
 * app/about/page.tsx — عن نبض للتمريض المنزلي
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import { siteConfig, getWhatsAppUrl } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'من نحن | نبض للتمريض المنزلي',
  description: 'تعرف على نبض للتمريض المنزلي — خدمات التمريض والرعاية المنزلية في دمياط، مصر.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-primary py-12 sm:py-16">
          <div className="section-container text-center">
            <div className="w-24 h-24 rounded-3xl overflow-hidden mx-auto mb-5 shadow-card-lg border-2 border-white/30">
              <Image
                src="/logo.jpg"
                alt={siteConfig.brand.logoAlt}
                width={96}
                height={96}
                className="object-contain w-full h-full"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              {siteConfig.brand.name}
            </h1>
            <p className="text-gold-300 text-lg font-semibold mb-2">{siteConfig.brand.tagline}</p>
            <p className="text-white/70 text-base max-w-lg mx-auto">
              {siteConfig.brand.description}
            </p>
          </div>
        </section>

        {/* About content */}
        <section className="bg-white">
          <div className="section-container section-padding max-w-3xl">
            <div className="flex flex-col gap-8 text-medical-muted leading-relaxed">

              <div className="nabd-card p-6">
                <h2 className="text-navy-700 text-xl font-bold mb-4">من نحن</h2>
                <p>
                  نبض للتمريض المنزلي منصة خدمات تمريضية ورعاية صحية منزلية تعمل داخل دمياط ومحيطها.
                  نقدم خدماتنا للمريض في منزله لتوفير أقصى درجات الراحة والأمان له ولعائلته.
                </p>
              </div>

              <div className="nabd-card p-6">
                <h2 className="text-navy-700 text-xl font-bold mb-4">رسالتنا</h2>
                <p>
                  توفير خدمات تمريضية ورعاية صحية منزلية باهتمام وأمان ومهنية،
                  تجعل المريض يشعر بالاطمئنان وعائلته بالثقة.
                </p>
              </div>

              <div className="nabd-card p-6">
                <h2 className="text-navy-700 text-xl font-bold mb-4">ما نؤمن به</h2>
                <ul className="flex flex-col gap-3">
                  {[
                    'الرعاية الحقيقية تبدأ من المنزل',
                    'خصوصية المريض حق لا يُتنازل عنه',
                    'كل خدمة تتم وفق التوجيه الطبي الصحيح',
                    'التواصل الإنساني جزء من العلاج',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-gold-500 text-lg mt-0.5 shrink-0" aria-hidden="true">✦</span>
                      <span className="text-sm sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="nabd-card p-6">
                <h2 className="text-navy-700 text-xl font-bold mb-4">منطقة الخدمة</h2>
                <p className="mb-3">
                  نقدم خدماتنا حالياً داخل <strong className="text-navy-700">دمياط</strong> والمناطق التي يغطيها فريق نبض.
                </p>
                <a
                  href={siteConfig.social.googleBusiness}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2 text-sm"
                >
                  موقعنا على Google
                </a>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/booking" className="btn-primary flex-1 justify-center">
                  احجز خدمة الآن
                </Link>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp flex-1 justify-center"
                >
                  تواصل معنا
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
