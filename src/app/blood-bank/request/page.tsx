'use client';

/**
 * app/blood-bank/request/page.tsx
 * Blood request creation form with patient details, hospital, blood type, and urgency level.
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, AlertCircle, CheckCircle2, Droplet, Building2, User, Hash } from 'lucide-react';
import TopBar from '@/components/blood-bank/TopBar';
import { BloodType } from '@/lib/blood-bank/types';

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodRequestPage() {
  const router = useRouter();

  const [patientName, setPatientName] = useState('');
  const [hospital, setHospital] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>('A+');
  const [bagsCount, setBagsCount] = useState('2');
  const [urgency, setUrgency] = useState<'critical' | 'urgent' | 'normal'>('urgent');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: replace with real API call to submit blood request
    setIsSubmitted(true);
    setTimeout(() => {
      router.push('/blood-bank');
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50" dir="rtl">
      {/* Top Header */}
      <TopBar title="طلب دم عاجل" showBack />

      <div className="p-4 space-y-4">
        {/* Emergency Alert Banner */}
        <div className="bg-[#FDECEC] border border-[#FADBD8] rounded-2xl p-3.5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#C0392B] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-[#C0392B]">تنبيه الحالات الحرجة جداً</p>
            <p className="text-gray-600 leading-relaxed">
              إذا كانت الحالة طارئة جداً تستوجب تدخلاً فورياً، يرجى التوجه لأقرب مركز إقليمي أو التواصل مع طوارئ نبض مباشرة.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#E8F8F0] text-[#27AE60] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-900">تم تسجيل طلب الدم بنجاح!</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              سيتم إشعار المتبرعين القريبين الحاملين لفصيلة ({bloodType}) داخل نطاق المستشفى فوراً. جارٍ التحويل للرئيسية...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs space-y-4">
            {/* Patient Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800">
                اسم المريض أو كود الحالة *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="مثال: محمد أحمد علي"
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
                />
                <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* Hospital */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800">
                المستشفى أو المركز الطبي *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="مثال: مستشفى دمياط التخصصي - الدور الثالث"
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
                />
                <Building2 className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* Blood Type Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800">
                فصيلة الدم المطلوبة *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {bloodTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBloodType(type)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                      bloodType === type
                        ? 'bg-[#C0392B] text-white shadow-xs'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Bags count + Urgency row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  عدد الأكياس *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={bagsCount}
                    onChange={(e) => setBagsCount(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
                  />
                  <Hash className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-800">
                  درجة الإلحاح *
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
                >
                  <option value="critical">حرج جداً (عمليات)</option>
                  <option value="urgent">عاجل (خلال 6 ساعات)</option>
                  <option value="normal">عادي (خلال اليوم)</option>
                </select>
              </div>
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800">
                رقم هاتف للتواصل الفوري *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 text-left focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            {/* Additional notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-800">
                ملاحظات إضافية (اختياري)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تفاصيل أخرى تخص الحالة أو اسم المرافق..."
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20 resize-none"
              />
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#C0392B] hover:bg-[#A93226] text-white font-black text-base rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 pt-3"
            >
              <Droplet className="w-5 h-5 fill-current" />
              <span>نشر طلب التبرع الآن</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
