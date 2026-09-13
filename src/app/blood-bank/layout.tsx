import type { Metadata } from 'next';
import { DonorProvider } from '@/lib/blood-bank/useDonorStore';
import BottomNav from '@/components/blood-bank/BottomNav';

export const metadata: Metadata = {
  title: 'بنك الدم | نبض للتمريض والرعاية المنزلية بدمياط',
  description: 'منظومة بنك الدم والتبرع الطوعي لإنقاذ الأرواح في دمياط ومحيطها بالتعاون مع نبض.',
};

export default function BloodBankLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DonorProvider>
      <div
        dir="rtl"
        className="font-sans min-h-screen bg-slate-100 text-gray-900 flex justify-center"
      >
        {/* Mobile-first app shell centered on desktop */}
        <div className="w-full max-w-md min-h-screen bg-white shadow-xl relative flex flex-col pb-20 border-x border-gray-200/70">
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
          <BottomNav />
        </div>
      </div>
    </DonorProvider>
  );
}
