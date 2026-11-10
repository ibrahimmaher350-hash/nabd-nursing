'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  IdentificationIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { siteConfig } from '@/data/siteConfig'

export default function ProfilePage() {
  const [name, setName] = useState('إبراهيم ماهر')
  const [title, setTitle] = useState('أخصائي تمريض ورعاية صحية منزلية متقدمة')
  const [licenseNo, setLicenseNo] = useState('ترخيص مزاولة مهنة التمريض - نقابة التمريض المصرية')
  const [phone, setPhone] = useState('01001097896')
  const [facebookUrl, setFacebookUrl] = useState('https://www.facebook.com/share/19gZWtCPLc/')
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/Ibrahim5k')
  const [primaryZone, setPrimaryZone] = useState('مركز وبندر دمياط')
  const [bio, setBio] = useState(
    'مؤسس نبض للتمريض المنزلي بدمياط. خبرة سريرية واسعة في رعاية الحالات الحرجة، غيار الجروح المعقدة وقدم السكري، تركيب الكانيولا والمحاليل الوريدية، القساطر البولية والرايل، وسحب عينات التحاليل الطبية داخل المنزل بأعلى معايير التعقيم والسرية.'
  )
  const [is24hAvailable, setIs24hAvailable] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <IdentificationIcon className="w-6 h-6 text-gold-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">الملف المهني لمقدم الخدمة</h1>
            <span className="bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              معتمد سريرياً
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            بيانات الاعتماد الطبي، مناطق التغطية بدمياط وروابط التواصل المهنية
          </p>
        </div>

        {saved && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
            <CheckCircleIcon className="w-4 h-4" />
            تم حفظ وتحديث الملف بنجاح!
          </span>
        )}
      </div>

      {/* Main Profile Card Preview */}
      <div className="bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-2 border-gold-400 shadow-2xl shrink-0">
            <Image src="/logo.jpg" alt="نبض" fill className="object-cover" sizes="96px" />
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white">{name}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {is24hAvailable ? 'متاح 24 ساعة بدمياط' : 'شفتات محددة'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gold-400">{title}</p>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{licenseNo}</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <MapPinIcon className="w-4 h-4 text-rose-400 shrink-0" />
              <span>نطاق العمل: {primaryZone} ومحيطها</span>
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <GlobeAltIcon className="w-4 h-4" />
              <span>فيسبوك ↗</span>
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>تليجرام ↗</span>
            </a>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-gold-400 block mb-1">النبذة المهنية والخبرات:</span>
          {bio}
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-navy-900 border border-slate-800 rounded-3xl p-6 space-y-5">
        <h3 className="text-sm font-black text-white">تعديل بيانات الملف المهني</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الاسم المهني</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">المسمى الوظيفي / التخصص</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">ترخيص المزاولة / الاعتماد</label>
            <input
              type="text"
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف الأساسي</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">رابط صفحة فيسبوك الرسمية</label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">رابط قناة أو حساب تليجرام</label>
            <input
              type="url"
              value={telegramUrl}
              onChange={(e) => setTelegramUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">النبذة المهنية والخبرات السريرية</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="avail24"
            checked={is24hAvailable}
            onChange={(e) => setIs24hAvailable(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700"
          />
          <label htmlFor="avail24" className="text-xs font-bold text-slate-300 cursor-pointer">
            تفعيل شارة &quot;متاح 24 ساعة لطوارئ التمريض بدمياط&quot;
          </label>
        </div>

        <button
          type="submit"
          className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition"
        >
          حفظ وتحديث الملف المهني
        </button>
      </form>
    </div>
  )
}
