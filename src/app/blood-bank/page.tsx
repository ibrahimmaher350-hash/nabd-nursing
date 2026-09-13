'use client';

/**
 * app/blood-bank/page.tsx
 * Main Dashboard supporting Logged-Out and Logged-In states,
 * fully integrated with Nabd identity, non-profit ethical charter,
 * blood compatibility calculator, and Supabase live requests.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MapPin, ChevronLeft } from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';
import { getBloodRequests } from '@/lib/blood-bank/supabaseService';
import { BloodRequest } from '@/lib/blood-bank/types';
import TopBar from '@/components/blood-bank/TopBar';
import StatCard from '@/components/blood-bank/StatCard';
import InfoCarousel from '@/components/blood-bank/InfoCarousel';
import ProfileIncompleteCard from '@/components/blood-bank/ProfileIncompleteCard';
import BloodRequestCTA from '@/components/blood-bank/BloodRequestCTA';
import NonProfitCharterBanner from '@/components/blood-bank/NonProfitCharterBanner';
import BloodCompatibilityCalculator from '@/components/blood-bank/BloodCompatibilityCalculator';
import GpsPermissionModal from '@/components/blood-bank/modals/GpsPermissionModal';
import LoginModal from '@/components/blood-bank/modals/LoginModal';

export default function BloodBankHomePage() {
  const { isLoggedIn, profileComplete, locationPermission, bloodType } = useDonorStore();
  const [showGpsModal, setShowGpsModal] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [recentRequests, setRecentRequests] = useState<BloodRequest[]>([]);

  // Fetch live requests from Supabase
  useEffect(() => {
    getBloodRequests().then((reqs) => {
      if (reqs && reqs.length > 0) {
        setRecentRequests(reqs);
      }
    });
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-slate-50" dir="rtl">
      {/* Top Bar with Nabd Identity & Universal Back to Nabd Home */}
      <TopBar />

      <div className="p-4 space-y-4">
        {/* Non-Profit Ethical Charter Banner */}
        <NonProfitCharterBanner />

        {/* ─────────────────────────────────────────────────────────────
            STATE A: LOGGED-OUT
           ───────────────────────────────────────────────────────────── */}
        {!isLoggedIn ? (
          <div className="space-y-4">
            {/* Login Prompt Banner */}
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
                className="bg-[#E8DEF8] hover:bg-[#D7C7F4] text-gray-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full transition-colors active:scale-95 shrink-0"
              >
                سجل دخولك
              </button>
            </div>

            {/* Two Stat Cards side-by-side */}
            <div className="flex items-center gap-3">
              <StatCard label="أرواح أنقذت" value={0} variant="green" />
              <StatCard label="متبرع قريب" value={0} variant="red" />
            </div>

            {/* Blood Compatibility Calculator */}
            <BloodCompatibilityCalculator initialType="A+" />

            {/* Section Header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black text-gray-900">طلبات قريبة</h2>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </div>
              <Link
                href="/blood-bank/request"
                className="text-xs font-bold text-[#C0392B] hover:underline"
              >
                طلب تبرع عاجل +
              </Link>
            </div>

            {/* Recent Requests or Empty State */}
            {recentRequests.length > 0 ? (
              <div className="space-y-2.5">
                {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#C0392B] text-white flex items-center justify-center font-black text-sm">
                        {req.bloodType}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{req.requesterName}</h4>
                        <p className="text-[11px] text-gray-500">حالة عاجلة في دمياط</p>
                      </div>
                    </div>
                    <Link
                      href="/blood-bank/request"
                      className="text-xs font-bold text-[#C0392B] bg-red-50 px-3 py-1.5 rounded-xl border border-red-100"
                    >
                      استجابة
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="py-8 bg-white rounded-2xl border border-gray-200/90 flex flex-col items-center justify-center text-center space-y-2.5 p-4">
                <div className="w-16 h-16 rounded-full bg-[#FDECEC] flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C0392B] shadow-xs">
                    <MapPin className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-gray-900">لا توجد طلبات قريبة حالياً</p>
                  <p className="text-xs text-gray-400 font-medium">كن أول من ينقذ حياة وسجل كمتبرع طوعي معتمد</p>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-1">
              <BloodRequestCTA />
            </div>
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
              STATE B: LOGGED-IN
             ───────────────────────────────────────────────────────────── */
          <div className="space-y-4">
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

            {/* Blood Compatibility Calculator for User's Blood Type */}
            <BloodCompatibilityCalculator initialType={bloodType} />

            {/* Nearby Requests Header & Live List */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-black text-gray-900">طلبات قريبة منك</h2>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <Link
                  href="/blood-bank/request"
                  className="text-xs font-bold text-[#C0392B] hover:underline"
                >
                  طلب دم جديد +
                </Link>
              </div>

              {recentRequests.length > 0 ? (
                <div className="space-y-2.5">
                  {recentRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#C0392B] text-white flex items-center justify-center font-black text-sm shadow-xs">
                          {req.bloodType}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">{req.requesterName}</h4>
                          <p className="text-[11px] text-gray-500">حالة عاجلة في محيطك</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-red-100 text-red-700">
                        عاجل
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#FFF5F5] border border-dashed border-[#FADBD8] rounded-2xl p-6 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white text-[#C0392B] flex items-center justify-center mx-auto shadow-xs">
                    <MapPin className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <p className="text-xs font-bold text-gray-800">لا توجد طلبات قريبة مطابقة لفصيلتك الآن</p>
                  <p className="text-[11px] text-gray-500">سنرسل لك إشعاراً فور ورود أي طلب عاجل في دمياط</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Return to Nabd Nursing Footer Pill */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all"
          >
            <span>العودة لموقع نبض الرئيسي 🩺</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* GPS Permission Modal */}
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
