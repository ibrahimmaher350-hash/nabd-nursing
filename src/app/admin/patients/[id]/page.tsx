'use client';

/**
 * src/app/admin/patients/[id]/page.tsx
 * Comprehensive Medical File Viewer & Editor for Patient Records.
 * Syncs directly to Supabase `patients` and Tab 2 "ملفات المرضى" in Google Sheets.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Heart,
  AlertTriangle,
  Activity,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  Droplet,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Patient Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [bloodType, setBloodType] = useState('A+');
  const [allergies, setAllergies] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [visitCount, setVisitCount] = useState(0);
  const [lastVisit, setLastVisit] = useState<string | null>(null);

  // Associated Appointments
  const [patientAppointments, setPatientAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!patientId) return;

    async function loadPatient() {
      setIsLoading(true);
      try {
        // 1. Fetch patient record
        const { data: patient, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .maybeSingle();

        if (patient) {
          setFullName(patient.full_name || '');
          setPhone(patient.phone || '');
          setEmail(patient.email || '');
          setBirthDate(patient.birth_date || '');
          setGender(patient.gender || 'male');
          setBloodType(patient.blood_type || 'A+');
          setAllergies(patient.allergies || '');
          setChronicDiseases(patient.chronic_diseases || '');
          setCurrentMedications(patient.current_medications || '');
          setMedicalNotes(patient.medical_notes || '');
          setVisitCount(patient.visit_count || 0);
          setLastVisit(patient.last_visit || null);

          // 2. Fetch associated appointments
          const { data: apps } = await supabase
            .from('appointments')
            .select('*')
            .or(`patient_id.eq.${patient.id},patient_email.eq.${patient.email}`)
            .order('start_at', { ascending: false });

          if (apps) {
            setPatientAppointments(apps);
          }
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'تعذر تحميل ملف المريض');
      } finally {
        setIsLoading(false);
      }
    }

    loadPatient();
  }, [patientId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      const updatedData = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        birth_date: birthDate || null,
        gender,
        blood_type: bloodType,
        allergies: allergies.trim() || 'لا يوجد',
        chronic_diseases: chronicDiseases.trim() || 'لا يوجد',
        current_medications: currentMedications.trim() || 'لا يوجد',
        medical_notes: medicalNotes.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('patients')
        .update(updatedData)
        .eq('id', patientId);

      if (error) throw error;

      // Sync directly with Google Sheets Tab 2
      try {
        await fetch('/api/sync/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'db_webhook',
            table: 'patients',
            record: {
              id: patientId,
              ...updatedData,
              visit_count: visitCount,
              last_visit: lastVisit,
              created_at: new Date().toISOString(),
            },
          }),
        });
      } catch (syncErr) {
        console.warn('Sheets sync error:', syncErr);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#07132B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">جارٍ تحميل الملف الطبي للمريض...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16" dir="rtl">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#07132B] text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white"
          >
            <ArrowRight className="w-4 h-4 text-gold-400" />
            <span>العودة للوحة التحكم</span>
          </Link>

          <h1 className="text-sm font-black text-gold-400 flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>الملف الطبي: {fullName || 'مريض'}</span>
          </h1>

          <a
            href="https://docs.google.com/spreadsheets/d/19Xv5QOgi0Qn78Q6ypv6PM7sU74khLEtHy7T49T_vUjo/edit#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"
          >
            <span>شيت ملفات المرضى</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-5">
        {/* Success Alert */}
        {saveSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>تم حفظ التعديلات بنجاح وتحديثها في شيت "ملفات المرضى" بجوجل! ✅</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-red-800 text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {/* Quick Summary Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#07132B] flex items-center justify-center font-black text-lg">
              {bloodType}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">{fullName}</h2>
              <p className="text-xs text-slate-500">{phone} • {email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="bg-slate-100 px-3 py-2 rounded-xl text-center">
              <span className="text-slate-400 block text-[10px]">عدد الزيارات</span>
              <span className="text-slate-900 font-black">{visitCount}</span>
            </div>
            <div className="bg-slate-100 px-3 py-2 rounded-xl text-center">
              <span className="text-slate-400 block text-[10px]">آخر زيارة</span>
              <span className="text-slate-900 font-black">
                {lastVisit ? new Date(lastVisit).toLocaleDateString('ar-EG') : 'موعد قادم'}
              </span>
            </div>
          </div>
        </div>

        {/* Medical Form */}
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#07132B]" />
              <span>تعديل السجل الطبي وتفاصيل المريض</span>
            </h3>
          </div>

          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">الاسم بالكامل *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">رقم الهاتف (واتساب) *</label>
              <input
                type="tel"
                dir="ltr"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-left"
              />
            </div>
          </div>

          {/* Row 2: Email & Birth Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">البريد الإلكتروني *</label>
              <input
                type="email"
                dir="ltr"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-left"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">تاريخ الميلاد</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          {/* Row 3: Gender & Blood Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">الجنس</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    gender === 'male' ? 'bg-[#07132B] text-white' : 'bg-slate-50 text-slate-700 border'
                  }`}
                >
                  ذكر
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    gender === 'female' ? 'bg-[#07132B] text-white' : 'bg-slate-50 text-slate-700 border'
                  }`}
                >
                  أنثى
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">فصيلة الدم</label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Allergies & Chronic Diseases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-red-700 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span>الحساسية المعروفة</span>
              </label>
              <input
                type="text"
                placeholder="مثال: حساسية بنسلين، سلفا، أكلات معينة..."
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-amber-800 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-amber-600" />
                <span>الأمراض المزمنة</span>
              </label>
              <input
                type="text"
                placeholder="مثال: ضغط، سكر نوع ثاني، ربو، قصور قلب..."
                value={chronicDiseases}
                onChange={(e) => setChronicDiseases(e.target.value)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Row 5: Current Medications */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>الأدوية الحالية والجرعات</span>
            </label>
            <textarea
              rows={2}
              placeholder="مثال: كونكور 5 مجم صباحاً، جلوكوفاج 1000 مجم بعد الغداء..."
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold placeholder:text-slate-400"
            />
          </div>

          {/* Row 6: Medical Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">ملاحظات الطبيب / التمريض الخاصة</label>
            <textarea
              rows={3}
              placeholder="أي ملاحظات سريرية أو خطة متابعة منزلية..."
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold placeholder:text-slate-400"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 bg-[#07132B] hover:bg-[#0F2756] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4 text-gold-400" />
            <span>{isSaving ? 'جارٍ حفظ وتحديث الشيت...' : 'حفظ التعديلات في المنظومة وشيت جوجل ✅'}</span>
          </button>
        </form>

        {/* Patient Appointments History */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#07132B]" />
            <span>سجل زيارات ومواعيد المريض ({patientAppointments.length})</span>
          </h3>

          {patientAppointments.length > 0 ? (
            <div className="space-y-2">
              {patientAppointments.map((app) => (
                <div
                  key={app.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-black text-slate-800">{app.title}</span>
                    <p className="text-[11px] text-slate-500">
                      {new Date(app.start_at).toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })} • {app.location}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                      app.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {app.status === 'completed'
                      ? 'مكتمل'
                      : app.status === 'cancelled'
                      ? 'ملغي'
                      : 'مجدول'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-3 text-center">لا توجد زيارات سابقة مسجلة</p>
          )}
        </div>
      </main>
    </div>
  );
}
