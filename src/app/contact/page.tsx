/**
 * app/contact/page.tsx — تواصل معنا
 */
import type { Metadata } from 'next'
import { PhoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import { siteConfig, getWhatsAppUrl } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'

export const metadata: Metadata = {
  title: 'تواصل معنا | نبض للتمريض المنزلي',
  description: 'تواصل مع نبض للتمريض المنزلي عبر واتساب أو مكالمة مباشرة.',
  alternates: { canonical: '/contact' },
}

const contactMethods = [
  {
    id: 'whatsapp',
    title: 'واتساب',
    description: 'تواصل معنا مباشرة عبر واتساب للرد السريع.',
    action: 'فتح المحادثة',
    href: getWhatsAppUrl(),
    external: true,
    bgClass: 'bg-[#25D366]',
    Icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: 'phone',
    title: 'اتصال مباشر',
    description: `${siteConfig.contact.phone}`,
    action: 'اتصل الآن',
    href: siteConfig.contact.callUrl,
    external: false,
    bgClass: 'bg-gold-500',
    Icon: () => <PhoneIcon className="w-8 h-8" aria-hidden="true" />,
  },
  {
    id: 'facebook',
    title: 'صفحة فيسبوك',
    description: 'تابع صفحتنا على فيسبوك.',
    action: 'تابعنا',
    href: siteConfig.social.facebook,
    external: true,
    bgClass: 'bg-[#1877F2]',
    Icon: () => (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'group',
    title: 'جروب نبض',
    description: 'انضم لجروب نبض على فيسبوك.',
    action: 'انضم للجروب',
    href: siteConfig.social.facebookGroup,
    external: true,
    bgClass: 'bg-navy-700',
    Icon: () => <ChatBubbleLeftRightIcon className="w-8 h-8" aria-hidden="true" />,
  },
]

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-gradient-primary py-10 sm:py-14">
          <div className="section-container text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">تواصل معنا</h1>
            <p className="text-white/70 text-base">
              نبض للتمريض المنزلي — {siteConfig.location.addressDisplay}
            </p>
          </div>
        </section>

        <section className="bg-gradient-section">
          <div className="section-container section-padding">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {contactMethods.map((method) => (
                <a
                  key={method.id}
                  href={method.href}
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noopener noreferrer' : undefined}
                  className="nabd-card p-5 flex flex-col items-center text-center gap-3 group"
                  aria-label={method.action + ' — ' + method.title}
                >
                  <div className={`w-16 h-16 rounded-2xl ${method.bgClass} flex items-center justify-center text-white shadow-lg`}>
                    <method.Icon />
                  </div>
                  <div>
                    <h2 className="font-bold text-navy-700 text-base">{method.title}</h2>
                    <p className="text-medical-muted text-sm mt-1">{method.description}</p>
                  </div>
                  <span className="text-navy-600 text-sm font-semibold group-hover:text-gold-600 transition-colors">
                    {method.action} →
                  </span>
                </a>
              ))}
            </div>

            {/* Google Business */}
            <div className="text-center mt-8">
              <a
                href={siteConfig.social.googleBusiness}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                موقعنا على Google Business
              </a>
            </div>

            {/* Location info */}
            <div className="nabd-card p-5 max-w-md mx-auto mt-6 text-center">
              <p className="font-bold text-navy-700 text-base mb-1">{siteConfig.brand.name}</p>
              <p className="text-medical-muted text-sm">{siteConfig.location.addressDisplay}</p>
              <p className="text-medical-muted text-sm mt-1">
                منطقة الخدمة: {siteConfig.location.serviceAreas.join('، ')}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
