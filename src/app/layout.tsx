/**
 * app/layout.tsx — نبض للتمريض المنزلي
 * Root layout — RTL Arabic, Cairo font, SEO metadata.
 */

import type { Metadata, Viewport } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/data/siteConfig'

// ── Cairo Font ────────────────────────────────────────────────
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
})

// ── Metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-nursing.vercel.app'
  ),
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: siteConfig.seo.keywords,

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    siteName: siteConfig.brand.name,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteConfig.brand.name,
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
    images: ['/og-image.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  // Icons
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  // Manifest
  manifest: '/manifest.webmanifest',

  // Canonical
  alternates: {
    canonical: '/',
  },

  // Search Engine Verifications (Google Search Console, Bing, Yandex)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || siteConfig.seo.googleSiteVerification || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || siteConfig.seo.bingSiteVerification || '',
    },
  },
}

// ── Viewport ─────────────────────────────────────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1B2B6B' },
    { media: '(prefers-color-scheme: dark)',  color: '#0B122E' },
  ],
}

// ── JSON-LD Structured Data ───────────────────────────────────
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'LocalBusiness', 'HealthAndBeautyBusiness'],
  '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-nursing.vercel.app'}/#organization`,
  name: siteConfig.brand.name,
  alternateName: ['نبض', 'Nabd Nursing', 'نبض للتمريض المنزلي بدمياط'],
  description: siteConfig.brand.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-nursing.vercel.app',
  logo: {
    '@type': 'ImageObject',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-nursing.vercel.app'}/logo.jpg`,
    width: '512',
    height: '512',
  },
  image: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-nursing.vercel.app'}/images/nabd-hero-poster.jpg`,
  telephone: siteConfig.contact.phoneE164,
  priceRange: '$$',
  currenciesAccepted: 'EGP',
  paymentAccepted: 'Cash, Vodafone Cash, InstaPay',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'دمياط',
    addressRegion: 'دمياط',
    addressCountry: 'EG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 31.4165,
    longitude: 31.8133,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'دمياط',
      containedInPlace: {
        '@type': 'Country',
        name: 'مصر',
      },
    },
    {
      '@type': 'AdministrativeArea',
      name: 'محافظة دمياط',
    },
  ],
  medicalSpecialty: [
    'Nursing',
    'Emergency',
    'PrimaryCare',
    'Geriatric',
  ],
  availableService: [
    {
      '@type': 'MedicalProcedure',
      name: 'تركيب وتغيير القسطرة البولية بالمنزل',
      procedureType: 'NoninvasiveProcedure',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'تركيب المحاليل الوريدية والكانيولا',
      procedureType: 'NoninvasiveProcedure',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'غيار الجروح والحروق وقرح الفراش',
      procedureType: 'NoninvasiveProcedure',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'تركيب أنبوبة التغذية المعوية (الرايل)',
      procedureType: 'NoninvasiveProcedure',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'سحب عينات التحاليل الطبية من المنزل',
      procedureType: 'DiagnosticProcedure',
    },
    {
      '@type': 'MedicalProcedure',
      name: 'إعطاء كافة أنواع الحقن المنزلية',
      procedureType: 'NoninvasiveProcedure',
    },
  ],
  founder: {
    '@type': 'Person',
    name: 'إبراهيم ماهر',
    jobTitle: 'المشرف العام وأخصائي التمريض والرعاية الصحية المنزلية',
    telephone: siteConfig.contact.phoneE164,
  },
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.facebookProfile,
    siteConfig.social.facebookGroup,
    siteConfig.social.blogger,
    siteConfig.social.googleBusiness,
    siteConfig.social.googleReviews,
    siteConfig.social.cezmaStore,
    siteConfig.social.telegram,
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.brand.name,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-nursing.vercel.app',
  inLanguage: 'ar-EG',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/services?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

import NotificationPrompt from '@/components/ui/NotificationPrompt'
import { SettingsProvider } from '@/context/SettingsContext'
import MetaPixel from '@/components/analytics/MetaPixel'

// ── Root Layout ───────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cairo.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}', {
                    page_location: window.location.href,
                    language: 'ar'
                  });
                `,
              }}
            />
          </>
        )}

        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Geo & Location Tags for Search Engines & AI */}
        <meta name="geo.region" content="EG-DT" />
        <meta name="geo.placename" content="دمياط" />
        <meta name="geo.position" content="31.4165;31.8133" />
        <meta name="ICBM" content="31.4165, 31.8133" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="نبض للتمريض" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://script.google.com" />
      </head>
      <body className="font-cairo antialiased">
        <MetaPixel />
        <SettingsProvider>
          {children}
          <NotificationPrompt />
        </SettingsProvider>
      </body>
    </html>
  )
}
