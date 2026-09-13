'use client';

/**
 * src/app/blood-bank/profile/page.tsx
 * Complete Donor Profile & Settings Center with full user control.
 * Edit profile, update blood type, toggle donation availability, notifications, and save to Supabase.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Camera,
  Droplet,
  Star,
  LogOut,
  ShieldCheck,
  Edit2,
  Check,
  CheckCircle2,
  Bell,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { useDonorStore } from '@/lib/blood-bank/useDonorStore';
import { toArabicDigits } from '@/lib/blood-bank/mockData';
import TopBar from '@/components/blood-bank/TopBar';
import QuickActionGrid from '@/components/blood-bank/modals/QuickActionGrid';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;

export default function ProfilePage() {
  const { donor, bloodType, setAvailable, updateProfile, logout } = useDonorStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState(donor?.firstName || 'إبراهيم');
  const [lastName, setLastName] = useState(donor?.lastName || 'ماهر');
  const [username, setUsername] = useState(donor?.username || 'ibrahim_maher');
  const [avatarUrl, setAvatarUrl] = useState(donor?.avatarUrl || '');
  const [phone, setPhone] = useState(donor?.phone || '01001097896');
  const [email, setEmail] = useState(donor?.email || 'ibrahim@nabd.eg');
  const [selectedBloodType, setSelectedBloodType] = useState<any>(bloodType || 'A+');
  const [region, setRegion] = useState(donor?.region || 'دمياط، مصر');
  const [birthDate, setBirthDate] = useState(donor?.birthDate || '1995-05-15');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isAvailable = donor?.availableToDonate ?? true;
  const donationCount = donor?.donationCount ?? 0;

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      updateProfile({ avatarUrl: result });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      updateProfile({
        firstName,
        lastName,
        username,
        avatarUrl,
        phone,
        email,
        bloodType: selectedBloodType,
        region,
        birthDate,
      });

      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900" dir="rtl">
      {/* Hidden selfie input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="user"
        onChange={handleSelfieChange}
        className="hidden"
      />

      {/* Top Bar with title and Back link */}
      <TopBar
        title="الملف الشخصي للمتبرع"
        subtitle="بيانات الحساب وتوثيق التبرع بالدم"
        showBack
        backHref="/blood-bank"
        rightAction={
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95"
            title="تعديل الملف"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'إلغاء' : 'تعديل'}</span>
          </button>
        }
      />

      <main className="max-w-xl mx-auto w-full p-4 space-y-4 pb-16">
        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold shadow-2xs animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>تم حفظ وتحديث بياناتك بنجاح في المنظومة السحابية! ✅</span>
          </div>
        )}

        {/* Profile Header: Avatar, Username, Badge */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-22 h-22 rounded-full bg-slate-100 border-[3px] border-[#C0392B] flex items-center justify-center text-slate-400 shadow-sm overflow-hidden">
              {avatarUrl || donor?.avatarUrl ? (
                <img
                  src={avatarUrl || donor?.avatarUrl}
                  alt={firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-[#07132B]" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 start-0 w-7 h-7 rounded-full bg-[#C0392B] text-white flex items-center justify-center shadow-md ring-2 ring-white hover:bg-[#A93226] transition-transform active:scale-95"
              aria-label="تحديث صورة السيلفي"
              title="تحديث صورة السيلفي"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="mt-3 text-lg font-black text-slate-900 leading-snug">
            {firstName} {lastName}
          </h2>
          <p className="text-xs font-bold text-slate-500" dir="ltr">@{username}</p>

          <div className="flex items-center gap-2 mt-2.5 flex-wrap justify-center">
            {/* Pill Badge: "٠ تبرعات موثقة" */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#C0392B] text-xs font-bold border border-red-200">
              <Droplet className="w-3.5 h-3.5 fill-current" />
              <span>{toArabicDigits(donationCount)} تبرعات موثقة</span>
            </div>

            {/* Verified Donor Trust Badge */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-extrabold border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span>متبرع معتمد لدى نبض 🛡️</span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form (When isEditing is true) */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-[#C0392B]" />
                <span>تعديل البيانات الشخصية</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                إلغاء
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">الاسم الأول</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">اسم العائلة</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">فصيلة الدم</label>
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedBloodType(type)}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${
                      selectedBloodType === type
                        ? 'bg-[#C0392B] text-white shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">رقم الهاتف (واتساب)</label>
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-left"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">البريد الإلكتروني</label>
                <input
                  type="email"
                  dir="ltr"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-left"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">المنطقة السكنية (دمياط)</label>
              <input
                type="text"
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="مثال: الأعصر، دمياط"
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">تاريخ الميلاد</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-[#07132B] hover:bg-navy-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>{isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات في الحساب'}</span>
            </button>
          </form>
        ) : (
          /* Card 1: Donation Availability & Blood Info */
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-4">
            {/* Availability Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-0.5">جاهزية واستعداد التبرع</p>
                <p
                  className={`text-sm font-black ${
                    isAvailable ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {isAvailable ? 'متاح للتبرع الفوري لإنقاذ حياة' : 'غير متاح للتبرع حالياً'}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isAvailable}
                onClick={() => setAvailable(!isAvailable)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAvailable ? 'bg-[#C0392B]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isAvailable ? '-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">فصيلة الدم</span>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#C0392B] text-white font-black text-xs shadow-2xs">
                  {bloodType}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">المنطقة</span>
                <span className="font-black text-slate-800 line-clamp-1">{region}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">رقم الهاتف</span>
                <span className="font-bold text-slate-800" dir="ltr">{phone}</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">البريد الإلكتروني</span>
                <span className="font-bold text-slate-800 line-clamp-1" dir="ltr">{email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Action Grid */}
        <div className="pt-2">
          <h3 className="text-sm font-black text-slate-900 mb-3 text-right">
            إجراءات سريعة
          </h3>
          <QuickActionGrid />
        </div>

        {/* Logout and Exit */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={logout}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 p-2"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج من بنك الدم</span>
          </button>

          <Link
            href="/blood-bank"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            <span>← رئيسية بنك الدم</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
