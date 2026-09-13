'use client';

/**
 * app/blood-bank/page.tsx
 * Main Dashboard supporting Logged-Out and Logged-In states.
 */

import { useState } from 'react';
import Link from 'next/link';
import { User, MapPin } from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';
import TopBar from '@/components/blood-bank/TopBar';
import StatCard from '@/components/blood-bank/StatCard';
import InfoCarousel from '@/components/blood-bank/InfoCarousel';
import ProfileIncompleteCard from '@/components/blood-bank/ProfileIncompleteCard';
import BloodRequestCTA from '@/components/blood-bank/BloodRequestCTA';
import GpsPermissionModal from '@/components/blood-bank/modals/GpsPermissionModal';
import LoginModal from '@/components/blood-bank/modals/LoginModal';

export default function BloodBankHomePage() {
  const { isLoggedIn, profileComplete, locationPermission } = useDonorStore();
  const [showGpsModal, setShowGpsModal] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-full" dir="rtl">
      {/* ─────────────────────────────────────────────────────────────
          STATE A: LOGGED-OUT
         ───────────────────────────────────────────────────────────── */}
      {!isLoggedIn ? (
        <div className="p-4 space-y-5">
          {/* Top Banner */}
          <div className="bg-[#FDECEC] border border-[#FADBD8] rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C0392B]/15 text-[#C0392B] flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-800">
                سجل دخولك للاستفادة بكل المزايا
              </span>
            </div>

            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-[#E8DEF8] hover:bg-[#D7C7F4] text-gray-900 text-xs font-extrabold px-3 py-1.5 rounded-full transition-colors active:scale-95 shrink-0"
            >
              سجل دخولك
            </button>
          </div>

          {/* Two Stat Cards side-by-side */}
          <div className="flex items-center gap-3">
            <StatCard label="أرواح أنقذت" value={0} variant="green" />
            <StatCard label="متبرع قريب" value={0} variant="red" />
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between pt-2">
            <h2 className="text-base font-black text-gray-900">طلبات قريبة</h2>
            <Link
              href="/blood-bank/request"
              className="text-xs font-bold text-[#C0392B] hover:underline"
            >
              عرض الكل
            </Link>
          </div>

          {/* Empty State */}
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-[#FDECEC] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#C0392B] shadow-xs">
                <MapPin className="w-8 h-8 stroke-[2.2]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black text-gray-900">لا توجد طلبات قريبة حالياً</p>
              <p className="text-xs text-gray-400 font-medium">لا توجد طلبات قريبة حالياً</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <BloodRequestCTA />
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            STATE B: LOGGED-IN
           ───────────────────────────────────────────────────────────── */
        <div className="space-y-4">
          <TopBar />

          <div className="p-4 space-y-4">
            {/* Info Carousel */}
            <InfoCarousel />

            {/* Incomplete Profile Alert Card */}
            {!profileComplete && <ProfileIncompleteCard />}

            {/* Stats Row & Blood Request CTA */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <StatCard label="أرواح أنقذت" value={0} variant="green" />
                <StatCard label="متبرع قريب" value={3} variant="red" />
              </div>

              {/* Big Request Blood CTA Button */}
              <BloodRequestCTA />
            </div>

            {/* Nearby Requests Header & Empty State */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-gray-900">طلبات قريبة منك</h2>
                <Link
                  href="/blood-bank/request"
                  className="text-xs font-bold text-[#C0392B] hover:underline"
                >
                  عرض الكل
                </Link>
              </div>

              <div className="bg-[#FFF5F5] border border-dashed border-[#FADBD8] rounded-2xl p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white text-[#C0392B] flex items-center justify-center mx-auto shadow-xs">
                  <MapPin className="w-6 h-6 stroke-[2.2]" />
                </div>
                <p className="text-xs font-bold text-gray-800">لا توجد طلبات قريبة مطابقة لفصيلتك الآن</p>
                <p className="text-[11px] text-gray-500">سنرسل لك إشعاراً فور ورود أي طلب عاجل في دمياط</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GPS Permission Modal (appears if location is not granted yet) */}
      {isLoggedIn && locationPermission !== 'granted' && (
        <GpsPermissionModal
          isOpen={showGpsModal}
          onClose={() => setShowGpsModal(false)}
        />
      )}

      {/* In-place Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
