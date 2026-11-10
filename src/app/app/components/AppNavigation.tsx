'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  IdentificationIcon,
  ArrowTopRightOnSquareIcon,
  PlusIcon,
  ShieldCheckIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  {
    name: 'تسجيل المريض',
    href: '/app/intake',
    icon: ClipboardDocumentCheckIcon,
    badge: 'سريع',
  },
  {
    name: 'ملفات المرضى',
    href: '/app/patients',
    icon: UserGroupIcon,
    badge: null,
  },
  {
    name: 'المواعيد والتقويم',
    href: '/app/appointments',
    icon: CalendarDaysIcon,
    badge: 'Google',
  },
  {
    name: 'الحسابات واليومية',
    href: '/app/accounts',
    icon: BanknotesIcon,
    badge: null,
  },
  {
    name: 'الملف المهني',
    href: '/app/profile',
    icon: IdentificationIcon,
    badge: null,
  },
  {
    name: 'الإعدادات',
    href: '/app/settings',
    icon: Cog6ToothIcon,
    badge: null,
  },
]

export default function AppNavigation() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/app/settings') {
      return pathname.startsWith('/app/settings')
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* ── Desktop Sidebar (md+) ── */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-navy-950 border-e border-slate-800 p-4 shrink-0 h-screen sticky top-0 justify-between">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-3 mb-4 border-b border-slate-800/80">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-400 shrink-0 shadow-md">
              <Image src="/logo.jpg" alt="نبض" fill className="object-cover" sizes="40px" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-base tracking-tight">نبض</span>
                <span className="bg-gold-500/20 text-gold-400 border border-gold-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  إدارة العيادة
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">التمريض المنزلي · مركز دمياط</p>
            </div>
          </div>

          {/* Quick Intake CTA */}
          <Link
            href="/app/intake"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 mb-5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-black shadow-md transition-all active:scale-[0.98]"
          >
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>تسجيل كشف / مريض جديد</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1" aria-label="قائمة النظام">
            {navItems.map((item) => {
              const active = isActive(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-slate-800 text-gold-400 border border-slate-700/80 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${active ? 'text-gold-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        item.badge === 'Google'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Status & Links */}
        <div className="border-t border-slate-800 pt-3 flex flex-col gap-2">
          <a
            href="https://calendar.google.com/calendar/u/1/r"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-850 transition"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>تقويم Google Calendar</span>
            </div>
            <ArrowTopRightOnSquareIcon className="w-3 h-3 text-slate-500" />
          </a>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-850 transition"
          >
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>موقع نبض الرئيسي</span>
            </div>
            <ArrowTopRightOnSquareIcon className="w-3 h-3 text-slate-500" />
          </Link>

          <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-slate-500">
            <span>نظام نبض v2.0</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              متصل 24/7
            </span>
          </div>
        </div>
      </aside>

      {/* ── Mobile Top Header (xs-sm) ── */}
      <header className="md:hidden sticky top-0 z-40 bg-navy-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold-400 shrink-0">
            <Image src="/logo.jpg" alt="نبض" fill className="object-cover" sizes="32px" />
          </div>
          <div>
            <span className="font-black text-white text-sm">نبض · إدارة العيادة</span>
            <p className="text-[10px] text-slate-400">مركز وبندر دمياط</p>
          </div>
        </div>
        <Link
          href="/app/intake"
          className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black px-2.5 py-1.5 rounded-lg shadow-sm"
        >
          <PlusIcon className="w-3.5 h-3.5 stroke-[3]" />
          <span>كشف جديد</span>
        </Link>
      </header>

      {/* ── Mobile Bottom Navigation Bar (xs-sm) ── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-navy-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl"
        aria-label="شريط التنقل السفلي"
      >
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                active ? 'text-gold-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-gold-400 stroke-2' : 'text-slate-400'}`} />
              <span className={`text-[10px] mt-0.5 ${active ? 'font-black' : 'font-semibold'}`}>
                {item.name.replace('ملفات ', '').replace(' والمواعيد', '').replace(' واليومية', '')}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
