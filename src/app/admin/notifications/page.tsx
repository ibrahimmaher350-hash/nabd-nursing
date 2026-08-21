'use client'
/**
 * app/admin/notifications/page.tsx — إدارة وإرسال الإشعارات
 */

import { useState } from 'react'
import Link from 'next/link'
import { BellIcon, PaperAirplaneIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

type TargetAudience = 'all' | 'single' | 'service_group'

export default function AdminNotificationsPage() {
  const [target, setTarget] = useState<TargetAudience>('all')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const quickTemplates = [
    {
      label: 'تأكيد الحجز',
      title: 'تم تأكيد طلب الخدمة التمريضية',
      body: 'تم تأكيد موعدك التمريضي بنجاح مع فريق نبض. سيصلك مقدم الخدمة في الموعد المحدد.',
    },
    {
      label: 'تذكير قبل الموعد بيوم',
      title: 'تذكير بموعد نبض للتمريض المنزلي',
      body: 'تذكير: لديك موعد تمريض منزلي غداً. يرجى تجهيز الأدوية أو الفحوصات إن وجدت.',
    },
    {
      label: 'تذكير في نفس اليوم',
      title: 'مقدم الخدمة في الطريق إليك',
      body: 'مقدم الخدمة من فريق نبض يستعد للزيارة المنزلية وفق الموعد المتفق عليه.',
    },
    {
      label: 'إشعار عام / نصيحة صحية',
      title: 'نصيحة صحية من نبض للتمريض',
      body: 'تابع علامتك الحيوية بانتظام واشرب كميات كافية من الماء حفاظاً على صحتك وصحة أحبائك.',
    },
  ]

  const applyTemplate = (t: { title: string; body: string }) => {
    setTitle(t.title)
    setBody(t.body)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !body) return

    setSending(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target,
          title,
          body,
          bookingId: bookingId || undefined,
          scheduledTime: scheduledTime || undefined,
        }),
      })

      const json = await res.json()
      if (json.success) {
        setFeedback({
          type: 'success',
          message: 'تم إرسال / جدولة الإشعار بنجاح لجميع المشتركين المستهدفين!',
        })
        setTitle('')
        setBody('')
        setBookingId('')
      } else {
        throw new Error(json.error || 'فشل إرسال الإشعار')
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'تعذر إرسال الإشعار حالياً'
      setFeedback({
        type: 'error',
        message: errorMsg,
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white p-6" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-white/50 hover:text-white text-sm">
          ← العودة للوحة التحكم
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <BellIcon className="w-6 h-6 text-gold-400" />
          إدارة وإرسال الإشعارات (Push Notifications)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSend} className="bg-navy-900 border border-white/10 rounded-2xl p-6 shadow-card space-y-5">
            <h2 className="text-base font-bold text-white mb-2">إرسال إشعار جديد</h2>

            {/* Target Selector */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-2">
                الجمهور المستهدف:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'جميع المشتركين' },
                  { id: 'single', label: 'عميل محدد (برقم الحجز)' },
                  { id: 'service_group', label: 'حسب نوع الخدمة' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTarget(item.id as TargetAudience)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      target === item.id
                        ? 'bg-gold-500 text-white border-gold-400 shadow-md'
                        : 'bg-navy-800 text-white/60 border-white/10 hover:bg-navy-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {target === 'single' && (
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5">
                  رقم الحجز (Booking ID):
                </label>
                <input
                  type="text"
                  placeholder="مثال: NB-XXXXXXXX"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 font-mono"
                  dir="ltr"
                />
              </div>
            )}

            {/* Notification Title */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                عنوان الإشعار: <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثال: تذكير بموعد الزيارة التمريضية"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            {/* Notification Body */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                نص الرسالة / الإشعار: <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="اكتب محتوى الإشعار الواضح والمباشر..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400 resize-none"
              />
            </div>

            {/* Schedule (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                تاريخ ووقت الإرسال (اختياري - اتركه فارغاً للإرسال الفوري):
              </label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400"
                dir="ltr"
              />
            </div>

            {/* Feedback Alert */}
            {feedback && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                  feedback.type === 'success'
                    ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-900/40 text-red-300 border border-red-500/30'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircleIcon className="w-5 h-5 shrink-0" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={sending}
              className="w-full btn-primary bg-gold-500 hover:bg-gold-600 shadow-gold text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <PaperAirplaneIcon className="w-4 h-4 rtl:-rotate-90" />
              {sending ? 'جارٍ الإرسال...' : scheduledTime ? 'جدولة الإشعار' : 'إرسال الإشعار الآن'}
            </button>
          </form>
        </div>

        {/* Templates & Guidelines */}
        <div className="space-y-6">
          <div className="bg-navy-900 border border-white/10 rounded-2xl p-5 shadow-card">
            <h3 className="text-sm font-bold text-gold-300 mb-3 flex items-center gap-2">
              ⚡ قوالب رسائل سريعة
            </h3>
            <p className="text-xs text-white/50 mb-4">
              اضغط على أي قالب لتعبئة الحقول فوراً والتعديل عليها:
            </p>
            <div className="space-y-2">
              {quickTemplates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="w-full text-start p-3 bg-navy-800 hover:bg-navy-700/80 rounded-xl text-xs border border-white/5 transition"
                >
                  <p className="font-bold text-white mb-1">{t.label}</p>
                  <p className="text-white/60 line-clamp-1">{t.body}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-navy-900 border border-white/10 rounded-2xl p-5 shadow-card">
            <h3 className="text-sm font-bold text-white mb-2">ℹ️ معمارية الإشعارات</h3>
            <ul className="text-xs text-white/60 space-y-2 leading-relaxed list-disc list-inside">
              <li>تعتمد الإشعارات على Firebase Cloud Messaging وWeb Push.</li>
              <li>يتم تخزين التوكنز في Firestore ضمن مجموعة المشتركين.</li>
              <li>لا يتم إرسال إشعارات مزعجة للمستخدمين للحفاظ على ثقة المريض.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
