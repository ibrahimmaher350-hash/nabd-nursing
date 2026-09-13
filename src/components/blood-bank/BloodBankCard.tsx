'use client';

/**
 * components/blood-bank/BloodBankCard.tsx
 * Card component displaying blood bank info, distance, and user blood type availability.
 */

import { BloodBank, BloodType } from '@/lib/blood-bank/types';
import { formatDistance } from '@/lib/blood-bank/mockData';
import { Plus } from 'lucide-react';

interface BloodBankCardProps {
  bank: BloodBank;
  userBloodType?: BloodType;
}

export default function BloodBankCard({ bank, userBloodType = 'A+' }: BloodBankCardProps) {
  const isAvailable = bank.availableTypes.includes(userBloodType);

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden transition-all hover:shadow-sm"
      dir="rtl"
    >
      <div className="p-4 space-y-2">
        {/* Top Row: Icon + Distance */}
        <div className="flex items-center justify-between">
          {/* Right side: Circular dashed badge with red hospital plus icon */}
          <div className="w-10 h-10 rounded-full border border-dashed border-[#C0392B]/50 flex items-center justify-center p-0.5">
            <div className="w-7 h-7 rounded-lg bg-[#C0392B] text-white flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
          </div>

          {/* Left side: Distance */}
          <span className="text-xs font-bold text-gray-500" dir="ltr">
            {formatDistance(bank.distanceKm)}
          </span>
        </div>

        {/* Bank Name */}
        <h3 className="text-sm font-black text-gray-900 leading-snug">
          {bank.name}
        </h3>

        {/* Address */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {bank.address}
        </p>
      </div>

      {/* Footer Strip */}
      <div
        className={`px-4 py-2 border-t text-xs font-bold flex items-center justify-between ${
          isAvailable
            ? 'bg-[#E8F8F0] border-[#27AE60]/20 text-[#27AE60]'
            : 'bg-[#FDECEC] border-[#FADBD8] text-[#C0392B]'
        }`}
      >
        <span>
          {isAvailable
            ? `فصيلتك (${userBloodType}) متوفرة ✓`
            : `فصيلتك (${userBloodType}) غير متوفرة حالياً`}
        </span>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bank.name + ' ' + bank.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] underline opacity-80 hover:opacity-100"
        >
          الاتجاهات ↗
        </a>
      </div>
    </div>
  );
}
