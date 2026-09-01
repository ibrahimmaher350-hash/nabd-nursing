/**
 * app/admin/bookings/page.tsx — نبض للتمريض المنزلي
 * Admin Bookings Management with 12-Hour format and Official Reminder generator.
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllBookings } from '@/lib/firebase/firestore'
import type { Booking, BookingStatus } from '@/types/booking'
import Link from 'next/link'
import { formatTo12HourArabic, formatArabicDateWithDay, buildCustomerReminderMessage } from '@/lib/timeUtils'

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending:     'جديد',
  confirmed:   'مؤكد',
  completed:   'مكتمل',
  cancelled:   'ملغي',
  rescheduled: 'معدّل',
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  pending:     'bg-gold-100 text-gold-700',
  confirmed:   'bg-blue-100 text-blue-700',
  completed:   'bg-emerald-100 text-emerald-700',
  cancelled:   'bg-red-100 text-red-700',
  rescheduled: 'bg-purple-100 text-purple-700',
}

type FilterStatus = BookingStatus | 'all'

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Array<Booking & { docId: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAllBookings(filter !== 'all' ? { status: filter } : {})
      setBookings(data)
    } catch {
      setError('تعذر تحميل الحجوزات. تحقق من اتصال Firebase.')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const handleStatusChange = async (docId: string, newStatus: BookingStatus) => {
    setUpdatingId(docId)
    try {
      const { updateBookingStatus } = await import('@/lib/firebase/firestore')
      await updateBookingStatus(docId, newStatus)
      setBookings((prev) =>
        prev.map((b) => (b.docId === docId ? { ...b, status: newStatus } : b))
      )
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white p-6" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white/50 hover:text-white text-sm">
            ← العودة للوحة التحكم
          </Link>
          <h1 className="text-xl font-bold">إدارة وسجل الحجوزات</h1>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://calendar.google.com/calendar/u/1/r"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            📅 فتح تقويم Google Calendar ↗
          </a>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as FilterStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              filter === s ? 'bg-gold-500 text-white font-bold' : 'bg-navy-800 text-white/60 hover:bg-navy-700'
            }`}
          >
            {s === 'all' ? 'الكل' : STATUS_LABELS[s as BookingStatus]}
          </button>
        ))}
      </div>

      {/* Content */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-4">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-navy-800 rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-white/40">
          <p className="text-5xl mb-4">📋</p>
          <p className="text-lg font-medium">لا توجد حجوزات في هذا التصنيف</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => {
            const rawPhone = booking.whatsapp || booking.customerPhone
            const cleanPhone = rawPhone?.replace(/[^0-9]/g, '')
            const targetPhone = cleanPhone?.startsWith('0') ? `2${cleanPhone}` : cleanPhone

            const reminderText = buildCustomerReminderMessage({
              customerName: booking.customerName,
              serviceName: booking.serviceName,
              preferredDate: booking.preferredDate,
              preferredTime: booking.preferredTime,
              address: `${booking.city} - ${booking.address || ''}`,
            })

            return (
              <div key={booking.docId} className="bg-navy-800 border border-white/10 rounded-2xl p-5 shadow-card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-white text-base">{booking.customerName}</p>
                    <p className="text-white/50 text-xs font-mono">{booking.bookingId}</p>
                  </div>
                  <span className={`badge ${STATUS_COLORS[booking.status]} text-xs px-3 py-1 font-bold`}>
                    {STATUS_LABELS[booking.status]}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm bg-navy-900/50 p-3.5 rounded-xl">
                  <div>
                    <p className="text-white/40 text-xs mb-1">الخدمة</p>
                    <p className="text-white/90 font-bold text-xs sm:text-sm">{booking.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">الهاتف</p>
                    <a href={`tel:${booking.customerPhone}`} className="text-gold-300 font-mono text-xs hover:underline">
                      {booking.customerPhone}
                    </a>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">الموعد (12 ساعة)</p>
                    <p className="text-white/90 text-xs font-bold">
                      {formatArabicDateWithDay(booking.preferredDate)}
                      <br />
                      <span className="text-emerald-400 font-mono">{formatTo12HourArabic(booking.preferredTime)}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs mb-1">المنطقة</p>
                    <p className="text-white/90 text-xs">{booking.city} {booking.landmark ? `(${booking.landmark})` : ''}</p>
                  </div>
                </div>

                {booking.address && (
                  <p className="text-white/70 text-xs">
                    <span className="text-white/40">العنوان: </span>{booking.address}
                  </p>
                )}

                {booking.notes && (
                  <p className="text-white/60 text-xs bg-navy-950/40 p-2.5 rounded-lg border border-white/5">
                    <span className="text-white/40">ملاحظات: </span>{booking.notes}
                  </p>
                )}

                {/* Status Update & Contact Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                  {/* Status action buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs text-white/50 me-1">تغيير الحالة:</span>
                    {booking.status !== 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking.docId, 'confirmed')}
                        disabled={updatingId === booking.docId}
                        className="text-xs bg-blue-600/80 hover:bg-blue-600 text-white px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                      >
                        تأكيد
                      </button>
                    )}
                    {booking.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusChange(booking.docId, 'completed')}
                        disabled={updatingId === booking.docId}
                        className="text-xs bg-emerald-600/80 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                      >
                        مكتمل
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(booking.docId, 'cancelled')}
                        disabled={updatingId === booking.docId}
                        className="text-xs bg-red-600/80 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg transition disabled:opacity-50"
                      >
                        إلغاء
                      </button>
                    )}
                  </div>

                  {/* Direct Actions: Official Reminder + Call + WhatsApp */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={`https://wa.me/${targetPhone}?text=${encodeURIComponent(reminderText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-black shadow-sm"
                    >
                      📲 إرسال التذكير الرسمي
                    </a>
                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="text-xs bg-gold-500 hover:bg-gold-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold"
                    >
                      اتصال
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
