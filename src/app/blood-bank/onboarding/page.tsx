'use client';

/**
 * app/blood-bank/onboarding/page.tsx
 * 4-step donation profile completion wizard (الفصيلة, بيانات التبرع, الحالة الصحية, الموقع)
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Navigation, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import OnboardingStepper from '@/components/blood-bank/OnboardingStepper';
import InteractiveMap from '@/components/blood-bank/InteractiveMap';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';
import { BloodType } from '@/lib/blood-bank/types';

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function OnboardingPage() {
  const router = useRouter();
  const { donor, updateProfile } = useDonorStore();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Blood type
  const [selectedBloodType, setSelectedBloodType] = useState<BloodType>(donor?.bloodType || 'A+');

  // Step 2: Donation history
  const [hasDonatedBefore, setHasDonatedBefore] = useState<boolean>(false);
  const [donationCount, setDonationCount] = useState<number>(0);

  // Step 3: Health questions
  const [weightOver50, setWeightOver50] = useState<boolean>(true);
  const [hasChronicDisease, setHasChronicDisease] = useState<boolean>(false);
  const [takesMedication, setTakesMedication] = useState<boolean>(false);

  // Step 4: Location
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [address, setAddress] = useState<string>(donor?.region || 'مصر، محافظة دمياط - الأعصر');
  const [lat, setLat] = useState<number>(donor?.lat || 31.4165);
  const [lng, setLng] = useState<number>(donor?.lng || 31.8133);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.push('/blood-bank');
    }
  };

  const handleComplete = () => {
    updateProfile({
      bloodType: selectedBloodType,
      donationCount: hasDonatedBefore ? Number(donationCount) : 0,
      region: address,
      lat,
      lng,
      profileComplete: true,
    });
    router.push('/blood-bank');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] bg-white text-gray-900" dir="rtl">
      {/* Header Stepper Bar */}
      <OnboardingStepper
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
      />

      {/* Step Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        {/* STEP 1: الفصيلة */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-gray-900 mb-2">اختر فصيلة دمك</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                معرفة فصيلة دمك تساعدنا في توصيلك بالأشخاص الذين يحتاجون إلى فصيلتك تحديداً.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-2">
              {bloodTypes.map((type) => {
                const isSelected = selectedBloodType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedBloodType(type)}
                    className={`h-16 rounded-2xl font-black text-xl flex items-center justify-center transition-all duration-200 shadow-xs active:scale-95 ${
                      isSelected
                        ? 'bg-[#C0392B] text-white shadow-md ring-2 ring-[#C0392B]/30'
                        : 'bg-white text-gray-800 border border-gray-200 hover:border-red-200 hover:bg-red-50/40'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: بيانات التبرع */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-gray-900 mb-2">تفاصيل التبرع</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                سجل تبرعاتك السابقة يساعدنا في تنظيم فترات الراحة الآمنة بين كل تبرع وآخر.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-sm font-bold text-gray-800">
                هل تبرعت بالدم من قبل؟
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasDonatedBefore(true)}
                  className={`py-3.5 rounded-xl font-bold text-sm transition-all shadow-xs active:scale-95 ${
                    hasDonatedBefore
                      ? 'bg-[#C0392B] text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  نعم
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasDonatedBefore(false);
                    setDonationCount(0);
                  }}
                  className={`py-3.5 rounded-xl font-bold text-sm transition-all shadow-xs active:scale-95 ${
                    !hasDonatedBefore
                      ? 'bg-[#C0392B] text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  لا
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-sm font-bold text-gray-800">
                عدد مرات التبرع
              </label>
              <input
                type="number"
                min="0"
                max="50"
                disabled={!hasDonatedBefore}
                value={donationCount}
                onChange={(e) => setDonationCount(Number(e.target.value))}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 font-bold text-center text-lg disabled:opacity-50 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30"
              />
            </div>
          </div>
        )}

        {/* STEP 3: الحالة الصحية */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black text-gray-900 mb-2">الحالة الصحية</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                سلامتك هي أولويتنا. يرجى الإجابة على الأسئلة التالية بصدق.
              </p>
            </div>

            <div className="space-y-5 pt-2">
              {/* Q1 */}
              <div className="space-y-2.5 pb-2 border-b border-gray-100">
                <span className="block text-sm font-bold text-gray-800">
                  هل وزنك أكثر من 50 كجم؟
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWeightOver50(true)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                      weightOver50
                        ? 'bg-[#C0392B] text-white'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightOver50(false)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                      !weightOver50
                        ? 'bg-[#C0392B] text-white'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>

              {/* Q2 */}
              <div className="space-y-2.5 pb-2 border-b border-gray-100">
                <span className="block text-sm font-bold text-gray-800">
                  هل تعاني من أي أمراض مزمنة؟
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHasChronicDisease(true)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                      hasChronicDisease
                        ? 'bg-[#C0392B] text-white'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasChronicDisease(false)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                      !hasChronicDisease
                        ? 'bg-[#C0392B] text-white'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>

              {/* Q3 */}
              <div className="space-y-2.5">
                <span className="block text-sm font-bold text-gray-800">
                  هل تتناول أي أدوية حالياً؟
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTakesMedication(true)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                      takesMedication
                        ? 'bg-[#C0392B] text-white'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    نعم
                  </button>
                  <button
                    type="button"
                    onClick={() => setTakesMedication(false)}
                    className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                      !takesMedication
                        ? 'bg-[#C0392B] text-white'
                        : 'bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    لا
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: الموقع */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-black text-gray-900 mb-1">الموقع الحالي</h1>
              <p className="text-sm text-gray-500 leading-relaxed">
                نحتاج لتحديد موقعك بدقة لعرض طلبات التبرع القريبة منك.
              </p>
            </div>

            {/* Search row: red square button on left (in RTL) + input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن عنوان أو مدينة ..."
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/30"
              />
              <button
                type="button"
                onClick={() => {
                  if (searchQuery.trim()) {
                    setAddress(`مصر, محافظة دمياط, ${searchQuery.trim()}`);
                  }
                }}
                className="w-12 h-11 bg-[#C0392B] hover:bg-[#A93226] text-white rounded-xl flex items-center justify-center shadow-xs transition-colors"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Real Interactive OpenStreetMap & Leaflet Map */}
            <InteractiveMap
              mode="picker"
              initialLat={lat}
              initialLng={lng}
              height="280px"
              showQuickPills={true}
              onLocationChange={(loc) => {
                setLat(loc.lat);
                setLng(loc.lng);
                setAddress(loc.address);
              }}
            />

            {/* Address line below map */}
            <div className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <MapPin className="w-4 h-4 text-[#C0392B] shrink-0" />
              <span className="font-semibold truncate">{address}</span>
            </div>
          </div>
        )}

        {/* Sticky Bottom Actions */}
        <div className="pt-6 pb-2 space-y-2">
          {currentStep < 4 ? (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3.5 bg-[#C0392B] hover:bg-[#A93226] text-white font-black text-base rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>الخطوة التالية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Secondary next square button */}
              <button
                type="button"
                onClick={handleNext}
                className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center shadow-xs active:scale-95 transition-transform"
                aria-label="التالي"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleComplete}
                className="flex-1 py-3.5 bg-[#C0392B] hover:bg-[#A93226] text-white font-black text-base rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>حفظ وإنهاء</span>
              </button>

              {/* Secondary complete button */}
              <button
                type="button"
                onClick={handleComplete}
                className="w-12 h-12 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center justify-center shadow-xs active:scale-95 transition-transform"
                aria-label="إنهاء"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Explicit Back / Cancel Button */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
            >
              {currentStep > 1 ? '← الرجوع للخطوة السابقة' : '← إلغاء والرجوع لرئيسية بنك الدم'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
