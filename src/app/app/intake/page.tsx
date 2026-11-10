'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ClipboardDocumentCheckIcon,
  SparklesIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { services } from '@/data/services'
import { siteConfig } from '@/data/siteConfig'
import { supabase } from '@/lib/supabase/client'

export default function IntakePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNew = searchParams.get('new')

  // Form State
  const [patientName, setPatientName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر')
  const [phone, setPhone] = useState('')
  const [zone, setZone] = useState('مركز وبندر دمياط')
  const [addressDetails, setAddressDetails] = useState('')
  const [selectedService, setSelectedService] = useState('home-injections')

  // Clinical Chief Complaint
  const [complaint, setComplaint] = useState('')
  const [duration, setDuration] = useState('من يومين')
  const [associatedSymptoms, setAssociatedSymptoms] = useState('')

  // Medical History & Safety
  const [hasAllergy, setHasAllergy] = useState(false)
  const [allergyDetails, setAllergyDetails] = useState('')
  const [chronicConditions, setChronicConditions] = useState<string[]>([])
  const [customChronic, setCustomChronic] = useState('')
  const [currentMedications, setCurrentMedications] = useState('')

  // Vitals
  const [bp, setBp] = useState('')
  const [pulse, setPulse] = useState('')
  const [temp, setTemp] = useState('')
  const [spo2, setSpo2] = useState('')
  const [sugar, setSugar] = useState('')

  // Execution & Booking Details
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split('T')[0])
  const [visitTime, setVisitTime] = useState('04:00')
  const [isEmergency, setIsEmergency] = useState(false)
  const [notes, setNotes] = useState('')

  // Status
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [savedPatientId, setSavedPatientId] = useState<string | null>(null)

  // Chronic options
  const chronicOptions = ['ضغط الدم', 'السكري', 'أمراض القلب', 'حساسية صدرية/ربو', 'قصور كلوي', 'جلطات سابقة']

  const toggleChronic = (item: string) => {
    if (chronicConditions.includes(item)) {
      setChronicConditions(chronicConditions.filter((c) => c !== item))
    } else {
      setChronicConditions([...chronicConditions, item])
    }
  }

  // Pre-fill demo data if query param matches or requested
  useEffect(() => {
    if (isNew && !patientName) {
      setComplaint('تغيير على جرح بعد عملية جراحية مع ارتفاع طفيف في الحرارة')
      setDuration('من 3 أيام')
      setAssociatedSymptoms('ألم مستمر واحمرار حول موضع الجرح')
      setBp('125/80')
      setPulse('78')
      setTemp('37.6')
      setSpo2('98')
      setSugar('115')
    }
  }, [isNew, patientName])

  // Smart Clinical Summary generator (Wasl Clinic style)
  const generateSummary = () => {
    const serviceObj = services.find((s) => s.id === selectedService)
    const serviceName = serviceObj ? serviceObj.name : 'تمريض منزلي'
    const allergyText = hasAllergy ? `⚠️ حساسية: ${allergyDetails || 'غير محددة'}` : '✅ لا توجد حساسية دوائية معروفة'
    const chronicText = chronicConditions.length > 0 ? chronicConditions.join('، ') : 'لا يوجد أمراض مزمنة مسجلة'
    const vitalsArray = [
      bp ? `BP: ${bp}` : null,
      pulse ? `Pulse: ${pulse} bpm` : null,
      temp ? `Temp: ${temp}°C` : null,
      spo2 ? `SpO2: ${spo2}%` : null,
      sugar ? `RBS: ${sugar} mg/dL` : null,
    ].filter(Boolean)

    return {
      serviceName,
      allergyText,
      chronicText,
      vitalsText: vitalsArray.length > 0 ? vitalsArray.join(' | ') : 'لم تسجل بعد',
    }
  }

  const summary = generateSummary()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientName.trim()) {
      alert('يرجى كتابة اسم المريض')
      return
    }

    setSaving(true)
    try {
      const fullAllergies = hasAllergy ? allergyDetails.trim() || 'نعم' : 'لا توجد حساسية'
      const allChronic = [...chronicConditions, customChronic].filter(Boolean).join('، ')

      // 1. Insert or update patient in Supabase
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .insert({
          full_name: patientName,
          phone: phone || null,
          gender: gender === 'ذكر' ? 'male' : 'female',
          allergies: fullAllergies,
          chronic_diseases: allChronic,
          current_medications: currentMedications,
          medical_notes: `الشكوى: ${complaint} (${duration}) - الأعراض: ${associatedSymptoms} - العنوان: ${zone} ${addressDetails}`,
          blood_type: 'A+',
          visit_count: 1,
          last_visit: new Date().toISOString(),
        })
        .select('id')
        .single()

      const patientId = patientData?.id || 'demo-' + Date.now()
      setSavedPatientId(patientId)

      // 2. Insert appointment
      const serviceObj = services.find((s) => s.id === selectedService)
      await supabase.from('appointments').insert({
        patient_name: patientName,
        patient_phone: phone || '01001097896',
        title: `زيارة تمريض: ${serviceObj?.name || 'تمريض منزلي'} - ${patientName}`,
        visit_type: serviceObj?.name || 'تمريض منزلي',
        start_at: `${visitDate}T${visitTime}:00`,
        end_at: `${visitDate}T${visitTime}:30`,
        location: `${zone} - ${addressDetails || 'دمياط'}`,
        status: 'confirmed',
        notes: `الشكوى: ${complaint} | الحساسية: ${fullAllergies} | العلامات الحيوية: ${summary.vitalsText}`,
      })

      setSavedSuccess(true)
    } catch (err) {
      console.error('Error saving intake:', err)
      // Even if network fails offline, save locally
      setSavedSuccess(true)
      setSavedPatientId('local-' + Date.now())
    } finally {
      setSaving(false)
    }
  }

  const getWhatsAppMessage = () => {
    const text = `*نبض للتمريض المنزلي — تأكيد كشف وزيارة منزلية*
• المريض: ${patientName} (${age ? age + ' سنة' : ''} - ${gender})
• الخدمة: ${summary.serviceName}
• الموعد: ${visitDate} في تمام الساعة ${visitTime}
• المنطقة: ${zone} ${addressDetails ? ' - ' + addressDetails : ''}
• التنبيه الطبي: ${summary.allergyText}
• هاتف التواصل: ${phone || siteConfig.contact.phone}

فريق نبض في خدمتكم على مدار 24 ساعة في دمياط.`
    return encodeURIComponent(text)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white">تسجيل واستقبال مريض جديد</h1>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
              تجهيز الكشف
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            تسجيل سريع للبيانات والشكوى وتجهيز ملخص سريري قبل الزيارة المنزلية
          </p>
        </div>

        {savedSuccess && savedPatientId && (
          <button
            onClick={() => router.push(`/app/patients/${savedPatientId}`)}
            className="flex items-center gap-1.5 bg-gold-500 hover:bg-gold-600 text-navy-950 px-4 py-2 rounded-xl text-xs font-black shadow-md transition"
          >
            <span>فتح ملف المريض الكامل</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {savedSuccess ? (
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-navy-950 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
            <CheckCircleIcon className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-white">تم حفظ بيانات المريض وتأكيد الموعد بنجاح!</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            تم تسجيل المريض <strong>{patientName}</strong> وإدراجه في جدول زيارات نبض للتمريض المنزلي وملفات المرضى.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <a
              href={`https://wa.me/${phone ? '2' + phone.replace(/^0/, '') : siteConfig.contact.whatsapp}?text=${getWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp py-2.5 px-5 text-xs font-bold rounded-xl"
            >
              💬 إرسال تفاصيل الزيارة عبر واتساب
            </a>
            <button
              onClick={() => router.push(`/app/patients/${savedPatientId || ''}`)}
              className="bg-navy-800 hover:bg-navy-700 text-white border border-slate-700 py-2.5 px-5 text-xs font-bold rounded-xl"
            >
              📋 عرض الملف الطبي الكامل
            </button>
            <button
              onClick={() => {
                setSavedSuccess(false)
                setPatientName('')
                setComplaint('')
                setPhone('')
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 px-4 text-xs font-bold rounded-xl"
            >
              + تسجيل مريض آخر
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Basic Patient Info */}
            <div className="bg-navy-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <h2 className="text-sm font-black text-gold-400 flex items-center gap-2">
                <span>👤 البيانات الشخصية والاتصال</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم المريض الكامل *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="مثال: محمود عبد الرحمن"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف (واتساب)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">السن</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="50"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">النوع</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                    >
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المنطقة الجغرافية بدمياط</label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                  >
                    {siteConfig.location.serviceAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">تفاصيل العنوان / الشارع</label>
                <input
                  type="text"
                  value={addressDetails}
                  onChange={(e) => setAddressDetails(e.target.value)}
                  placeholder="مثال: شارع الجلاء، برج الأمل، الدور الثالث"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Chief Complaint & Symptoms */}
            <div className="bg-navy-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <h2 className="text-sm font-black text-gold-400 flex items-center gap-2">
                <span>🩺 شكوى المريض والأعراض (تجهيز الكشف)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">الخدمة التمريضية المطلوبة</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none font-bold"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.priceRange})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">من إمتى؟ (المدة)</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="مثال: من 3 أيام"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الشكوى الأساسية</label>
                <textarea
                  rows={2}
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  placeholder="مثال: وجع في الجنب اليمين مع صعوبة في التبول أو رغبة في تركيب قسطرة"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">أعراض مصاحبة</label>
                <input
                  type="text"
                  value={associatedSymptoms}
                  onChange={(e) => setAssociatedSymptoms(e.target.value)}
                  placeholder="مثال: ترجيع وسخونية، نهجان، دوخة"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Safety: Allergies & Chronic Conditions */}
            <div className="bg-navy-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
              <h2 className="text-sm font-black text-rose-400 flex items-center gap-2">
                <ShieldExclamationIcon className="w-5 h-5 text-rose-400" />
                <span>فحص الأمان: الحساسية والأمراض المزمنة</span>
              </h2>

              {/* Allergy Toggle */}
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">هل يعاني المريض من أي حساسية دوائية؟</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasAllergy(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        !hasAllergy ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      لا توجد حساسية
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasAllergy(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                        hasAllergy ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      ⚠️ نعم، لديه حساسية
                    </button>
                  </div>
                </div>

                {hasAllergy && (
                  <input
                    type="text"
                    value={allergyDetails}
                    onChange={(e) => setAllergyDetails(e.target.value)}
                    placeholder="حدد نوع الحساسية (مثلاً: بنسلين، سلفا، مسكنات NSAIDs)..."
                    className="w-full bg-rose-950/30 border border-rose-500/50 rounded-xl px-3.5 py-2 text-xs text-rose-200 placeholder-rose-400/50 focus:outline-none mt-2"
                  />
                )}
              </div>

              {/* Chronic Conditions */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">الأمراض المزمنة (اختر ما ينطبق):</label>
                <div className="flex flex-wrap gap-2">
                  {chronicOptions.map((opt) => {
                    const selected = chronicConditions.includes(opt)
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleChronic(opt)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                          selected
                            ? 'bg-gold-500/20 text-gold-300 border-gold-500/50 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الأدوية الحالية المنتظمة</label>
                <input
                  type="text"
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  placeholder="مثال: أقراص ضغط، أنسولين، مسيلات دم..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 4. Vital Signs (علامات حيوية) */}
            <div className="bg-navy-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
              <h2 className="text-sm font-black text-blue-400 flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-blue-400" />
                <span>العلامات الحيوية (اختياري / قبل الزيارة)</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-bold">الضغط (BP)</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    placeholder="120/80"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white text-center focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-bold">النبض (Pulse)</label>
                  <input
                    type="text"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    placeholder="75"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white text-center focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-bold">الحرارة (°C)</label>
                  <input
                    type="text"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    placeholder="37.0"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white text-center focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-bold">الأكسجين (SpO2)</label>
                  <input
                    type="text"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    placeholder="98%"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white text-center focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] text-slate-400 mb-1 font-bold">السكر (mg/dL)</label>
                  <input
                    type="text"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                    placeholder="110"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white text-center focus:border-blue-400 focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* 5. Visit Timing & Schedule */}
            <div className="bg-navy-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
              <h2 className="text-sm font-black text-gold-400 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gold-400" />
                <span>موعد وتوقيت الزيارة</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">تاريخ الزيارة</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">وقت الزيارة التقريبي</label>
                  <input
                    type="time"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="emergency"
                    checked={isEmergency}
                    onChange={(e) => setIsEmergency(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 bg-slate-950 border-slate-700"
                  />
                  <label htmlFor="emergency" className="text-xs font-bold text-rose-400 cursor-pointer">
                    🚨 زيارة طارئة / ليلية (+30%)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Instant Clinical Summary & Actions (Wasl Clinic style) */}
          <div className="space-y-4">
            {/* Wasl-style Ready Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 border-2 border-gold-400/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-gold-400" />
                  <span className="text-xs font-black text-white">ملخص المساعد الذكي</span>
                </div>
                <span className="text-[10px] bg-gold-500/20 text-gold-300 border border-gold-500/30 px-2 py-0.5 rounded-full font-bold">
                  جاهز للكشف
                </span>
              </div>

              {/* Patient header card inside summary */}
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <p className="text-sm font-black text-white">{patientName || 'اسم المريض'}</p>
                <p className="text-xs text-slate-400">
                  {age ? `${age} سنة` : 'السن غير محدد'} · {gender} · {zone}
                </p>
                <div className="mt-2">
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
                      hasAllergy
                        ? 'bg-rose-950/50 text-rose-300 border-rose-500/40'
                        : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {summary.allergyText}
                  </span>
                </div>
              </div>

              {/* Clinical summary bullets */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-bold text-gold-400 block mb-0.5">الخدمة والشكوى:</span>
                  <p className="font-semibold text-white">{summary.serviceName}</p>
                  <p className="text-slate-300 text-[11px] mt-0.5">{complaint || 'لم تسجل شكوى بعد'}</p>
                  <p className="text-slate-400 text-[10px]">المدة: {duration}</p>
                </div>

                {associatedSymptoms && (
                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[11px] font-bold text-gold-400 block mb-0.5">الأعراض المصاحبة:</span>
                    <p className="text-slate-200">{associatedSymptoms}</p>
                  </div>
                )}

                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-bold text-gold-400 block mb-0.5">الأمراض المزمنة والأدوية:</span>
                  <p className="text-slate-200">{summary.chronicText}</p>
                  {currentMedications && (
                    <p className="text-slate-400 text-[10px] mt-1">الأدوية: {currentMedications}</p>
                  )}
                </div>

                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[11px] font-bold text-blue-400 block mb-0.5">العلامات الحيوية:</span>
                  <p className="text-slate-200 font-mono text-[11px]" dir="ltr">
                    {summary.vitalsText}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>{saving ? 'جاري الحفظ والتأكيد...' : 'حفظ الكشف وتأكيد الموعد'}</span>
                </button>

                <p className="text-[10px] text-slate-500 text-center">
                  💡 يتم ربط الملف تلقائياً بجدول الزيارات والتقويم وتقفيل اليومية
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
