'use client';

/**
 * components/blood-bank/modals/GpsPermissionModal.tsx
 * Dialog prompting user to enable GPS location permission with real browser geolocation invocation.
 */

import { useState } from 'react';
import { MapPin, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';

interface GpsPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GpsPermissionModal({ isOpen, onClose }: GpsPermissionModalProps) {
  const { setLocationPermission, setLocation } = useDonorStore();
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGrant = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      setErrorMsg(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(latitude, longitude, 'دمياط، مصر (موقعك الدقيق)');
          setLocationPermission('granted');
          setIsLocating(false);
          onClose();
        },
        (err) => {
          setIsLocating(false);
          console.warn('Geolocation error:', err);
          setErrorMsg('تعذر الوصول للموقع. يرجى تفعيل الـ GPS في جهازك أو الاستمرار يدوياً.');
          setLocationPermission('denied');
          setTimeout(() => {
            onClose();
          }, 1500);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocationPermission('granted');
      onClose();
    }
  };

  const handleCancel = () => {
    setLocationPermission('denied');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gps-modal-title"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-4 animate-scale-in">
        <div className="w-12 h-12 rounded-2xl bg-[#FDECEC] text-[#C0392B] flex items-center justify-center mx-auto">
          <MapPin className="w-6 h-6 stroke-[2.2]" />
        </div>

        <div className="text-center space-y-2">
          <h3 id="gps-modal-title" className="text-base font-black text-gray-900">
            تفعيل موقعك بدقة (GPS)
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            يرجى السماح بصلاحية الموقع لتتمكن المنظومة من عرض بنوك الدم وطلبات التبرع العاجلة الأقرب إليك بدمياط.
          </p>

          {errorMsg && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 font-bold">
              {errorMsg}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLocating}
            className="px-4 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            تخطي حالياً
          </button>
          <button
            type="button"
            onClick={handleGrant}
            disabled={isLocating}
            className="px-5 py-2.5 text-xs font-black text-white bg-[#C0392B] hover:bg-[#A93226] rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            {isLocating && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{isLocating ? 'جارٍ التحديد...' : 'تفعيل وتحديد الموقع 📍'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
