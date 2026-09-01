'use client'
/**
 * app/admin/calendar/page.tsx — تقويم وجدول المواعيد بنظام 12 ساعة
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllBookings } from '@/lib/firebase/firestore'
import type { Booking } from '@/types/booking'
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { formatTo12HourArabic, formatArabicDateWithDay, buildCustomerReminderMessage } from '@/lib/timeUtils'

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
            تقويم ومواعيد الزيارات (12 ساعة)
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="https://calendar.google.com/calendar/u/1/r"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            📅 فتح تقويم Google Calendar ↗
          </a>

          {/* View Switcher */}
          <div className="flex bg-navy-900 rounded-xl p-1 border border-white/10">
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
      </div>

      {/* Date Navigation */}
      <div className="bg-navy-900 border border-white/10 rounded-2xl p-4 flex items-center justify-between mb-6 shadow-card">
        <button
          onClick={() => changeDate(1)}
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

      {/* Bookings List for selected date */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-navy-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : dayBookings.length === 0 ? (
        <div className="text-center py-16 bg-navy-900/50 rounded-3xl border border-white/5">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-sm text-white/60">لا توجد مواعيد مسجلة في هذا اليوم</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dayBookings.map((b) => {
            const rawPhone = b.whatsapp || b.customerPhone
            const cleanPhone = rawPhone?.replace(/[^0-9]/g, '')
            const targetPhone = cleanPhone?.startsWith('0') ? `2${cleanPhone}` : cleanPhone

            const reminderText = buildCustomerReminderMessage({
              customerName: b.customerName,
              serviceName: b.serviceName,
              preferredDate: b.preferredDate,
              preferredTime: b.preferredTime,
              address: `${b.city} - ${b.address || ''}`,
            })

            return (
              <div
                key={b.docId}
                className="bg-navy-900 border border-white/10 rounded-2xl p-5 shadow-card hover:border-gold-500/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">{b.serviceName}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>{b.customerName}</span>
                      {b.patientName && <span>(المريض: {b.patientName})</span>}
                    </p>
                  </div>

                  <span className="badge bg-gold-500/20 text-gold-300 font-mono text-xs font-bold px-2.5 py-1">
                    {formatTo12HourArabic(b.preferredTime)}
                  </span>
                </div>

                <div className="bg-navy-950/60 p-3 rounded-xl text-xs space-y-1 text-slate-300">
                  <p className="flex items-center gap-1.5">
                    <MapPinIcon className="w-3.5 h-3.5 text-gold-400" />
                    <span>دمياط — {b.city} {b.address ? `(${b.address})` : ''}</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-mono">
                    <ClockIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{formatArabicDateWithDay(b.preferredDate)} — {formatTo12HourArabic(b.preferredTime)}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <a
                    href={`https://wa.me/${targetPhone}?text=${encodeURIComponent(reminderText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold"
                  >
                    📲 إرسال التذكير
                  </a>

                  <a
                    href={`tel:${b.customerPhone}`}
                    className="text-xs text-gold-300 hover:underline font-mono"
                  >
                    📞 {b.customerPhone}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
