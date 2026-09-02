import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'عروض وباقات التمريض المنزلي المخفضة | نبض دمياط',
  description: 'أقوى باقات وعروض التمريض المنزلي ورعاية كبار السن، المتابعة الشهرية لمرضى السكر والضغط، وغيارات الجروح والقسطرة بدمياط بخصومات خاصة.',
  keywords: [
    'عروض تمريض منزلي',
    'باقات رعاية كبار السن دمياط',
    'خصم تمريض منزلي',
    'باقة متابعة السكر والضغط',
    'غيار جروح مخفض',
  ],
  alternates: { canonical: '/offers' },
  openGraph: {
    title: 'عروض وباقات نبض للتمريض المنزلي — دمياط',
    description: 'وفر مع باقات نبض التمريضية المتكاملة لرعاية أهلك في المنزل.',
    url: '/offers',
    type: 'website',
  },
}

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
