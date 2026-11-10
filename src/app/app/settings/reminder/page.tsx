'use client'

import React, { useState } from 'react'
import SettingsNav from '../components/SettingsNav'
import { BellAlertIcon, CheckCircleIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline'

export default function SettingsReminderPage() {
  const [enableWhatsAppReminders, setEnableWhatsAppReminders] = useState(true)
  const [reminderLeadHours, setReminderLeadHours] = useState(2)
  const [reminderTemplate, setReminderTemplate] = useState(
    `السلام عليكم ورحمة الله وبركاته، أ/ {patient_name}.
نود تذكيركم بموعد زيارة التمريض المنزلي من *نبض للتمريض المنزلي* اليوم الساعة *{visit_time}*.
• الخدمة المطلوبة: {service_name}
• العنوان: {location}

لأي استفسار أو تعديل، يرجى التواصل معنا على {phone}.
نتمنى لكم دوام الصحة والعافية.`
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
        <h1 className="text-xl sm:text-2xl font-black text-white">إعدادات تذكير المواعيد (واتساب)</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          تذكير المرضى تلقائياً بمواعيد الزيارات التمريضية وتأكيد الحجوزات
        </p>
      </div>

      <SettingsNav />

      <form onSubmit={handleSave} className="bg-navy-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <BellAlertIcon className="w-5 h-5 text-gold-400" />
            <h2 className="text-sm font-black text-white">إشعارات وتذكير واتساب</h2>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
            نشط
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white">تفعيل زر التذكير السريع بالواتساب للمواعيد</p>
            <p className="text-[11px] text-slate-400">إرسال رسالة تذكير مهنية بضغطة واحدة من جدول المواعيد</p>
          </div>
          <input
            type="checkbox"
            checked={enableWhatsAppReminders}
            onChange={(e) => setEnableWhatsAppReminders(e.target.checked)}
            className="w-5 h-5 rounded text-emerald-500 bg-slate-900 border-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              وقت الإرسال المفضل قبل الموعد
            </label>
            <select
              value={reminderLeadHours}
              onChange={(e) => setReminderLeadHours(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            >
              <option value={1}>ساعة واحدة قبل الموعد</option>
              <option value={2}>ساعتان قبل الموعد (موصى به)</option>
              <option value={4}>4 ساعات قبل الموعد</option>
              <option value={24}>قبل الموعد بيوم كامل (24 ساعة)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            نص قالب رسالة التذكير بالواتساب
          </label>
          <textarea
            rows={6}
            value={reminderTemplate}
            onChange={(e) => setReminderTemplate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none font-mono"
            dir="rtl"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            المتغيرات المتاحة: {'{patient_name}'} (اسم المريض)، {'{service_name}'} (الخدمة)، {'{visit_time}'} (الوقت)، {'{location}'} (العنوان)، {'{phone}'} (رقم الهاتف)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition"
          >
            حفظ إعدادات التذكير
          </button>
          {saved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" />
              تم حفظ القالب بنجاح!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
