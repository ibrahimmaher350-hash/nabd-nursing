/**
 * data/offers.ts — نبض للتمريض المنزلي
 * عروض وخصومات نبض — مُدار بالبيانات.
 * لإضافة عرض جديد: أضف entry جديد في مصفوفة offers.
 */

export type OfferType = 'bundle' | 'discount' | 'free-gift'

export interface OfferPackage {
  label: string          // e.g. "5 محاليل حديد"
  gift?: string          // e.g. "صورة دم كاملة مجانًا"
  highlight?: string     // e.g. "30% خصم"
  badge?: string         // badge text on card
  badgeColor?: 'gold' | 'emerald' | 'red'
}

export interface NabdOffer {
  id: string
  title: string                // العنوان الرئيسي
  subtitle: string             // وصف مختصر
  serviceSlug: string          // رابط الخدمة المرتبطة
  serviceName: string          // اسم الخدمة
  emoji: string
  packages: OfferPackage[]
  validFrom: string            // ISO date string
  validUntil: string           // ISO date string
  active: boolean
  featured: boolean            // يظهر في الصفحة الرئيسية؟
  bgGradient: string           // Tailwind classes for card background
  whatsappMessage: string      // رسالة واتساب مباشرة للعرض
}

export const offers: NabdOffer[] = [
  {
    id: 'iron-fluids-aug-2026',
    title: 'عرض خاص على تركيب محاليل الحديد',
    subtitle: 'عشان صحتك تهمنا، جهزنا لك 3 عروض مميزة على تركيب محاليل الحديد!',
    serviceSlug: 'iv-fluids',
    serviceName: 'تركيب المحاليل الوريدية',
    emoji: '🩸',
    packages: [
      {
        label: '5 محاليل حديد',
        gift: 'صورة دم كاملة (CBC) مجانًا 🧪',
        badge: 'عرض 1',
        badgeColor: 'gold',
      },
      {
        label: '10 محاليل حديد',
        gift: 'صورة دم كاملة (CBC) + تحليل الفيريتين (Ferritin) مجانًا 🔬',
        badge: 'عرض 2',
        badgeColor: 'emerald',
      },
      {
        label: 'خصم 30% على تكلفة التركيب',
        highlight: '30%',
        badge: 'عرض 3',
        badgeColor: 'red',
      },
    ],
    validFrom: '2026-08-27',
    validUntil: '2026-09-25',
    active: true,
    featured: true,
    bgGradient: 'from-navy-900 via-navy-800 to-navy-900',
    whatsappMessage: 'مرحبًا، أريد الاستفسار عن عروض تركيب محاليل الحديد الخاصة من نبض للتمريض المنزلي.',
  },
  {
    id: 'vivachek-glucose-meter-2026',
    title: 'عرض خاص: جهاز قياس السكر فيفا تشيك (VivaChek Ino)',
    subtitle: 'سهولة في الاستخدام بدون ألم وبنتيجة فورية خلال 5 ثوانٍ مع 10 شرائط هدية مجانية!',
    serviceSlug: 'medical-supplies',
    serviceName: 'توفير المستلزمات والأجهزة الطبية',
    emoji: '🩸',
    packages: [
      {
        label: 'جهاز فيفا تشيك + 10 شرائط هدية',
        highlight: '250 ج.م فقط',
        gift: '10 شرائط اختبار + قلم شكاكة وإبر مجاناً 🎁',
        badge: 'الأكثر طلباً',
        badgeColor: 'emerald',
      },
      {
        label: 'الجهاز + علبة 50 شريط إضافية',
        gift: 'توصيل منزلي وشرح عملي بدمياط 🚚',
        badge: 'توفير كامل',
        badgeColor: 'gold',
      },
    ],
    validFrom: '2026-08-27',
    validUntil: '2026-11-30',
    active: true,
    featured: true,
    bgGradient: 'from-emerald-950 via-teal-900 to-navy-950',
    whatsappMessage:
      'السلام عليكم، محتاج أطلب عرض جهاز قياس السكر فيفا تشيك بسعر 250ج مع الـ 10 شرايط من نبض بدمياط.',
  },
]

/** Returns only currently active offers */
export function getActiveOffers(): NabdOffer[] {
  const now = new Date()
  return offers.filter((o) => {
    if (!o.active) return false
    const from = new Date(o.validFrom)
    const until = new Date(o.validUntil)
    // Set until to end of day
    until.setHours(23, 59, 59, 999)
    return now >= from && now <= until
  })
}

/** Returns active offers for a specific service slug */
export function getOffersForService(slug: string): NabdOffer[] {
  return getActiveOffers().filter((o) => o.serviceSlug === slug)
}

/** Returns featured active offers */
export function getFeaturedOffers(): NabdOffer[] {
  return getActiveOffers().filter((o) => o.featured)
}
