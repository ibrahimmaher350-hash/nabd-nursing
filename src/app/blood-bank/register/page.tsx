'use client';

/**
 * app/blood-bank/register/page.tsx
 * Registration screen matching screenshot specifications.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  AtSign,
  Calendar,
  Mail,
  Lock,
  ChevronDown,
  ArrowRight,
  User,
} from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';
import { BloodType } from '@/lib/blood-bank/types';
import SelfieCapture from '@/components/blood-bank/SelfieCapture';

const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useDonorStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [birthDate, setBirthDate] = useState('1998-01-01');
  const [bloodType, setBloodType] = useState<BloodType>('A+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !email) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (!avatarUrl) {
      setError('يرجى التقاط صورة سيلفي مباشرة للوجه بالكاميرا قبل استكمال التسجيل للتوثيق الإنساني 🤳');
      return;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    register({
      firstName,
      lastName,
      username,
      avatarUrl,
      gender,
      birthDate,
      bloodType,
      phone: phone || '01001097896',
      email,
      profileComplete: false,
    });

    router.push('/blood-bank/onboarding');
  };

  return (
    <div className="min-h-full p-5 bg-white space-y-6" dir="rtl">
      {/* Top Header / Back */}
      <div className="flex items-center justify-between">
        <Link
          href="/blood-bank"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all shadow-2xs"
          aria-label="رجوع لبنك الدم"
        >
          <ArrowRight className="w-4 h-4 text-[#C0392B]" />
          <span>رجوع</span>
        </Link>
        <h1 className="text-sm font-black text-gray-900">تسجيل متبرع جديد لدى نبض</h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Direct Selfie Capture Component */}
      <div className="py-1">
        <SelfieCapture
          value={avatarUrl}
          onChange={(url) => {
            setAvatarUrl(url);
            setError('');
          }}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="الاسم الأول"
            className="w-full bg-gray-100 text-gray-900 placeholder:text-[#C0392B]/70 text-xs rounded-xl px-3.5 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[#C0392B]"
          />
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="اسم العائلة"
            className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 text-xs rounded-xl px-3.5 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[#C0392B]"
          />
        </div>

        {/* Username */}
        <div className="relative">
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 text-xs rounded-xl ps-3.5 pe-10 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[#C0392B]"
          />
          <AtSign className="w-4 h-4 text-gray-400 absolute end-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Gender Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">الجنس</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                gender === 'male'
                  ? 'bg-[#C0392B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ذكر
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                gender === 'female'
                  ? 'bg-[#C0392B] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              أنثى
            </button>
          </div>
        </div>

        {/* Birth Date */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">تاريخ الميلاد</label>
          <div className="relative">
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 text-xs rounded-xl ps-3.5 pe-10 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[#C0392B]"
            />
            <Calendar className="w-4 h-4 text-gray-400 absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Blood Type Grid */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">فصيلة الدم</label>
          <div className="grid grid-cols-4 gap-2">
            {bloodTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setBloodType(type)}
                className={`py-2 rounded-xl text-xs font-black transition-all ${
                  bloodType === type
                    ? 'bg-[#C0392B] text-white shadow-xs scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Phone Number with Country Flag */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 block">رقم الهاتف</label>
          <div className="flex gap-2" dir="ltr">
            {/* Country Selector Flag */}
            <div className="bg-gray-100 rounded-xl px-3 py-3 flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
              <span className="text-base">🇪🇬</span>
              <span>+20</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
            {/* Phone Input */}
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010XXXXXXXX"
              className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 text-xs rounded-xl px-3.5 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[#C0392B]"
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 text-xs rounded-xl ps-3.5 pe-10 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[#C0392B]"
          />
          <Mail className="w-4 h-4 text-gray-400 absolute end-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Passwords */}
        <div className="relative">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 text-xs rounded-xl ps-3.5 pe-10 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[#C0392B]"
          />
          <Lock className="w-4 h-4 text-gray-400 absolute end-3.5 top-1/2 -translate-y-1/2" />
        </div>

        <div className="relative">
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="تأكيد كلمة المرور"
            className="w-full bg-gray-100 text-gray-900 placeholder:text-gray-400 text-xs rounded-xl ps-3.5 pe-10 py-3 outline-none focus:bg-white focus:ring-1 focus:ring-[#C0392B]"
          />
          <Lock className="w-4 h-4 text-gray-400 absolute end-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Voluntary Pledge Checkbox */}
        <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-3 text-start">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              defaultChecked
              className="mt-0.5 w-4 h-4 rounded text-[#C0392B] focus:ring-[#C0392B] border-gray-300"
            />
            <span className="text-[11px] text-amber-950 font-bold leading-relaxed">
              <strong>ميثاق المتبرع الإنساني:</strong> أتعهد بأن تسجيلي كمتبرع هو عمل تطوعي إنساني خالص لوجه الله وبدون أي مقابل مادي أو سمسرة مالية.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#C0392B] hover:bg-[#A93226] text-white font-black text-sm py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] mt-2"
        >
          إنشاء حساب متبرع موثق
        </button>
      </form>

      {/* Footer */}
      <div className="text-center py-3 text-xs text-gray-500 space-y-2">
        <div>
          <span>لديك حساب بالفعل؟ </span>
          <Link href="/blood-bank/login" className="font-bold text-[#C0392B] hover:underline">
            تسجيل الدخول
          </Link>
        </div>
        <div>
          <Link href="/blood-bank" className="font-bold text-gray-500 hover:text-gray-800">
            ← الرجوع لرئيسية بنك الدم
          </Link>
        </div>
      </div>
    </div>
  );
}
