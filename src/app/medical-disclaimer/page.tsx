/**
 * app/medical-disclaimer/page.tsx
 */
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'إخلاء المسؤولية الطبي',
  description: 'إخلاء المسؤولية الطبي لنبض للتمريض المنزلي.',
  robots: { index: false },
}

export default function MedicalDisclaimerPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-gradient-primary py-8 sm:py-10">
          <div className="section-container">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">إخلاء المسؤولية الطبي</h1>
          </div>
        </section>

        <section className="bg-white">
          <div className="section-container py-10 max-w-3xl">
            <div className="text-medical-muted leading-relaxed flex flex-col gap-5 text-sm sm:text-base">

              <div className="emergency-notice">
                <span className="text-lg shrink-0">⚠️</span>
                <p>
                  <strong className="text-red-700">تحذير:</strong> في الحالات الطارئة أو الأعراض الخطيرة،
                  اتصل بخدمات الطوارئ أو توجه لأقرب قسم طوارئ فوراً.
                  نبض للتمريض المنزلي ليس بديلاً عن طوارئ المستشفيات.
                </p>
              </div>

              <div className="medical-disclaimer">
                <p>
                  <strong>طبيعة الخدمة:</strong> تقدم نبض للتمريض المنزلي خدمات تمريضية ورعاية صحية منزلية
                  بواسطة مقدمي خدمة مؤهلين. جميع الإجراءات التمريضية تتم وفق التوجيه الطبي أو وصف الطبيب المعالج.
                </p>
              </div>

              <p>
                <strong className="text-navy-700">عدم تقديم التشخيص:</strong>{' '}
                لا يقدم هذا الموقع أو فريق نبض تشخيصات طبية أو وصفات دوائية.
                المعلومات على الموقع لأغراض تعريفية فقط وليست بديلاً عن الاستشارة الطبية المتخصصة.
              </p>

              <p>
                <strong className="text-navy-700">مسؤولية الطبيب:</strong>{' '}
                يقع على عاتق الطبيب المعالج وحده تحديد نوع العلاج والدواء والخطة العلاجية.
                مقدمو الخدمة في نبض ينفذون التعليمات الطبية ولا يضعونها.
              </p>

              <p>
                <strong className="text-navy-700">الخصوصية الطبية:</strong>{' '}
                نلتزم بحماية بيانات المريض ونعاملها بسرية تامة وفق سياسة الخصوصية المعتمدة.
              </p>

              <p>
                <strong className="text-navy-700">حدود الخدمة:</strong>{' '}
                تُقدَّم خدماتنا داخل دمياط والمناطق التي يغطيها فريق نبض.
                يمكنك التحقق من توافر الخدمة في منطقتك عبر التواصل معنا.
              </p>

              <p className="text-xs text-medical-muted border-t border-medical-border pt-4">
                هذا الإخلاء يسري على جميع خدمات نبض للتمريض المنزلي.
                آخر تحديث: {new Date().getFullYear()}.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
