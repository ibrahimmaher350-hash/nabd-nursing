'use client';

/**
 * components/blood-bank/ProfileIncompleteCard.tsx
 * Card displayed to prompt the user to complete their donor profile.
 */

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfileIncompleteCard() {
  return (
    <div
      className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm space-y-2.5"
      dir="rtl"
    >
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#C0392B] animate-pulse" />
        <h3 className="text-sm font-extrabold text-[#C0392B]">ملفك غير مكتمل!</h3>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">
        أكمل بيانات التبرع ليظهر لك المتبرعين القريبين
      </p>
      <Link
        href="/blood-bank/onboarding"
        className="w-full bg-gradient-to-r from-[#C0392B] to-[#A93226] hover:from-[#A93226] hover:to-[#922B21] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
      >
        <span>أكمل بياناتك الآن</span>
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  );
}
