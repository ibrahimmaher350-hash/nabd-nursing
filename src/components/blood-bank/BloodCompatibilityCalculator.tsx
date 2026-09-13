'use client';

/**
 * components/blood-bank/BloodCompatibilityCalculator.tsx
 * Interactive blood type compatibility matrix (who you can give to & who you can receive from).
 * Distinctive and educational feature matching Nabd's medical identity.
 */

import React, { useState } from 'react';
import { BloodType } from '@/lib/blood-bank/types';
import { Droplet, ArrowUpRight, ArrowDownLeft, Sparkles } from 'lucide-react';

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Compatibility rules
const compatibilityData: Record<
  BloodType,
  {
    giveTo: BloodType[];
    receiveFrom: BloodType[];
    badge?: string;
    note: string;
  }
> = {
  'O-': {
    giveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    receiveFrom: ['O-'],
    badge: 'المعطي العام لجميع البشر 🌟',
    note: 'فصيلة ذهبية نادرة يمكنها إنقاذ أي إنسان في الطوارئ دون انتظار نتائج الفحص!',
  },
  'O+': {
    giveTo: ['O+', 'A+', 'B+', 'AB+'],
    receiveFrom: ['O+', 'O-'],
    badge: 'الفصيلة الأكثر احتياجاً 🩸',
    note: 'الفصيلة الأكثر استخداماً وطلباً في غرف العمليات وحوادث الطرق.',
  },
  'A+': {
    giveTo: ['A+', 'AB+'],
    receiveFrom: ['A+', 'A-', 'O+', 'O-'],
    note: 'من أكثر الفصائل شيوعاً وتوفر دعماً هائلاً لمرضى السرطان والعمليات.',
  },
  'A-': {
    giveTo: ['A+', 'A-', 'AB+', 'AB-'],
    receiveFrom: ['A-', 'O-'],
    badge: 'فصيلة حرجة ⚠️',
    note: 'فصيلة مهمة جداً ومطلوبة دائماً للأمهات الحوامل وحالات الولادة.',
  },
  'B+': {
    giveTo: ['B+', 'AB+'],
    receiveFrom: ['B+', 'B-', 'O+', 'O-'],
    note: 'تساهم بقوة في علاج مرضى الثلاسيميا والأنيميا الحادة.',
  },
  'B-': {
    giveTo: ['B+', 'B-', 'AB+', 'AB-'],
    receiveFrom: ['B-', 'O-'],
    badge: 'فصيلة نادرة 💎',
    note: 'نسبة أصحابها أقل من 2% من السكان، وتبرعك بها يعتبر إنقاذاً استثنائياً.',
  },
  'AB+': {
    giveTo: ['AB+'],
    receiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    badge: 'المستقبل العام 🛡️',
    note: 'صاحب هذه الفصيلة يستطيع استقبال الدم من أي متبرع على كوكب الأرض!',
  },
  'AB-': {
    giveTo: ['AB+', 'AB-'],
    receiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    badge: 'أندر فصيلة دم بالعالم 🏆',
    note: 'أندر فصيلة دموية (أقل من 1%)، وبلازما AB- معطي عام لجميع الفصائل.',
  },
};

export default function BloodCompatibilityCalculator({
  initialType = 'A+',
}: {
  initialType?: BloodType;
}) {
  const [selected, setSelected] = useState<BloodType>(initialType);
  const data = compatibilityData[selected];

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-xs space-y-4"
      dir="rtl"
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-100 text-[#C0392B] flex items-center justify-center">
            <Droplet className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-900">حاسبة توافق الفصائل</h3>
            <p className="text-[11px] text-gray-500 font-medium">
              اكتشف من تنقذ ومن تتلقى منه الدم
            </p>
          </div>
        </div>

        {data.badge && (
          <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {data.badge}
          </span>
        )}
      </div>

      {/* Selector Pills */}
      <div className="grid grid-cols-4 gap-1.5">
        {bloodTypes.map((type) => {
          const isCurrent = selected === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => setSelected(type)}
              className={`py-2 rounded-xl text-xs font-black transition-all ${
                isCurrent
                  ? 'bg-[#C0392B] text-white shadow-sm scale-102'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Results Box */}
      <div className="space-y-2.5 pt-1">
        {/* Can give to */}
        <div className="bg-[#FFF5F5] rounded-xl p-3 border border-red-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#C0392B]">
            <ArrowUpRight className="w-4 h-4" />
            <span>يمكنك التبرع لـ ({data.giveTo.length} فصائل):</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {data.giveTo.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-lg bg-white border border-red-200 text-[#C0392B] text-xs font-extrabold shadow-2xs"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Can receive from */}
        <div className="bg-[#EBF5FB] rounded-xl p-3 border border-blue-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D6CDF]">
            <ArrowDownLeft className="w-4 h-4" />
            <span>يمكنك الاستقبال من ({data.receiveFrom.length} فصائل):</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {data.receiveFrom.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-lg bg-white border border-blue-200 text-[#2D6CDF] text-xs font-extrabold shadow-2xs"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Note */}
        <p className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 leading-relaxed font-medium">
          💡 {data.note}
        </p>
      </div>
    </div>
  );
}
