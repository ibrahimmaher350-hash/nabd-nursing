import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الملف الطبي الموحد والسجل الصحي | نبض للتمريض المنزلي',
  description: 'استعراض السجل الطبي الموحد للمريض، تتبع قراءات العلامات الحيوية، مواعيد الزيارات والمتابعة الدورية، وتصدير تقرير طبي معتمد PDF بهوية نبض.',
  keywords: [
    'الملف الطبي نبض',
    'السجل الصحي الموحد',
    'تقرير تمريض منزلي PDF',
    'متابعة العلامات الحيوية',
    'سجل المريض دمياط',
  ],
  alternates: { canonical: '/medical-record' },
  openGraph: {
    title: 'الملف الطبي الموحد — نبض للتمريض المنزلي بدمياط',
    description: 'سجلك الطبي الشامل: علامات حيوية، زيارات، تحاليل، وأدوية معتمدة.',
    url: '/medical-record',
    type: 'website',
  },
}

export default function MedicalRecordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
