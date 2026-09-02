import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'لوحة التحكم | نبض للتمريض المنزلي',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-cairo" dir="rtl">
      {/* Simple Admin Header */}
      <header className="bg-navy-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1">
              <img src="/logo.jpg" alt="Logo" className="max-w-full rounded-full" />
            </div>
            <h1 className="font-bold text-lg">لوحة تحكم نبض</h1>
          </div>
          <a href="/" className="text-xs text-navy-200 hover:text-white transition-colors">
            العودة للموقع
          </a>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}
