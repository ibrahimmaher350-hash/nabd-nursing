'use client'
/**
 * components/sections/FacebookPostSection.tsx — نبض للتمريض المنزلي
 * قسم المنشور الرسمي على فيسبوك — تفاعل حي وتوثيق رسمي للخدمات
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
      className="bg-white border-y border-medical-border overflow-hidden"
      aria-labelledby="facebook-section-heading"
    >
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left Column: Interactive Facebook Post Embed ── */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <div className="w-full max-w-[500px] rounded-3xl overflow-hidden shadow-card-lg border border-medical-border bg-slate-50 p-2 sm:p-3">
              <div className="relative w-full overflow-hidden rounded-2xl flex justify-center bg-white">
                <iframe
                  src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid05UyzC9gPXGcyGiWVh3THNbXQToBgD7kDjxuTFTLdFwquepW6p9pqX1twpzpgtSYZl%26id%3D61593884400330&show_text=true&width=500"
                  width="500"
                  height="706"
                  style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="منشور نبض للتمريض المنزلي على فيسبوك — رعاية صحية في منزلك"
                  className="w-full max-w-[500px]"
                />
              </div>
            </div>
          </div>

          {/* ── Right Column: Marketing Copy & Direct Community Links ── */}
          <div className="lg:col-span-6 text-center lg:text-start order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 rounded-full px-4 py-1.5 mb-4 text-xs sm:text-sm font-bold">
              <FacebookIcon />
              <span>تفاعل حي على صفحتنا الرسمية</span>
            </div>

            <h2
              id="facebook-section-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-700 leading-tight mb-4"
            >
              تابع جديد نبض{' '}
              <span className="text-gold-500">على فيسبوك</span>
            </h2>

            <p className="text-medical-muted text-sm sm:text-base leading-relaxed mb-6">
              ننشر يومياً أهم الإرشادات والنصائح الطبية، تفاصيل الخدمات التمريضية المنزلية، وتجارب حية لرعاية المرضى وكبار السن بأمان وراحة تامة داخل دمياط.
            </p>

            {/* Feature points */}
            <div className="flex flex-col gap-3 mb-8">
              {[
                { icon: '🩺', text: 'تغطية مستمرة لخدمات الحقن والمحاليل ورعاية الجروح بدمياط' },
                { icon: '💬', text: 'رد فوري على استفساراتكم الطبية عبر رسائل الصفحة' },
                { icon: '⭐', text: 'آراء وتجارب حقيقية لأهالي المرضى والمتابعين' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-start justify-center lg:justify-start">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-base shrink-0 shadow-sm">
                    {item.icon}
                  </span>
                  <span className="text-xs sm:text-sm text-navy-800 font-semibold">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Official Facebook Platforms Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start flex-wrap">
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
                className="inline-flex items-center justify-center gap-2 bg-navy-50 hover:bg-navy-100 text-navy-700 font-bold px-5 py-3.5 rounded-2xl text-sm border border-navy-200 active:scale-95 transition-all"
              >
                <span>جروب نبض على فيسبوك 👥</span>
              </a>

              <a
                href="https://www.facebook.com/share/1BDJwJeW15/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-4 py-3 rounded-2xl text-xs border border-slate-200 active:scale-95 transition-all"
              >
                <span>إبراهيم ماهر (المسؤول)</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
