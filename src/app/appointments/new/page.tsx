'use client';

/**
 * src/app/appointments/new/page.tsx
 * Appointment Booking Page for Nabd Home Nursing
 * Features Cairo working hours enforcement (09:00 - 21:00), visit types, and instant sync.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuthStore';

const VISIT_TYPES = [
  { id: 'home_visit', label: 'كشف وزيارة منزلية', icon: '🩺', desc: 'فحص سريري كامل وقياس علامات حيوية' },
  { id: 'nursing_care', label: 'متابعة وتمريض منزلي', icon: '💉', desc: 'حقن، تركيب محاليل، غيار جروح وقرح' },
  { id: 'consultation', label: 'استشارة طبية وتوجيه', icon: '📋', desc: 'مراجعة تحاليل واستشارة عن بعد أو بالمنزل' },
  { id: 'blood_donation', label: 'موعد تبرع بالدم', icon: '🩸', desc: 'تنسيق تبرع آمن لإنقاذ حالة حرجة' },
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00',
];

export default function NewAppointmentPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [patientName, setPatientName] = useState(profile?.full_name || '');
  const [patientPhone, setPatientPhone] = useState(profile?.phone || '');
  const [patientEmail, setPatientEmail] = useState(user?.email || '');
  const [visitType, setVisitType] = useState('home_visit');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('11:00');
  const [location, setLocation] = useState('دمياط');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Cairo local ISO timestamp
      const startAt = `${selectedDate}T${selectedTime}:00+02:00`;

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientPhone,
          patientEmail,
          visitType,
          title: VISIT_TYPES.find((v) => v.id === visitType)?.label || 'زيارة تمريضية',
          startAt,
          location,
          notes,
          patientId: user?.id || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'تعذر حجز الموعد، يرجى المحاولة مرة أخرى');
      }

      setCreatedAppointment(data.appointment);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16" dir="rtl">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#07132B] text-white border-b border-white/10 shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-gold-400" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-2 font-black text-base text-gold-400">
            <Stethoscope className="w-5 h-5" />
            <span>حجز موعد زيارة نبض</span>
          </div>
          <Link
            href="/appointments/mine"
            className="text-xs font-bold text-slate-300 hover:text-gold-300 bg-white/10 px-3 py-1.5 rounded-full"
          >
            مواعيدي
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* Banner */}
        <div className="bg-gradient-to-l from-[#07132B] to-[#122A56] text-white p-6 rounded-2xl shadow-sm mb-6 border border-gold-500/20">
          <span className="inline-flex items-center gap-1 bg-gold-400/20 text-gold-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <ShieldCheck className="w-4 h-4" />
            رعاية تمريضية وطبية معتمدة — دمياط
          </span>
          <h1 className="text-xl sm:text-2xl font-black mb-2">
            احجز زيارتك التمريضية المنزلية بكل سهولة
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            اختر نوع الخدمة والموعد المناسب، وسيتم ربط الحجز فوراً بجدول نبض وإرسال تذكير رسمي ومباشر لإيميلك وهاتفك.
          </p>
        </div>

        {/* Success View */}
        {createdAppointment ? (
          <div className="bg-white rounded-2xl p-8 border border-emerald-200 text-center space-y-4 shadow-sm animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              تم تأكيد حجز موعدك بنجاح! ✅
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              ستصلك رسالة تذكير قبل الموعد بـ 24 ساعة ثم قبل الزيارة بساعة واحدة تتضمن رابط المتابعة والإلغاء وتفاصيل مقدم الخدمة.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-right max-w-md mx-auto space-y-2 text-xs">
              <div><strong>اسم المريض:</strong> {createdAppointment.patient_name}</div>
              <div><strong>نوع الخدمة:</strong> {createdAppointment.title}</div>
              <div><strong>التاريخ:</strong> {new Date(createdAppointment.start_at).toLocaleDateString('ar-EG', { timeZone: 'Africa/Cairo', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div><strong>الوقت:</strong> {new Date(createdAppointment.start_at).toLocaleTimeString('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit' })} (بتوقيت القاهرة)</div>
              {createdAppointment.meet_link && (
                <div className="pt-2">
                  <a
                    href={createdAppointment.meet_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg text-xs"
                  >
                    رابط Google Meet للقاء الطبي 📹
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/appointments/mine"
                className="w-full sm:w-auto bg-[#07132B] text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-navy-800 transition-colors"
              >
                عرض في قائمة مواعيدي
              </Link>
              <button
                onClick={() => {
                  setCreatedAppointment(null);
                  setNotes('');
                }}
                className="w-full sm:w-auto bg-slate-100 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm hover:bg-slate-200 transition-colors"
              >
                حجز موعد آخر
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm font-bold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Visit Type Select */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                1. نوع الخدمة المطلوبة *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VISIT_TYPES.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setVisitType(type.id)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      visitType === type.id
                        ? 'border-[#07132B] bg-slate-50 shadow-xs'
                        : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-black text-slate-900">{type.label}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{type.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  2. تاريخ الزيارة المطلوبة *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#07132B]/20"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  3. التوقيت المناسب (9:00 ص - 9:00 م) *
                </label>
                <div className="relative">
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#07132B]/20"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        الساعة {t} {parseInt(t, 10) < 12 ? 'صباحاً' : 'مساءً'}
                      </option>
                    ))}
                  </select>
                  <Clock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-sm font-black text-slate-900">4. بيانات المريض والتواصل</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    اسم المريض ثلاثي *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: محمد السيد أحمد"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#07132B]/20"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    رقم الهاتف (واتساب) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      dir="ltr"
                      required
                      placeholder="010xxxxxxxx"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold placeholder:text-slate-400 text-left focus:outline-none focus:ring-2 focus:ring-[#07132B]/20"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    البريد الإلكتروني (لاستلام التذكير والتأكيد) *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      dir="ltr"
                      required
                      placeholder="name@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold placeholder:text-slate-400 text-left focus:outline-none focus:ring-2 focus:ring-[#07132B]/20"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    العنوان التفصيلي داخل دمياط *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="مثال: الأعصر - شارع المحطة - عمارة 4 دور 2"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#07132B]/20"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  ملاحظات إضافية أو وصف الحالة الطبية (اختياري)
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="أي توجيهات طبية، حساسية أدوية، أو متطلبات خاصة..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#07132B]/20"
                  />
                  <FileText className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-black text-base text-white bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'جارٍ تسجيل وتأكيد الموعد...' : 'تأكيد حجز الزيارة المنزلية 🩺'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
