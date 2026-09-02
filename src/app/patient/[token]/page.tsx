'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CalendarDaysIcon,
  HeartIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

export default function PatientProfilePublic({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  
  const [patientData, setPatientData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPatientData()
  }, [token])

  const fetchPatientData = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/patient/${token}`)
      const data = await res.json()
      if (data.success && data.data) {
        setPatientData(data.data)
      } else {
        setError('الملف الطبي غير موجود أو الرابط غير صحيح.')
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <ArrowPathIcon className="w-10 h-10 animate-spin text-navy-500" />
      </div>
    )
  }

  if (error || !patientData?.patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-cairo" dir="rtl">
        <div className="text-center p-10 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-sm w-full m-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
          <p className="text-navy-900 font-bold mb-4">{error}</p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-navy-600 text-white rounded-xl font-bold text-sm">العودة للصفحة الرئيسية</Link>
        </div>
      </div>
    )
  }

  const { patient, visits, vitals, instructions } = patientData

  return (
    <div className="min-h-screen bg-slate-50 font-cairo pb-20" dir="rtl">
      {/* Patient Public Header */}
      <header className="bg-gradient-to-l from-navy-800 to-navy-900 text-white pt-10 pb-6 rounded-b-[2rem] shadow-lg">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white rounded-2xl p-2 mb-4 shadow-xl">
            <Image src="/logo.jpg" alt="نبض للتمريض المنزلي" width={80} height={80} className="rounded-xl" />
          </div>
          <h1 className="text-2xl font-black mb-1">{patient.patient_name}</h1>
          <p className="text-navy-200 text-sm">الملف الطبي الموحد — نبض للتمريض المنزلي</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm">
            <span>رقم الملف: <strong className="font-mono">{patient.patient_id}</strong></span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        
        {/* Upcoming Visit Highlight (if any) */}
        {visits?.filter((v:any) => v.status === 'مجدولة').slice(0, 1).map((v: any) => (
          <div key={v.visit_id} className="bg-white rounded-3xl p-6 shadow-card border border-emerald-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <CalendarDaysIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900">الموعد القادم</h3>
                <p className="text-xs text-emerald-600">تم تأكيد الموعد</p>
              </div>
            </div>
            <div className="text-lg font-black text-navy-900 mb-1">{v.date} — {v.time}</div>
            <div className="text-sm font-bold text-slate-600">{v.service}</div>
          </div>
        ))}

        {/* Vitals History */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-navy-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
            <HeartIcon className="w-5 h-5 text-rose-500" />
            أحدث العلامات الحيوية
          </h3>
          <div className="space-y-3">
            {vitals?.length > 0 ? vitals.slice(0, 3).map((v: any) => (
              <div key={v.vital_id} className="p-4 rounded-xl bg-slate-50 flex flex-col gap-3">
                <div className="text-xs font-bold text-slate-500">{v.date} {v.time}</div>
                <div className="flex flex-wrap gap-2 text-sm">
                  {v.blood_pressure && <div className="bg-white px-3 py-2 rounded-lg shadow-xs"><span className="text-slate-400 text-[10px] block">ضغط الدم</span><strong className="text-navy-700">{v.blood_pressure}</strong></div>}
                  {v.blood_glucose && <div className="bg-white px-3 py-2 rounded-lg shadow-xs"><span className="text-slate-400 text-[10px] block">السكر</span><strong className="text-navy-700">{v.blood_glucose}</strong></div>}
                  {v.spo2 && <div className="bg-white px-3 py-2 rounded-lg shadow-xs"><span className="text-slate-400 text-[10px] block">الأكسجين</span><strong className="text-navy-700">{v.spo2}</strong></div>}
                </div>
              </div>
            )) : <p className="text-sm text-slate-400 text-center py-2">لا توجد قياسات مسجلة</p>}
          </div>
        </div>

        {/* Instructions */}
        {instructions?.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-navy-900 flex items-center gap-2 mb-4 border-b border-slate-100 pb-4">
              <ClipboardDocumentCheckIcon className="w-5 h-5 text-amber-500" />
              التعليمات الطبية النشطة
            </h3>
            <ul className="space-y-2">
              {instructions.map((ins: any) => (
                <li key={ins.instruction_id} className="flex gap-2 text-sm text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <span className="text-amber-500">•</span>
                  <span>{ins.instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center pt-4">
          <p className="text-xs text-slate-400 mb-2">هذا الملف مخصص للقراءة فقط ومؤمن بالكامل.</p>
          <a href="https://wa.me/201099667065" className="text-xs font-bold text-emerald-500 hover:underline">للتواصل أو حجز موعد جديد عبر واتساب</a>
        </div>
      </main>
    </div>
  )
}
