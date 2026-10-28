'use client'
/**
 * components/layout/Header.tsx — رأس الصفحة
 * قائمة عائمة احترافية وأنيقة بدون البار العلوي لتقليل التزاحم
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'
import { siteConfig } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import { useSettings } from '@/context/SettingsContext'

interface NavLinkItem {
  href: string
  label: string
  badge: string | null
  isExternal?: boolean
}

const navLinks: NavLinkItem[] = [
  { href: '/#services',      label: 'خدماتنا',              badge: null },
  { href: '/reviews',        label: 'آراء العملاء',          badge: '5.0' },
  { href: '/medical-guide',  label: 'الدليل الطبي',          badge: null },
  { href: 'https://nabdhomenursing.blogspot.com/', label: 'المدونة', badge: null, isExternal: true },
  { href: '/contact',        label: 'تواصل معنا',            badge: null },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { settings, getCallUrl, getWhatsAppUrl } = useSettings()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
      {/* ── Floating Header ── */}
      <header
        className="sticky top-2 z-50 w-full transition-all duration-300 px-3 sm:px-6 no-print pt-2"
        role="banner"
      >
        <div
          className={`max-w-7xl mx-auto rounded-2xl sm:rounded-full transition-all duration-300 ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-md shadow-[0_12px_40px_rgba(11,27,61,0.15)] border border-slate-200/90 py-2 sm:py-2.5 px-4 sm:px-6'
              : 'bg-white/95 backdrop-blur-sm shadow-[0_6px_25px_rgba(11,27,61,0.08)] border border-slate-100 py-3 sm:py-3.5 px-4 sm:px-6'
          }`}
        >
          <div className="flex items-center justify-between">

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label={`${siteConfig.brand.name} — الصفحة الرئيسية`}
              title="نبض — التمريض المنزلي"
              onClick={closeMenu}
            >
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-md shrink-0 border-2 border-gold-400/80 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.jpg"
                  alt={siteConfig.brand.logoAlt}
                  fill
                  className="object-contain"
                  priority
                  sizes="44px"
                />
              </div>
              <div className="hidden sm:flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black text-navy-900 leading-none group-hover:text-gold-600 transition-colors">
                    نبض
                  </span>
                  <span className="badge-navy text-[10px] py-0 px-2 rounded-full font-bold">
                    24/7
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 leading-tight">
                  التمريض المنزلي
                </span>
              </div>
            </Link>

            {/* ── Desktop Navigation Links ── */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="القائمة الرئيسية">
              {navLinks.map((link) =>
                link.isExternal ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs xl:text-sm font-bold text-slate-700 hover:text-navy-900 hover:bg-slate-100/80 px-3 py-2 rounded-full transition-all inline-flex items-center gap-1"
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-slate-400">↗</span>
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs xl:text-sm font-bold text-slate-700 hover:text-navy-900 hover:bg-slate-100/80 px-3 py-2 rounded-full transition-all inline-flex items-center gap-1"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="bg-gold-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
            </nav>

            {/* ── Desktop Action Buttons ── */}
            <div className="hidden lg:flex items-center gap-2.5">
              <a
                href={getCallUrl()}
                className="inline-flex items-center gap-1.5 text-xs xl:text-sm font-extrabold text-navy-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-full transition-all border border-slate-200"
                onClick={() => analytics.clickCall('header')}
              >
                <PhoneIcon className="w-4 h-4 text-gold-600" />
                <span dir="ltr">{settings.phone}</span>
              </a>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs xl:text-sm font-black text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                onClick={() => analytics.clickWhatsApp('header')}
              >
                <span>احجز عبر واتساب</span>
                <span className="text-xs">💬</span>
              </a>
            </div>

            {/* ── Mobile Action Icons ── */}
            <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
              <a
                href={getCallUrl()}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold-50 text-gold-600 border border-gold-200 shadow-xs"
                aria-label="اتصل بنا"
                onClick={() => analytics.clickCall('header_mobile')}
              >
                <PhoneIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-navy-800 border border-slate-200 shadow-xs"
                aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ── */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm lg:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          <nav
            id="mobile-menu"
            className="fixed top-0 end-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col transition-transform"
            aria-label="القائمة الرئيسية المتنقلة"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-400">
                  <Image src="/logo.jpg" alt={siteConfig.brand.logoAlt} fill className="object-contain" sizes="40px" />
                </div>
                <div>
                  <p className="text-sm font-black text-navy-900">نبض — التمريض المنزلي</p>
                  <p className="text-xs text-slate-500">رعاية متميزة في منزلك</p>
                </div>
              </Link>
              <button
                onClick={closeMenu}
                className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="p-4 flex flex-col gap-1 overflow-y-auto flex-1">
              {navLinks.map((link) =>
                link.isExternal ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <span>{link.label}</span>
                    <span className="text-xs text-slate-400">↗</span>
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              )}
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col gap-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="btn-whatsapp w-full justify-center text-sm py-3"
              >
                💬 احجز عبر واتساب الآن
              </a>
              <a
                href={getCallUrl()}
                className="btn-call w-full justify-center text-sm py-3"
              >
                📞 اتصل بنا مباشرةً
              </a>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
