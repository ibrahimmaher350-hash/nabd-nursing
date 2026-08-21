/**
 * app/admin/page.tsx — Admin Dashboard
 * Protected route — requires Firebase Auth.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'لوحة التحكم | نبض',
  robots: { index: false, follow: false },
}

// Admin dashboard layout
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-white" dir="rtl">
      {/* Admin Header */}
      <header className="bg-navy-800 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">لوحة تحكم نبض</h1>
          <span className="badge bg-gold-500/20 text-gold-300 text-xs">Admin</span>
        </div>
      </header>

      <main className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'حجوزات جديدة', value: '—', icon: '📋' },
            { label: 'مؤكدة', value: '—', icon: '✅' },
            { label: 'مكتملة', value: '—', icon: '🏁' },
            { label: 'ملغية', value: '—', icon: '❌' },
          ].map((stat) => (
            <div key={stat.label} className="bg-navy-800 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-3xl mb-2" aria-hidden="true">{stat.icon}</div>
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="text-white/50 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { href: '/admin/bookings',      label: 'إدارة الحجوزات', icon: '📋', desc: 'عرض وإدارة الحجوزات' },
            { href: '/admin/calendar',      label: 'التقويم', icon: '📅', desc: 'عرض المواعيد يومياً وأسبوعياً' },
            { href: '/admin/notifications', label: 'الإشعارات', icon: '🔔', desc: 'إرسال إشعارات للعملاء' },
            { href: '/admin/settings',      label: 'الإعدادات', icon: '⚙️', desc: 'إعدادات الموقع والخدمة' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="bg-navy-800 border border-white/10 rounded-2xl p-5 hover:bg-navy-700 transition-colors"
            >
              <div className="text-3xl mb-3" aria-hidden="true">{item.icon}</div>
              <h2 className="font-bold text-white text-base mb-1">{item.label}</h2>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </a>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 bg-navy-800/50 border border-white/10 rounded-xl p-4">
          <p className="text-white/50 text-xs leading-relaxed">
            ملاحظة: هذه اللوحة مكوّنة لتعمل مع Firebase Authentication وFirestore.
            تأكد من ربط Firebase Config في ملف .env.local لتفعيل جميع الوظائف.
          </p>
        </div>
      </main>
    </div>
  )
}
