import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import { PhoneIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'تواصل معنا | نبض للتمريض المنزلي',
  description: 'تواصل مع نبض للتمريض المنزلي عبر الهاتف أو واتساب أو المنصات الرسمية لحجز خدمة فورية.',
  alternates: { canonical: 'https://nabd-nursing.vercel.app/contact' },
}

export default function ContactPage() {
  return (
    <>
      <Header />

      <main id="main-content" className="min-h-[85vh] bg-medical-gray pb-24 sm:pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-primary py-8 sm:py-12 text-white">
          <div className="section-container">
            {/* Top Back Navigation */}
            <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-xl transition-all group"
              >
                <ArrowRightIcon className="w-4 h-4 text-gold-400 transition-transform group-hover:translate-x-1" />
                <span>الصفحة الرئيسية</span>
              </Link>
              <a
                href="https://wa.me/201001097896?text=السلام+عليكم،+أريد+حجز+خدمة+تمريضية+منزلية"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline"
              >
                💬 احجز عبر واتساب
              </a>
            </div>

            <div className="text-center">
              <span className="inline-block bg-white/10 border border-white/20 text-gold-300 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-3">
                خدمة تمريضية منزلية 24 ساعة
              </span>
              <h1 className="!text-2xl sm:!text-3xl lg:!text-4xl font-extrabold text-white mb-2">
                تواصل معنا
              </h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto font-medium">
                فريقنا التمريضي جاهز لخدمتكم وتلبية استفساراتكم على مدار الساعة.
              </p>
            </div>
          </div>
        </section>

        <div className="section-container -mt-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">

            {/* قنوات الاتصال المباشرة */}
            <div className="nabd-card p-6 sm:p-8 bg-white border border-medical-border shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-navy-700">الاتصال المباشر</h2>
                  <p className="text-xs text-medical-muted">تواصل فوري للحالات الطارئة والحجوزات السريعة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Phone */}
                <a
                  href={siteConfig.contact.callUrl}
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300/40 text-navy-800 transition-all group"
                  aria-label="اتصل هاتفياً"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <PhoneIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-medical-muted font-bold block">اتصال هاتفي مباشر</span>
                    <span className="text-base font-black text-navy-800 tracking-wide" dir="ltr">01001097896</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/201001097896"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 transition-all group"
                  aria-label="محادثة واتساب"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-medical-muted font-bold block">محادثة واتساب سريعة</span>
                    <span className="text-base font-black text-emerald-800 tracking-wide" dir="ltr">01001097896</span>
                  </div>
                </a>
              </div>
            </div>

            {/* المنصات والشبكات الاجتماعية */}
            <div className="nabd-card p-6 sm:p-8 bg-white border border-medical-border shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌐</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-navy-700">صفحاتنا ومنصاتنا</h2>
                  <p className="text-xs text-medical-muted">تابعنا وتواصل معنا عبر منصاتنا الرسمية</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Facebook Page */}
                <a
                  href="https://www.facebook.com/profile.php?id=61593884400330"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-blue-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-navy-800 group-hover:text-navy-950">
                      صفحة فيسبوك الرسمية
                    </h3>
                    <p className="text-xs text-medical-muted mt-0.5">تابع آخر الأخبار والنصائح الطبية</p>
                  </div>
                  <span className="ms-auto text-xs text-blue-600 font-bold">زيارة ↗</span>
                </a>

                {/* Blog */}
                <a
                  href="https://nabdhomenursing.blogspot.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-navy-100 hover:border-navy-300 hover:bg-navy-50/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform text-xl">
                    ✍️
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-navy-800 group-hover:text-navy-950">
                      مدونة نبض الطبية
                    </h3>
                    <p className="text-xs text-medical-muted mt-0.5">مقالات وإرشادات تمريضية موثوقة</p>
                  </div>
                  <span className="ms-auto text-xs text-navy-600 font-bold">زيارة ↗</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
