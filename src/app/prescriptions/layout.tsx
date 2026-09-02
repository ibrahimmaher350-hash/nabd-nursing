import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'دليل الروشتات الطبية الذكي والأدوية | نبض للتمريض المنزلي',
  description: 'مرجع الروشتات الطبية الشامل والإسعافي لجميع التخصصات: الباطنة، الصدر، القلب، السكر، العظام، الأطفال، مع جرعات الأدوية والتحذيرات السريرية بدمياط.',
  keywords: [
    'دليل الروشتات الطبية',
    'روشتاتولوجي',
    'روشتة باطنة',
    'جرعات الأدوية',
    'علاج النزلة المعوية',
    'علاج الربو والبلغم',
    'علاج ارتفاع الضغط',
    'علاج السكر',
    'تمريض منزلي دمياط',
  ],
  alternates: { canonical: '/prescriptions' },
  openGraph: {
    title: 'دليل الروشتات الطبية الذكي | نبض للتمريض المنزلي — دمياط',
    description: 'ابحث عن أي شكوى طبية لتظهر لك الروشتة الإسعافية الكاملة، الجرعات، المحاذير، مع إمكانية طلب التمريض المنزلي فوراً.',
    url: '/prescriptions',
    type: 'website',
  },
}

export default function PrescriptionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
