/**
 * siteConfig.ts — نبض للتمريض المنزلي
 * Central configuration — NO hardcoding elsewhere.
 * All contact info, social links, and settings live here.
 */

export const siteConfig = {
  // ─── Brand ───────────────────────────────────────────────
  brand: {
    name: 'نبض للتمريض المنزلي',
    shortName: 'نبض',
    tagline: 'رعاية تبدأ من بيتك',
    description:
      'خدمات التمريض والرعاية الصحية المنزلية في دمياط ومحيطها',
    url: 'https://nabd-damietta.blogspot.com',
    locale: 'ar-EG',
    dir: 'rtl' as const,
    logo: '/logo.jpg',
    logoAlt: 'شعار نبض للتمريض المنزلي',
  },

  // ─── Contact ─────────────────────────────────────────────
  contact: {
    phone: '01099667065',
    phoneE164: '+201099667065',
    whatsapp: '201099667065',
    whatsappUrl: 'https://wa.me/201099667065',
    callUrl: 'tel:+201099667065',
    email: null, // Not provided — do NOT invent
  },

  // ─── Location ────────────────────────────────────────────
  location: {
    governorate: 'دمياط',
    country: 'مصر',
    countryCode: 'EG',
    serviceAreas: ['دمياط'], // Configurable from Admin — expandable
    addressDisplay: 'دمياط، مصر',
  },

  // ─── Social ──────────────────────────────────────────────
  social: {
    facebook: 'https://www.facebook.com/share/1D1B1uSJMy/',
    facebookGroup: 'https://www.facebook.com/share/g/1Hok2omwVU/',
    blogger: 'https://nabd-damietta.blogspot.com/?m=1',
    googleBusiness: 'https://share.google/6Yj2LI07E3WNmZ7c0',
    whatsapp: 'https://wa.me/201099667065',
  },

  // ─── SEO ─────────────────────────────────────────────────
  seo: {
    defaultTitle: 'نبض للتمريض المنزلي | خدمات التمريض والرعاية المنزلية في دمياط',
    titleTemplate: '%s | نبض للتمريض المنزلي',
    defaultDescription:
      'نبض للتمريض المنزلي يقدم خدمات التمريض والرعاية الصحية المنزلية في دمياط، بما يشمل الحقن، المحاليل، غيار الجروح، القسطرة، الكانيولا، سحب العينات، ورعاية كبار السن.',
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image' as const,
    keywords: [
      'تمريض منزلي في دمياط',
      'ممرض منزلي في دمياط',
      'تمريض منزلي دمياط',
      'رعاية كبار السن في المنزل',
      'غيار جروح في المنزل',
      'تركيب قسطرة بولية في المنزل',
      'تركيب كانيولا في المنزل',
      'إعطاء حقن في المنزل',
      'تركيب محاليل في المنزل',
      'سحب عينات من المنزل',
      'رعاية ما بعد العمليات في المنزل',
    ],
    googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || null,
    bingSiteVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || null,
    adsenseId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || null, // e.g. ca-pub-XXXXXXXXXXXXXXXX
  },

  // ─── Booking ─────────────────────────────────────────────
  booking: {
    enabled: true,
    idPrefix: 'NB',
    confirmationMessage:
      'تم استلام طلب الحجز. سيتم التواصل معك لتأكيد الموعد.',
    pricingNote: 'السعر يحدد حسب الخدمة والحالة والموقع.',
    emergencyNotice:
      'في الحالات الطارئة أو الأعراض الخطيرة، اتصل بخدمات الطوارئ أو توجه لأقرب قسم طوارئ.',
    sensitiveDataWarning:
      'لا تكتب بيانات طبية شديدة الحساسية إلا عند الحاجة.',
  },

  // ─── Working Hours ────────────────────────────────────────
  workingHours: {
    // Configurable from Admin — placeholder
    display: null, // null = not displayed until configured
    available247: false,
  },

  // ─── Notifications ────────────────────────────────────────
  notifications: {
    enabled: true,
    permissionPrompt:
      'فعّل الإشعارات لتصلك تذكيرات مواعيدك وتحديثات الحجز.',
    reminderOffsets: [
      { label: 'قبل 15 دقيقة', minutes: 15 },
      { label: 'قبل ساعة', minutes: 60 },
      { label: 'قبل يوم', minutes: 1440 },
    ],
  },

  // ─── Blog ─────────────────────────────────────────────────
  blog: {
    provider: 'blogger' as const, // Swappable: 'blogger' | 'firestore' | 'wordpress'
    bloggerUrl: 'https://nabd-damietta.blogspot.com',
    blogId: null, // Set when Blogger API key is configured
    categories: [
      'صحة عامة',
      'تمريض منزلي',
      'رعاية كبار السن',
      'العناية بالجروح',
      'السكري',
      'الضغط',
      'التغذية',
      'التوعية الصحية',
      'العناية بعد العمليات',
    ],
  },

  // ─── Analytics ─────────────────────────────────────────────
  analytics: {
    ga4Id: null, // Set GA4 Measurement ID here
    gtmId: null, // Optional GTM
  },

  // ─── PWA ────────────────────────────────────────────────
  pwa: {
    appName: 'نبض للتمريض المنزلي',
    shortName: 'نبض',
    themeColor: '#1B2B6B',
    backgroundColor: '#0B122E',
    display: 'standalone' as const,
    startUrl: '/',
    lang: 'ar-EG',
    dir: 'rtl' as const,
  },
}

// Helper: Generate WhatsApp URL with pre-filled message
export function getWhatsAppUrl(serviceName?: string): string {
  const base = `https://wa.me/${siteConfig.contact.whatsapp}`
  if (!serviceName) {
    const msg = encodeURIComponent(
      'مرحبًا، أريد الاستفسار عن خدمات نبض للتمريض المنزلي.'
    )
    return `${base}?text=${msg}`
  }
  const msg = encodeURIComponent(
    `مرحبًا، أريد حجز خدمة ${serviceName} من نبض للتمريض المنزلي.`
  )
  return `${base}?text=${msg}`
}

// Helper: Generate Booking ID
export function generateBookingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${siteConfig.booking.idPrefix}-${timestamp}${random}`
}
