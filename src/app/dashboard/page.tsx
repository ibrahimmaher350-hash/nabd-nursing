'use client';

/**
 * src/app/dashboard/page.tsx
 * Comprehensive Realtime Owner Dashboard for Nabd Clinic & Blood Bank Operations.
 * Connected to Supabase Realtime channels with Google sync and reminder management.
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Video,
  FileSpreadsheet,
  CalendarCheck,
  Droplet,
  ExternalLink,
  Edit2,
  ChevronDown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/useAuthStore';
import AdminGuard from '@/components/admin/AdminGuard';

interface Appointment {
  id: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string;
  title: string;
  visit_type: string;
  start_at: string;
  end_at: string;
  location?: string | null;
  meet_link?: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  google_event_id?: string | null;
  notes?: string | null;
  created_at: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const { user, profile, isAdmin } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bloodRequestsCount, setBloodRequestsCount] = useState<number>(0);
  const [pendingRemindersCount, setPendingRemindersCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Reschedule Modal State
  const [rescheduleModalApp, setRescheduleModalApp] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('12:00');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Google OAuth feedback
  const googleStatus = searchParams.get('google');

  // Load appointments and stats
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch appointments
      const { data: appsData, error: appsError } = await supabase
        .from('appointments')
        .select('*')
        .order('start_at', { ascending: false });

      if (!appsError && appsData) {
        setAppointments(appsData as Appointment[]);
      }

      // 2. Fetch pending reminders count
      const { count: remCount } = await supabase
        .from('reminder_jobs')
        .select('*', { count: 'exact', head: true })
        .eq('sent', false)
        .eq('status', 'pending');

      setPendingRemindersCount(remCount || 0);

      // 3. Fetch active blood requests count
      const { count: bloodCount } = await supabase
        .from('blood_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setBloodRequestsCount(bloodCount || 0);
    } catch (err) {
      console.error('[Dashboard Fetch Error]', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // 4. Realtime subscription to appointments
    const channel = supabase
      .channel('appointments-realtime-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAppointments((prev) => [payload.new as Appointment, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAppointments((prev) =>
              prev.map((app) => (app.id === payload.new.id ? (payload.new as Appointment) : app))
            );
          } else if (payload.eventType === 'DELETE') {
            setAppointments((prev) => prev.filter((app) => app.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  // Status and Date filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        app.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.patient_phone.includes(searchQuery) ||
        app.title.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

      // Date filter
      let matchesDate = true;
      const appDate = new Date(app.start_at);
      const today = new Date();

      if (dateFilter === 'today') {
        matchesDate = appDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'upcoming') {
        matchesDate = appDate >= today && app.status === 'scheduled';
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchQuery, statusFilter, dateFilter]);

  // Statistics
  const todayAppsCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return appointments.filter((a) => new Date(a.start_at).toDateString() === todayStr).length;
  }, [appointments]);

  const thisWeekAppsCount = useMemo(() => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return appointments.filter((a) => {
      const d = new Date(a.start_at);
      return d >= now && d <= nextWeek;
    }).length;
  }, [appointments]);

  // Actions: Cancel, Complete, Reschedule
  const handleUpdateStatus = async (id: string, newStatus: 'cancelled' | 'completed') => {
    const confirmMsg =
      newStatus === 'cancelled'
        ? 'هل أنت متأكد من رغبتك في إلغاء هذا الموعد وحذفه من جدول Google؟'
        : 'هل تريد تأكيد إتمام هذه الزيارة بنجاح؟';

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalApp || !newDate) return;

    setIsUpdating(true);
    try {
      const newStartAt = `${newDate}T${newTime}:00+02:00`;
      const res = await fetch(`/api/appointments/${rescheduleModalApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startAt: newStartAt }),
      });

      if (res.ok) {
        setRescheduleModalApp(null);
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16" dir="rtl">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#07132B] text-white shadow-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-black text-xl text-gold-400">
              نبض للتمريض 🩺
            </Link>
            <span className="bg-white/10 text-white/80 text-xs px-2.5 py-1 rounded-full font-bold">
              لوحة تحكم الإدارة الحية
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>تحديث حي</span>
            </button>
            <Link
              href="/appointments/new"
              className="text-xs font-black bg-gold-500 hover:bg-gold-600 text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors"
            >
              + حجز جديد
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Google Status Notification Banner */}
        {googleStatus === 'connected' && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-800 text-sm font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>تم ربط حساب Google (Calendar & Sheets) بنجاح! جميع المواعيد متزامنة لحظياً.</span>
            </div>
            <Link href="/dashboard" className="text-xs underline text-emerald-700">إغلاق</Link>
          </div>
        )}

        {/* 1. KPIs Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{todayAppsCount}</div>
              <div className="text-xs font-bold text-slate-500">زيارات اليوم</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{thisWeekAppsCount}</div>
              <div className="text-xs font-bold text-slate-500">مواعيد الأسبوع القادم</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{pendingRemindersCount}</div>
              <div className="text-xs font-bold text-slate-500">تذكيرات مجدولة (24h/1h)</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{bloodRequestsCount}</div>
              <div className="text-xs font-bold text-slate-500">طلبات بنك الدم العاجلة</div>
            </div>
          </div>
        </div>

        {/* 2. Integrations Card */}
        <div className="bg-gradient-to-r from-[#07132B] to-[#162E5B] text-white p-5 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-gold-500/20">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-gold-400" />
              <span className="font-black text-base">لوحة تحكم جوجل شيت (Google Sheets Control Panel)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              تحكّم في الحجوزات، ملفات المرضى، بنك الدم، التذكيرات، وساعات العمل مباشرة من جدول جوجل الخاص بك. المزامنة ثنائية الاتجاه ولحظية!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Open Google Sheet Direct Link */}
            <a
              href="https://docs.google.com/spreadsheets/d/19Xv5QOgi0Qn78Q6ypv6PM7sU74khLEtHy7T49T_vUjo/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>فتح شيت التحكم 📊</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            {/* Run Full Sync */}
            <button
              type="button"
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const res = await fetch('/api/admin/full-sync', { method: 'POST' });
                  const data = await res.json();
                  if (res.ok) {
                    alert('تمت المزامنة الكاملة مع الأوراق الخمس بنجاح! ✅\n' + JSON.stringify(data.stats));
                    await fetchData();
                  } else {
                    alert('خطأ أثناء المزامنة: ' + (data.error || 'تأكد من ربط حساب Google'));
                  }
                } catch (e: any) {
                  alert('خطأ: ' + e.message);
                } finally {
                  setIsLoading(false);
                }
              }}
              className="bg-gold-500 hover:bg-gold-600 text-slate-900 text-xs font-black px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>مزامنة الشيت الآن 🔄</span>
            </button>

            {/* Google OAuth Connect */}
            <a
              href="/api/auth/google"
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
              title="إعادة ربط أو تحديث إذن Google"
            >
              <span>ربط Google 📅</span>
            </a>
          </div>
        </div>

        {/* 3. Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="بحث باسم المريض أو الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#07132B]/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="all">كل المواعيد</option>
              <option value="today">مواعيد اليوم</option>
              <option value="upcoming">المواعيد القادمة</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
            >
              <option value="all">كل الحالات</option>
              <option value="scheduled">مجدول فقط</option>
              <option value="completed">مكتمل</option>
              <option value="cancelled">ملغي</option>
            </select>
          </div>
        </div>

        {/* 4. Appointments List */}
        <div className="space-y-3">
          {isLoading && appointments.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-2xl border border-slate-200">
              جارٍ تحميل جدول المواعيد الحي...
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-bold bg-white rounded-2xl border border-slate-200">
              لا توجد مواعيد مطابقة للشروط المحددة.
            </div>
          ) : (
            filteredAppointments.map((app) => {
              const startD = new Date(app.start_at);
              const dateStr = startD.toLocaleDateString('ar-EG', {
                timeZone: 'Africa/Cairo',
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const timeStr = startD.toLocaleTimeString('ar-EG', {
                timeZone: 'Africa/Cairo',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={app.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-center shrink-0 border border-slate-200">
                      <span className="text-[10px] font-black text-slate-500">{dateStr.split(' ')[0]}</span>
                      <span className="text-sm font-black text-[#07132B]">{startD.getDate()}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-base text-slate-900">{app.patient_name}</span>
                        <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
                          {app.title}
                        </span>
                        {app.status === 'scheduled' && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            مجدول
                          </span>
                        )}
                        {app.status === 'completed' && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            مكتمل
                          </span>
                        )}
                        {app.status === 'cancelled' && (
                          <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            ملغي
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>الساعة {timeStr}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span dir="ltr">{app.patient_phone}</span>
                        </span>
                        {app.location && (
                          <span className="text-slate-500">📍 {app.location}</span>
                        )}
                      </div>

                      {app.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 border border-slate-100">
                          {app.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Meet Link */}
                  <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                    {app.meet_link && (
                      <a
                        href={app.meet_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Google Meet</span>
                      </a>
                    )}

                    <a
                      href={`tel:${app.patient_phone}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                      title="اتصال هاتف"
                    >
                      <Phone className="w-4 h-4" />
                    </a>

                    <a
                      href={`https://wa.me/20${app.patient_phone.replace(/^0+/, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                      title="مراسلة واتساب"
                    >
                      💬
                    </a>

                    {app.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => {
                            setRescheduleModalApp(app);
                            setNewDate(app.start_at.split('T')[0]);
                          }}
                          className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>تعديل</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(app.id, 'completed')}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                          title="إتمام الزيارة"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors"
                          title="إلغاء الموعد"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reschedule Modal */}
        {rescheduleModalApp && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-right animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-black text-slate-900">
                تعديل موعد الزيارة 🗓️
              </h3>
              <p className="text-xs text-slate-500">
                المريض: {rescheduleModalApp.patient_name} — سيتم تحديث تقويم Google تلقائياً وإعادة جدولة التذكيرات.
              </p>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">التاريخ الجديد</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">التوقيت الجديد</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRescheduleModalApp(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#07132B] hover:bg-navy-800 disabled:opacity-50"
                  >
                    {isUpdating ? 'جارٍ الحفظ والمزامنة...' : 'حفظ التعديل'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AdminGuard>
      <React.Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-bold text-slate-500" dir="rtl">جارٍ تحميل لوحة التحكم...</div>}>
        <DashboardContent />
      </React.Suspense>
    </AdminGuard>
  );
}
