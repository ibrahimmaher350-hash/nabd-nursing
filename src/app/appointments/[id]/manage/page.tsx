'use client';

/**
 * src/app/appointments/[id]/manage/page.tsx
 * 1-Click Appointment Management Portal (No password needed with signed token).
 * Allows patient or staff to view details, join video call, reschedule, or cancel.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Edit3,
} from 'lucide-react';

interface Props {
  params: { id: string };
}

function ManageAppointmentContent({ params }: Props) {
  const { id } = params;
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [appointment, setAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reschedule form state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('11:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAppointment();
  }, [id, token]);

  const loadAppointment = async () => {
    setIsLoading(true);
    try {
      const url = `/api/appointments/${id}${token ? `?token=${encodeURIComponent(token)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.appointment) {
        throw new Error(data.error || 'تعذر تحميل بيانات الموعد أو أن الرابط منتهي');
      }

      setAppointment(data.appointment);
      setNewDate(data.appointment.start_at.split('T')[0]);
    } catch (err: any) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تحميل الموعد');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الموعد؟')) return;

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل إلغاء الموعد');

      setSuccessMsg('تم إلغاء الموعد بنجاح وحذفه من جدول الزيارات ✅');
      setAppointment(data.appointment);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const newStartAt = `${newDate}T${newTime}:00+02:00`;
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAt: newStartAt, token }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'فشل تحديث الموعد');

      setSuccessMsg('تم تحديث موعد الزيارة بنجاح وإعادة جدولة التذكيرات ✅');
      setAppointment(data.appointment);
      setIsRescheduling(false);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center" dir="rtl">
        <div className="text-slate-600 font-bold text-sm">جارٍ التحقق من الموعد...</div>
      </div>
    );
  }

  if (errorMsg && !appointment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl border border-red-200 text-center space-y-4 shadow-xs">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-black text-slate-900">تعذر فتح صفحة الموعد</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{errorMsg}</p>
          <Link
            href="/"
            className="inline-block bg-[#07132B] text-white text-xs font-bold px-5 py-2.5 rounded-xl"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const d = new Date(appointment.start_at);
  const dateStr = d.toLocaleDateString('ar-EG', {
    timeZone: 'Africa/Cairo',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = d.toLocaleTimeString('ar-EG', {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16" dir="rtl">
      <header className="sticky top-0 z-30 bg-[#07132B] text-white shadow-md border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gold-400" />
            <span>الرئيسية</span>
          </Link>
          <span className="font-black text-base text-gold-400">إدارة موعد الزيارة ⚙️</span>
          <div />
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-8 space-y-4">
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Appointment Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-black text-slate-900">{appointment.title}</h1>
            {appointment.status === 'scheduled' && (
              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                مؤكد ومجدول
              </span>
            )}
            {appointment.status === 'cancelled' && (
              <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                تم الإلغاء
              </span>
            )}
            {appointment.status === 'completed' && (
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                تمت الزيارة بنجاح
              </span>
            )}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs border border-slate-100">
            <div><strong>اسم المريض:</strong> {appointment.patient_name}</div>
            <div><strong>رقم الهاتف:</strong> {appointment.patient_phone}</div>
            <div><strong>التاريخ:</strong> {dateStr}</div>
            <div><strong>التوقيت:</strong> {timeStr} (بتوقيت القاهرة)</div>
            {appointment.location && <div><strong>العنوان:</strong> {appointment.location}</div>}
            {appointment.notes && <div><strong>ملاحظات:</strong> {appointment.notes}</div>}
          </div>

          {appointment.meet_link && (
            <a
              href={appointment.meet_link}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl text-xs transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>دخول رابط Google Meet الطبي 📹</span>
            </a>
          )}

          {/* Action Buttons */}
          {appointment.status === 'scheduled' && !isRescheduling && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRescheduling(true)}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>تعديل الموعد</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>إلغاء الموعد</span>
              </button>
            </div>
          )}

          {/* Reschedule Inline Form */}
          {isRescheduling && (
            <form onSubmit={handleReschedule} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 pt-3">
              <h3 className="text-xs font-black text-slate-900">اختر موعداً جديداً (ساعات العمل 9:00 ص - 9:00 م):</h3>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-bold"
                />
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-bold"
                >
                  {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map((t) => (
                    <option key={t} value={t}>الساعة {t}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsRescheduling(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600"
                >
                  تراجع
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#07132B] text-white text-xs font-black rounded-lg hover:bg-navy-800"
                >
                  {isSubmitting ? 'جارٍ الحفظ...' : 'تأكيد الموعد الجديد'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ManageAppointmentPage(props: Props) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-bold text-slate-500" dir="rtl">جارٍ التحقق من الموعد...</div>}>
      <ManageAppointmentContent {...props} />
    </React.Suspense>
  );
}
