'use client';

/**
 * src/app/appointments/mine/page.tsx
 * Patient self-service appointments portal.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowRight,
  Video,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/useAuthStore';

export default function MyAppointmentsPage() {
  const { user, isLoggedIn } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneSearch, setPhoneSearch] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadUserAppointments(user.id);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadUserAppointments = async (patientId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('start_at', { ascending: false });

      if (!error && data) {
        setAppointments(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_phone', phoneSearch.trim())
        .order('start_at', { ascending: false });

      if (!error && data) {
        setAppointments(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#07132B] text-white shadow-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gold-400" />
            <span>الرئيسية</span>
          </Link>
          <span className="font-black text-base text-gold-400">مواعيدي وجدول الزيارات 📋</span>
          <Link
            href="/appointments/new"
            className="flex items-center gap-1 text-xs font-black bg-gold-500 hover:bg-gold-600 text-white px-3.5 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>حجز جديد</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {!isLoggedIn && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-sm font-black text-slate-800">
              استعراض المواعيد برقم الهاتف (بدون تسجيل دخول):
            </h2>
            <form onSubmit={handlePhoneLookup} className="flex gap-2">
              <input
                type="tel"
                dir="ltr"
                placeholder="010xxxxxxxx"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-left focus:outline-none focus:ring-2 focus:ring-[#07132B]/20"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl font-black text-xs text-white bg-[#07132B] hover:bg-navy-800"
              >
                بحث عن مواعيدي
              </button>
            </form>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-2xl border border-slate-200">
              جارٍ تحميل مواعيدك...
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold bg-white rounded-2xl border border-slate-200 space-y-3">
              <p>لا توجد مواعيد مسجلة حالياً.</p>
              <Link
                href="/appointments/new"
                className="inline-block text-xs font-bold text-[#07132B] bg-gold-400 hover:bg-gold-500 px-4 py-2.5 rounded-xl"
              >
                احجز موعدك الأول الآن 🩺
              </Link>
            </div>
          ) : (
            appointments.map((app) => {
              const d = new Date(app.start_at);
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
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">{app.title}</h3>
                      <p className="text-xs text-slate-500">المريض: {app.patient_name}</p>
                    </div>
                    {app.status === 'scheduled' && (
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-black px-3 py-1 rounded-full border border-emerald-200">
                        مجدول
                      </span>
                    )}
                    {app.status === 'completed' && (
                      <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1 rounded-full border border-blue-200">
                        مكتمل
                      </span>
                    )}
                    {app.status === 'cancelled' && (
                      <span className="bg-red-50 text-red-700 text-xs font-black px-3 py-1 rounded-full border border-red-200">
                        ملغي
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600">
                    <div><strong>الموعد:</strong> {dateStr} — الساعة {timeStr}</div>
                    {app.location && <div><strong>العنوان:</strong> {app.location}</div>}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    {app.meet_link ? (
                      <a
                        href={app.meet_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                      >
                        <Video className="w-4 h-4" />
                        <span>رابط Google Meet 📹</span>
                      </a>
                    ) : <span />}

                    <Link
                      href={`/appointments/${app.id}/manage`}
                      className="text-xs font-bold text-[#07132B] hover:underline"
                    >
                      إدارة أو تعديل الموعد ←
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
