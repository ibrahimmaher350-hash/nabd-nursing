/**
 * app/services/[slug]/page.tsx — نبض للتمريض المنزلي
 * Individual service detail page — SEO-friendly.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PhoneIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { CheckCircleIcon, ExclamationTriangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import { services, getServiceBySlug } from '@/data/services'
import { getOffersForService } from '@/data/offers'
import ServiceOfferBanner from '@/components/ui/ServiceOfferBanner'
import MedicalSuppliesView from '@/components/services/MedicalSuppliesView'
import SocialShareButton from '@/components/ui/SocialShareButton'
import { siteConfig, getWhatsAppUrl } from '@/data/siteConfig'

interface Props {
  params: Promise<{ slug: string }>
}

// Static params for all services
export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

// Dynamic metadata per service with rich Open Graph preview for Facebook, WhatsApp & Twitter
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}

  const isMedicalSupplies = slug === 'medical-supplies'
  const ogImageUrl = isMedicalSupplies ? '/vivachek.png' : '/og-image.jpg'
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app'
  const pageUrl = `${BASE_URL}/services/${slug}`

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    keywords: service.keywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: pageUrl,
      siteName: siteConfig.brand.name,
      locale: 'ar_EG',
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: isMedicalSupplies ? 800 : 1200,
          height: isMedicalSupplies ? 800 : 630,
          alt: service.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.seoTitle,
      description: service.seoDescription,
      images: [ogImageUrl],
    },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service || !service.active) notFound()

  // Structured data
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: siteConfig.brand.name,
      telephone: siteConfig.contact.phoneE164,
      areaServed: 'دمياط، مصر',
    },
    areaServed: 'دمياط، مصر',
    serviceType: service.category,
  }

  const faqSchema = service.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } : null

  const BASE_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nabd-nursing.vercel.app'
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: BASE_SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'الخدمات', item: `${BASE_SITE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: service.name, item: `${BASE_SITE_URL}/services/${slug}` },
    ],
  }

  const whatsappUrl = getWhatsAppUrl(service.name)
  const serviceOffers = getOffersForService(slug)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header />
      <main id="main-content">
        {/* Breadcrumb & Back Navigation */}
        <nav aria-label="مسار التنقل" className="bg-white border-b border-medical-border">
          <div className="section-container py-3 flex items-center justify-between gap-4 flex-wrap">
            <ol className="flex items-center gap-2 text-xs text-medical-muted flex-wrap" role="list">
              <li><Link href="/" className="hover:text-navy-600">الرئيسية</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/services" className="hover:text-navy-600">الخدمات</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-navy-700 font-medium" aria-current="page">{service.name}</li>
            </ol>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-xs font-bold text-navy-700 hover:text-navy-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all group"
            >
              <ArrowRightIcon className="w-3.5 h-3.5 text-navy-600 transition-transform group-hover:translate-x-1" />
              <span>العودة لقائمة الخدمات</span>
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-primary py-10 sm:py-14" aria-label={`خدمة ${service.name}`}>
          <div className="section-container">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-4xl" aria-hidden="true">
                  {service.iconEmoji}
                </div>
                <span className="badge bg-white/20 text-white">{service.category}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3">
                {service.name}
              </h1>

              {/* Price & Location Badges */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-gold-400/20 text-gold-300 border border-gold-400/30">
                  <span>💰 متوسط السعر:</span>
                  <span className="text-white font-black">{service.priceRange}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90 border border-white/20">
                  <span>📍</span>
                  <span>{service.targetZone || 'مركز وبندر دمياط'}</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  بدون المستلزمات الطبية
                </span>
              </div>

              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                {service.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp px-6 py-3.5 w-full sm:w-auto shadow-md"
                >
                  💬 احجز الخدمة عبر واتساب
                </a>
                <a
                  href={siteConfig.contact.callUrl}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-bold rounded-2xl px-6 py-3.5 w-full sm:w-auto hover:bg-white/10 transition-colors"
                >
                  <PhoneIcon className="w-5 h-5" aria-hidden="true" />
                  اتصل الآن
                </a>
                <SocialShareButton
                  title={service.name}
                  description={service.shortDescription}
                  url={`/services/${slug}`}
                  image={slug === 'medical-supplies' ? '/vivachek.png' : '/og-image.jpg'}
                  variant="button"
                  buttonText="مشاركة الخدمة 📢"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-6 py-3.5 w-full sm:w-auto"
                  detailsList={service.whatWeOffer}
                  deliveryNote="رعاية وتمريض منزلي باهتمام وأمان داخل دمياط."
                  analyticsContext={`service_${slug}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Service Details */}
        <section className="bg-white py-10 sm:py-14">
          <div className="section-container">
            {service.id === 'medical-supplies' ? (
              <div className="flex flex-col gap-10">
                {/* ── Active Offers Banner if available ── */}
                {serviceOffers.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {serviceOffers.map((offer) => (
                      <ServiceOfferBanner key={offer.id} offer={offer} />
                    ))}
                  </div>
                )}

                {/* ── VivaChek Ino & Medical Supplies Catalog ── */}
                <MedicalSuppliesView />

                {/* ── Service FAQ ── */}
                {service.faq.length > 0 && (
                  <div className="max-w-4xl mx-auto w-full pt-8 border-t border-slate-200">
                    <h2 className="text-xl sm:text-2xl font-bold text-navy-700 mb-6 text-center">
                      أسئلة شائعة حول الأجهزة والمستلزمات الطبية
                    </h2>
                    <div className="flex flex-col gap-3">
                      {service.faq.map((item, i) => (
                        <details key={i} className="nabd-card">
                          <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer font-semibold text-navy-700 text-sm sm:text-base">
                            <span>{item.question}</span>
                            <ChevronDownIcon className="w-4 h-4 text-gold-500 shrink-0" aria-hidden="true" />
                          </summary>
                          <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-medical-border">
                            <p className="text-medical-muted text-sm leading-relaxed pt-3">{item.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Main content */}
              <div className="lg:col-span-2 flex flex-col gap-8">

                {/* ── Offer Banner in main content (mobile + tablet visible) ── */}
                {serviceOffers.length > 0 && (
                  <div className="lg:hidden flex flex-col gap-4">
                    {serviceOffers.map((offer) => (
                      <ServiceOfferBanner key={offer.id} offer={offer} />
                    ))}
                  </div>
                )}

                {/* ── Pricing & Clinical Execution Card ── */}
                <div className="bg-gradient-to-br from-amber-50/90 via-slate-50 to-emerald-50/70 rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-xs">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-4 pb-3 border-b border-amber-200/60">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block mb-0.5">متوسط السعر العادل (استرشادي)</span>
                      <h2 className="text-xl sm:text-2xl font-black text-navy-900">{service.priceRange}</h2>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-navy-800 px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs">
                      <span>📍 التغطية الأساسية:</span>
                      <span className="text-gold-700 font-extrabold">{service.targetZone || 'مركز وبندر دمياط'}</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="bg-white/90 p-3.5 rounded-2xl border border-slate-200/80">
                      <strong className="text-navy-900 block mb-1 font-bold">📝 ملاحظات التنفيذ السريري:</strong>
                      <p className="leading-relaxed text-slate-700">{service.executionNotes || service.priceNote}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="bg-white/70 p-3 rounded-xl border border-slate-200/70">
                        <span className="font-bold text-navy-900 block mb-1">🩹 فصل تكلفة المستلزمات:</span>
                        <p className="text-slate-600">السعر للخدمة المهنية والتعقيم فقط. في حال طلبت توفير المستلزمات تضاف بسعر الصيدلية الفعلي.</p>
                      </div>
                      <div className="bg-white/70 p-3 rounded-xl border border-slate-200/70">
                        <span className="font-bold text-navy-900 block mb-1">🚗 رسوم الانتقال للمناطق الأبعد:</span>
                        <p className="text-slate-600">تضاف رسوم (50 - 100 ج) للزيارات الأبعد جغرافياً كدمياط الجديدة ورأس البر وكفر البطيخ.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Who needs this */}
                <div>
                  <h2 className="text-xl font-bold text-navy-700 mb-4">من يحتاج هذه الخدمة؟</h2>
                  <ul className="flex flex-col gap-2" role="list">
                    {service.whoNeeds.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-medical-muted text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What we offer */}
                <div>
                  <h2 className="text-xl font-bold text-navy-700 mb-4">ماذا نقدم؟</h2>
                  <ul className="flex flex-col gap-2" role="list">
                    {service.whatWeOffer.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gold-100 flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                          <div className="w-2 h-2 rounded-full bg-gold-500" />
                        </div>
                        <span className="text-medical-muted text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparation */}
                {service.preparation.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-navy-700 mb-4">ما الذي يحتاجه المريض قبل الزيارة؟</h2>
                    <ul className="flex flex-col gap-2" role="list">
                      {service.preparation.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="text-navy-400 text-lg shrink-0 leading-tight" aria-hidden="true">•</span>
                          <span className="text-medical-muted text-sm sm:text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Medical warning */}
                {service.medicalWarning && (
                  <div className="medical-disclaimer flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-navy-500 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-sm leading-relaxed">{service.medicalWarning}</p>
                  </div>
                )}

                {/* FAQ */}
                {service.faq.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-navy-700 mb-4">أسئلة شائعة</h2>
                    <div className="flex flex-col gap-3">
                      {service.faq.map((item, i) => (
                        <details key={i} className="nabd-card">
                          <summary className="flex items-center justify-between gap-4 p-4 cursor-pointer font-semibold text-navy-700 text-sm">
                            {item.question}
                            <ChevronDownIcon className="w-4 h-4 text-gold-500 shrink-0" aria-hidden="true" />
                          </summary>
                          <div className="px-4 pb-4 border-t border-medical-border">
                            <p className="text-medical-muted text-sm leading-relaxed pt-3">{item.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="flex flex-col gap-4">
                {/* ── Offer Banner (if active offer exists) ── */}
                {serviceOffers.map((offer) => (
                  <ServiceOfferBanner key={offer.id} offer={offer} />
                ))}

                {/* Booking card */}
                <div className="nabd-card p-5 sticky top-20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-navy-700 text-base">احجز هذه الخدمة</h3>
                    <span className="text-xs font-black text-navy-950 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-300">
                      {service.priceRange}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90 text-xs text-slate-700 mb-4 space-y-1.5">
                    <p className="font-bold text-navy-900 flex items-center gap-1">
                      <span>📍</span>
                      <span>{service.targetZone || 'مركز وبندر دمياط'}</span>
                    </p>
                    <p className="leading-relaxed text-[11px] text-slate-500">
                      {service.priceNote}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp w-full py-3.5 text-sm"
                    >
                      💬 احجز الخدمة عبر واتساب
                    </a>
                    <a
                      href={siteConfig.contact.callUrl}
                      className="btn-call w-full py-3.5 text-sm"
                    >
                      <PhoneIcon className="w-4 h-4" aria-hidden="true" />
                      اتصل الآن
                    </a>
                  </div>

                  {/* Emergency */}
                  <div className="emergency-notice mt-4">
                    <ExclamationTriangleIcon className="w-4 h-4 shrink-0 text-red-500" aria-hidden="true" />
                    <p className="text-xs leading-relaxed">{siteConfig.booking.emergencyNotice}</p>
                  </div>
                </div>

                {/* Other services */}
                <div className="nabd-card p-4">
                  <h3 className="font-bold text-navy-700 text-sm mb-3">خدمات أخرى</h3>
                  <ul className="flex flex-col gap-1.5" role="list">
                    {services
                      .filter((s) => s.active && s.id !== service.id)
                      .slice(0, 5)
                      .map((s) => (
                        <li key={s.id}>
                          <Link
                            href={`/services/${s.slug}`}
                            className="flex items-center gap-2 text-xs text-medical-muted hover:text-navy-700 transition-colors py-1"
                          >
                            <span className="text-base" aria-hidden="true">{s.iconEmoji}</span>
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    <li>
                      <Link href="/services" className="text-gold-600 text-xs font-medium hover:underline">
                        عرض كل الخدمات →
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
