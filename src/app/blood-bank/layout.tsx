import type { Metadata } from 'next';
import { DonorProvider } from '@/lib/blood-bank/useDonorStore';
import BottomNav from '@/components/blood-bank/BottomNav';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'بنك الدم | نبض للتمريض والرعاية المنزلية بدمياط',
  description: 'منظومة بنك الدم والتبرع الطوعي لإنقاذ الأرواح في دمياط ومحيطها بالتعاون مع نبض.',
  alternates: { canonical: '/blood-bank' },
};

export default function BloodBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DonorProvider>
      <div dir="rtl" className="font-sans min-h-screen bg-slate-100 text-gray-900">

        {/* ═══════════════════════════════════════════════════
            DESKTOP HEADER BAR (hidden on mobile)
        ═══════════════════════════════════════════════════ */}
        <header className="hidden md:flex items-center justify-between bg-[#07132B] text-white px-8 py-3 shadow-md">
          <Link href="/" className="flex items-center gap-2 text-gold-400 font-black text-lg hover:opacity-80 transition-opacity">
            <span className="text-2xl">🩸</span>
            <span>نبض — بنك الدم</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-bold">
            <Link href="/blood-bank" className="text-white/80 hover:text-gold-300 transition-colors">الرئيسية</Link>
            <Link href="/blood-bank/banks" className="text-white/80 hover:text-gold-300 transition-colors">بنوك الدم</Link>
            <Link href="/blood-bank/request" className="text-white/80 hover:text-gold-300 transition-colors">الطلبات</Link>
            <Link href="/blood-bank/profile" className="text-white/80 hover:text-gold-300 transition-colors">حسابي</Link>
            <Link href="/" className="bg-gold-500 hover:bg-gold-600 text-[#07132B] font-black px-4 py-1.5 rounded-xl transition-colors text-xs">
              ← العودة لنبض
            </Link>
          </nav>
        </header>

        {/* ═══════════════════════════════════════════════════
            LAYOUT: Desktop = sidebar + content | Mobile = full width
        ═══════════════════════════════════════════════════ */}
        <div className="flex justify-center">

          {/* Desktop Left Sidebar (info panel) */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 p-6 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
              <h3 className="font-black text-[#07132B] mb-3 text-base flex items-center gap-2">
                <span>🩸</span> لماذا التبرع؟
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 leading-relaxed">
                <li className="flex gap-2"><span>✅</span> كيس دم واحد ينقذ 3 أرواح</li>
                <li className="flex gap-2"><span>✅</span> آمن تماماً على صحتك</li>
                <li className="flex gap-2"><span>✅</span> الجسم يعوض الكمية خلال 24 ساعة</li>
                <li className="flex gap-2"><span>✅</span> مفتوح للجميع من 18 إلى 60 سنة</li>
              </ul>
            </div>
            <div className="bg-[#FDECEC] rounded-2xl p-5 border border-red-200">
              <h3 className="font-black text-[#C0392B] mb-2 text-sm">⚠️ حالة طارئة؟</h3>
              <p className="text-xs text-slate-600 mb-3">تواصل معنا فوراً للتنسيق العاجل</p>
              <a
                href="tel:+201001097896"
                className="block text-center bg-[#C0392B] text-white font-black rounded-xl py-2 text-sm hover:bg-red-700 transition-colors"
              >
                📞 اتصل الآن
              </a>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
              <h3 className="font-black text-[#07132B] mb-3 text-sm">🏥 أكثر الطلبات إلحاحاً</h3>
              <div className="flex flex-wrap gap-2">
                {['O-', 'O+', 'AB-', 'B-'].map((bt) => (
                  <span key={bt} className="bg-red-50 border border-red-200 text-red-700 font-black text-xs px-3 py-1 rounded-full">{bt}</span>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">هذه الفصائل في أشد الحاجة حالياً</p>
            </div>
          </aside>

          {/* Main Content — phone-like shell on desktop, full width on mobile */}
          <div className="w-full max-w-md md:max-w-lg lg:max-w-md min-h-screen bg-white md:shadow-2xl md:border-x md:border-gray-200/70 relative flex flex-col pb-20 md:pb-4">
            <main className="flex-1 overflow-x-hidden">
              {children}
            </main>
            {/* Bottom nav: show on mobile, hide on desktop (desktop uses top header) */}
            <div className="md:hidden">
              <BottomNav />
            </div>
          </div>

          {/* Desktop Right Sidebar (blood type guide) */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 p-6 shrink-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80">
              <h3 className="font-black text-[#07132B] mb-3 text-base flex items-center gap-2">
                <span>🔬</span> توافق فصائل الدم
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { type: 'O-', give: 'الكل', receive: 'O-' },
                  { type: 'O+', give: 'O+، A+، B+، AB+', receive: 'O+، O-' },
                  { type: 'A+', give: 'A+، AB+', receive: 'A، O' },
                  { type: 'B+', give: 'B+، AB+', receive: 'B، O' },
                  { type: 'AB+', give: 'AB+ فقط', receive: 'الكل' },
                ].map((row) => (
                  <div key={row.type} className="bg-slate-50 rounded-xl p-2 flex items-start gap-2">
                    <span className="font-black text-[#C0392B] w-8 shrink-0">{row.type}</span>
                    <div>
                      <p className="text-slate-500">يعطي: <span className="text-slate-700 font-semibold">{row.give}</span></p>
                      <p className="text-slate-500">يأخذ من: <span className="text-slate-700 font-semibold">{row.receive}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/blood-bank/register"
              className="block text-center bg-[#C0392B] hover:bg-red-700 text-white font-black rounded-2xl py-4 text-base shadow-lg transition-colors"
            >
              🩸 سجّل كمتبرع الآن
            </Link>
          </aside>

        </div>
      </div>
    </DonorProvider>
  );
}

