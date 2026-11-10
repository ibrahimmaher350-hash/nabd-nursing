'use client'

import React from 'react'
import Link from 'next/link'
import {
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  SparklesIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  PlusIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { siteConfig } from '@/data/siteConfig'

export default function WaslAppDashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="bg-gold-500/20 text-gold-400 border border-gold-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              لوحة إدارة العيادة والزيارات
            </span>
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              مباشر 24/7 · دمياط
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            المريض يدخلك وحكايته جاهزة قدامك
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            إدارة زيارات نبض للتمريض المنزلي من أول استقبال المريض، ملخص المساعد الذكي، فحص أمان الحساسية والتعارضات الدوائية، حتى الروشتة وتقفيل اليومية.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <Link
            href="/app/intake"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg transition active:scale-[0.98]"
          >
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>تسجيل كشف / مريض جديد</span>
          </Link>

          <Link
            href="/app/appointments"
            className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-5 py-2.5 rounded-2xl text-xs font-bold transition"
          >
            <CalendarDaysIcon className="w-4 h-4" />
            <span>فتح جدول المواعيد وتقويم Google</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats (Wasl Clinic style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/app/appointments"
          className="bg-navy-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">زيارات اليوم المجدولة</span>
            <CalendarDaysIcon className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">4</p>
          <span className="text-[10px] text-emerald-400 font-bold block mt-1">1 جارية الآن · 3 قادمة</span>
        </Link>

        <Link
          href="/app/patients"
          className="bg-navy-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">إجمالي ملفات المرضى</span>
            <UserGroupIcon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2 font-mono">5</p>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">سجلات طبية مشفرة</span>
        </Link>

        <Link
          href="/app/patients?filter=allergy"
          className="bg-navy-900 border border-rose-500/30 hover:border-rose-500/60 rounded-2xl p-4 sm:p-5 transition shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-300">مرضى الحساسية (أمان)</span>
            <ShieldExclamationIcon className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-2 font-mono">2</p>
          <span className="text-[10px] text-rose-300 font-bold block mt-1">تنبيهات حساسية بنسلين وسلفا</span>
        </Link>

        <Link
          href="/app/accounts"
          className="bg-navy-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-4 sm:p-5 transition shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">إيراد اليوم</span>
            <BanknotesIcon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono">
            2,010 <span className="text-xs font-normal text-slate-400">ج.م</span>
          </p>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">تقفيل اليومية متاح</span>
        </Link>
      </div>

      {/* Main Grid: Live Queue & AI Assistant Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Live Queue (الطابور اللحظي - Wasl match) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-gold-400" />
                <h2 className="text-sm font-black text-white">الطابور وجدول الزيارات اللحظي</h2>
              </div>
              <Link href="/app/appointments" className="text-xs text-gold-400 hover:underline font-bold">
                عرض الجدول الكامل ←
              </Link>
            </div>

            <div className="space-y-3">
              {/* Item 1: In progress */}
              <div className="bg-slate-950 border border-emerald-500/50 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-navy-950 font-black text-xs flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm">محمود عبد الرحمن</span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                        🟢 قيد الزيارة الآن
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      كانيولا ومحاليل وريدية · مركز وبندر دمياط · 10:30 ص
                    </p>
                  </div>
                </div>

                <Link
                  href="/app/patients/58f57634-7af0-448a-b15c-5531bc8027db"
                  className="bg-slate-800 hover:bg-slate-700 text-gold-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700"
                >
                  فتح الملف الطبي
                </Link>
              </div>

              {/* Item 2 */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 font-black text-xs flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm">منى السيد إبراهيم</span>
                      <span className="bg-blue-500/20 text-blue-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                        مجدول 12:00 م
                      </span>
                      <span className="bg-rose-950/60 text-rose-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                        ⚠️ حساسية بنسلين
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">غيار جروح بسيطة وحقن · السنانية</p>
                  </div>
                </div>

                <a
                  href={`https://wa.me/201023456789?text=${encodeURIComponent('السلام عليكم أ/ منى، نود تذكيركم بموعد زيارة نبض للتمريض اليوم الساعة 12:00 م.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1.5 rounded-lg"
                >
                  💬 تذكير واتساب
                </a>
              </div>

              {/* Item 3 */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 font-black text-xs flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm">كريم عادل الدسوقي</span>
                      <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        مجدول 04:30 م
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">غيار جروح معقدة وقدم سكري · الشعراء</p>
                  </div>
                </div>

                <Link
                  href="/app/patients"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700"
                >
                  تفاصيل الحالة
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right (1 col): Smart Assistant & Quick Links */}
        <div className="space-y-4">
          {/* Smart Assistant live widget (Wasl Clinic match) */}
          <div className="bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 border border-gold-400/40 rounded-2xl p-5 space-y-3.5 shadow-md">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
              <SparklesIcon className="w-5 h-5 text-gold-400" />
              <h3 className="text-xs font-black text-white">ملخص المساعد الذكي للحالة الجارية</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-gold-400 font-bold block mb-0.5">المريض:</span>
                <p className="font-bold text-white">محمود عبد الرحمن (50 سنة · ذكر)</p>
                <p className="text-[11px] text-emerald-400 mt-0.5">✓ لا توجد حساسية دوائية</p>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-gold-400 font-bold block mb-0.5">الشكوى:</span>
                <p className="text-slate-300 text-[11px]">وجع في الجنب اليمين من 3 أيام مع ترجيع وسخونية</p>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-cyan-400 font-bold block mb-0.5">تحاليل صورة دم (CBC):</span>
                <p className="font-mono text-cyan-300 text-[11px]" dir="ltr">
                  WBC: 13.8 ↑ | Hb: 11.2 ↓
                </p>
              </div>
            </div>

            <Link
              href="/app/patients/58f57634-7af0-448a-b15c-5531bc8027db"
              className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-black py-2 px-3 rounded-xl block text-center transition shadow-xs"
            >
              فتح ملف محمود عبد الرحمن الكامل
            </Link>
          </div>

          {/* Quick Hub Shortcuts */}
          <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-400 mb-2">أقسام النظام السريعة:</h3>
            <Link
              href="/app/intake"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-xs text-white transition"
            >
              <span>📋 تسجيل واستقبال مريض</span>
              <span className="text-slate-500">←</span>
            </Link>
            <Link
              href="/app/patients"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-xs text-white transition"
            >
              <span>👥 سجلات وملفات المرضى</span>
              <span className="text-slate-500">←</span>
            </Link>
            <Link
              href="/app/appointments"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-xs text-white transition"
            >
              <span>📅 تقويم Google والمواعيد</span>
              <span className="text-slate-500">←</span>
            </Link>
            <Link
              href="/app/accounts"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-xs text-white transition"
            >
              <span>💰 الحسابات وتقفيل اليومية</span>
              <span className="text-slate-500">←</span>
            </Link>
            <Link
              href="/app/profile"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-xs text-white transition"
            >
              <span>👤 الملف المهني والاعتمادات</span>
              <span className="text-slate-500">←</span>
            </Link>
            <Link
              href="/app/settings"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-xs text-white transition"
            >
              <span>⚙️ الإعدادات وسياسات التسعير</span>
              <span className="text-slate-500">←</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
