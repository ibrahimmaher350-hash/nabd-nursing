'use client'

import React, { useState } from 'react'
import SettingsNav from '../components/SettingsNav'
import { ClockIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function SettingsHoursPage() {
  const [is247, setIs247] = useState(true)
  const [morningStart, setMorningStart] = useState('08:00')
  const [morningEnd, setMorningEnd] = useState('16:00')
  const [eveningStart, setEveningStart] = useState('16:00')
  const [eveningEnd, setEveningEnd] = useState('00:00')
  const [nightStart, setNightStart] = useState('00:00')
  const [nightEnd, setNightEnd] = useState('08:00')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">إعدادات ساعات وشفتات العمل</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          تنظيم شفتات التمريض المنزلي، ساعات الطوارئ وتغطية مركز وبندر دمياط
        </p>
      </div>

      <SettingsNav />

      <form onSubmit={handleSave} className="bg-navy-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-gold-400" />
            <h2 className="text-sm font-black text-white">نظام التغطية السريرية</h2>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
            24 ساعة طوال أيام الأسبوع
          </span>
        </div>

        {/* 24/7 Toggle */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">تفعيل نظام التغطية المستمرة 24/7</p>
            <p className="text-[11px] text-slate-400">استقبال طلبات التمريض المنزلي العاجلة وطوارئ دمياط على مدار الساعة</p>
          </div>
          <input
            type="checkbox"
            checked={is247}
            onChange={(e) => setIs247(e.target.checked)}
            className="w-5 h-5 rounded text-emerald-500 bg-slate-900 border-slate-700"
          />
        </div>

        {/* Shifts Schedule */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gold-400">تقسيم الشفتات اليومية:</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Morning Shift */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-xs font-black text-white block">☀️ الشفت الصباحي</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">من</label>
                  <input
                    type="time"
                    value={morningStart}
                    onChange={(e) => setMorningStart(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">إلى</label>
                  <input
                    type="time"
                    value={morningEnd}
                    onChange={(e) => setMorningEnd(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-center"
                  />
                </div>
              </div>
            </div>

            {/* Evening Shift */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <span className="text-xs font-black text-white block">🌆 الشفت المسائي</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">من</label>
                  <input
                    type="time"
                    value={eveningStart}
                    onChange={(e) => setEveningStart(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">إلى</label>
                  <input
                    type="time"
                    value={eveningEnd}
                    onChange={(e) => setEveningEnd(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-center"
                  />
                </div>
              </div>
            </div>

            {/* Night Emergency Shift */}
            <div className="bg-slate-950 border border-rose-500/30 p-4 rounded-xl space-y-2">
              <span className="text-xs font-black text-rose-400 block">🌙 شفت الطوارئ الليلي (+30%)</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">من</label>
                  <input
                    type="time"
                    value={nightStart}
                    onChange={(e) => setNightStart(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-center"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">إلى</label>
                  <input
                    type="time"
                    value={nightEnd}
                    onChange={(e) => setNightEnd(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition"
          >
            حفظ ساعات العمل
          </button>
          {saved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" />
              تم حفظ الشفتات بنجاح!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
