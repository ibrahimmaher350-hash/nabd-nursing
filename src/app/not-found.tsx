/**
 * app/not-found.tsx — 404 page
 */
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-gradient-section min-h-[60vh] flex items-center">
        <div className="section-container section-padding text-center">
          <div className="text-8xl mb-6" aria-hidden="true">🏥</div>
          <h1 className="text-3xl font-extrabold text-navy-700 mb-3">
            الصفحة غير موجودة
          </h1>
          <p className="text-medical-muted text-base mb-8 max-w-sm mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary px-8 py-3.5">
              العودة للرئيسية
            </Link>
            <Link href="/services" className="btn-secondary px-8 py-3.5">
              الخدمات
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
