/**
 * app/admin/bookings/page.tsx — Admin Bookings
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllBookings } from '@/lib/firebase/firestore'
import type { Booking, BookingStatus } from '@/types/booking'
import Link from 'next/link'

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
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-white/50 hover:text-white text-sm">← العودة</Link>
        <h1 className="text-xl font-bold">إدارة الحجوزات</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as FilterStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              filter === s ? 'bg-gold-500 text-white' : 'bg-navy-800 text-white/60 hover:bg-navy-700'
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
          <p className="text-red-400/70 text-xs mt-1">تأكد من إعداد Firebase في .env.local</p>
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
          {bookings.map((booking) => (
            <div key={booking.docId} className="bg-navy-800 border border-white/10 rounded-2xl p-5 shadow-card">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-white text-base">{booking.customerName}</p>
                  <p className="text-white/50 text-xs font-mono">{booking.bookingId}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[booking.status]} text-xs px-3 py-1`}>
                  {STATUS_LABELS[booking.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm bg-navy-900/50 p-3 rounded-xl">
                <div>
                  <p className="text-white/40 text-xs mb-1">الخدمة</p>
                  <p className="text-white/90 font-medium text-xs sm:text-sm">{booking.serviceName}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">الهاتف</p>
                  <a href={`tel:${booking.customerPhone}`} className="text-gold-300 font-mono text-xs hover:underline">
                    {booking.customerPhone}
                  </a>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">الموعد</p>
                  <p className="text-white/90 text-xs">{booking.preferredDate} — {booking.preferredTime}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">المنطقة</p>
                  <p className="text-white/90 text-xs">{booking.city} {booking.landmark ? `(${booking.landmark})` : ''}</p>
                </div>
              </div>

              {booking.address && (
                <p className="text-white/70 text-xs mt-2">
                  <span className="text-white/40">العنوان: </span>{booking.address}
                </p>
              )}

              {booking.notes && (
                <p className="text-white/60 text-xs mt-2 bg-navy-950/40 p-2.5 rounded-lg border border-white/5">
                  <span className="text-white/40">ملاحظات: </span>{booking.notes}
                </p>
              )}

              {/* Status Update & Contact Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
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

                {/* Direct Contact actions */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${booking.whatsapp ?? booking.customerPhone}?text=${encodeURIComponent(
                      `مرحبًا ${booking.customerName}، بخصوص طلب حجز نبض للتمريض رقم ${booking.bookingId} (${booking.serviceName}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium"
                  >
                    واتساب
                  </a>
                  <a
                    href={`tel:${booking.customerPhone}`}
                    className="text-xs bg-gold-500 hover:bg-gold-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-medium"
                  >
                    اتصال
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
