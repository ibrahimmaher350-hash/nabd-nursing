'use client';

/**
 * components/blood-bank/BloodRequestCTA.tsx
 * Prominent "طلب دم" (Request Blood) call-to-action button
 */

import Link from 'next/link';
import { Droplet } from 'lucide-react';

interface BloodRequestCTAProps {
  className?: string;
}

export default function BloodRequestCTA({ className = '' }: BloodRequestCTAProps) {
  return (
    <Link
      href="/blood-bank/request"
      className={`w-full bg-[#C0392B] hover:bg-[#A93226] text-white font-black text-base py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
      dir="rtl"
    >
      <Droplet className="w-5 h-5 fill-white" />
      <span>طلب دم</span>
    </Link>
  );
}
