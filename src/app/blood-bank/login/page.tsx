'use client';

/**
 * app/blood-bank/login/page.tsx
 * Login screen matching screenshot specifications.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Droplet, ArrowRight } from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useDonorStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }
    login(email, password);
    router.push('/blood-bank');
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-white" dir="rtl">
      {/* Top Header / Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/blood-bank"
          className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors"
          aria-label="رجوع"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <span className="text-xs font-bold text-gray-400">بنك الدم — نبض</span>
      </div>

      {/* Main Form Container */}
      <div className="py-8 space-y-6 max-w-sm mx-auto w-full">
        {/* Top Icon Badge */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-[#FDECEC] border border-[#FADBD8] flex items-center justify-center shadow-xs">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#C0392B] shadow-xs">
              <Droplet className="w-6 h-6 fill-[#C0392B]" />
            </div>
          </div>
        </div>

        {/* Headings */}
        <div className="text-center space-y-1.5">
          <h1 className="text-xl font-black text-gray-900">أهلاً بك مجدداً 👋</h1>
          <p className="text-xs text-gray-500">سجل دخولك وابدأ بإنقاذ الأرواح</p>
        </div>

        {/* Section Title */}
        <div className="pt-2">
          <h2 className="text-sm font-black text-gray-900 mb-3">تسجيل الدخول</h2>

          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="البريد الإلكتروني"
                className="w-full bg-gray-100 hover:bg-gray-100/80 focus:bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm rounded-xl ps-4 pe-10 py-3.5 outline-none border border-transparent focus:border-[#C0392B] focus:ring-1 focus:ring-[#C0392B] transition-all"
              />
              <Mail className="w-4 h-4 text-[#C0392B] absolute end-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full bg-gray-100 hover:bg-gray-100/80 focus:bg-white text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm rounded-xl ps-10 pe-10 py-3.5 outline-none border border-transparent focus:border-[#C0392B] focus:ring-1 focus:ring-[#C0392B] transition-all"
              />
              <Lock className="w-4 h-4 text-[#C0392B] absolute end-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-start">
              <button
                type="button"
                onClick={() => alert('يرجى التواصل مع الدعم الفني عبر واتساب لاستعادة كلمة المرور.')}
                className="text-xs font-bold text-[#C0392B] hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#C0392B] hover:bg-[#A93226] text-white font-black text-sm py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] mt-2"
            >
              دخول
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 border-t border-gray-100 text-xs text-gray-500">
        <span>ليس لديك حساب؟ </span>
        <Link href="/blood-bank/register" className="font-extrabold text-[#C0392B] hover:underline">
          إنشاء حساب جديد
        </Link>
      </div>
    </div>
  );
}
