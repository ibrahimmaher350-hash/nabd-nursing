import type { Metadata } from 'next'
import AdminGuard from '@/components/admin/AdminGuard'
import AppNavigation from './components/AppNavigation'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'نبض | إدارة العيادة والتمريض المنزلي',
  description: 'نظام إدارة ملفات المرضى، المواعيد، الحسابات وتقفيل اليومية لخدمات نبض للتمريض المنزلي',
  robots: { index: false, follow: false },
}

export default function WaslAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased selection:bg-gold-500 selection:text-navy-950 font-cairo" dir="rtl">
        <AppNavigation />
        <main className="flex-1 min-w-0 pb-20 md:pb-8 p-3 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
          {children}
        </main>
      </div>
    </AdminGuard>
  )
}
