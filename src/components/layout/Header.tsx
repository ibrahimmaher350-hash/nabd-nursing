'use client'
/**
 * components/layout/Header.tsx — نبض للتمريض المنزلي
 * CareHub-inspired floating island header with 24/7 emergency top bar
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  ShieldCheckIcon,
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
  { href: '/#services',      label: 'خدماتنا 🩺',             badge: null },
  { href: '/reviews',        label: 'آراء المرضى ⭐',         badge: '5.0' },
  { href: '/medical-guide',  label: 'الإسعافات والروشتات 🚑', badge: null },
  { href: 'https://nabd-damietta.blogspot.com', label: 'المدونة ✍️', badge: null, isExternal: true },
  { href: '/contact',        label: 'تواصل معنا',             badge: null },
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
      {/* ── 1. Top Emergency Bar (CareHub Style) ── */}
      <div className="bg-[#07132B] text-white text-xs border-b border-white/10 no-print">
        <div className="section-container">
          <div className="flex items-center justify-between h-9 px-1">
            {/* Right: 24/7 Emergency Phone */}
            <div className="flex items-center gap-3">
              <a
                href={getCallUrl()}
                className="flex items-center gap-1.5 text-gold-300 font-bold hover:text-white transition-colors"
                title="خط الطوارئ والاستجابة الفورية"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-white/80 font-medium hidden sm:inline">طوارئ 24/7:</span>
                <span className="text-xs sm:text-sm tracking-wider font-extrabold text-gold-300">{settings.phone}</span>
              </a>

              <span className="text-white/20 hidden md:inline">|</span>

              <div className="hidden md:flex items-center gap-1.5 text-white/70">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>رعاية معتمدة داخل محافظة دمياط بالكامل</span>
              </div>
            </div>

            {/* Left: Social icons & WhatsApp */}
            <div className="flex items-center gap-3 text-white/70">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-emerald-400 transition-colors text-[11px] font-bold"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="hidden xs:inline">واتساب مباشر</span>
              </a>

              <a
                href="https://www.facebook.com/profile.php?id=61593884400330"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors hidden sm:inline-flex items-center"
                aria-label="فيسبوك"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Announcement Banner if active */}
      {settings.announcementActive && settings.announcement && (
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-teal-950 text-white text-xs font-bold py-2 px-4 text-center border-b border-gold-500/30 flex items-center justify-center gap-2 shadow-sm no-print">
          <span className="text-gold-400 animate-pulse">📢</span>
          <span className="leading-snug">{settings.announcement}</span>
        </div>
      )}

      {/* ── 2. CareHub Floating Pill Header ── */}
      <header
        className={`sticky top-2 z-50 w-full transition-all duration-300 px-3 sm:px-6 no-print`}
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

            {/* ── Logo + Brand Name ── */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
              aria-label={`${siteConfig.brand.name} — الصفحة الرئيسية`}
              title="نبض للتمريض المنزلي"
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
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black text-navy-900 leading-none group-hover:text-gold-600 transition-colors">
                    نبض
                  </span>
                  <span className="badge-navy text-[10px] py-0 px-2 rounded-full font-bold hidden xs:inline-flex">
                    دمياط
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

              <Link
                href="/booking"
                className="inline-flex items-center gap-1.5 text-xs xl:text-sm font-black text-white bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>احجز زيارة الآن</span>
                <span className="text-xs">🩺</span>
              </Link>
            </div>

            {/* ── Mobile Action Icons (Clean & Uncrowded) ── */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={getCallUrl()}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-50 text-gold-600 border border-gold-200 shadow-xs"
                aria-label="اتصل بنا"
                onClick={() => analytics.clickCall('header_mobile')}
              >
                <PhoneIcon className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-navy-800 border border-slate-200 shadow-xs"
                aria-label={isMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
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
            aria-label="القائمة المحمولة"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-400">
                  <Image src="/logo.jpg" alt={siteConfig.brand.logoAlt} fill className="object-contain" sizes="40px" />
                </div>
                <div>
                  <p className="text-sm font-black text-navy-900">نبض للتمريض المنزلي</p>
                  <p className="text-xs text-slate-500">المستشفى في منزلك — دمياط</p>
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
              <Link
                href="/booking"
                onClick={closeMenu}
                className="btn-primary w-full justify-center text-sm py-3"
              >
                احجز ممرض لمنزلك 🩺
              </Link>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center text-sm py-3"
              >
                تواصل عبر واتساب 💬
              </a>
              <a
                href={getCallUrl()}
                className="btn-call w-full justify-center text-sm py-3"
              >
                اتصال هاتفي سريع 📞
              </a>
            </div>
          </nav>
        </>
      )}
    </>
  )
}
