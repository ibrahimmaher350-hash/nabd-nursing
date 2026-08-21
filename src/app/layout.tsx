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
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-damietta.blogspot.com'
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
  '@type': ['LocalBusiness', 'MedicalBusiness'],
  '@id': `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-damietta.blogspot.com'}/#organization`,
  name: siteConfig.brand.name,
  alternateName: siteConfig.brand.shortName,
  description: siteConfig.brand.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-damietta.blogspot.com',
  logo: {
    '@type': 'ImageObject',
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-damietta.blogspot.com'}/logo.jpg`,
  },
  telephone: siteConfig.contact.phoneE164,
  areaServed: {
    '@type': 'City',
    name: 'دمياط',
    containedInPlace: {
      '@type': 'Country',
      name: 'مصر',
    },
  },
  serviceType: 'Home Nursing Services',
  priceRange: 'حسب الخدمة والحالة',
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.facebookGroup,
    siteConfig.social.blogger,
    siteConfig.social.googleBusiness,
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.brand.name,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nabd-damietta.blogspot.com',
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

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-cairo antialiased">
        <SettingsProvider>
          {children}
          <NotificationPrompt />
        </SettingsProvider>
      </body>
    </html>
  )
}
