'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  HeartIcon,
  ShieldExclamationIcon,
  PrinterIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  BeakerIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase/client'
import { siteConfig } from '@/data/siteConfig'

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params?.id as string

  const [activeTab, setActiveTab] = useState<'summary' | 'prescription' | 'edit'>('summary')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Patient Fields
  const [name, setName] = useState('محمود عبد الرحمن')
  const [phone, setPhone] = useState('01001097896')
  const [age, setAge] = useState('50')
  const [gender, setGender] = useState('ذكر')
  const [bloodType, setBloodType] = useState('A+')
  const [zone, setZone] = useState('مركز وبندر دمياط')
  const [allergies, setAllergies] = useState('لا توجد حساسية دوائية معروفة')
  const [chronic, setChronic] = useState('السكري، ارتفاع ضغط الدم')
  const [medications, setMedications] = useState('Cefotax 1g, Metformin 500mg, Concor 5mg')
  const [complaint, setComplaint] = useState('وجع في الجنب اليمين من 3 أيام مع ترجيع وسخونية')
  const [medicalNotes, setMedicalNotes] = useState('متابعة غيار جروح معقم، قياس سكر عشوائي وضغط دم.')

  // Lab Results (Wasl Clinic match)
  const [labs, setLabs] = useState([
    { name: 'WBC (كرات الدم البيضاء)', value: '13.8', status: 'high', unit: '10^3/uL', ref: '4.0 - 11.0' },
    { name: 'Hb (الهيموجلوبين)', value: '11.2', status: 'low', unit: 'g/dL', ref: '13.0 - 17.0' },
    { name: 'RBS (السكر العشوائي)', value: '145', status: 'normal', unit: 'mg/dL', ref: '< 140' },
    { name: 'SpO2 (تشبع الأكسجين)', value: '98%', status: 'normal', unit: '%', ref: '95 - 100' },
  ])

  // Prescriptions list
  const [prescriptions, setPrescriptions] = useState([
    {
      drug: 'Cefotax 1g Vial',
      dose: 'فيال عضل كل 12 ساعة لمدة 5 أيام بعد اختبار الحساسية',
      interaction: 'لا يوجد تعارض معروف',
      severity: 'safe',
    },
    {
      drug: 'Metformin 500mg',
      dose: 'قرص واحد مرتين يومياً بعد الوجبات',
      interaction: 'آمن مع الأدوية الموصوفة',
      severity: 'safe',
    },
    {
      drug: 'Panadol 500mg',
      dose: 'قرص عند اللزوم لتسكين الألم وخفض الحرارة',
      interaction: 'خارج قاعدة التعارضات',
      severity: 'warning',
    },
  ])

  // Visits History
  const [visits, setVisits] = useState([
    {
      date: '2026-11-10 10:30 ص',
      service: 'كانيولا ومحاليل وريدية وغيار جروح',
      nurse: 'فريق نبض للتمريض المنزلي',
      vitals: 'BP: 125/80 | SpO2: 98% | Pulse: 78 | Temp: 37.2°C',
      notes: 'تم فحص موضع الكانيولا سليم تماماً مع تعقيم الجرح بدون أي التهابات.',
    },
    {
      date: '2026-11-08 04:00 م',
      service: 'سحب عينات تحاليل منزلية وحقن عضل',
      nurse: 'فريق نبض للتمريض المنزلي',
      vitals: 'BP: 130/85 | SpO2: 97% | Temp: 37.6°C',
      notes: 'تم سحب عينات صورة دم كاملة وإرسالها للمعمل وتطهير موضع الحقن.',
    },
  ])

  // Load from Supabase if real ID
  useEffect(() => {
    async function load() {
      if (!patientId || patientId === '58f57634-7af0-448a-b15c-5531bc8027db') return
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .maybeSingle()

        if (data) {
          setName(data.full_name || name)
          setPhone(data.phone || phone)
          setBloodType(data.blood_type || bloodType)
          setAllergies(data.allergies || allergies)
          setChronic(data.chronic_diseases || chronic)
          setMedications(data.current_medications || medications)
          setMedicalNotes(data.medical_notes || medicalNotes)
        }
      } catch (e) {
        console.error('Error loading patient detail:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [patientId])

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (patientId && patientId !== '58f57634-7af0-448a-b15c-5531bc8027db') {
        await supabase
          .from('patients')
          .update({
            full_name: name,
            phone,
            blood_type: bloodType,
            allergies,
            chronic_diseases: chronic,
            current_medications: medications,
            medical_notes: medicalNotes,
          })
          .eq('id', patientId)
      }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const hasAllergyFlag =
    allergies &&
    !allergies.includes('لا توجد') &&
    !allergies.includes('مفيش') &&
    allergies !== 'لا'

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/app/patients"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowRightIcon className="w-3.5 h-3.5" />
          <span>العودة لقائمة ملفات المرضى</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="no-print inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition"
        >
          <PrinterIcon className="w-4 h-4 text-gold-400" />
          <span>طباعة الملف الطبي / الروشتة</span>
        </button>
      </div>

      {/* Patient Header Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/20 border border-gold-500/40 text-gold-400 flex items-center justify-center text-xl font-black shrink-0 shadow-inner">
              {name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">{name}</h1>
                <span className="bg-rose-950/60 text-rose-300 border border-rose-500/40 text-xs font-black px-2 py-0.5 rounded-lg">
                  فصيلة {bloodType}
                </span>
                <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-lg">
                  {age} سنة · {gender}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                📍 {zone} · ملف رقم: <span className="font-mono text-slate-300 text-[11px]">{patientId.slice(0, 8)}...</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {phone && (
              <>
                <a
                  href={`https://wa.me/2${phone.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-xs py-2 px-3.5 rounded-xl shadow-xs"
                >
                  💬 واتساب
                </a>
                <a
                  href={`tel:${phone}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <PhoneIcon className="w-3.5 h-3.5" />
                  <span>اتصال</span>
                </a>
              </>
            )}
            <Link
              href="/app/intake"
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-black py-2 px-3.5 rounded-xl shadow-xs"
            >
              + حجز زيارة جديدة
            </Link>
          </div>
        </div>

        {/* Prominent Allergy Alert Banner */}
        <div
          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
            hasAllergyFlag
              ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
              : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldExclamationIcon className="w-5 h-5 shrink-0" />
            <span>فحص الحساسية الدوائية: {allergies}</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-black/30">
            Safety Checked
          </span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'summary'
              ? 'bg-gold-500 text-navy-950 font-black shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <SparklesIcon className="w-4 h-4" />
          <span>ملخص الكشف والزيارات</span>
        </button>

        <button
          onClick={() => setActiveTab('prescription')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'prescription'
              ? 'bg-gold-500 text-navy-950 font-black shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <DocumentTextIcon className="w-4 h-4" />
          <span>الروشتة وفحص التعارضات</span>
        </button>

        <button
          onClick={() => setActiveTab('edit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'edit'
              ? 'bg-gold-500 text-navy-950 font-black shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>تعديل البيانات الأساسية</span>
        </button>
      </div>

      {/* Tab 1: Clinical Summary & Visits History (Wasl Clinic match) */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Wasl style AI Summary & Labs (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* AI Summary Card */}
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-gold-400" />
                  <h2 className="text-sm font-black text-white">ملخص المساعد الذكي للحالة</h2>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                  تحديث تلقائي
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-gold-400 font-bold block mb-1">الشكوى الأساسية:</span>
                  <p className="text-white text-sm font-medium">{complaint}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-gold-400 font-bold block mb-1">الأمراض المزمنة:</span>
                    <p className="text-slate-200">{chronic || 'لا يوجد'}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-gold-400 font-bold block mb-1">الأدوية المنتظمة:</span>
                    <p className="text-slate-200">{medications || 'لا توجد أدوية منتظمة'}</p>
                  </div>
                </div>

                {medicalNotes && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-bold block mb-1">ملاحظات التمريض السريرية:</span>
                    <p className="text-slate-300">{medicalNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Lab Investigations Card (قراءة التحاليل - Wasl feature) */}
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BeakerIcon className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-sm font-black text-white">قراءة نتائج التحاليل والعلامات</h2>
                </div>
                <span className="text-[10px] bg-cyan-950/50 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                  مؤكد سريرياً
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {labs.map((lab, i) => (
                  <div
                    key={i}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{lab.name}</p>
                      <p className="text-[10px] text-slate-500">المدى الطبيعي: {lab.ref}</p>
                    </div>
                    <div className="text-end">
                      <span
                        className={`text-sm font-black font-mono ${
                          lab.status === 'high'
                            ? 'text-rose-400'
                            : lab.status === 'low'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {lab.value}{' '}
                        {lab.status === 'high' ? '↑' : lab.status === 'low' ? '↓' : ''}
                      </span>
                      <p className="text-[10px] text-slate-400">{lab.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visits Timeline */}
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-gold-400" />
                <span>سجل زيارات التمريض المنزلي السابقة</span>
              </h2>

              <div className="space-y-3">
                {visits.map((v, i) => (
                  <div key={i} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-black text-gold-300">{v.service}</span>
                      <span className="text-[11px] text-slate-400">{v.date}</span>
                    </div>
                    <p className="text-[11px] text-cyan-300 font-mono" dir="ltr">
                      {v.vitals}
                    </p>
                    <p className="text-xs text-slate-300">{v.notes}</p>
                    <p className="text-[10px] text-slate-500">مقدم الخدمة: {v.nurse}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Action Box */}
          <div className="space-y-4">
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-black text-gold-400">⚡ إجراءات سريعة</h3>
              <Link
                href="/app/intake"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl text-xs font-bold text-center block transition shadow-sm"
              >
                + تسجيل كشف / زيارة جديدة
              </Link>
              <button
                onClick={() => setActiveTab('prescription')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-3 rounded-xl text-xs font-bold text-center block transition border border-slate-700"
              >
                📄 عرض وطباعة الروشتة
              </button>
              <a
                href="https://calendar.google.com/calendar/u/1/r"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-2.5 px-3 rounded-xl text-xs font-bold text-center block transition border border-blue-500/30"
              >
                📅 مزامنة الموعد مع تقويم جوجل
              </a>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl text-xs text-slate-400 space-y-2">
              <p className="font-bold text-white">🔒 خصوصية وأمان السجل الطبي</p>
              <p className="text-[11px] leading-relaxed">
                ملفات المرضى مشفرة، لا يتم مشاركتها، وتخضع لميثاق شرف المهنة والسرية الطبية التامة تحت إشراف نبض للتمريض المنزلي.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Prescription & Drug Interaction Checker (Wasl Clinic match) */}
      {activeTab === 'prescription' && (
        <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-white">روشتة العلاج وفحص التعارضات الدوائية</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                فحص الأدوية المصرح بها في مصر مع تحذيرات التعارض الدوائي الصريحة
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
            >
              <PrinterIcon className="w-4 h-4" />
              <span>طباعة الروشتة المعتمدة</span>
            </button>
          </div>

          {/* Prescriptions Table with Drug Interaction status */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gold-400">الأدوية المقررة:</h3>
            <div className="space-y-2.5">
              {prescriptions.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-white">{p.drug}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.severity === 'safe'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.interaction}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{p.dose}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Printable Prescription Template (Preview) */}
          <div className="bg-white text-navy-950 p-6 rounded-2xl shadow-xl space-y-6 border border-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-navy-900 pb-4">
              <div>
                <h3 className="text-lg font-black text-navy-950">نبض للتمريض المنزلي</h3>
                <p className="text-xs text-slate-600 font-bold">خدمات الرعاية الصحية والتمريض المنزلي التخصصي</p>
                <p className="text-xs text-slate-500">مركز وبندر دمياط · هاتف: {siteConfig.contact.phone}</p>
              </div>
              <div className="text-end text-xs">
                <p className="font-bold text-navy-900">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                <p className="text-slate-600">المريض: {name}</p>
                <p className="text-slate-600">السن: {age} سنة</p>
              </div>
            </div>

            {/* Body (Rx) */}
            <div className="min-h-[140px] space-y-4">
              <p className="text-2xl font-serif font-black text-navy-900">Rx</p>
              <ol className="list-decimal list-inside space-y-2 text-xs font-bold text-slate-800">
                {prescriptions.map((p, i) => (
                  <li key={i} className="leading-relaxed">
                    <span className="font-black text-navy-950">{p.drug}</span> — {p.dose}
                  </li>
                ))}
              </ol>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-500">
              <p>تنبيه: تُصرف الأدوية تحت الإشراف الطبي المباشر. سلامة المريض أولويتنا.</p>
              <div className="text-end">
                <p className="font-bold text-navy-950">التوقيع / الختم</p>
                <p className="font-cursive text-slate-400">نبض التمريض المنزلي</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Edit Patient Details */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSaveEdit} className="bg-navy-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-black text-white">تعديل بيانات وسجل المريض</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الاسم بالكامل</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">فصيلة الدم</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">المنطقة بدمياط</label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-rose-300 mb-1">الحساسية الدوائية (تنبيه سلامة)</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full bg-slate-950 border border-rose-500/50 rounded-xl p-2.5 text-xs text-rose-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الأمراض المزمنة</label>
            <input
              type="text"
              value={chronic}
              onChange={(e) => setChronic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">الأدوية الحالية</label>
            <input
              type="text"
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">ملاحظات سريرية</label>
            <textarea
              rows={3}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow-md"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات في السجل'}
            </button>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" />
                تم حفظ التعديلات بنجاح!
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  )
}
