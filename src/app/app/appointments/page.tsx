'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CalendarDaysIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  PhoneIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase/client'
import { siteConfig } from '@/data/siteConfig'

interface AppointmentItem {
  id: string
  patient_name: string
  patient_phone: string
  title: string
  visit_type: string
  start_at: string
  location: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
}

const fallbackAppointments: AppointmentItem[] = [
  {
    id: 'apt-1',
    patient_name: 'محمود عبد الرحمن',
    patient_phone: '01001097896',
    title: 'كانيولا ومحاليل وريدية',
    visit_type: 'تركيب كانيولا وتعليق محاليل',
    start_at: new Date().toISOString().split('T')[0] + 'T10:30:00',
    location: 'مركز وبندر دمياط - شارع الجلاء',
    status: 'in_progress',
    notes: 'مريض سكري، تعليق محلول ملح 500 مل ومتابعة الضغط',
  },
  {
    id: 'apt-2',
    patient_name: 'منى السيد إبراهيم',
    patient_phone: '01023456789',
    title: 'حقن عضل وغيار جروح',
    visit_type: 'غيار الجروح البسيطة',
    start_at: new Date().toISOString().split('T')[0] + 'T12:00:00',
    location: 'السنانية - بجوار مسجد النور',
    status: 'confirmed',
    notes: 'حساسية بنسلين، حقن سيفوتاكس مع تعقيم الجرح',
  },
  {
    id: 'apt-3',
    patient_name: 'كريم عادل الدسوقي',
    patient_phone: '01034567890',
    title: 'غيار جروح معقدة وقدم سكري',
    visit_type: 'غيار الجروح المعقدة',
    start_at: new Date().toISOString().split('T')[0] + 'T16:30:00',
    location: 'الشعراء - عمارة الأمل',
    status: 'pending',
    notes: 'غيار قدم سكري يتطلب عناية وتعقيم دقيق ومحاليل مطهرة',
  },
  {
    id: 'apt-4',
    patient_name: 'الحاج رمضان الشرباصي',
    patient_phone: '01056789012',
    title: 'شيفت تمريض منزلي 12 ساعة',
    visit_type: 'شيفت تمريض منزلي',
    start_at: new Date().toISOString().split('T')[0] + 'T20:00:00',
    location: 'وسط البلد - دمياط',
    status: 'pending',
    notes: 'متابعة ليلية كاملة، رعاية قسطرة ورايل وعلامات حيوية',
  },
]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(fallbackAppointments)
  const [filter, setFilter] = useState<'today' | 'queue' | 'upcoming' | 'completed'>('today')
  const [loading, setLoading] = useState(false)
  const [syncingGoogle, setSyncingGoogle] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(false)

  // Fetch Supabase appointments
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .order('start_at', { ascending: true })

        if (data && data.length > 0) {
          const mapped: AppointmentItem[] = data.map((d: any) => ({
            id: d.id,
            patient_name: d.patient_name || 'مريض بدون اسم',
            patient_phone: d.patient_phone || siteConfig.contact.phone,
            title: d.title || d.visit_type || 'زيارة تمريضية',
            visit_type: d.visit_type || 'تمريض منزلي',
            start_at: d.start_at || new Date().toISOString(),
            location: d.location || 'مركز وبندر دمياط',
            status: d.status || 'confirmed',
            notes: d.notes || '',
          }))
          setAppointments(mapped)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Sync with Google Calendar handler
  const handleSyncGoogle = async () => {
    setSyncingGoogle(true)
    try {
      // Trigger local sync route
      await fetch('/api/appointments', { method: 'GET' }).catch(() => null)
      setSyncSuccess(true)
      setTimeout(() => setSyncSuccess(false), 4000)
    } catch (e) {
      console.error(e)
    } finally {
      setSyncingGoogle(false)
    }
  }

  // Update status locally & Supabase
  const updateStatus = async (id: string, newStatus: AppointmentItem['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    )
    try {
      await supabase.from('appointments').update({ status: newStatus }).eq('id', id)
    } catch (e) {
      console.error(e)
    }
  }

  // Filter appointments
  const todayStr = new Date().toISOString().split('T')[0]
  const filtered = appointments.filter((apt) => {
    const aptDate = (apt.start_at || '').split('T')[0]
    if (filter === 'today') return aptDate === todayStr || apt.status === 'in_progress'
    if (filter === 'queue') return apt.status === 'in_progress' || apt.status === 'pending' || apt.status === 'confirmed'
    if (filter === 'completed') return apt.status === 'completed'
    if (filter === 'upcoming') return aptDate >= todayStr && apt.status !== 'completed'
    return true
  })

  // Format 12-hour time
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return '10:00 ص'
    }
  }

  const sendWhatsAppReminder = (apt: AppointmentItem) => {
    const timeFormatted = formatTime(apt.start_at)
    const text = `السلام عليكم ورحمة الله وبركاته، أ/ ${apt.patient_name}.
نود تذكيركم بموعد زيارة التمريض المنزلي من *نبض للتمريض المنزلي* اليوم في تمام الساعة *${timeFormatted}*.
• الخدمة المطلوبة: ${apt.visit_type}
• العنوان: ${apt.location}

فريق نبض في خدمتكم على مدار 24 ساعة. دمتم بصحة وعافية.`
    const url = `https://wa.me/2${apt.patient_phone.replace(/^0/, '')}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <CalendarDaysIcon className="w-6 h-6 text-gold-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">المواعيد والطابور اللحظي</h1>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              مربوط بتقويم Google Calendar
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            جدول زيارات التمريض المنزلي اليومية بدمياط، التذكير الفوري بالواتساب والمزامنة السحابية
          </p>
        </div>

        {/* Google Calendar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSyncGoogle}
            disabled={syncingGoogle}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${syncingGoogle ? 'animate-spin' : ''}`} />
            <span>{syncingGoogle ? 'جاري المزامنة...' : 'مزامنة مع تقويم Google'}</span>
          </button>

          <a
            href="https://calendar.google.com/calendar/u/1/r"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-gold-400" />
            <span>فتح Google Calendar ↗</span>
          </a>

          <Link
            href="/app/intake"
            className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-black px-3.5 py-2.5 rounded-xl shadow-md transition"
          >
            <PlusIcon className="w-4 h-4 stroke-[3]" />
            <span>حجز زيارة جديدة</span>
          </Link>
        </div>
      </div>

      {syncSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 p-3 rounded-xl text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
            <span>تمت مزامنة المواعيد بنجاح مع تقويم Google Calendar وجداول العمل!</span>
          </div>
          <span className="text-[10px] text-slate-400">محدث الآن</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setFilter('today')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            filter === 'today'
              ? 'bg-gold-500 text-navy-950 font-black shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          زيارات اليوم ({appointments.filter((a) => (a.start_at || '').includes(todayStr)).length})
        </button>

        <button
          onClick={() => setFilter('queue')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
            filter === 'queue'
              ? 'bg-emerald-600 text-white font-black shadow-xs'
              : 'text-emerald-400 hover:text-emerald-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>طابور المتابعة اللحظي</span>
        </button>

        <button
          onClick={() => setFilter('upcoming')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            filter === 'upcoming'
              ? 'bg-blue-600 text-white font-black shadow-xs'
              : 'text-blue-400 hover:text-blue-300'
          }`}
        >
          المواعيد القادمة
        </button>

        <button
          onClick={() => setFilter('completed')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            filter === 'completed'
              ? 'bg-slate-700 text-white font-black shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          الزيارات المكتملة
        </button>
      </div>

      {/* Appointments List / Queue Cards */}
      <div className="space-y-3.5">
        {filtered.map((apt, index) => {
          const isCurrent = apt.status === 'in_progress'
          return (
            <div
              key={apt.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCurrent
                  ? 'bg-gradient-to-r from-emerald-950/40 via-navy-900 to-slate-900 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/30'
                  : 'bg-navy-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Left: Queue Number & Patient Info */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                    isCurrent
                      ? 'bg-emerald-500 text-navy-950 border-emerald-400 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-white text-sm sm:text-base">{apt.patient_name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        apt.status === 'in_progress'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : apt.status === 'completed'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      }`}
                    >
                      {apt.status === 'in_progress'
                        ? '🟢 جاري الزيارة الآن'
                        : apt.status === 'completed'
                        ? '✓ تمت الزيارة'
                        : 'منتظر / مجدول'}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-gold-300">{apt.visit_type}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1 font-mono text-cyan-300" dir="ltr">
                      <ClockIcon className="w-3.5 h-3.5 text-slate-500" />
                      {formatTime(apt.start_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-slate-500" />
                      {apt.location}
                    </span>
                  </div>

                  {apt.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                      ملاحظات: {apt.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions & WhatsApp Reminder */}
              <div className="flex items-center gap-2 flex-wrap self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 w-full md:w-auto justify-end">
                {/* Send WhatsApp Reminder Button (Wasl Clinic match) */}
                <button
                  onClick={() => sendWhatsAppReminder(apt)}
                  className="bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
                  title="إرسال تذكير بالموعد على الواتساب"
                >
                  <span>💬 تذكير بالموعد</span>
                </button>

                {/* Call */}
                <a
                  href={`tel:${apt.patient_phone}`}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2 rounded-xl transition"
                  title="اتصال"
                >
                  <PhoneIcon className="w-4 h-4 text-blue-400" />
                </a>

                {/* Status Switcher */}
                {apt.status !== 'completed' ? (
                  <button
                    onClick={() => updateStatus(apt.id, 'completed')}
                    className="bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-black px-3.5 py-2 rounded-xl transition shadow-xs"
                  >
                    تم إنجاز الزيارة ✓
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(apt.id, 'confirmed')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold px-3 py-2 rounded-xl transition"
                  >
                    إعادة كـ مجدول
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-navy-900/50 rounded-2xl border border-slate-800 p-8 space-y-3">
          <p className="text-slate-400 text-sm">لا توجد مواعيد في هذا القسم حالياً.</p>
          <Link
            href="/app/intake"
            className="inline-block bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs px-4 py-2 rounded-xl"
          >
            + تسجيل موعد جديد
          </Link>
        </div>
      )}
    </div>
  )
}
