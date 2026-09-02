'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRightIcon,
  PhoneIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

export default function AdminPatientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const [pin, setPin] = useState('')
  const [patientData, setPatientData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const savedPin = sessionStorage.getItem('adminPin')
    if (!savedPin) {
      router.push('/admin')
      return
    }
    setPin(savedPin)
    fetchPatientData(savedPin)
  }, [id])

  const fetchPatientData = async (currentPin: string) => {
    setIsLoading(true)
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

  if (isLoading) {
    return <div className="p-20 text-center"><ArrowPathIcon className="w-10 h-10 animate-spin mx-auto text-navy-500" /></div>
  }

  if (error || !patientData?.patient) {
    return (
      <div className="text-center p-10 bg-white rounded-2xl shadow-sm">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/admin" className="text-navy-600 underline">العودة للوحة التحكم</Link>
      </div>
    )
  }

  const { patient, visits, vitals, medications, instructions } = patientData

  return (
    <div className="space-y-6">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-navy-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
          <ArrowRightIcon className="w-4 h-4" />
          رجوع
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              const url = `${window.location.origin}/patient/${patient.public_token}`
              navigator.clipboard.writeText(url)
              alert('تم نسخ رابط ملف المريض بنجاح!')
            }}
            className="inline-flex items-center gap-2 text-sm font-bold text-navy-700 bg-navy-50 hover:bg-navy-100 px-4 py-2 rounded-xl transition-colors"
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
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-navy-50 rounded-full blur-3xl -z-10"></div>
        <div>
          <h2 className="text-2xl font-black text-navy-900 mb-1">{patient.patient_name}</h2>
          <p className="text-slate-500 text-sm mb-3">رقم الملف: <span className="font-mono text-navy-600 font-bold">{patient.patient_id}</span></p>
          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <a href={`tel:${patient.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100">
              <PhoneIcon className="w-4 h-4 text-emerald-500" />
              <span dir="ltr">{patient.phone}</span>
            </a>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700">
              📍 {patient.city} {patient.address ? `- ${patient.address}` : ''}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full md:w-auto no-print">
          <button onClick={() => window.print()} className="w-full md:w-auto px-6 py-3 bg-navy-600 text-white font-bold rounded-xl shadow-md hover:bg-navy-700 transition-colors flex justify-center gap-2">
            <DocumentTextIcon className="w-5 h-5" />
            إنشاء تقرير PDF
          </button>
        </div>
      </div>

      {/* --- Print Only PDF Layout --- */}
      <div className="hidden print:block absolute top-0 left-0 w-full bg-white text-black p-8 font-cairo z-50 min-h-screen">
        <div className="flex justify-between items-center border-b-2 border-navy-900 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-navy-900">نبض للتمريض المنزلي</h1>
            <p className="text-gray-500">Nabd Home Nursing - Damietta</p>
          </div>
          <img src="/logo.jpg" alt="Logo" className="w-20 h-20 rounded-xl grayscale" />
        </div>
        
        <h2 className="text-xl font-bold bg-navy-100 p-2 mb-4">البيانات الأساسية</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <p><strong>اسم المريض:</strong> {patient.patient_name}</p>
          <p><strong>رقم الملف:</strong> {patient.patient_id}</p>
          <p><strong>رقم الهاتف:</strong> {patient.phone}</p>
          <p><strong>العنوان:</strong> {patient.city} {patient.address && `- ${patient.address}`}</p>
          <p><strong>تاريخ التسجيل:</strong> {patient.registration_date}</p>
        </div>

        {vitals?.length > 0 && (
          <>
            <h2 className="text-xl font-bold bg-navy-100 p-2 mb-4">أحدث العلامات الحيوية</h2>
            <table className="w-full text-sm border-collapse mb-8 text-center">
              <thead>
                <tr className="bg-gray-100 border border-gray-300">
                  <th className="p-2 border border-gray-300">التاريخ</th>
                  <th className="p-2 border border-gray-300">الضغط</th>
                  <th className="p-2 border border-gray-300">النبض</th>
                  <th className="p-2 border border-gray-300">الأكسجين</th>
                  <th className="p-2 border border-gray-300">السكر</th>
                </tr>
              </thead>
              <tbody>
                {vitals.slice(0, 5).map((v: any) => (
                  <tr key={v.vital_id} className="border border-gray-300">
                    <td className="p-2 border border-gray-300">{v.date}</td>
                    <td className="p-2 border border-gray-300">{v.blood_pressure || '-'}</td>
                    <td className="p-2 border border-gray-300">{v.pulse || '-'}</td>
                    <td className="p-2 border border-gray-300">{v.spo2 || '-'}</td>
                    <td className="p-2 border border-gray-300">{v.blood_glucose || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="text-center mt-12 pt-4 border-t border-gray-300 text-gray-500 text-sm">
          <p>هذا التقرير معتمد ومستخرج إلكترونياً من نظام نبض للتمريض المنزلي.</p>
          <p>تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
        </div>
      </div>
      {/* --- End Print Layout --- */}

      {/* Content Grid (Hidden on Print) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
        
        {/* Visits Section */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-navy-900 flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-navy-500" />
              المواعيد والزيارات
            </h3>
            <button className="text-xs font-bold text-navy-600 bg-navy-50 px-3 py-1.5 rounded-lg hover:bg-navy-100">+ إضافة زيارة</button>
          </div>
          <div className="space-y-3">
            {visits?.length > 0 ? visits.map((v: any) => (
              <div key={v.visit_id} className="p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-sm text-navy-800">{v.service}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${v.status === 'مكتملة' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{v.status}</span>
                </div>
                <div className="text-xs font-medium text-slate-500">
                  {v.date} {v.time ? `- ${v.time}` : ''} | {v.nurse}
                </div>
              </div>
            )) : <p className="text-sm text-slate-400 text-center py-4">لا توجد زيارات مسجلة</p>}
          </div>
        </div>

        {/* Vitals Section */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-navy-900 flex items-center gap-2">
              <HeartIcon className="w-5 h-5 text-rose-500" />
              العلامات الحيوية
            </h3>
            <button className="text-xs font-bold text-navy-600 bg-navy-50 px-3 py-1.5 rounded-lg hover:bg-navy-100">+ إضافة قياس</button>
          </div>
          <div className="space-y-3">
            {vitals?.length > 0 ? vitals.map((v: any) => (
              <div key={v.vital_id} className="p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                <div className="text-xs font-bold text-slate-500 mb-1">{v.date} {v.time}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  {v.blood_pressure && <div className="bg-white p-2 rounded-lg border border-slate-100"><span className="text-slate-400 text-[10px] block">ضغط الدم</span><strong className="text-navy-700">{v.blood_pressure}</strong></div>}
                  {v.blood_glucose && <div className="bg-white p-2 rounded-lg border border-slate-100"><span className="text-slate-400 text-[10px] block">السكر</span><strong className="text-navy-700">{v.blood_glucose}</strong></div>}
                  {v.spo2 && <div className="bg-white p-2 rounded-lg border border-slate-100"><span className="text-slate-400 text-[10px] block">أكسجين</span><strong className="text-navy-700">{v.spo2}</strong></div>}
                  {v.pulse && <div className="bg-white p-2 rounded-lg border border-slate-100"><span className="text-slate-400 text-[10px] block">نبض</span><strong className="text-navy-700">{v.pulse}</strong></div>}
                </div>
              </div>
            )) : <p className="text-sm text-slate-400 text-center py-4">لا توجد قياسات مسجلة</p>}
          </div>
        </div>

      </div>
    </div>
  )
}
