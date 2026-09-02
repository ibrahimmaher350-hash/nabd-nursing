'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  UsersIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  ArrowPathIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid'

export default function AdminDashboard() {
  const [pin, setPin] = useState('')
  const [isAuth, setIsAuth] = useState(false)
  const [authError, setAuthError] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPatient, setNewPatient] = useState({ patient_name: '', phone: '', city: 'دمياط' })

  // Check auth on load from session storage
  useEffect(() => {
    try {
      const savedPin = sessionStorage.getItem('adminPin')
      if (savedPin) {
        setPin(savedPin)
        setIsAuth(true)
        fetchPatients(savedPin)
      }
    } catch (e) {
      // sessionStorage not available
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (pin === '2026' || pin === '01001097896') {
      try {
        sessionStorage.setItem('adminPin', pin)
      } catch (e) {}
      setIsAuth(true)
      setAuthError('')
      fetchPatients(pin)
    } else {
      setAuthError('الرمز السري غير صحيح')
    }
  }

  const fetchPatients = async (currentPin: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/patients', {
        headers: { 'x-admin-pin': currentPin }
      })
      const data = await res.json()
      if (data.success) {
        setPatients(data.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAdding(true)
    try {
      const res = await fetch('/api/admin/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin
        },
        body: JSON.stringify(newPatient)
      })
      const data = await res.json()
      if (data.success) {
        setNewPatient({ patient_name: '', phone: '', city: 'دمياط' })
        setShowAddForm(false)
        fetchPatients(pin)
      } else {
        alert(data.message || 'حدث خطأ')
      }
    } catch (err) {
      console.error(err)
      alert('خطأ في الاتصال')
    } finally {
      setIsAdding(false)
    }
  }

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-700">
            <LockClosedIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">تسجيل دخول الإدارة</h2>
          <p className="text-sm text-slate-500 mb-8">أدخل رمز المشرف للوصول إلى النظام</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center text-2xl tracking-widest px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="****"
                autoFocus
              />
              {authError && <p className="text-red-500 text-xs mt-2">{authError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-800 text-white font-bold py-3.5 rounded-xl hover:bg-blue-900 transition-all"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    )
  }

  const filteredPatients = patients.filter(p =>
    (p.patient_name || '').includes(search) ||
    (p.phone || '').includes(search) ||
    (p.patient_id || '').includes(search)
  )

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">إجمالي المرضى</p>
            <p className="text-2xl font-black text-slate-900">{patients.length}</p>
          </div>
        </div>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <MagnifyingGlassIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالاسم أو رقم الهاتف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-800 text-white font-bold px-5 py-3 rounded-xl shadow hover:bg-blue-900 transition-all"
        >
          <UserPlusIcon className="w-5 h-5" />
          إضافة مريض جديد
        </button>
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <UserPlusIcon className="w-5 h-5 text-blue-600" />
            تسجيل مريض جديد
          </h3>
          <form onSubmit={handleAddPatient} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">اسم المريض</label>
              <input
                required
                type="text"
                value={newPatient.patient_name}
                onChange={e => setNewPatient({ ...newPatient, patient_name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="الاسم ثلاثي"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">رقم الهاتف</label>
              <input
                required
                type="tel"
                value={newPatient.phone}
                onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                dir="ltr"
                placeholder="010..."
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={isAdding}
                className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-70"
              >
                {isAdding ? 'جاري الحفظ...' : 'حفظ وإنشاء ملف'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 text-sm"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Patients List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="font-bold text-slate-900">سجل المرضى</h2>
          <button
            onClick={() => fetchPatients(pin)}
            className="p-2 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="تحديث"
          >
            <ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {isLoading && patients.length === 0 ? (
          <div className="p-10 text-center text-slate-500 flex flex-col items-center">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-300 mb-3" />
            <p>جاري تحميل البيانات...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient: any) => (
                <div
                  key={patient.patient_id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg">{patient.patient_name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${patient.status === 'نشط' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                        {patient.status || 'نشط'}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                      <span>ملف: <strong className="font-mono text-xs text-blue-700">{patient.patient_id}</strong></span>
                      <span>هاتف: <span dir="ltr">{patient.phone}</span></span>
                      {patient.registration_date && <span>تاريخ: {patient.registration_date}</span>}
                    </div>
                  </div>
                  <Link
                    href={`/admin/patient/${patient.patient_id}`}
                    className="w-full sm:w-auto text-center px-6 py-2.5 bg-slate-100 hover:bg-blue-50 text-blue-800 font-bold text-sm rounded-xl transition-colors border border-slate-200 hover:border-blue-200"
                  >
                    فتح الملف
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-slate-500">
                {patients.length === 0 ? 'لا يوجد مرضى مسجلين بعد. أضف أول مريض!' : 'لا يوجد مرضى مطابقين للبحث'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
