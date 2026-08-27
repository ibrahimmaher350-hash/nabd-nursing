'use client'
/**
 * components/layout/Footer.tsx — نبض للتمريض المنزلي
 * Premium footer with links, social, contact, and legal.
 */

import Link from 'next/link'
import Image from 'next/image'
import { PhoneIcon } from '@heroicons/react/24/solid'
import { siteConfig } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'

const footerLinks = {
  main: [
    { href: '/',               label: 'الرئيسية' },
    { href: '/services',       label: 'الخدمات' },
    { href: '/offers',         label: 'العروض' },
    { href: '/medical-record', label: 'ملفي الطبي' },
    { href: '/booking',        label: 'الحجز' },
    { href: '/about',          label: 'من نحن' },
    { href: '/blog',           label: 'المدونة' },
    { href: '/contact',        label: 'تواصل معنا' },
  ],
  legal: [
    { href: '/privacy',            label: 'سياسة الخصوصية' },
    { href: '/terms',              label: 'الشروط والأحكام' },
    { href: '/medical-disclaimer', label: 'إخلاء المسؤولية الطبي' },
  ],
}

// WhatsApp SVG icon
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

// Facebook SVG icon
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

// Google icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// Blog icon
const BlogIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { settings, getCallUrl, getWhatsAppUrl } = useSettings()

  return (
    <footer
      className="bg-gradient-primary text-white"
      role="contentinfo"
      aria-label="تذييل الصفحة"
    >
      {/* ── Main Footer ── */}
      <div className="section-container py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/10 border border-white/20">
                <Image
                  src="/logo.jpg"
                  alt={siteConfig.brand.logoAlt}
                  fill
                  className="object-contain p-1"
                  sizes="56px"
                />
              </div>
              <div>
                <p className="font-extrabold text-lg leading-tight">{settings.businessName || 'نبض للتمريض المنزلي'}</p>
                <p className="text-white/60 text-sm">{siteConfig.location.addressDisplay}</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              {siteConfig.brand.description}
            </p>
            <p className="text-gold-300 text-sm font-semibold italic">
              {settings.tagline || siteConfig.brand.tagline}
            </p>
          </div>

          {/* Main Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">روابط سريعة</h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold-300 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">قانوني</h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold-300 text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">تواصل معنا</h3>

            {/* Phone */}
            <a
              href={getCallUrl()}
              className="flex items-center gap-2.5 text-white/80 hover:text-gold-300 text-sm mb-3 transition-colors"
              onClick={() => analytics.clickCall('footer')}
            >
              <PhoneIcon className="w-4 h-4 text-gold-400 shrink-0" aria-hidden="true" />
              {settings.phone}
            </a>

            {/* WhatsApp */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white/80 hover:text-gold-300 text-sm mb-5 transition-colors"
              onClick={() => analytics.clickWhatsApp('footer')}
            >
              <WhatsAppIcon />
              واتساب
            </a>

            {/* Social */}
            <div>
              <p className="text-xs text-white/50 mb-3 font-semibold uppercase tracking-wide">
                تابعنا
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={settings.facebookUrl || siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  aria-label="صفحتنا على فيسبوك"
                  onClick={() => analytics.facebookClick('page')}
                >
                  <FacebookIcon />
                  فيسبوك
                </a>

                <a
                  href={settings.facebookGroupUrl || siteConfig.social.facebookGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  aria-label="جروب نبض على فيسبوك"
                  onClick={() => analytics.facebookClick('group')}
                >
                  <FacebookIcon />
                  الجروب
                </a>

                <a
                  href={settings.bloggerUrl || siteConfig.social.blogger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  aria-label="مدونة نبض الصحية"
                  onClick={() => analytics.blogClick()}
                >
                  <BlogIcon />
                  المدونة
                </a>

                <a
                  href={siteConfig.social.googleBusiness}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  aria-label="موقعنا على Google"
                  onClick={() => analytics.googleBusinessClick()}
                >
                  <GoogleIcon />
                  Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Emergency Notice ── */}
      <div className="border-t border-white/10">
        <div className="section-container py-4">
          <p className="text-center text-red-300 text-xs leading-relaxed">
            ⚠️ في الحالات الطارئة أو الأعراض الخطيرة، اتصل بخدمات الطوارئ أو توجه لأقرب قسم طوارئ. نبض ليس بديلاً عن طوارئ المستشفيات.
          </p>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="border-t border-white/10">
        <div className="section-container py-4">
          <p className="text-center text-white/40 text-xs">
            © {currentYear} {siteConfig.brand.name} — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  )
}
