'use client'

import React, { useState } from 'react'
import SettingsNav from '../components/SettingsNav'
import { DocumentTextIcon, CheckCircleIcon, PrinterIcon } from '@heroicons/react/24/outline'
import { siteConfig } from '@/data/siteConfig'

export default function SettingsPrescriptionPage() {
  const [headerTitle, setHeaderTitle] = useState('نبض للتمريض المنزلي')
  const [headerSubtitle, setHeaderSubtitle] = useState('خدمات الرعاية الصحية والتمريض المنزلي التخصصي')
  const [paperSize, setPaperSize] = useState<'A4' | 'A5'>('A5')
  const [showLogo, setShowLogo] = useState(true)
  const [showSignatureBox, setShowSignatureBox] = useState(true)
  const [disclaimer, setDisclaimer] = useState(
    'تنبيه طبي: تُنفَّذ الإجراءات والخدمات التمريضية وفق التوجيه والوصفات الطبية المعتمدة. سلامة وتعقيم المريض أولويتنا القصوى.'
  )
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">إعدادات قوالب الروشتات والتقارير</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          تخصيص ترويسة الروشتة المطبوعة، مقاس الورق، وملاحظات إخلاء المسؤولية
        </p>
      </div>

      <SettingsNav />

      <form onSubmit={handleSave} className="bg-navy-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="w-5 h-5 text-gold-400" />
            <h2 className="text-sm font-black text-white">ترويسة وهوية الروشتة المطبوعة</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Format: {paperSize}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">اسم المؤسسة / العيادة</label>
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الوصف الفرعي</label>
            <input
              type="text"
              value={headerSubtitle}
              onChange={(e) => setHeaderSubtitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">مقاس الطباعة</label>
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value="A5">A5 (مقاس الروشتات المعتاد - نصف A4)</option>
              <option value="A4">A4 (مقاس التقارير الطبية الكاملة)</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showLogo}
                onChange={(e) => setShowLogo(e.target.checked)}
                className="w-4 h-4 rounded text-gold-500 bg-slate-950 border-slate-700"
              />
              <span>إظهار شعار نبض</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showSignatureBox}
                onChange={(e) => setShowSignatureBox(e.target.checked)}
                className="w-4 h-4 rounded text-gold-500 bg-slate-950 border-slate-700"
              />
              <span>خانة ختم وتوقيع التمريض</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            ملاحظة إخلاء المسؤولية وأمان المريض (أسفل الروشتة)
          </label>
          <textarea
            rows={3}
            value={disclaimer}
            onChange={(e) => setDisclaimer(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition"
          >
            حفظ إعدادات الروشتة
          </button>
          {saved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" />
              تم الحفظ بنجاح!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
