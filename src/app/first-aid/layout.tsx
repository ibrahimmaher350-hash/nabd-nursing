import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'دليل الإسعافات الأولية التفاعلي والطوارئ | نبض للتمريض المنزلي',
  description: 'دليل إسعافات أولية تفاعلي سريع باللغة العربية واللهجة المصرية: الاختناق، الإنعاش القلبي الرئوي CPR، النزيف، الحروق، الغيبوبة، التشنجات، والكسور خطوة بخطوة.',
  keywords: [
    'إسعافات أولية',
    'إنعاش قلبي رئوي',
    'علاج الحروق في المنزل',
    'إسعاف الشرقة والاختناق',
    'إسعاف الجلطة والغيبوبة',
    'طوارئ دمياط',
    'تمريض طوارئ دمياط',
  ],
  alternates: { canonical: '/first-aid' },
  openGraph: {
    title: 'دليل الإسعافات الأولية الذكي | نبض للتمريض المنزلي',
    description: 'خطوات إنقاذ الحياة في الطوارئ المنزلية بحسب الفئات العمرية (رضع، أطفال، بالغين، كبار السن، حوامل).',
    url: '/first-aid',
    type: 'website',
  },
}

export default function FirstAidLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
