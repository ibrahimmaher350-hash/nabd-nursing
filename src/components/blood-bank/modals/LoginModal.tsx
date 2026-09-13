'use client';

/**
 * components/blood-bank/modals/LoginModal.tsx
 * Modal version of login for quick in-place authentication.
 */

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useDonorStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 start-4 w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-2 space-y-1">
          <div className="w-12 h-12 rounded-full bg-[#FDECEC] text-[#C0392B] flex items-center justify-center mx-auto text-xl mb-2">
            🩸
          </div>
          <h3 className="text-lg font-black text-gray-900">تسجيل الدخول</h3>
          <p className="text-xs text-gray-500">سجل دخولك وابدأ بإنقاذ الأرواح</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {/* Email input */}
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 text-xs rounded-xl ps-4 pe-10 py-3 outline-none focus:ring-2 focus:ring-[#C0392B] transition-all"
            />
            <Mail className="w-4 h-4 text-[#C0392B] absolute end-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Password input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 text-xs rounded-xl ps-10 pe-10 py-3 outline-none focus:ring-2 focus:ring-[#C0392B] transition-all"
            />
            <Lock className="w-4 h-4 text-[#C0392B] absolute end-3 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C0392B] hover:bg-[#A93226] text-white font-black text-sm py-3 rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            دخول
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-gray-500">
          <span>ليس لديك حساب؟ </span>
          <Link
            href="/blood-bank/register"
            onClick={onClose}
            className="font-bold text-[#C0392B] hover:underline"
          >
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
}
