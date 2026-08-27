'use client'
/**
 * components/layout/Header.tsx — نبض للتمريض المنزلي
 * Sticky RTL header with mobile menu.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bars3Icon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { siteConfig } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'

const navLinks = [
  { href: '/',               label: 'الرئيسية',     badge: null },
  { href: '/services',       label: 'الخدمات',      badge: null },
  { href: '/first-aid',      label: 'الإسعافات 🚑', badge: 'دليل' },
  { href: '/offers',         label: 'العروض',       badge: 'جديد' },
  { href: '/medical-record', label: 'ملفي الطبي',   badge: 'خاص' },
  { href: '/booking',        label: 'احجز الآن',    badge: null },
  { href: '/about',          label: 'من نحن',       badge: null },
  { href: '/blog',           label: 'المدونة',      badge: null },
  { href: '/contact',        label: 'تواصل معنا',   badge: null },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { settings, getCallUrl, getWhatsAppUrl } = useSettings()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-card border-b border-medical-border'
            : 'bg-white border-b border-transparent'
        }`}
        role="banner"
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2 shrink-0 min-w-0"
              aria-label={`${siteConfig.brand.name} — الصفحة الرئيسية`}
              onClick={closeMenu}
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shrink-0">
                <Image
                  src="/logo.jpg"
                  alt={siteConfig.brand.logoAlt}
                  fill
                  className="object-contain"
                  priority
                  sizes="40px"
                />
              </div>
              {/* Brand name — shown only on sm (640px+) to prevent cramping on phones */}
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-extrabold text-navy-700 leading-tight truncate">
                  نبض للتمريض
                </p>
                <p className="text-xs font-medium text-medical-muted leading-tight">
                  المنزلي
                </p>
              </div>
              {/* Location badge — desktop only */}
              <span className="badge-navy text-xs hidden lg:inline-flex shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse-slow" />
                دمياط
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="القائمة الرئيسية"
            >
              {navLinks.map((link) =>
                link.href === '/booking' ? null : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="btn-ghost text-[11px] xl:text-xs 2xl:text-sm px-1.5 xl:px-2.5 relative inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    {link.label}
                    {link.badge && (
                      <span className="bg-gold-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
            </nav>

            {/* ── Desktop Actions ── */}
            <div className="hidden lg:flex items-center gap-2">
              <a
                href={getCallUrl()}
                className="btn-ghost text-sm flex items-center gap-1.5"
                aria-label="اتصل بنا"
                onClick={() => analytics.clickCall('header')}
              >
                <PhoneIcon className="w-4 h-4" aria-hidden="true" />
                {settings.phone}
              </a>
              <Link
                href="/booking"
                className="btn-primary text-sm px-5 py-2.5"
              >
                احجز الآن
              </Link>
            </div>

            {/* ── Mobile: Call + Menu toggle ── */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={getCallUrl()}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-50 text-gold-600 shrink-0"
                aria-label="اتصل بنا"
                onClick={() => analytics.clickCall('header_mobile')}
              >
                <PhoneIcon className="w-5 h-5" aria-hidden="true" />
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-navy-50 text-navy-700 shrink-0"
                aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Drawer */}
          <nav
            id="mobile-menu"
            className="fixed top-0 end-0 z-50 h-full w-72 max-w-[85vw] bg-white shadow-card-lg lg:hidden animate-slide-up flex flex-col"
            aria-label="القائمة المحمولة"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between p-4 border-b border-medical-border shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shrink-0">
                  <Image
                    src="/logo.jpg"
                    alt={siteConfig.brand.logoAlt}
                    fill
                    className="object-contain"
                    sizes="40px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-navy-700 truncate">نبض للتمريض المنزلي</p>
                  <p className="text-xs text-medical-muted">دمياط — مصر</p>
                </div>
              </div>
              <button
                onClick={closeMenu}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-medical-gray text-medical-muted shrink-0 ms-2"
                aria-label="إغلاق القائمة"
              >
                <XMarkIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Nav links */}
            <div className="p-4 flex flex-col gap-1 overflow-y-auto flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    link.href === '/booking'
                      ? 'bg-navy-700 text-white mt-2'
                      : 'text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-none ms-2">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Contact in drawer — pinned to bottom */}
            <div className="p-4 border-t border-medical-border bg-medical-gray shrink-0">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full mb-2 text-sm"
                onClick={() => analytics.clickWhatsApp('mobile_menu')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                واتساب
              </a>
              <a
                href="https://t.me/Ibrahim5k"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mb-2 py-2.5 rounded-xl bg-[#229ED9] text-white font-bold text-xs sm:text-sm shadow transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
                <span>تليجرام: t.me/Ibrahim5k</span>
              </a>
              <a
                href={getCallUrl()}
                className="btn-call w-full text-sm"
                onClick={() => analytics.clickCall('mobile_menu')}
              >
                <PhoneIcon className="w-5 h-5" aria-hidden="true" />
                اتصل الآن
              </a>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
