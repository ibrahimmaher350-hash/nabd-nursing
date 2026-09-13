'use client';

/**
 * components/blood-bank/BottomNav.tsx
 * Fixed bottom navigation bar for blood bank module (RTL: right to left)
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, PlusSquare, ClipboardList, User } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  hasBadge?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'الرئيسية', href: '/blood-bank', icon: Home },
  { id: 'notifications', label: 'الإشعارات', href: '/blood-bank#notifications', icon: Bell, hasBadge: true },
  { id: 'banks', label: 'بنوك الدم', href: '/blood-bank/banks', icon: PlusSquare },
  { id: 'requests', label: 'الطلبات', href: '/blood-bank/request', icon: ClipboardList },
  { id: 'profile', label: 'حسابي', href: '/blood-bank/profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/blood-bank') {
      return pathname === '/blood-bank';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      dir="rtl"
      aria-label="شريط التنقل السفلي"
    >
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className="relative flex flex-col items-center justify-center p-1.5 transition-transform active:scale-95 group"
              aria-label={item.label}
            >
              <div
                className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                  active
                    ? 'w-12 h-8 bg-[#E8DEF8] text-[#1F2937]'
                    : 'w-10 h-8 text-gray-500 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.hasBadge && (
                  <span className="absolute top-1 end-2 w-2 h-2 rounded-full bg-[#C0392B] ring-2 ring-white" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
