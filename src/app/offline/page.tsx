/**
 * app/offline/page.tsx — Offline fallback
 */
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6" aria-hidden="true">📡</div>
        <h1 className="text-2xl font-extrabold text-white mb-3">
          لا يوجد اتصال بالإنترنت
        </h1>
        <p className="text-white/70 text-base mb-8 leading-relaxed">
          تحقق من اتصالك بالإنترنت وحاول مرة أخرى.
          <br />
          يمكنك التواصل معنا مباشرة عبر:
        </p>
        <div className="flex flex-col gap-3">
          <a
            href="https://wa.me/201099667065"
            className="btn-whatsapp w-full"
          >
            واتساب
          </a>
          <a
            href="tel:+201001097896"
            className="btn-call w-full"
          >
            اتصل بنا
          </a>
        </div>
      </div>
    </main>
  )
}
