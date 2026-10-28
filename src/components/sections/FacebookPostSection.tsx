'use client'
/**
 * components/sections/FacebookPostSection.tsx
 * قسم مبسط — زر فيسبوك فقط بدون تفاصيل زائدة
 */

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export default function FacebookPostSection() {
  return (
    <section
      className="bg-slate-50 border-y border-slate-200 py-8 sm:py-10"
      aria-labelledby="facebook-section-heading"
    >
      <div className="section-container">
        <div className="flex flex-col items-center text-center gap-4">
          <h2
            id="facebook-section-heading"
            className="text-lg sm:text-xl font-extrabold text-navy-700"
          >
            تابعنا على <span className="text-blue-600">فيسبوك</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.facebook.com/profile.php?id=61593884400330"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#0c65d8] text-white font-bold px-6 py-3 rounded-2xl text-sm shadow-md active:scale-95 transition-all"
            >
              <FacebookIcon />
              <span>صفحتنا على فيسبوك</span>
            </a>

            <a
              href="https://www.facebook.com/share/g/1BmBygobMw/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-navy-50 text-navy-700 font-bold px-5 py-3 rounded-2xl text-sm border border-navy-200 active:scale-95 transition-all"
            >
              <span>انضم لمجموعتنا</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
