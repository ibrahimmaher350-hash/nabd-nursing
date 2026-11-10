'use client'

import React, { useState } from 'react'
import SettingsNav from './components/SettingsNav'
import {
  CurrencyDollarIcon,
  CheckCircleIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { services } from '@/data/services'
import { siteConfig } from '@/data/siteConfig'

export default function AppSettingsPage() {
  const [baseZone, setBaseZone] = useState('مركز وبندر دمياط')
  const [travelFeeFar, setTravelFeeFar] = useState(75)
  const [nightSurgePercent, setNightSurgePercent] = useState(30)
  const [chronicDiscountPercent, setChronicDiscountPercent] = useState(15)
  const [adminPin, setAdminPin] = useState('2026')
  const [saved, setSaved] = useState(false)

  // Service price overrides
  const [servicePrices, setServicePrices] = useState(
    services.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      priceRange: s.priceRange,
      targetZone: s.targetZone || 'مركز وبندر دمياط',
    }))
  )

  const handlePriceChange = (id: string, newPrice: string) => {
    setServicePrices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, priceRange: newPrice } : s))
    )
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="visit">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">إعدادات النظام والعيادة</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          تسعير الزيارات، سياسات الطوارئ، مناطق الانتقال وإعدادات الأمان
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <SettingsNav />

      {/* Main Content */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Operational & Pricing Policies Card */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-black text-gold-400 flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5" />
              <span>سياسات التشغيل والتسعير الاسترشادي (دمياط)</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Zone Pricing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                نطاق السعر الأساسي
              </label>
              <input
                type="text"
                value={baseZone}
                onChange={(e) => setBaseZone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">وسط البلد، السنانية، السيالة، الشعراء</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                رسوم انتقال المناطق الأبعد (ج)
              </label>
              <input
                type="number"
                value={travelFeeFar}
                onChange={(e) => setTravelFeeFar(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white text-center focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">دمياط الجديدة، رأس البر، كفر البطيخ</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                نسبة طوارئ الليل المتأخر (%)
              </label>
              <input
                type="number"
                value={nightSurgePercent}
                onChange={(e) => setNightSurgePercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white text-center focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">بعد منتصف الليل (30% - 50%)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                خصم باقات الحالات المزمنة (%)
              </label>
              <input
                type="number"
                value={chronicDiscountPercent}
                onChange={(e) => setChronicDiscountPercent(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white text-center focus:outline-none"
              />
              <p className="text-[10px] text-slate-500 mt-1">للمتابعات الأسبوعية وقرح الفراش</p>
            </div>
          </div>
        </div>

        {/* 2. Services Pricing Table */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-black text-white">قائمة أسعار الخدمات التمريضية الفردية</h2>
            <span className="text-xs text-slate-400">15 خدمة معتمدة</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 text-start">الخدمة التمريضية</th>
                  <th className="py-2.5 px-3 text-start">التصنيف</th>
                  <th className="py-2.5 px-3 text-start">النطاق الجغرافي</th>
                  <th className="py-2.5 px-3 text-start">متوسط السعر العادل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {servicePrices.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-2.5 px-3 font-bold text-white">{s.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{s.category}</td>
                    <td className="py-2.5 px-3 text-slate-400">{s.targetZone}</td>
                    <td className="py-2.5 px-3">
                      <input
                        type="text"
                        value={s.priceRange}
                        onChange={(e) => handlePriceChange(s.id, e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-gold-300 font-bold focus:outline-none w-36"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Security & PIN */}
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
            <span>رمز المرور السري (PIN) للوحة التحكم</span>
          </h2>
          <div className="max-w-xs">
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white tracking-widest text-center focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">الرمز الافتراضي: 2026 أو هاتف الإدارة</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition"
          >
            حفظ جميع الإعدادات
          </button>
          {saved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" />
              تم حفظ الإعدادات بنجاح!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
