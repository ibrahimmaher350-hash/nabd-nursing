'use client';

/**
 * components/blood-bank/modals/ReportFraudModal.tsx
 * Ethical safety modal to report commercial exploitation, brokers, or fee demands.
 */

import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';

interface ReportFraudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportFraudModal({ isOpen, onClose }: ReportFraudModalProps) {
  const [suspectNumber, setSuspectNumber] = useState('');
  const [reason, setReason] = useState('طلب مقابل مادي / أموال للتبرع');
  const [details, setDetails] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);

    const whatsappMessage = `⚠️ *بلاغ عاجل عن مخالفة في بنك الدم نبض*%0A%0A📱 *رقم المخالف:* ${encodeURIComponent(
      suspectNumber || 'غير محدد'
    )}%0A📌 *نوع المخالفة:* ${encodeURIComponent(reason)}%0A📝 *التفاصيل:* ${encodeURIComponent(
      details || 'لا توجد'
    )}%0A%0Aيرجى التحقق الفوري وحظر هذا الرقم حماية للمرضى.`;

    setTimeout(() => {
      window.open(`https://wa.me/201099667065?text=${whatsappMessage}`, '_blank');
      setIsSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-red-100 overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 text-[#C0392B] flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-gray-900">
              إبلاغ عن ابتزاز أو طلب مقابل مادي
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {isSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-gray-900">تم تسجيل البلاغ بنجاح</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              جارٍ تحويل البلاغ لإدارة الرقابة في نبض لمتابعة الرقم وحظره لحماية أهالينا.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-3 space-y-3">
            {/* Warning Banner */}
            <div className="bg-[#FFF5F5] border border-red-200 rounded-2xl p-3 flex items-start gap-2 text-xs text-red-800 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                <strong>التبرع بالدم مجاني 100% وإنساني لوجه الله.</strong> يمنع قانوناً وأخلاقياً بيع أو شراء الدم أو أخذ أي وساطة مالية.
              </span>
            </div>

            {/* Suspect number */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">
                رقم هاتف الشخص المشبوه أو المخالف
              </label>
              <input
                type="tel"
                required
                dir="ltr"
                value={suspectNumber}
                onChange={(e) => setSuspectNumber(e.target.value)}
                placeholder="010xxxxxxxx"
                className="w-full text-xs p-3 bg-gray-50 rounded-xl border border-gray-200 text-left outline-none focus:border-[#C0392B]"
              />
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">نوع المخالفة</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-800 outline-none focus:border-[#C0392B]"
              >
                <option value="طلب مقابل مادي / أموال للتبرع">طلب مقابل مادي / أموال للتبرع</option>
                <option value="سمسار أو وسيط تجاري">سمسار أو وسيط تجاري</option>
                <option value="بيانات وهمية أو غير صحيحة">بيانات وهمية أو غير صحيحة</option>
                <option value="إزعاج أو مضايقات">إزعاج أو مضايقات</option>
              </select>
            </div>

            {/* Details */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">تفاصيل أخرى (اختياري)</label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="اكتب ما حدث بدقة لنتخذ الإجراء الفوري..."
                className="w-full text-xs p-2.5 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-[#C0392B] resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-black rounded-xl shadow-sm transition-all active:scale-95"
              >
                إرسال البلاغ وحظر المخالف
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
