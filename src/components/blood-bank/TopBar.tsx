'use client';

/**
 * components/blood-bank/TopBar.tsx
 * Reusable top bar for blood bank module.
 * Supports greeting mode (with avatar & username) or sub-page title mode (with back button).
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MessageSquare, ChevronRight, User } from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function TopBar({ title, showBack, onBack, rightAction }: TopBarProps) {
  const router = useRouter();
  const { donor, isLoggedIn } = useDonorStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Sub-page with title mode
  if (title) {
    return (
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3.5" dir="rtl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={handleBack}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors active:scale-95"
                aria-label="رجوع"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-base font-bold text-gray-900">{title}</h1>
          </div>
          {rightAction && <div>{rightAction}</div>}
        </div>
      </header>
    );
  }

  // Dashboard top bar mode (Greeting, avatar, search, message)
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-3" dir="rtl">
      <div className="flex items-center justify-between">
        {/* Right side (Avatar + Greeting) */}
        <Link href="/blood-bank/profile" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-full bg-gray-200 border-2 border-[#C0392B] flex items-center justify-center text-gray-500 overflow-hidden shrink-0 shadow-sm">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div className="text-start">
            <p className="text-xs text-gray-500 font-medium leading-none mb-1">أهلاً بك مجدداً 👋</p>
            <p className="text-sm font-extrabold text-gray-900 leading-none group-hover:text-[#C0392B] transition-colors">
              {isLoggedIn && donor?.username ? donor.username : 'زائر نبض'}
            </p>
          </div>
        </Link>

        {/* Left side (Action Icons) */}
        <div className="flex items-center gap-2">
          <Link
            href="/blood-bank/banks"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors active:scale-95"
            aria-label="البحث عن بنوك الدم"
          >
            <Search className="w-4 h-4 text-gray-700" />
          </Link>
          <a
            href="https://wa.me/201099667065?text=%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A8%D9%86%D9%83%20%D8%A7%D9%84%D8%AF%D9%85%20%D9%86%D8%A8%D8%B6"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors active:scale-95"
            aria-label="مراسلة الدعم"
          >
            <MessageSquare className="w-4 h-4 text-gray-700" />
          </a>
        </div>
      </div>
    </header>
  );
}
