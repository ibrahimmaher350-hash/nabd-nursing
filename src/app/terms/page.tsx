/**
 * app/terms/page.tsx — الشروط والأحكام
 */
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'الشروط والأحكام',
  description: 'شروط وأحكام استخدام خدمات نبض للتمريض المنزلي.',
  robots: { index: false },
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-gradient-primary py-8 sm:py-10">
          <div className="section-container">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">الشروط والأحكام</h1>
            <p className="text-white/70 text-sm mt-2">{siteConfig.brand.name}</p>
          </div>
        </section>

        <section className="bg-white">
          <div className="section-container py-10 max-w-3xl">
            <div className="flex flex-col gap-5 text-medical-muted leading-relaxed text-sm sm:text-base">

              <p>
                باستخدامك لموقع أو خدمات نبض للتمريض المنزلي، فإنك توافق على الشروط والأحكام التالية.
              </p>

              <div>
                <h2 className="text-navy-700 text-lg font-bold mb-3">1. طبيعة الخدمة</h2>
                <p>
                  نبض للتمريض المنزلي يقدم خدمات تمريضية ورعاية صحية منزلية داخل دمياط.
                  جميع الخدمات تُنفَّذ بواسطة مقدمي خدمة وفق التوجيه الطبي.
                </p>
              </div>

              <div>
                <h2 className="text-navy-700 text-lg font-bold mb-3">2. الحجز والإلغاء</h2>
                <ul className="list-disc list-inside flex flex-col gap-2">
                  <li>الحجز يُعتبر مؤكداً بعد تأكيدنا التواصل معك.</li>
                  <li>يمكن إلغاء أو تعديل الموعد بالتواصل معنا مسبقاً.</li>
                  <li>نحتفظ بحق رفض أو تأجيل الحجز في حال عدم توافر مقدم خدمة.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-navy-700 text-lg font-bold mb-3">3. المسؤولية الطبية</h2>
                <p>
                  نبض للتمريض المنزلي يقدم خدمات تمريضية وفق التوجيهات الطبية فقط.
                  المسؤولية الطبية الكاملة عن التشخيص وخطة العلاج تقع على عاتق الطبيب المعالج.
                </p>
              </div>

              <div>
                <h2 className="text-navy-700 text-lg font-bold mb-3">4. الأسعار والدفع</h2>
                <p>
                  الأسعار تُحدَّد حسب نوع الخدمة والحالة والموقع وتُتفق عليها قبل تنفيذ الخدمة.
                </p>
              </div>

              <div>
                <h2 className="text-navy-700 text-lg font-bold mb-3">5. التعديلات</h2>
                <p>
                  نحتفظ بحق تعديل هذه الشروط في أي وقت. الاستمرار في استخدام الخدمة يعني الموافقة على أي تعديلات.
                </p>
              </div>

              <p className="text-xs border-t border-medical-border pt-4">
                آخر تحديث: {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
