'use client';

/**
 * components/blood-bank/modals/QuickActionGrid.tsx
 * 2-column grid of 6 quick action cards on the profile page.
 */

import Link from 'next/link';
import { Pencil, ClipboardList, MapPin, User, MessageCircle } from 'lucide-react';

interface ActionItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  action?: () => void;
}

export default function QuickActionGrid() {
  const actions: ActionItem[] = [
    {
      id: 'history',
      label: 'سجل التبرعات',
      href: '/blood-bank#history',
      icon: Pencil,
      iconColor: 'text-[#27AE60]',
      bgColor: 'bg-[#E8F8F0]',
    },
    {
      id: 'my-requests',
      label: 'طلباتي',
      href: '/blood-bank/request',
      icon: ClipboardList,
      iconColor: 'text-[#C0392B]',
      bgColor: 'bg-[#FDECEC]',
    },
    {
      id: 'donation-data',
      label: 'بيانات التبرع',
      href: '/blood-bank/onboarding',
      icon: MapPin,
      iconColor: 'text-[#F39C12]',
      bgColor: 'bg-[#FEF9E7]',
    },
    {
      id: 'basic-data',
      label: 'بيانات أساسية',
      href: '/blood-bank/profile#edit',
      icon: User,
      iconColor: 'text-[#2D6CDF]',
      bgColor: 'bg-[#EBF5FB]',
    },
    {
      id: 'account-settings',
      label: 'إعدادات الحساب',
      href: 'https://wa.me/201099667065?text=%D8%A5%D8%B9%D8%AF%D8%A7%D8%AF%D8%A7%D8%AA%20%D8%AD%D8%B3%D8%A7%D8%A8%20%D8%A8%D9%86%D9%83%20%D8%A7%D9%84%D8%AF%D9%85',
      icon: MessageCircle,
      iconColor: 'text-[#64748B]',
      bgColor: 'bg-[#F1F5F9]',
    },
    {
      id: 'update-location',
      label: 'تحديث الموقع',
      href: '/blood-bank/onboarding?step=4',
      icon: MapPin,
      iconColor: 'text-[#8E44AD]',
      bgColor: 'bg-[#F4ECF7]',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3" dir="rtl">
      {actions.map((act) => {
        const Icon = act.icon;
        const CardContent = (
          <div className="bg-white rounded-2xl border border-gray-200/90 p-4 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-sm transition-all active:scale-[0.98] cursor-pointer group">
            <div
              className={`w-11 h-11 rounded-2xl ${act.bgColor} ${act.iconColor} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xs font-bold text-gray-800 group-hover:text-[#C0392B] transition-colors">
              {act.label}
            </span>
          </div>
        );

        if (act.href?.startsWith('http')) {
          return (
            <a key={act.id} href={act.href} target="_blank" rel="noopener noreferrer">
              {CardContent}
            </a>
          );
        }

        return (
          <Link key={act.id} href={act.href || '#'}>
            {CardContent}
          </Link>
        );
      })}
    </div>
  );
}
