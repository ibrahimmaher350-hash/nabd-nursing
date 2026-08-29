/**
 * data/medicalSuppliesData.ts — نبض للتمريض المنزلي
 * كتالوج الأجهزة والمستلزمات الطبية المنزلية المتاحة للتوصيل والطلب بدمياط
 */

export interface MedicalProduct {
  id: string
  name: string
  nameEnglish: string
  slug: string
  category: 'glucose' | 'pressure' | 'oximeter' | 'wound_care' | 'beds' | 'thermometer'
  categoryName: string
  price: string
  priceNumber: number
  oldPrice?: string
  badge?: string
  isFeatured?: boolean
  image: string
  shortDesc: string
  features: { icon: string; title: string; desc: string }[]
  specifications: { label: string; value: string }[]
  inTheBox: string[]
  whatsappText: string
}

// ── Featured Hero Product: VivaChek Ino Glucose Meter ─────────
export const FEATURED_GLUCOSE_METER: MedicalProduct = {
  id: 'vivachek-ino',
  name: 'جهاز قياس السكر في الدم فيفا تشيك',
  nameEnglish: 'VivaChek Ino Blood Glucose Monitoring System',
  slug: 'vivachek-ino',
  category: 'glucose',
  categoryName: 'أجهزة قياس السكر',
  price: '250 ج.م',
  priceNumber: 250,
  oldPrice: '350 ج.م',
  badge: 'الأكثر مبيعاً 🏆 | عرض خاص 250ج',
  isFeatured: true,
  image: '/vivachek.png',
  shortDesc:
    'سهولة تامة في الاستخدام بدون ألم 💯 ونتائج مضمونة وموثوقة خلال 5 ثوانٍ فقط. يأتي مع 10 شرائط اختبار هدية وقلم وخز متطور.',
  features: [
    {
      icon: '⚡',
      title: 'نتيجة سريعة خلال 5 ثوانٍ',
      desc: 'يعطي نتيجة التحليل فوراً على الشاشة الرقمية الكبيرة خلال 5 ثوانٍ فقط بدون أي تأخير.',
    },
    {
      icon: '🩸',
      title: 'سهولة في الاستخدام وبدون كود (No Coding)',
      desc: 'يتعرف الجهاز على الشرائط تلقائياً بدون كود وبدون ألم مع قطرة دم صغيرة جداً (0.5 ميكروليتر).',
    },
    {
      icon: '📉',
      title: 'ذاكرة ذكية ومراجعة متوسطات 90 يوماً',
      desc: 'يراجع ويحسب متوسطات نتائج الاختبار حتى 90 يوماً (7، 14، 30، 90 يوم) لمتابعة منحنى السكر مع الطبيب.',
    },
    {
      icon: '📥',
      title: 'تنبيهات عند انتهاء صلاحية الشرائط',
      desc: 'خاصية أمان ذكية تطلق تنبيهاً إذا كانت الشرائط منتهية الصلاحية لضمان الحصول على قراءات دقيقة 100%.',
    },
    {
      icon: '🍽️',
      title: 'اختيار التحليل قبل أو بعد الوجبات',
      desc: 'خاصية تصنيف الفحص (صائم قبل الأكل أو بعد الوجبة) لتنظيم خطة العلاج وجرعات الإنسولين.',
    },
    {
      icon: '👨‍⚕️',
      title: 'مناسب للاستخدام المنزلي ولأطقم التمريض',
      desc: 'مثالي للاستخدام الشخصي السهل للأسرة، وللمختصين في فحص سكر الدم الطارئ لدقته وسرعته العالية.',
    },
  ],
  specifications: [
    { label: 'العلامة التجارية', value: 'VivaChek™ Ino (فيفا تشيك إينو)' },
    { label: 'زمن الفحص', value: '5 ثوانٍ فقط' },
    { label: 'عينة الدم المطلوبة', value: '0.5 ميكروليتر (أقل عينة بدون ألم)' },
    { label: 'نطاق القياس', value: '20 - 600 ملجم/ديسيلتر' },
    { label: 'نوع الشرائط', value: 'شرائط فيفا تشيك بدون كود (No Coding)' },
    { label: 'الذاكرة والمتوسطات', value: 'ذاكرة سابقة مع متوسطات 7 و 14 و 30 و 90 يوماً' },
    { label: 'التنبيهات', value: 'تنبيه انتهاء صلاحية الشرائط، وتنبيه هبوط/ارتفاع السكر' },
    { label: 'الاعتمادات', value: 'معتمد من FDA ومنظمة الصحة وهيئات المعايير الطبية' },
    { label: 'الضمان', value: 'ضمان 5 سنوات معتمد' },
  ],
  inTheBox: [
    'جهاز قياس السكر VivaChek Ino بشاشة واضحة',
    '10 شرائط اختبار فيفا تشيك معقمة مجاناً',
    'قلم وخز طبي مريح متعدد درجات العمق',
    '10 إبر وخز معقمة للاستخدام الفردي',
    'حقيبة واقية أنيقة لحفظ الجهاز ومستلزماته',
    'بطارية تشغيل طويلة العمر متضمنة',
    'كتيب إرشادات باللغة العربية والإنجليزية + كارت الضمان',
  ],
  whatsappText:
    'السلام عليكم، محتاج أطلب جهاز قياس السكر فيفا تشيك بسعر 250ج مع الـ 10 شرايط من نبض بدمياط.',
}

// ── Additional Medical Supplies Available in Damietta ─────────
export const ADDITIONAL_MEDICAL_SUPPLIES: MedicalProduct[] = [
  {
    id: 'vivachek-strips-50',
    name: 'شرائط قياس سكر فيفا تشيك (علبة 50 شريط)',
    nameEnglish: 'VivaChek Ino Test Strips (50 Strips)',
    slug: 'vivachek-strips-50',
    category: 'glucose',
    categoryName: 'شرائط السكر',
    price: 'سعر خاص',
    priceNumber: 0,
    badge: 'متوفر دائماً',
    image: '/vivachek.png',
    shortDesc: 'علبة شرائط اختبار أصلية معتمدة لجهاز فيفا تشيك إنو، تحتوي على 50 شريط معقم مع إبر وخز.',
    features: [
      { icon: '🛡️', title: 'شرائط أصلية 100%', desc: 'تاريخ صلاحية حديث وتغليف معقم محكم.' },
      { icon: '🩸', title: 'سحب دم ذاتي فوري', desc: 'تمتص نقطة الدم فوراً بدون إهدار.' },
    ],
    specifications: [
      { label: 'العدد', value: '50 شريط اختبار' },
      { label: 'التوافق', value: 'أجهزة VivaChek Ino' },
    ],
    inTheBox: ['علبة 50 شريط فيفا تشيك', 'نشرة الإرشادات'],
    whatsappText: 'السلام عليكم، محتاج أطلب علبة شرائط فيفا تشيك 50 شريط بدمياط.',
  },
  {
    id: 'digital-bp-monitor',
    name: 'جهاز قياس ضغط الدم الديجيتال للذراع',
    nameEnglish: 'Digital Upper Arm Blood Pressure Monitor',
    slug: 'digital-bp-monitor',
    category: 'pressure',
    categoryName: 'أجهزة الضغط',
    price: 'متوفر للطلب',
    priceNumber: 0,
    badge: 'دقة طبية عالية',
    image: '/logo.jpg',
    shortDesc: 'جهاز قياس ضغط الدم الرقمي الأوتوماتيكي للذراع مع شاشة عريضة وناطق بالعربية أو مؤشر ضغط.',
    features: [
      { icon: '💓', title: 'قياس دقيق للضغط والنبض', desc: 'يكشف اضطراب ضربات القلب التلقائي.' },
      { icon: '🔊', title: 'شاشة كبيرة سهلة القراءة', desc: 'مثالي لكبار السن وضعاف البصر.' },
    ],
    specifications: [
      { label: 'طريقة القياس', value: 'أوتوماتيكي على الذراع' },
      { label: 'الذاكرة', value: 'ذاكرة لمستخدمين مع متوسط القياسات' },
    ],
    inTheBox: ['جهاز الضغط الرقمي', 'حزام ذراع عريض مريح', 'حقيبة حفظ', 'بطاريات'],
    whatsappText: 'السلام عليكم، عايز استفسر عن جهاز قياس ضغط الدم الديجيتال من نبض بدمياط.',
  },
  {
    id: 'pulse-oximeter',
    name: 'جهاز قياس نسبة أكسجين الدم ونبض القلب (Pulse Oximeter)',
    nameEnglish: 'Fingertip Pulse Oximeter',
    slug: 'pulse-oximeter',
    category: 'oximeter',
    categoryName: 'أجهزة الأكسجين',
    price: 'متوفر للطلب',
    priceNumber: 0,
    badge: 'أساسي لمرضى الصدر',
    image: '/logo.jpg',
    shortDesc: 'جهاز قياس نسبة تشبع الأكسجين في الدم (SpO2) ومعدل نبضات القلب من الإصبع فورياً وبدقة فائقة.',
    features: [
      { icon: '🫁', title: 'قياس الأكسجين الفوري', desc: 'قراءة فورية خلال ثوانٍ بنسبة دقة 99%.' },
      { icon: '📊', title: 'شاشة OLED ملونة', desc: 'تعرض نبض القلب وموجة البلثسموغراف.' },
    ],
    specifications: [
      { label: 'النطاق', value: 'SpO2: 70-100% | Pulse: 30-250 bpm' },
      { label: 'الإغلاق التلقائي', value: 'نعم بعد 8 ثوانٍ لتوفير الطاقة' },
    ],
    inTheBox: ['جهاز الأوكسيميتر', 'حبل تعليق', 'بطاريات', 'دليل الاستخدام'],
    whatsappText: 'السلام عليكم، محتاج أطلب جهاز قياس الأكسجين Pulse Oximeter بدمياط.',
  },
  {
    id: 'sterile-wound-kit',
    name: 'حقيبة غيار الجروح والقرح المعقمة المتكاملة',
    nameEnglish: 'Sterile Wound & Ulcer Care Kit',
    slug: 'sterile-wound-kit',
    category: 'wound_care',
    categoryName: 'غيارات الجروح',
    price: 'حسب مقاس الجرح',
    priceNumber: 0,
    badge: 'معقم 100%',
    image: '/logo.jpg',
    shortDesc: 'مستلزمات متكاملة لغيارات جروح العمليات، قرح الفراش، والقدم السكري مع مطهرات ودريسنج طبي متطور.',
    features: [
      { icon: '🩹', title: 'غيارات متطورة Hydrocolloid & Foam', desc: 'تحمي من التلوث وتسرع التئام الأنسجة.' },
      { icon: '👨‍⚕️', title: 'إمكانية توفير ممرض للغيار', desc: 'ممرض نبض يقوم بالغيار المعقم في منزلك.' },
    ],
    specifications: [
      { label: 'المحتويات', value: 'شاش فازلين، مطهرات، دريسنج معقم، بلاستر هيبافيكس' },
      { label: 'الاستخدام', value: 'جروح العمليات، القيصرية، الحروق، قرح الفراش' },
    ],
    inTheBox: ['مستلزمات الغيار المعقمة حسب مقاس وطبيعة الجرح'],
    whatsappText: 'السلام عليكم، محتاج مستلزمات غيار جروح معقمة أو ممرض للغيار بدمياط.',
  },
  {
    id: 'air-mattress',
    name: 'مرتبة هوائية طبية لمنع قرح الفراش (مع ماتور صامت)',
    nameEnglish: 'Medical Alternating Air Mattress with Pump',
    slug: 'air-mattress',
    category: 'beds',
    categoryName: 'رعاية كبار السن',
    price: 'متوفر للطلب',
    priceNumber: 0,
    badge: 'ضروري لملازمي الفراش',
    image: '/logo.jpg',
    shortDesc: 'مرتبة هوائية بنظام الضغط المتناوب مع ماتور هادئ لمنع وتخفيف قرح الفراش للمرضى طريحي الفراش.',
    features: [
      { icon: '🛏️', title: 'حماية متواصلة 24 ساعة', desc: 'تغير نقاط الضغط على الجسم لمنع احمرار وتقرح الجلد.' },
      { icon: '🔇', title: 'ماتور هادئ وموفر للطاقة', desc: 'يعمل دون إزعاج المريض ليلاً.' },
    ],
    specifications: [
      { label: 'التحمل', value: 'حتى 135 كجم' },
      { label: 'الخامة', value: 'PVC طبي مضاد للحساسية وسهل التنظيف' },
    ],
    inTheBox: ['مرتبة هوائية خلايا', 'ماتور ضخ هواء كهربائي', 'خرطوم التوصيل', 'طقم صيانة'],
    whatsappText: 'السلام عليكم، عايز استفسر عن المرتبة الهوائية الطبية لمنع قرح الفراش بدمياط.',
  },
]
