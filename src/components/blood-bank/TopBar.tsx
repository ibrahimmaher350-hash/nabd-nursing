'use client';

/**
 * components/blood-bank/TopBar.tsx
 * Integrated Nabd top bar with brand identity, universal back button,
 * emergency hotline, and seamless link back to Nabd Home.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight, User, Home, ShieldCheck, ArrowRight } from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';
import { siteConfig } from '@/data/siteConfig';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function TopBar({
  title,
  subtitle,
  showBack,
  backHref,
  onBack,
  rightAction,
}: TopBarProps) {
  const router = useRouter();
  const { donor, isLoggedIn } = useDonorStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  // Sub-page mode with explicit title & back button
  if (title) {
    return (
      <header
        className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs"
        dir="rtl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {showBack !== false && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all active:scale-95 text-xs font-bold shadow-2xs"
                aria-label="رجوع"
              >
                <ArrowRight className="w-4 h-4 text-[#C0392B]" />
                <span>رجوع</span>
              </button>
            )}
            <div>
              <h1 className="text-sm font-black text-gray-900 leading-tight flex items-center gap-1.5">
                <span>{title}</span>
              </h1>
              {subtitle && (
                <p className="text-[11px] text-gray-500 font-medium">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {rightAction}
            {/* Quick link back to Blood Bank Home */}
            <Link
              href="/blood-bank"
              className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              title="رئيسية بنك الدم"
              aria-label="رئيسية بنك الدم"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Dashboard top bar mode (Unified with Nabd Identity)
  return (
    <header className="sticky top-0 z-30 bg-[#07132B] text-white border-b border-white/10" dir="rtl">
      {/* 1. Nabd Brand & Emergency Ribbon */}
      <div className="px-4 py-1.5 bg-[#040A1A] border-b border-white/5 flex items-center justify-between text-[11px] text-gray-300">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="font-bold text-amber-400">طوارئ نبض 24/7:</span>
          <a href="tel:01099667065" className="font-extrabold text-white hover:text-amber-300 tracking-wider">
            01099667065
          </a>
        </div>

        {/* Return to main site button */}
        <Link
          href="/"
          className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white transition-colors bg-white/10 hover:bg-white/15 px-2.5 py-0.5 rounded-full"
        >
          <span>موقع نبض 🩺</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Main App Bar with User Greeting & Search */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* User Info / Avatar */}
        <Link href="/blood-bank/profile" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-400/80 flex items-center justify-center text-amber-300 overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-amber-200" />
          </div>
          <div className="text-start">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-gray-300 font-medium">أهلاً بك 👋</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-red-600/80 text-white font-black">
                بنك الدم
              </span>
            </div>
            <p className="text-xs sm:text-sm font-black text-white leading-tight group-hover:text-amber-300 transition-colors">
              {isLoggedIn && donor?.username ? donor.username : 'منقذ نبض المتطوع'}
            </p>
          </div>
        </Link>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <Link
            href="/blood-bank/banks"
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active:scale-95"
            aria-label="البحث عن بنوك الدم"
            title="بنوك الدم"
          >
            <Search className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/201099667065?text=%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A8%D9%86%D9%83%20%D8%A7%D9%84%D8%AF%D9%85%20%D9%86%D8%A8%D8%B6"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs"
            aria-label="تواصل مع المشرف"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>مشرف نبض</span>
          </a>
        </div>
      </div>
    </header>
  );
}
