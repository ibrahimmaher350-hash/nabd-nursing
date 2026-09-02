'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ArrowRightIcon,
  PhoneIcon,
  CalendarDaysIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

export default function AdminPatientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [pin, setPin] = useState('')
  const [patientData, setPatientData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const savedPin = sessionStorage.getItem('adminPin')
      if (!savedPin) {
        router.push('/admin')
        return
      }
      setPin(savedPin)
      fetchPatientData(savedPin)
    } catch (e) {
      router.push('/admin')
    }
  }, [id])

  const fetchPatientData = async (currentPin: string) => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/patients/${id}`, {
        headers: { 'x-admin-pin': currentPin }
      })
      const data = await res.json()
      if (data.success && data.data) {
        setPatientData(data.data)
      } else {
        setError(data.message || 'المريض غير موجود')
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePatient = async () => {
    if (!confirm('هل أنت متأكد من حذف المريض وجميع سجلاته نهائياً؟')) return
    try {
      const res = await fetch(`/api/admin/patients/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin }
      })
      const data = await res.json()
      if (data.success) {
        router.push('/admin')
      } else {
        alert('حدث خطأ أثناء الحذف')
      }
    } catch (err) {
      alert('خطأ في الاتصال')
    }
  }

  const handleShareLink = () => {
    if (!patientData?.patient?.public_token) {
      alert('لا يوجد رابط مشاركة لهذا المريض')
      return
    }
    const url = `${window.location.origin}/patient/${patientData.patient.public_token}`
    navigator.clipboard.writeText(url).then(() => {
      alert('✅ تم نسخ رابط ملف المريض!\n' + url)
    }).catch(() => {
      prompt('انسخ الرابط يدوياً:', url)
    })
  }

  if (isLoading) {
    return (
      <div className="p-20 text-center">
        <ArrowPathIcon className="w-10 h-10 animate-spin mx-auto text-blue-500" />
        <p className="mt-3 text-slate-500 text-sm">جاري تحميل بيانات المريض...</p>
      </div>
    )
  }

  if (error || !patientData?.patient) {
    return (
      <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-slate-100">
        <p className="text-red-500 mb-4 font-bold">{error || 'بيانات غير موجودة'}</p>
        <Link href="/admin" className="inline-block px-6 py-2.5 bg-blue-800 text-white rounded-xl font-bold text-sm">
          العودة للوحة التحكم
        </Link>
      </div>
    )
  }

  const { patient, visits, vitals, medications, instructions } = patientData

  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-800 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
        >
          <ArrowRightIcon className="w-4 h-4" />
          رجوع
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareLink}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
          >
            <ShareIcon className="w-4 h-4" />
            مشاركة الملف
          </button>
          <button
            onClick={handleDeletePatient}
            className="inline-flex items-center justify-center w-9 h-9 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            title="حذف المريض"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Patient Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">{patient.patient_name}</h2>
          <p className="text-slate-500 text-sm mb-3">
            رقم الملف: <span className="font-mono text-blue-700 font-bold">{patient.patient_id}</span>
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            {patient.phone && (
              <a
                href={`tel:${patient.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                <PhoneIcon className="w-4 h-4 text-green-500" />
                <span dir="ltr">{patient.phone}</span>
              </a>
            )}
            {patient.city && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                📍 {patient.city} {patient.address ? `- ${patient.address}` : ''}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="w-full md:w-auto px-6 py-3 bg-blue-800 text-white font-bold rounded-xl shadow hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
        >
          <DocumentTextIcon className="w-5 h-5" />
          طباعة / PDF
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Visits */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
              المواعيد والزيارات
            </h3>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
              {visits?.length || 0} زيارة
            </span>
          </div>
          <div className="space-y-3">
            {visits?.length > 0 ? (
              visits.map((v: any) => (
                <div key={v.visit_id} className="p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-800">{v.service}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${v.status === 'مكتملة' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {v.status}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    {v.date} {v.time ? `- ${v.time}` : ''} {v.nurse ? `| ${v.nurse}` : ''}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">لا توجد زيارات مسجلة</p>
            )}
          </div>
        </div>

        {/* Vitals */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-rose-500" />
              العلامات الحيوية
            </h3>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg">
              {vitals?.length || 0} قياس
            </span>
          </div>
          <div className="space-y-3">
            {vitals?.length > 0 ? (
              vitals.slice(0, 5).map((v: any) => (
                <div key={v.vital_id} className="p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="text-xs font-bold text-slate-500 mb-2">{v.date} {v.time}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    {v.blood_pressure && (
                      <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
                        <span className="text-slate-400 text-[10px] block">ضغط</span>
                        <strong className="text-slate-700">{v.blood_pressure}</strong>
                      </div>
                    )}
                    {v.blood_glucose && (
                      <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
                        <span className="text-slate-400 text-[10px] block">سكر</span>
                        <strong className="text-slate-700">{v.blood_glucose}</strong>
                      </div>
                    )}
                    {v.spo2 && (
                      <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
                        <span className="text-slate-400 text-[10px] block">O₂</span>
                        <strong className="text-slate-700">{v.spo2}</strong>
                      </div>
                    )}
                    {v.pulse && (
                      <div className="bg-white p-2 rounded-lg border border-slate-100 text-center">
                        <span className="text-slate-400 text-[10px] block">نبض</span>
                        <strong className="text-slate-700">{v.pulse}</strong>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">لا توجد قياسات مسجلة</p>
            )}
          </div>
        </div>

      </div>

      {/* Instructions */}
      {instructions?.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4">📋 التعليمات الطبية</h3>
          <ul className="space-y-2">
            {instructions.map((ins: any, i: number) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <span className="text-amber-500 shrink-0">•</span>
                <span>{ins.instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Print-only PDF Layout */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>
      <div className="print-only bg-white p-8 text-black">
        <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black">نبض للتمريض المنزلي</h1>
            <p className="text-gray-500">Nabd Home Nursing - Damietta</p>
          </div>
        </div>
        <h2 className="text-xl font-bold bg-slate-100 p-2 mb-4">البيانات الأساسية</h2>
        <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <p><strong>اسم المريض:</strong> {patient.patient_name}</p>
          <p><strong>رقم الملف:</strong> {patient.patient_id}</p>
          <p><strong>رقم الهاتف:</strong> {patient.phone}</p>
          <p><strong>العنوان:</strong> {patient.city} {patient.address && `- ${patient.address}`}</p>
          <p><strong>تاريخ التسجيل:</strong> {patient.registration_date}</p>
        </div>
        <div className="text-center mt-12 pt-4 border-t border-gray-300 text-gray-500 text-sm">
          <p>تقرير معتمد من نظام نبض للتمريض المنزلي</p>
          <p>تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
        </div>
      </div>
    </div>
  )
}
