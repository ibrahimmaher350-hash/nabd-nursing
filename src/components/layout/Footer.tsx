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
    { href: '/',                                label: 'الرئيسية' },
    { href: '/services',                        label: 'خدمات التمريض 🩺' },
    { href: '/reviews',                         label: 'آراء عملائنا ⭐' },
    { href: '/booking',                         label: 'طلب ممرض للمنزل 📅' },
    { href: '/offers',                          label: 'عروض التمريض 🎁' },
    { href: '/medical-guide',                   label: 'الإسعافات والروشتات 🚑💊' },
    { href: 'https://nabd-damietta.blogspot.com', label: 'المدونة الطبية ✍️', isExternal: true },
    { href: '/medical-record',                  label: 'ملفي الطبي' },
    { href: '/contact',                         label: 'تواصل معنا' },
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

// Telegram icon
const TelegramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
)

// Star / Review icon
const StarIcon = () => (
  <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
)

// User icon
const UserIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
)

// Store icon
const StoreIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 6 0v.75H18A2.25 2.25 0 0 1 20.25 8.25v10.5A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V8.25A2.25 2.25 0 0 1 6 6h4.5v-.75Zm1.5.75v-.75a1.5 1.5 0 0 1 3 0V6h-3Z" clipRule="evenodd" />
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
                  {link.isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-gold-300 text-sm transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      <span>{link.label}</span>
                      <span className="text-xs text-gold-400">↗</span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-gold-300 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
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
          {/* Contact + All Official Platforms */}
          <div>
            <h3 className="font-bold text-base mb-3 text-white">الاتصال والحجز</h3>

            <div className="flex flex-col gap-2.5 mb-5">
              {/* Phone */}
              <a
                href={siteConfig.contact.callUrl}
                className="flex items-center gap-2 text-white/90 hover:text-gold-300 text-sm font-semibold transition-colors"
                onClick={() => analytics.clickCall('footer')}
              >
                <PhoneIcon className="w-4 h-4 text-gold-400 shrink-0" aria-hidden="true" />
                <span>01001097896</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/201099667065"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-semibold transition-colors"
                onClick={() => analytics.clickWhatsApp('footer')}
              >
                <WhatsAppIcon />
                <span>مراسلة إبراهيم عبر واتساب</span>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/Ibrahim5k"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sky-400 hover:text-sky-300 text-xs sm:text-sm font-semibold transition-colors"
              >
                <TelegramIcon />
                <span>تليجرام: t.me/Ibrahim5k</span>
              </a>
            </div>

            {/* Official Platforms */}
            <div>
              <p className="text-xs text-white/50 mb-2.5 font-semibold uppercase tracking-wide">
                منصات نبض الرسمية
              </p>
              <div className="grid grid-cols-2 gap-2">
                {/* Facebook Page */}
                <a
                  href="https://www.facebook.com/profile.php?id=61593884400330"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  aria-label="الصفحة الرسمية لنَبض للتمريض المنزلي"
                >
                  <FacebookIcon />
                  <span className="truncate">صفحة نبض</span>
                </a>

                {/* Responsible Profile */}
                <a
                  href="https://www.facebook.com/share/1BDJwJeW15/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  aria-label="الملف الشخصي المسؤول عن نبض – إبراهيم ماهر"
                >
                  <UserIcon />
                  <span className="truncate">إبراهيم ماهر</span>
                </a>

                {/* Facebook Group */}
                <a
                  href="https://www.facebook.com/share/g/1BmBygobMw/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  aria-label="جروب نبض على فيسبوك"
                >
                  <FacebookIcon />
                  <span className="truncate">جروب نبض</span>
                </a>

                {/* Blogger */}
                <a
                  href="https://nabd-damietta.blogspot.com/?m=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  aria-label="مدونة نبض – Blogger"
                >
                  <BlogIcon />
                  <span className="truncate">مدونة نبض</span>
                </a>

                {/* Google Business */}
                <a
                  href="https://2u.pw/AGitWm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  aria-label="نبض على Google"
                >
                  <GoogleIcon />
                  <span className="truncate">على Google</span>
                </a>

                {/* Google Reviews */}
                <a
                  href="https://2u.pw/lgOM5v"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-gold-300 text-xs font-medium transition-colors border border-amber-500/30"
                  aria-label="آراؤكم وتقييمكم على Google"
                >
                  <StarIcon />
                  <span className="truncate">التقييمات ⭐</span>
                </a>

                {/* Cezma Store */}
                <a
                  href="https://cezma.com/store/nabd.nu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors border border-emerald-500/30 col-span-2"
                  aria-label="متجر نبض على سيزما | Cezma"
                >
                  <StoreIcon />
                  <span>متجر نبض على سيزما (Cezma) 🛒</span>
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
