'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CurrencyDollarIcon,
  ClockIcon,
  BellAlertIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'

const tabs = [
  { name: 'تسعير الزيارات', href: '/app/settings', icon: CurrencyDollarIcon },
  { name: 'ساعات وشفتات العمل', href: '/app/settings/hours', icon: ClockIcon },
  { name: 'تذكير الواتساب', href: '/app/settings/reminder', icon: BellAlertIcon },
  { name: 'قوالب الروشتات', href: '/app/settings/prescription', icon: DocumentTextIcon },
  { name: 'رسائل وقوالب التواصل', href: '/app/settings/templates', icon: ChatBubbleLeftRightIcon },
  { name: 'سجل العمليات والأمان', href: '/app/settings/log', icon: ShieldCheckIcon },
]

export default function SettingsNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/app/settings') {
      return pathname === '/app/settings'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-hide">
      {tabs.map((tab) => {
        const active = isActive(tab.href)
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              active
                ? 'bg-gold-500 text-navy-950 font-black shadow-xs'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
