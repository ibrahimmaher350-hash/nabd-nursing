'use client';

/**
 * components/blood-bank/InfoCarousel.tsx
 * 4-slide educational carousel with dot navigation and exact screenshot copy.
 */

import { useState, useEffect } from 'react';
import { Check, Heart, AlertTriangle, Megaphone } from 'lucide-react';

export default function InfoCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Optional subtle auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full" dir="rtl">
      {/* Slide Container */}
      <div className="relative overflow-hidden rounded-2xl bg-[#FFF5F5] border border-[#FADBD8] p-5 shadow-xs min-h-[170px] flex flex-col justify-between">
        {/* Slide 1: Health benefits */}
        {activeSlide === 0 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#C0392B]">
                فوائد صحية لك <span className="text-xs text-gray-500 font-normal">/ Health benefit for you</span>
              </h3>
              <span className="text-2xl" aria-hidden="true">👨‍⚕️</span>
            </div>
            <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#27AE60] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>فحص صحي مجاني <span className="text-gray-400">/ free health screening</span></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#27AE60] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>يقلل خطر أمراض القلب <span className="text-gray-400">/ reduce heart diseases risk</span></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#27AE60] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </span>
                <span>يحفز إنتاج خلايا دم جديدة <span className="text-gray-400">/ stimulates new blood cells</span></span>
              </li>
            </ul>
          </div>
        )}

        {/* Slide 2: Who can donate */}
        {activeSlide === 1 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#C0392B]">
                من يمكنه التبرع؟ <span className="text-xs text-gray-500 font-normal">/ who can donate?</span>
              </h3>
              <span className="text-2xl" aria-hidden="true">🩸</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-bold text-gray-700 shadow-xs">
                18-65 سنة <span className="text-gray-400 font-normal">/ years old</span>
              </span>
              <span className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-bold text-gray-700 shadow-xs">
                الوزن +50 كجم <span className="text-gray-400 font-normal">/ 50+ KG weight</span>
              </span>
              <span className="bg-[#27AE60]/15 border border-[#27AE60]/30 text-[#27AE60] rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-[#27AE60]" />
                <span>بصحة جيدة <span className="font-normal text-[#27AE60]/80">/ In good health</span></span>
              </span>
            </div>
          </div>
        )}

        {/* Slide 3: Every drop saves lives */}
        {activeSlide === 2 && (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#C0392B]">
                كل قطرة , تنقذ حياة <span className="text-xs text-gray-500 font-normal">/ every drop saves lifes</span>
              </h3>
              <span className="text-2xl" aria-hidden="true">💉</span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              تبرعك يمكن ان ينقذ حتي 3 ارواح كن بطلا
            </p>
            <p className="text-[11px] text-gray-400 leading-tight">
              your donation can save up to 3 lives, be a hero today!
            </p>
          </div>
        )}

        {/* Slide 4: Safety warning */}
        {activeSlide === 3 && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center gap-1.5 text-[#C0392B]">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <h3 className="text-xs font-bold">
                تحذير أمني <span className="text-[10px] text-gray-500 font-normal">/ Safety warning</span>
              </h3>
            </div>
            <p className="text-[10px] text-red-600 leading-tight font-medium">
              Never meet in private places, avoid meeting strangers in private locations for blood donation.
            </p>
            <div className="bg-[#E8F8F0] border border-[#27AE60]/30 rounded-xl p-2 text-[11px] text-gray-800 leading-snug flex items-start gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-[#27AE60] shrink-0 mt-0.5" />
              <span>
                لا تقابل ابدا اي شخص لا تعرفه في اماكن خاصة بغرض التبرع بالدم دائماً اجعل تبرعك في بنوك الدم , المستشفيات او الاماكن المعروفة والموثوقة
              </span>
            </div>
          </div>
        )}

        {/* Dot Indicators */}
        <div className="flex items-center justify-center gap-1.5 pt-3">
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all duration-200 ${
                activeSlide === idx ? 'w-5 bg-[#C0392B]' : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`انتقال للشريحة ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
