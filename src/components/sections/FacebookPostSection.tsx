'use client'
/**
 * components/sections/FacebookPostSection.tsx — نبض للتمريض المنزلي
 * قسم التواصل الاجتماعي — روابط مباشرة بدون iframe
 */

import { siteConfig } from '@/data/siteConfig'

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export default function FacebookPostSection() {
  return (
    <section
      className="bg-blue-50 border-y border-blue-100 py-10 sm:py-14"
      aria-labelledby="facebook-section-heading"
    >
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-800 rounded-full px-4 py-1.5 mb-5 text-xs sm:text-sm font-bold shadow-sm">
            <FacebookIcon />
            <span>تابعونا على صفحتنا الرسمية</span>
          </div>

          <h2
            id="facebook-section-heading"
            className="text-2xl sm:text-3xl font-extrabold text-navy-700 leading-tight mb-3"
          >
            تابع <span className="text-blue-600">نبض على فيسبوك</span>
          </h2>

          <p className="text-medical-muted text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            نشر يومي لنصائح طبية مفيدة وإرشادات التمريض المنزلي ورعاية كبار السن داخل دمياط.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-start">
            {[
              { icon: '🩺', text: 'تغطية مستمرة لخدمات الحقن والمحاليل ورعاية الجروح' },
              { icon: '💬', text: 'رد سريع على استفساراتكم الطبية عبر رسائل الصفحة' },
              { icon: '⭐', text: 'آراء وتجارب حقيقية من عائلات المرضى' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white rounded-2xl p-3.5 border border-blue-100 shadow-sm">
                <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg shrink-0">
                  {item.icon}
                </span>
                <span className="text-xs sm:text-sm text-navy-800 font-medium leading-snug">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <a
              href="https://www.facebook.com/profile.php?id=61593884400330"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#0c65d8] text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-md active:scale-95 transition-all"
            >
              <FacebookIcon />
              <span>زيارة صفحة نبض الرسمية</span>
            </a>

            <a
              href="https://www.facebook.com/share/g/1BmBygobMw/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-navy-50 text-navy-700 font-bold px-5 py-3.5 rounded-2xl text-sm border border-navy-200 active:scale-95 transition-all"
            >
              <span>جروب نبض على فيسبوك 👥</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
