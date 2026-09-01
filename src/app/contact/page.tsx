import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import { PhoneIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'تواصل معنا | نبض للتمريض المنزلي',
  description: 'تواصل مع نبض للتمريض المنزلي عبر جميع وسائل الاتصال والمنصات الرسمية.',
  alternates: { canonical: '/contact' },
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
                <span>العودة للرئيسية</span>
              </Link>
              <Link
                href="/booking"
                className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline"
              >
                احجز خدمة الآن 📅
              </Link>
            </div>

            <div className="text-center">
              <span className="inline-block bg-white/10 border border-white/20 text-gold-300 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-3">
                📍 نبض للتمريض المنزلي — دمياط
              </span>
              <h1 className="!text-2xl sm:!text-3xl lg:!text-4xl font-extrabold text-white mb-2">
                تواصل معنا
              </h1>
              <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto font-medium">
                رعايتك الصحية تبدأ من مكانك، ونحن أقرب إليك.
              </p>
            </div>
          </div>
        </section>

        <div className="section-container -mt-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-8">

            {/* ── قسم الاتصال والحجز السريع ── */}
            <div className="nabd-card p-6 sm:p-8 bg-white border border-medical-border shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📱</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-navy-700">الاتصال والحجز</h2>
                  <p className="text-xs text-medical-muted">تواصل مباشر لطلب الخدمات والاستفسارات على مدار الساعة</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Phone */}
                <a
                  href={siteConfig.contact.callUrl}
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-300/40 text-navy-800 transition-all group"
                  aria-label="اتصال هاتفي"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <PhoneIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-medical-muted font-bold block">اتصال هاتفي</span>
                    <span className="text-base font-black text-navy-800 tracking-wide" dir="ltr">01001097896</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/201099667065"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 transition-all group"
                  aria-label="واتساب"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-emerald-700 font-bold block">واتساب</span>
                    <span className="text-sm font-black text-emerald-950">مراسلة إبراهيم عبر واتساب</span>
                  </div>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/Ibrahim5k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl bg-sky-50 hover:bg-sky-100/80 border border-sky-300 text-sky-900 transition-all group"
                  aria-label="تليجرام"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#229ED9] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-sky-700 font-bold block">تليجرام</span>
                    <span className="text-sm font-black text-sky-950" dir="ltr">t.me/Ibrahim5k</span>
                  </div>
                </a>
              </div>
            </div>

            {/* ── قسم المنصات الرسمية ووسائل التواصل ── */}
            <div className="nabd-card p-6 sm:p-8 bg-white border border-medical-border shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌐</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-navy-700">منصات نبض الرسمية</h2>
                  <p className="text-xs text-medical-muted">تابع نبض عبر جميع منصاتنا الرسمية ووسائل التواصل</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Facebook Official Page */}
                <a
                  href="https://www.facebook.com/profile.php?id=61593884400330"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-navy-100 hover:border-navy-300 hover:bg-navy-50/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform text-xl">
                    📘
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-navy-800 group-hover:text-navy-950">
                      الصفحة الرسمية لنَبض للتمريض المنزلي
                    </h3>
                    <p className="text-xs text-medical-muted mt-0.5">الصفحة الرئيسية على فيسبوك</p>
                  </div>
                  <span className="ms-auto text-xs text-navy-600 font-bold">فتح ←</span>
                </a>

                {/* Facebook Profile - Ibrahim Maher */}
                <a
                  href="https://www.facebook.com/share/1BDJwJeW15/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-navy-100 hover:border-navy-300 hover:bg-navy-50/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform text-xl">
                    🔵
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-navy-800 group-hover:text-navy-950">
                      الملف الشخصي المسؤول عن نبض
                    </h3>
                    <p className="text-xs text-medical-muted mt-0.5">إبراهيم ماهر</p>
                  </div>
                  <span className="ms-auto text-xs text-navy-600 font-bold">فتح ←</span>
                </a>

                {/* Facebook Group */}
                <a
                  href="https://www.facebook.com/share/g/1BmBygobMw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-navy-100 hover:border-navy-300 hover:bg-navy-50/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy-600 text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform text-xl">
                    👥
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-navy-800 group-hover:text-navy-950">
                      جروب نبض على فيسبوك
                    </h3>
                    <p className="text-xs text-medical-muted mt-0.5">مجتمع ومتابعي نبض</p>
                  </div>
                  <span className="ms-auto text-xs text-navy-600 font-bold">انضمام ←</span>
                </a>

                {/* Blogger */}
                <a
                  href="https://nabd-damietta.blogspot.com/?m=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-navy-100 hover:border-navy-300 hover:bg-navy-50/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform text-xl">
                    📝
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-navy-800 group-hover:text-navy-950">
                      مدونة نبض – Blogger
                    </h3>
                    <p className="text-xs text-medical-muted mt-0.5">مقالات ونصائح طبية وتمريضية</p>
                  </div>
                  <span className="ms-auto text-xs text-navy-600 font-bold">زيارة ←</span>
                </a>

                {/* Cezma Store */}
                <a
                  href="https://cezma.com/store/nabd.nu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-300 transition-all group sm:col-span-2"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform text-xl">
                    🛒
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-emerald-950 group-hover:text-emerald-900">
                      متجر نبض على سيزما | Cezma
                    </h3>
                    <p className="text-xs text-emerald-700 mt-0.5">المستلزمات الطبية والتمريضية</p>
                  </div>
                  <span className="ms-auto text-xs text-emerald-800 font-bold">تسوق الآن ←</span>
                </a>
              </div>
            </div>

            {/* ── قسم Google والتقييمات ── */}
            <div className="nabd-card p-6 sm:p-8 bg-white border border-medical-border shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⭐</span>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-navy-700">نبض على Google والتقييمات</h2>
                  <p className="text-xs text-medical-muted">شاركنا تجربتك واطلع على موقعنا وآراء العملاء على Google</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Google Location */}
                <a
                  href="https://2u.pw/AGitWm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform text-xl">
                    📍
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-blue-950 group-hover:text-blue-900">
                      نبض على Google
                    </h3>
                    <p className="text-xs text-blue-700 mt-0.5">الموقع الجغرافي وخريطة الخدمة</p>
                  </div>
                  <span className="ms-auto text-xs text-blue-800 font-bold">عرض الخريطة ←</span>
                </a>

                {/* Google Reviews */}
                <a
                  href="https://2u.pw/lgOM5v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow group-hover:scale-105 transition-transform text-xl">
                    ⭐
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-amber-950 group-hover:text-amber-900">
                      آراؤكم وتقييمكم على Google
                    </h3>
                    <p className="text-xs text-amber-700 mt-0.5">اكتب تقييمك وشاركنا رأيك في خدمتنا</p>
                  </div>
                  <span className="ms-auto text-xs text-amber-800 font-bold">تقييم الخدمة ←</span>
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
