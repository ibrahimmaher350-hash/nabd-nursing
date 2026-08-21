/**
 * app/privacy/page.tsx — سياسة الخصوصية
 */
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { siteConfig } from '@/data/siteConfig'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة خصوصية نبض للتمريض المنزلي — كيف نجمع ونحمي بياناتك.',
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-gradient-primary py-8 sm:py-10">
          <div className="section-container">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">سياسة الخصوصية</h1>
            <p className="text-white/70 text-sm mt-2">{siteConfig.brand.name}</p>
          </div>
        </section>

        <section className="bg-white">
          <div className="section-container py-10 max-w-3xl">
            <div className="prose prose-sm max-w-none text-medical-muted leading-relaxed">

              <h2 className="text-navy-700 text-lg font-bold mt-6 mb-3">المعلومات التي نجمعها</h2>
              <p>عند الحجز، نجمع البيانات التالية فقط:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 my-3">
                <li>الاسم الكامل</li>
                <li>رقم الهاتف</li>
                <li>رقم واتساب (اختياري)</li>
                <li>العنوان ومنطقة الخدمة</li>
                <li>الموعد المطلوب</li>
                <li>ملاحظات عامة عن الخدمة</li>
              </ul>
              <p>
                لا نجمع بيانات بطاقات الائتمان، ولا كلمات المرور، ولا صور طبية، ولا سجلات طبية شاملة.
              </p>

              <h2 className="text-navy-700 text-lg font-bold mt-6 mb-3">كيف نستخدم بياناتك</h2>
              <ul className="list-disc list-inside flex flex-col gap-1 my-3">
                <li>التواصل معك لتأكيد الحجز وتنسيق الموعد</li>
                <li>إرسال تذكيرات الموعد إذا وافقت على الإشعارات</li>
                <li>تحسين جودة خدماتنا</li>
              </ul>

              <h2 className="text-navy-700 text-lg font-bold mt-6 mb-3">مشاركة البيانات</h2>
              <p>
                لا نشارك بياناتك الشخصية مع أي طرف ثالث خارج فريق نبض للتمريض المنزلي.
                لا نبيع بياناتك لأي جهة إعلانية.
              </p>

              <h2 className="text-navy-700 text-lg font-bold mt-6 mb-3">أمان البيانات</h2>
              <p>
                نستخدم Firebase (Google Cloud) لتخزين البيانات بشكل آمن مع تشفير البيانات أثناء النقل والتخزين.
                لا يمكن الوصول لبيانات الحجوزات إلا للمشرفين المصرح لهم.
              </p>

              <h2 className="text-navy-700 text-lg font-bold mt-6 mb-3">حقوقك</h2>
              <p>
                يمكنك التواصل معنا لطلب حذف بياناتك أو الاستفسار عنها عبر:{' '}
                <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} className="text-navy-600 underline">
                  واتساب
                </a>.
              </p>

              <h2 className="text-navy-700 text-lg font-bold mt-6 mb-3">ملفات تعريف الارتباط (Cookies)</h2>
              <p>
                نستخدم ملفات تعريف ارتباط محدودة لتشغيل الموقع وقياس الأداء عبر Google Analytics.
                يمكنك تعطيلها من إعدادات متصفحك.
              </p>

              <p className="text-xs text-medical-muted mt-8 border-t border-medical-border pt-4">
                آخر تحديث: {new Date().getFullYear()}. للاستفسار: تواصل معنا عبر واتساب.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
