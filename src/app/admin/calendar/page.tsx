'use client'
/**
 * app/admin/calendar/page.tsx — التقويم وجدول المواعيد
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllBookings } from '@/lib/firebase/firestore'
import type { Booking } from '@/types/booking'
import { ChevronRightIcon, ChevronLeftIcon, CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'

type CalendarView = 'day' | 'week' | 'month'

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<Array<Booking & { docId: string }>>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<CalendarView>('week')
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await getAllBookings()
        setBookings(data)
      } catch (err) {
        console.error('Error fetching calendar bookings:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Format header date
  const formattedHeaderDate = new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: view === 'day' ? 'numeric' : undefined,
  }).format(currentDate)

  const changeDate = (delta: number) => {
    const next = new Date(currentDate)
    if (view === 'day') next.setDate(next.getDate() + delta)
    else if (view === 'week') next.setDate(next.getDate() + delta * 7)
    else next.setMonth(next.getMonth() + delta)
    setCurrentDate(next)
  }

  // Filter bookings for current selected date string (YYYY-MM-DD)
  const dateStr = currentDate.toISOString().split('T')[0]
  const dayBookings = bookings.filter((b) => b.preferredDate === dateStr)

  return (
    <div className="min-h-screen bg-navy-950 text-white p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white/50 hover:text-white text-sm">
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <CalendarDaysIcon className="w-6 h-6 text-gold-400" />
            تقويم المواعيد
          </h1>
        </div>

        {/* View Switcher */}
        <div className="flex bg-navy-900 rounded-xl p-1 border border-white/10 self-start sm:self-auto">
          {(['day', 'week', 'month'] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                view === v ? 'bg-gold-500 text-white shadow-md' : 'text-white/60 hover:text-white'
              }`}
            >
              {v === 'day' ? 'يومي' : v === 'week' ? 'أسبوعي' : 'شهري'}
            </button>
          ))}
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-navy-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-6 shadow-card">
        <button
          onClick={() => changeDate(1)} // In RTL, right moves to future or past depending on convention
          className="p-2 rounded-xl bg-navy-800 text-white/80 hover:text-white hover:bg-navy-700 transition"
          aria-label="الفترة التالية"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-lg font-bold text-gold-300">{formattedHeaderDate}</p>
          <p className="text-xs text-white/50">
            {bookings.length} موعد مسجل في النظام
          </p>
        </div>

        <button
          onClick={() => changeDate(-1)}
          className="p-2 rounded-xl bg-navy-800 text-white/80 hover:text-white hover:bg-navy-700 transition"
          aria-label="الفترة السابقة"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Main Calendar View Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-navy-900/60 rounded-2xl h-24 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white/80">
              مواعيد التاريخ المحدد ({dateStr}):
            </h2>
            <span className="badge bg-navy-800 text-gold-400 text-xs border border-white/10">
              {dayBookings.length} مواعيد اليوم
            </span>
          </div>

          {dayBookings.length === 0 ? (
            <div className="bg-navy-900 border border-white/10 rounded-2xl p-8 text-center text-white/50">
              <CalendarDaysIcon className="w-12 h-12 mx-auto mb-3 opacity-30 text-gold-400" />
              <p className="text-base font-semibold">لا توجد مواعيد مسجلة في هذا اليوم</p>
              <p className="text-xs mt-1 text-white/40">اختر يوماً آخر أو استعرض كل الحجوزات من قسم إدارة الحجوزات</p>
              <Link href="/admin/bookings" className="inline-block mt-4 text-xs text-gold-400 underline">
                الانتقال لجدول الحجوزات الكامل
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dayBookings.map((b) => (
                <div
                  key={b.docId}
                  className="bg-navy-900 border border-white/10 rounded-2xl p-5 shadow-card hover:border-gold-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge bg-gold-500/20 text-gold-300 font-mono text-xs border border-gold-500/30">
                        {b.bookingId}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-navy-800 text-white/80 font-medium">
                        {b.status === 'pending'
                          ? 'جديد'
                          : b.status === 'confirmed'
                          ? 'مؤكد'
                          : b.status === 'completed'
                          ? 'مكتمل'
                          : 'ملغي'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-2">{b.serviceName}</h3>

                    <div className="space-y-1.5 text-xs text-white/70">
                      <p className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gold-400" />
                        <span>{b.customerName} {b.patientName ? `(المريض: ${b.patientName})` : ''}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-gold-400" />
                        <span>{b.preferredTime}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-gold-400" />
                        <span>دمياط — {b.city} ({b.address})</span>
                      </p>
                    </div>

                    {b.notes && (
                      <p className="mt-3 p-2 bg-navy-950/60 rounded-xl text-xs text-white/60 border border-white/5">
                        ملاحظة: {b.notes}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
                    <a
                      href={`https://wa.me/${b.whatsapp ?? b.customerPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] text-white text-center py-2 rounded-xl text-xs font-bold hover:opacity-90"
                    >
                      واتساب
                    </a>
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="flex-1 bg-gold-500 text-white text-center py-2 rounded-xl text-xs font-bold hover:opacity-90"
                    >
                      اتصال
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick list of upcoming bookings */}
          <div className="mt-10">
            <h2 className="text-sm font-bold text-white/80 mb-3">كل المواعيد القادمة في النظام</h2>
            <div className="bg-navy-900 border border-white/10 rounded-2xl divide-y divide-white/5 overflow-hidden">
              {bookings.slice(0, 10).map((b) => (
                <div key={b.docId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-navy-800/50 transition">
                  <div>
                    <span className="text-xs font-mono text-gold-400 font-bold">{b.bookingId}</span>
                    <span className="mx-2 text-white/30">•</span>
                    <span className="font-bold text-sm text-white">{b.customerName}</span>
                    <span className="mx-2 text-white/30">•</span>
                    <span className="text-xs text-white/70">{b.serviceName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span>📅 {b.preferredDate}</span>
                    <span>⏰ {b.preferredTime}</span>
                    <span>📍 {b.city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
