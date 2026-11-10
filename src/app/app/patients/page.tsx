'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
  PlusIcon,
  PhoneIcon,
  HeartIcon,
  ChevronLeftIcon,
  ArrowTopRightOnSquareIcon,
  ClockIcon,
  MapPinIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase/client'
import { siteConfig } from '@/data/siteConfig'

interface PatientRecord {
  id: string
  full_name: string
  phone: string | null
  age?: number | string
  gender?: string
  blood_type?: string
  allergies?: string
  chronic_diseases?: string
  current_medications?: string
  medical_notes?: string
  zone?: string
  visit_count?: number
  last_visit?: string
  created_at?: string
}

// Demo patients matching Wasl Clinic examples
const fallbackPatients: PatientRecord[] = [
  {
    id: '58f57634-7af0-448a-b15c-5531bc8027db',
    full_name: 'محمود عبد الرحمن',
    age: 50,
    gender: 'ذكر',
    phone: '01001097896',
    blood_type: 'A+',
    allergies: 'لا توجد حساسية دوائية معروفة',
    chronic_diseases: 'السكري، ارتفاع ضغط الدم',
    current_medications: 'Cefotax 1g, Metformin 500mg, Concor 5mg',
    medical_notes: 'وجع في الجنب اليمين من 3 أيام مع ترجيع وسخونية. تم عمل غيار جروح وتحاليل دم.',
    zone: 'مركز وبندر دمياط',
    visit_count: 4,
    last_visit: '2026-11-09',
  },
  {
    id: 'a12b34c5-67de-89fa-bcde-0123456789ab',
    full_name: 'منى السيد إبراهيم',
    age: 42,
    gender: 'أنثى',
    phone: '01023456789',
    blood_type: 'O+',
    allergies: '⚠️ حساسية شديدة من البنسلين ومشتقاته (Penicillin)',
    chronic_diseases: 'حساسية صدرية وربو',
    current_medications: 'Ventolin Inhaler, Claritine 10mg',
    medical_notes: 'متابعة دورية لجلسات نبيولايزر وحقن عضلية آمنة خالية من البنسلين.',
    zone: 'السنانية',
    visit_count: 6,
    last_visit: '2026-11-08',
  },
  {
    id: 'b23c45d6-78ef-90ab-cdef-1234567890bc',
    full_name: 'كريم عادل الدسوقي',
    age: 64,
    gender: 'ذكر',
    phone: '01034567890',
    blood_type: 'B+',
    allergies: '⚠️ حساسية من السلفا والأسبرين',
    chronic_diseases: 'قصور كلوي، أمراض القلب والشرايين',
    current_medications: 'Amiodarone, Lasix 40mg',
    medical_notes: 'غيار جروح قدم سكري معقم وتغيير كانيولا دوري.',
    zone: 'الشعراء',
    visit_count: 12,
    last_visit: '2026-11-07',
  },
  {
    id: 'c34d56e7-89fa-01bc-def0-2345678901cd',
    full_name: 'هالة فتحي عوض',
    age: 35,
    gender: 'أنثى',
    phone: '01045678901',
    blood_type: 'AB+',
    allergies: 'لا توجد حساسية',
    chronic_diseases: '',
    current_medications: 'مكملات حديد وكالسيوم',
    medical_notes: 'سحب عينات تحاليل منزلية ومتابعة كانيولا ومحاليل وريدية بعد الولادة.',
    zone: 'السيالة',
    visit_count: 2,
    last_visit: '2026-11-05',
  },
  {
    id: 'd45e67f8-90ab-12cd-ef01-3456789012de',
    full_name: 'الحاج رمضان الشرباصي',
    age: 72,
    gender: 'ذكر',
    phone: '01056789012',
    blood_type: 'O-',
    allergies: 'لا توجد حساسية معروفة',
    chronic_diseases: 'السكري، قرح فراش، جلطة دماغية سابقة',
    current_medications: 'Clexane 40mg, Atorvastatin 20mg',
    medical_notes: 'شيفت تمريض منزلي يومي ورعاية قرح الفراش وتركيب رايل وقسطرة بولية.',
    zone: 'وسط البلد - دمياط',
    visit_count: 24,
    last_visit: '2026-11-10',
  },
]

export default function PatientsListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get('filter') || 'all'

  const [patients, setPatients] = useState<PatientRecord[]>(fallbackPatients)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch patients from Supabase or merge with demo
  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('last_visit', { ascending: false })

        if (data && data.length > 0) {
          // Merge supabase with fallback so requested demo patient always stays accessible
          const combined = [
            ...data,
            ...fallbackPatients.filter((fb) => !data.some((d) => d.id === fb.id)),
          ]
          setPatients(combined)
        }
      } catch (err) {
        console.error('Error fetching patients:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPatients()
  }, [])

  // Filter logic
  const filteredPatients = patients.filter((p) => {
    // 1. Search Query
    const q = searchTerm.toLowerCase().trim()
    const matchSearch =
      !q ||
      p.full_name?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.zone?.toLowerCase().includes(q) ||
      p.chronic_diseases?.toLowerCase().includes(q) ||
      p.allergies?.toLowerCase().includes(q)

    if (!matchSearch) return false

    // 2. Filter Tab
    if (currentFilter === 'allergy') {
      const allg = (p.allergies || '').toLowerCase()
      return allg && !allg.includes('لا توجد') && !allg.includes('مفيش') && allg !== 'لا'
    }

    if (currentFilter === 'chronic') {
      return Boolean(p.chronic_diseases && p.chronic_diseases.trim().length > 0)
    }

    return true
  })

  const setFilterTab = (tab: 'all' | 'allergy' | 'chronic') => {
    if (tab === 'all') {
      router.push('/app/patients')
    } else {
      router.push(`/app/patients?filter=${tab}`)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <UserGroupIcon className="w-6 h-6 text-gold-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">ملفات وسجلات المرضى</h1>
            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-slate-700">
              {filteredPatients.length} مريض
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            سجلات طبية مشفرة، فحص الحساسية، والأمراض المزمنة مع تقارير الزيارات
          </p>
        </div>

        <Link
          href="/app/intake"
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition"
        >
          <PlusIcon className="w-4 h-4 stroke-[3]" />
          <span>تسجيل مريض جديد (استقبال)</span>
        </Link>
      </div>

      {/* Search Bar & Filter Tabs (Wasl Clinic match) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث بالاسم، الهاتف، المنطقة أو المرض..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl ps-9 pe-3 py-2 text-xs text-white placeholder-slate-500 focus:border-gold-400 focus:outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              currentFilter === 'all'
                ? 'bg-gold-500 text-navy-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الكل ({patients.length})
          </button>

          <button
            onClick={() => setFilterTab('allergy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              currentFilter === 'allergy'
                ? 'bg-rose-600 text-white font-black shadow-xs'
                : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            <span>⚠️ مرضى الحساسية</span>
          </button>

          <button
            onClick={() => setFilterTab('chronic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              currentFilter === 'chronic'
                ? 'bg-blue-600 text-white font-black shadow-xs'
                : 'text-blue-400 hover:text-blue-300'
            }`}
          >
            <span>🩺 أصحاب الأمراض المزمنة</span>
          </button>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => {
          const hasAllergyFlag =
            patient.allergies &&
            !patient.allergies.includes('لا توجد') &&
            !patient.allergies.includes('مفيش') &&
            patient.allergies !== 'لا'

          return (
            <div
              key={patient.id}
              className="bg-navy-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
            >
              {/* Top Row: Name, Age, Blood Type */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-black text-white group-hover:text-gold-400 transition-colors">
                      {patient.full_name}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {patient.age ? `${patient.age} سنة` : ''} {patient.gender ? `· ${patient.gender}` : ''}{' '}
                      {patient.zone ? `· ${patient.zone}` : ''}
                    </p>
                  </div>
                  {patient.blood_type && (
                    <span className="bg-rose-950/40 text-rose-300 border border-rose-500/30 text-[10px] font-black px-2 py-0.5 rounded-lg shrink-0">
                      {patient.blood_type}
                    </span>
                  )}
                </div>

                {/* Prominent Allergy Status Badge (Wasl Clinic feature) */}
                <div>
                  {hasAllergyFlag ? (
                    <div className="bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs px-2.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                      <ShieldExclamationIcon className="w-4 h-4 shrink-0 text-rose-400" />
                      <span className="truncate">{patient.allergies}</span>
                    </div>
                  ) : (
                    <div className="bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-[11px] px-2.5 py-1 rounded-xl font-semibold">
                      ✓ لا توجد حساسية دوائية مسجلة
                    </div>
                  )}
                </div>

                {/* Chronic Diseases */}
                {patient.chronic_diseases && (
                  <div className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">الأمراض المزمنة:</span>
                    <p className="text-slate-200 line-clamp-1">{patient.chronic_diseases}</p>
                  </div>
                )}

                {/* Notes sample */}
                {patient.medical_notes && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                    &quot;{patient.medical_notes}&quot;
                  </p>
                )}
              </div>

              {/* Bottom: Contact & Actions */}
              <div className="border-t border-slate-800/80 pt-3 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{patient.visit_count || 1} زيارات</span>
                  </span>
                  <span>آخر كشف: {patient.last_visit || 'مؤخراً'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/app/patients/${patient.id}`}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-gold-400 hover:text-gold-300 text-xs font-black py-2 px-3 rounded-xl border border-slate-700 text-center transition flex items-center justify-center gap-1"
                  >
                    <span>فتح الملف الطبي</span>
                    <ChevronLeftIcon className="w-3.5 h-3.5" />
                  </Link>

                  {patient.phone && (
                    <>
                      <a
                        href={`https://wa.me/2${patient.phone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 p-2 rounded-xl transition"
                        title="واتساب"
                      >
                        💬
                      </a>
                      <a
                        href={`tel:${patient.phone}`}
                        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 p-2 rounded-xl transition"
                        title="اتصال"
                      >
                        <PhoneIcon className="w-4 h-4" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 bg-navy-900/50 rounded-2xl border border-slate-800 p-8 space-y-3">
          <p className="text-slate-400 text-sm">لا توجد نتائج تطابق البحث أو الفلتر المحدد.</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setFilterTab('all')
            }}
            className="text-gold-400 text-xs font-bold underline"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}
    </div>
  )
}
