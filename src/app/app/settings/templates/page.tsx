'use client'

import React, { useState } from 'react'
import SettingsNav from '../components/SettingsNav'
import { ChatBubbleLeftRightIcon, CheckCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'

export default function SettingsTemplatesPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)

  const [templates, setTemplates] = useState([
    {
      title: '1. تأكيد حجز زيارة تمريض منزلية',
      description: 'تُرسل فور تسجيل المريض وتأكيد موعد الزيارة',
      content: `*نبض للتمريض المنزلي — تأكيد حجز موعد*
مرحباً أ/ {patient_name}،
تم بنجاح تأكيد زيارتكم المنزلية:
• الخدمة: {service_name}
• الموعد: {visit_date} في تمام {visit_time}
• العنوان: {location}
• ملاحظات: فريقنا يتحرك ومعه جميع معدات التعقيم اللازمة.

لأي استفسار طارئ: {phone}`,
    },
    {
      title: '2. تذكير بالموعد قبل الزيارة بساعتين',
      description: 'تُرسل للتأكيد على تواجد المريض بالمنزل',
      content: `السلام عليكم أ/ {patient_name}.
نود تذكيركم بأن ميعاد زيارة التمريض المنزلي من نبض اليوم الساعة {visit_time}.
يرجى تجهيز الروشتة أو الأدوية المقررة إن وجدت. دمتم بصحة وعافية!`,
    },
    {
      title: '3. تقرير العلامات الحيوية بعد الزيارة',
      description: 'تُرسل لأهل المريض بعد انتهاء الزيارة والقياسات',
      content: `*تقرير متابعة الحالة — نبض للتمريض المنزلي*
المريض: {patient_name}
التاريخ: {visit_date}
العلامات الحيوية المقاسة:
• ضغط الدم: {bp}
• تشبع الأكسجين: {spo2}%
• النبض: {pulse} نبضة/دقيقة
• السكر: {sugar} mg/dL
• درجة الحرارة: {temp}°C

الحالة مستقرة بحمد الله، ونحن في خدمتكم دائماً.`,
    },
    {
      title: '4. تعليمات وإرشادات ما بعد غيار الجرح / القسطرة',
      description: 'نصائح منزلية للعناية بالجرح وموضع الكانيولا أو القسطرة',
      content: `*إرشادات هامة للعناية المنزلية:*
1. الحفاظ على موضع الغيار جافاً ونظيفاً تماماً.
2. عدم محاولة نزع اللصقة الطبية المعقمة.
3. في حال ملاحظة أي احمرار غير معتاد أو رشح، يرجى التواصل معنا فوراً على {phone}.
مع تمنيات فريق نبض بالشفاء العاجل!`,
    },
  ])

  const copyTemplate = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2500)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white">قوالب الرسائل والتواصل (واتساب)</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          قوالب جاهزة للاستخدام السريع مع المرضى وأسرهم بضغطة زر واحدة
        </p>
      </div>

      <SettingsNav />

      <form onSubmit={handleSave} className="space-y-4">
        {templates.map((tpl, i) => (
          <div key={i} className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs sm:text-sm font-black text-white">{tpl.title}</h2>
                <p className="text-[11px] text-slate-400">{tpl.description}</p>
              </div>

              <button
                type="button"
                onClick={() => copyTemplate(tpl.content, i)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              >
                <DocumentDuplicateIcon className="w-3.5 h-3.5 text-gold-400" />
                <span>{copiedIndex === i ? 'تم النسخ ✓' : 'نسخ النص'}</span>
              </button>
            </div>

            <textarea
              rows={5}
              value={tpl.content}
              onChange={(e) => {
                const next = [...templates]
                next[i].content = e.target.value
                setTemplates(next)
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none font-mono"
              dir="rtl"
            />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition"
          >
            حفظ تعديلات القوالب
          </button>
          {saved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" />
              تم حفظ جميع القوالب بنجاح!
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
