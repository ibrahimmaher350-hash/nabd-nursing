'use client';

/**
 * components/blood-bank/modals/GpsPermissionModal.tsx
 * Dialog prompting user to enable GPS location permission.
 */

import { MapPin } from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';

interface GpsPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GpsPermissionModal({ isOpen, onClose }: GpsPermissionModalProps) {
  const { setLocationPermission } = useDonorStore();

  if (!isOpen) return null;

  const handleGrant = () => {
    setLocationPermission('granted');
    onClose();
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
            الموقع متوقف
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            يرجى تفعيل الموقع (GPS) لتتمكن من رؤية طلبات التبرع القريبة منك.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleGrant}
            className="px-5 py-2 text-xs font-black text-[#C0392B] hover:bg-[#FDECEC] rounded-xl transition-colors"
          >
            الإعدادات
          </button>
        </div>
      </div>
    </div>
  );
}
