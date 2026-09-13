'use client';

/**
 * app/blood-bank/banks/page.tsx
 * Nearby blood banks page with instant client-side search and distance sorting.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { bloodBanks as defaultMockBanks } from '@/lib/blood-bank/mockData';
import { BloodBank } from '@/lib/blood-bank/types';
import { getBloodBanks } from '@/lib/blood-bank/supabaseService';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';
import BloodBankCard from '@/components/blood-bank/BloodBankCard';
import TopBar from '@/components/blood-bank/TopBar';

export default function NearbyBanksPage() {
  const { bloodType } = useDonorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [banksList, setBanksList] = useState<BloodBank[]>(defaultMockBanks);

  useEffect(() => {
    getBloodBanks().then((data) => {
      if (data && data.length > 0) {
        setBanksList(data);
      }
    });
  }, []);

  // Filter and sort blood banks ascending by distance
  const filteredBanks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = query
      ? banksList.filter(
          (bank) =>
            bank.name.toLowerCase().includes(query) ||
            bank.address.toLowerCase().includes(query)
        )
      : [...banksList];

    return list.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [searchQuery, banksList]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50" dir="rtl">
      {/* Top Header with Back Affordance */}
      <TopBar title="بنوك ومراكز الدم الإقليمية" subtitle="المراكز الرسمية المعتمدة بدمياط والدلتا" showBack backHref="/blood-bank" />

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو المنطقة..."
            className="w-full pl-4 pr-11 py-3 bg-white rounded-2xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#C0392B]/25 focus:border-[#C0392B]"
          />
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
            >
              مسح
            </button>
          )}
        </div>

        {/* Info Banner 1 (Blue) */}
        <div className="bg-[#EBF3FF] border border-[#2D6CDF]/20 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#2D6CDF]/15 text-[#2D6CDF] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#1E429F] font-bold leading-relaxed">
            تلقائياً حسب موقعك، تظهر الأماكن الأقرب إليك فقط
          </p>
        </div>

        {/* Info Banner 2 (Pink) */}
        <div className="bg-[#FDECEC] border border-[#C0392B]/20 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#C0392B]/15 text-[#C0392B] flex items-center justify-center shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <p className="text-xs text-[#991B1B] font-bold leading-relaxed">
            إذا كنت تبحث عن مكان محدد، اكتب اسمه في البحث
          </p>
        </div>

        {/* Bank Cards List */}
        <div className="space-y-3 pt-1">
          {filteredBanks.length > 0 ? (
            filteredBanks.map((bank) => (
              <BloodBankCard
                key={bank.id}
                bank={bank}
                userBloodType={bloodType}
              />
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-800 mb-1">لا توجد نتائج مطابقة</h4>
              <p className="text-xs text-gray-500">جرب البحث بكلمات أخرى أو مسح نص البحث</p>
            </div>
          )}
        </div>

        {/* Bottom Back Button */}
        <div className="text-center pt-3 pb-6">
          <Link
            href="/blood-bank"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
          >
            <span>← الرجوع لرئيسية بنك الدم</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
