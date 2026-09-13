'use client';

/**
 * components/blood-bank/OnboardingStepper.tsx
 * 4-step stepper header for onboarding wizard with exact RTL step ordering.
 */

import { Droplet, ClipboardList, Activity, MapPin, ArrowRight } from 'lucide-react';
import { toArabicDigits } from '@/lib/blood-bank/mockData';

interface OnboardingStepperProps {
  currentStep: number; // 1 to 4
  onNext?: () => void;
  onBack?: () => void;
}

const steps = [
  { id: 1, label: 'الفصيلة', icon: Droplet },
  { id: 2, label: 'بيانات التبرع', icon: ClipboardList },
  { id: 3, label: 'الحالة الصحية', icon: Activity },
  { id: 4, label: 'الموقع', icon: MapPin },
];

export default function OnboardingStepper({
  currentStep,
  onNext,
  onBack,
}: OnboardingStepperProps) {
  return (
    <div className="bg-[#FBE9E7] border-b border-[#FADBD8] p-4 space-y-4" dir="rtl">
      {/* Top Row: Title + Step Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {onBack && currentStep > 1 ? (
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-xl bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center shadow-xs transition-transform active:scale-95"
              aria-label="السابق"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-white/70 text-gray-400 flex items-center justify-center shadow-xs">
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
          <div>
            <h2 className="text-sm font-black text-gray-900">إكمال بيانات التبرع</h2>
            <p className="text-[11px] text-gray-500 font-medium">خطوات بسيطة لتصبح منقذاً للأرواح</p>
          </div>
        </div>

        {/* Step counter: "4 / N" (Total on left, Current on right as in screenshot) */}
        <div className="text-sm font-black text-[#C0392B] bg-white/80 px-2.5 py-1 rounded-xl shadow-xs">
          <span>{toArabicDigits(4)} / {toArabicDigits(currentStep)}</span>
        </div>
      </div>

      {/* Stepper Progress Row (RTL: Step 1 on the right, Step 4 on the left) */}
      <div className="flex items-center justify-between relative px-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isActive = isCurrent || isCompleted;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center flex-1">
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 -start-1/2 w-full h-0.5 -z-10 transition-colors duration-300 ${
                    currentStep > index + 1 ? 'bg-[#C0392B]' : 'bg-gray-300'
                  }`}
                />
              )}

              {/* Circle Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[#C0392B] text-white shadow-xs'
                    : 'bg-white text-gray-400 border border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Step Label */}
              <span
                className={`text-[10px] mt-1.5 font-bold transition-colors ${
                  isActive ? 'text-[#C0392B]' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
