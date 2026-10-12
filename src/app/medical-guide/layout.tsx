/**
 * app/medical-guide/layout.tsx — نبض للتمريض المنزلي
 * Layout wrapper needed because page.tsx is 'use client' and cannot export metadata.
 */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الدليل الطبي الشامل — الإسعافات والروشتات | نبض للتمريض المنزلي',
  description: 'الدليل الطبي الموحد من نبض للتمريض المنزلي بدمياط: دليل الإسعافات الأولية التفاعلي خطوة بخطوة، ودليل الروشتات الطبية الذكي لجميع التخصصات مع الجرعات والتحذيرات.',
  keywords: [
    'دليل طبي دمياط',
    'إسعافات أولية',
    'روشتات طبية',
    'الإنعاش القلبي الرئوي',
    'دليل الأدوية والجرعات',
    'تمريض منزلي دمياط',
    'طوارئ منزلية',
  ],
  alternates: { canonical: 'https://nabd-nursing.vercel.app/medical-guide' },
  openGraph: {
    title: 'الدليل الطبي الشامل | نبض للتمريض المنزلي — دمياط',
    description: 'دليل طبي تفاعلي شامل: إسعافات أولية ورشتات الأمراض الشائعة مع خدمة التمريض المنزلي في دمياط.',
    url: 'https://nabd-nursing.vercel.app/medical-guide',
    type: 'website',
  },
}

export default function MedicalGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
