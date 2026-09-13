'use client';

/**
 * app/blood-bank/profile/page.tsx
 * Donor profile page with donation toggle, blood type summary, and quick action grid.
 */

import React from 'react';
import { Camera, Droplet, Star, LogOut } from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';
import { toArabicDigits } from '@/lib/blood-bank/mockData';
import TopBar from '@/components/blood-bank/TopBar';
import QuickActionGrid from '@/components/blood-bank/modals/QuickActionGrid';

export default function ProfilePage() {
  const { donor, bloodType, setAvailable, logout } = useDonorStore();

  const isAvailable = donor?.availableToDonate ?? true;
  const username = donor?.username || 'ibrahim_maher';
  const region = donor?.region || 'مصر, محافظة دمياط, CRM7+C52';
  const donationCount = donor?.donationCount ?? 0;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50" dir="rtl">
      {/* Top Bar with title */}
      <TopBar
        title="الملف الشخصي"
        showBack
        rightAction={
          <button
            onClick={logout}
            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            title="تسجيل الخروج"
            aria-label="تسجيل الخروج"
          >
            <LogOut className="w-5 h-5" />
          </button>
        }
      />

      <div className="p-4 space-y-5">
        {/* Profile Header: Avatar, Username, Rating, Badge */}
        <div className="flex flex-col items-center text-center pt-2">
          {/* Circular Avatar with RED ring border and Camera badge */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 border-[3px] border-[#C0392B] flex items-center justify-center text-gray-400 shadow-sm overflow-hidden">
              <svg
                className="w-16 h-16 text-gray-400 fill-current translate-y-2"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            {/* Camera badge at bottom-start */}
            <button
              type="button"
              className="absolute bottom-0 start-0 w-7 h-7 rounded-full bg-[#C0392B] text-white flex items-center justify-center shadow-md ring-2 ring-white hover:bg-[#A93226] transition-transform active:scale-95"
              aria-label="تغيير الصورة الشخصية"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Username */}
          <h2 className="mt-3 text-lg font-black text-gray-900 leading-snug">
            {username}
          </h2>

          {/* Rating Row: "٠,٠" + 5 empty gray stars */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs font-bold text-gray-500">
              {toArabicDigits(0)},{toArabicDigits(0)}
            </span>
            <div className="flex items-center gap-0.5 text-gray-300">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-current text-gray-300" />
              ))}
            </div>
          </div>

          {/* Pill Badge: "٠ تبرعات موثقة" */}
          <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-[#FDECEC] text-[#C0392B] text-xs font-bold border border-[#FADBD8]">
            <Droplet className="w-3.5 h-3.5 fill-current" />
            <span>{toArabicDigits(donationCount)} تبرعات موثقة</span>
          </div>
        </div>

        {/* Card 1: Donation Availability & Blood Info */}
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 space-y-3">
          {/* Row 1: Status + Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold mb-0.5">الحالة الحالية</p>
              <p
                className={`text-sm font-black ${
                  isAvailable ? 'text-[#27AE60]' : 'text-gray-400'
                }`}
              >
                {isAvailable ? 'متاح للتبرع' : 'غير متاح للتبرع حالياً'}
              </p>
            </div>

            {/* Accessible Toggle Switch (Red when ON) */}
            <button
              type="button"
              role="switch"
              aria-checked={isAvailable}
              onClick={() => setAvailable(!isAvailable)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30 ${
                isAvailable ? 'bg-[#C0392B]' : 'bg-gray-300'
              }`}
            >
              <span className="sr-only">تفعيل أو إيقاف التوفر للتبرع</span>
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAvailable ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Row 2: Blood Type & Region */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Blood type */}
            <div>
              <p className="text-xs text-gray-400 font-bold mb-1">فصيلة الدم</p>
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#C0392B] text-white font-black text-sm shadow-xs">
                {bloodType}
              </div>
            </div>

            {/* Region */}
            <div>
              <p className="text-xs text-gray-400 font-bold mb-1">المنطقة</p>
              <p className="text-xs font-bold text-gray-700 leading-snug truncate" title={region}>
                {region}
              </p>
            </div>
          </div>
        </div>

        {/* Section Heading: إجراءات سريعة */}
        <div className="pt-2">
          <h3 className="text-sm font-black text-gray-900 mb-3 text-right">
            إجراءات سريعة
          </h3>

          {/* Quick Action Grid */}
          <QuickActionGrid />
        </div>
      </div>
    </div>
  );
}
