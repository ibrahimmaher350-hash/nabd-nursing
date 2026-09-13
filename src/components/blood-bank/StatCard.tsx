'use client';

/**
 * components/blood-bank/StatCard.tsx
 * Stat display card on soft-pink rounded container
 */

import { MapPin } from 'lucide-react';
import { toArabicDigits } from '@/lib/blood-bank/mockData';

interface StatCardProps {
  label: string;
  value: number | string;
  variant?: 'green' | 'red';
  icon?: React.ElementType;
}

export default function StatCard({
  label,
  value,
  variant = 'red',
  icon: IconComponent = MapPin,
}: StatCardProps) {
  const isGreen = variant === 'green';

  return (
    <div
      className="flex-1 bg-[#FDECEC] border border-[#FADBD8] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs"
      dir="rtl"
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${
          isGreen ? 'bg-[#27AE60]/15 text-[#27AE60]' : 'bg-[#C0392B]/15 text-[#C0392B]'
        }`}
      >
        <IconComponent className="w-5 h-5 stroke-[2.2]" />
      </div>
      <span className="text-2xl font-black text-gray-900 leading-none mb-1">
        {typeof value === 'number' ? toArabicDigits(value) : value}
      </span>
      <span className="text-xs font-semibold text-gray-600">{label}</span>
    </div>
  );
}
