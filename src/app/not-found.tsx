/**
 * app/not-found.tsx — نبض للتمريض المنزلي
 * صفحة 404 احترافية بتصميم طبي جذاب
 */

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { siteConfig } from '@/data/siteConfig'

const quickLinks = [
  { href: '/',               label: 'الرئيسية',         icon: '🏠' },
  { href: '/services',       label: 'خدماتنا',           icon: '🩺' },
  { href: '/booking',        label: 'احجز ممرض',         icon: '📅' },
  { href: '/prescriptions',  label: 'الروشتات الطبية',   icon: '💊' },
  { href: '/first-aid',      label: 'دليل الإسعافات',    icon: '🚑' },
  { href: '/contact',        label: 'تواصل معنا',        icon: '📞' },
]

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-gradient-section flex items-center">
        <div className="section-container py-16 sm:py-24 text-center">

          {/* Big 404 display */}
          <div className="relative inline-block mb-6">
            <p className="text-[120px] sm:text-[180px] font-black text-navy-100 leading-none select-none">
              404
            </p>
            {/* Medical cross overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-card-md border border-medical-border flex items-center justify-center animate-float">
                  <span className="text-4xl sm:text-5xl" role="img" aria-label="ممرض">🩺</span>
                </div>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-2xl border-2 border-gold-400/50 animate-ping" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-700 mb-3">
            الصفحة دي مش موجودة!
          </h1>
          <p className="text-medical-muted text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
            يبدو إن الرابط اللي دخلته غلط أو الصفحة اتشالت.
            خد نفس وروح لأي صفحة من اللي تحت 👇
          </p>

          {/* Quick Navigation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto mb-10">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nabd-card p-4 flex flex-col items-center gap-2 text-center hover:-translate-y-1 group"
              >
                <span className="text-2xl" aria-hidden="true">{link.icon}</span>
                <span className="text-sm font-semibold text-navy-700 group-hover:text-navy-500 transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="bg-white rounded-2xl border border-medical-border shadow-card p-5 max-w-sm mx-auto">
            <p className="text-sm font-bold text-navy-700 mb-3">
              لو محتاج مساعدة تواصل معنا فوراً
            </p>
            <div className="flex flex-col xs:flex-row gap-2 justify-center">
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp text-sm py-2.5 px-4"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                واتساب
              </a>
              <a
                href={siteConfig.contact.callUrl}
                className="btn-call text-sm py-2.5 px-4"
              >
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
