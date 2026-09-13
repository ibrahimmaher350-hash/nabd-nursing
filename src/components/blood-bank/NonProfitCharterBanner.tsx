'use client';

/**
 * components/blood-bank/NonProfitCharterBanner.tsx
 * Prominent banner emphasizing that blood donation through Nabd is 100% free and non-profit,
 * protecting citizens from commercial exploitation with a direct report button.
 */

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import ReportFraudModal from './modals/ReportFraudModal';

export default function NonProfitCharterBanner() {
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#07132B] via-[#0D1F44] to-[#07132B] text-white p-3.5 border border-amber-400/30 shadow-md"
        dir="rtl"
      >
        {/* Subtle decorative gold glow */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-300 tracking-wide">
                  ميثاق نبض الأخلاقي غير الربحي
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  تطوعي مجاني 100%
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                التبرع بالدم عمل إنساني لوجه الله. يُحظر تماماً بيع أو شراء الدم أو طلب أي مقابل مادي أو سمسرة.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
            <span>إبلاغ عن طلب أموال أو سمسرة</span>
          </button>
        </div>
      </div>

      <ReportFraudModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </>
  );
}
