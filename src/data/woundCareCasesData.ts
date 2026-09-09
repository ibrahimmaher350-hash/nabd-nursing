/**
 * data/woundCareCasesData.ts — نبض للتمريض المنزلي
 * قاعدة بيانات توثيق زيارات وحالات غيار الجروح والقرح المنزلية بدمياط
 * مجهزة لإضافة الصور الحقيقية ومراحل الالتئام بسهولة
 */

export interface WoundCareCase {
  id: string
  title: string
  category: 'surgical' | 'bedsores' | 'diabetic-foot' | 'burns' | 'deep-wounds'
  categoryLabel: string
  location: string
  visitNumber: string
  woundStage: string
  healingStatus: 'تم الالتئام التام بنجاح 🟢' | 'تحسن كبير في الأنسجة 🟡' | 'مرحلة التنظيف والتطهير 🔵'
  suppliesUsed: string[]
  nursingNotes: string
  patientAgeGroup?: string
  beforeImage: string
  afterImage: string
  hasRealPhotos: boolean // Set to true once user provides photos
  dateAdded: string
}

export const WOUND_CARE_CATEGORIES = [
  { id: 'all', name: 'جميع الحالات الموثقة', icon: '📋' },
  { id: 'surgical', name: 'جروح العمليات والقيصرية ✂️', icon: '✂️' },
  { id: 'bedsores', name: 'قرح الفراش وكبار السن 🛏️', icon: '🛏️' },
  { id: 'diabetic-foot', name: 'القدم السكري 🦶', icon: '🦶' },
  { id: 'burns', name: 'الحروق والتسلخات 🔥', icon: '🔥' },
  { id: 'deep-wounds', name: 'الجروح العميقة والخراجات 🩹', icon: '🩹' },
]

export const woundCareCasesData: WoundCareCase[] = [
  {
    id: 'case-surgical-cesarean',
    title: 'غيار جرح ولادة قيصرية معقم مع متابعة إزالة الغرز',
    category: 'surgical',
    categoryLabel: 'جروح العمليات والقيصرية',
    location: 'دمياط — السيالة',
    visitNumber: 'الزيارة الثانية',
    woundStage: 'التئام كامل للحواف الجراحية بدون أي احمرار أو صديد',
    healingStatus: 'تم الالتئام التام بنجاح 🟢',
    suppliesUsed: [
      'محلول ملح فسيولوجي معقم 0.9%',
      'بيتادين جراحي معقم (Povidone-Iodine)',
      'بلاستر طبي شفاف مضاد للماء (Waterproof Dressing)',
      'شاش طبي معقم مقاس 10×10',
      'جوانتيات جراحية معقمة لاتكس',
    ],
    nursingNotes:
      'تم تنظيف الجرح وفق التقنية اللاتلامسية المعقمة (ANTT). فحص خط العملية والتأكد من جفافه وعدم وجود أي تورم، ووضع دريسنج معقم يسمح بالاستحمام بأمان تام.',
    patientAgeGroup: 'أم في مرحلة ما بعد الولادة',
    beforeImage: '/images/wound-placeholder-before.svg',
    afterImage: '/images/wound-placeholder-after.svg',
    hasRealPhotos: false,
    dateAdded: '2026-09',
  },
  {
    id: 'case-bedsore-sacral-grade2',
    title: 'علاج ومتابعة قرحة فراش من الدرجة الثانية لمريض مسن طريح الفراش',
    category: 'bedsores',
    categoryLabel: 'قرح الفراش وكبار السن',
    location: 'دمياط — كفر البطيخ',
    visitNumber: 'الزيارة الرابعة',
    woundStage: 'تجدد الأنسجة الحبيبية الحية (Granulation) وانكماش القرحة بنسبة 85%',
    healingStatus: 'تحسن كبير في الأنسجة 🟡',
    suppliesUsed: [
      'محلول ملحي دافئ لتنظيف عمق القرحة',
      'شاش فضي معقم مضاد للبكتيريا (Aquacel Ag)',
      'ضمادة رغوية ممتصة للإفرازات (Hydrocellular Foam Dressing)',
      'مرهم زنك أكسيد لحماية الحواف المحيطة بالقرحة',
      'مرتبة هوائية طبية متغيرة الضغط وتوجيه بتعديل وضعية النوم كل ساعتين',
    ],
    nursingNotes:
      'إزالة الأنسجة الميتة بلطف بدون أي نزيف، وتطبيق الضمادة الفضية المعقمة، مع تدريب الأسرة على جدول تقليب المريض بانتظام للحد من الضغط الشرياني على العجز.',
    patientAgeGroup: 'مسن (78 عاماً)',
    beforeImage: '/images/wound-placeholder-before.svg',
    afterImage: '/images/wound-placeholder-after.svg',
    hasRealPhotos: false,
    dateAdded: '2026-09',
  },
  {
    id: 'case-diabetic-foot-ulcer',
    title: 'غيار وقائي وعلاجي لقرحة قدم سكري في أسفل القدم',
    category: 'diabetic-foot',
    categoryLabel: 'القدم السكري',
    location: 'دمياط الجديدة',
    visitNumber: 'الزيارة الثالثة',
    woundStage: 'تطهير القاع الجلدي ونمو أنسجة وردية صحية دون عدوى',
    healingStatus: 'تحسن كبير في الأنسجة 🟡',
    suppliesUsed: [
      'غسيل جراحي بمحلول ملح فسيولوجي معقم',
      'هيدروجيل مرطب لدعم الالتئام الرطب (Hydrogel)',
      'شاش فازلين معقم غير لاصق (Jelonet)',
      'لفافة شاش طبي قطني مريح لتوزيع الضغط',
      'قياس فوري للسكر العشوائي بالجهاز والتأكد من انضباطه',
    ],
    nursingNotes:
      'فحص نبض الشرايين الطرفية للقدم والإحساس العصبي، تعقيم وتغطية القرحة بعناية فائقة لمنع أي احتكاك أثناء الحركة البسيطة، ومتابعة نسبة السكر بالدم.',
    patientAgeGroup: 'مريض سكري مزمن (62 عاماً)',
    beforeImage: '/images/wound-placeholder-before.svg',
    afterImage: '/images/wound-placeholder-after.svg',
    hasRealPhotos: false,
    dateAdded: '2026-09',
  },
  {
    id: 'case-surgical-laparoscopy',
    title: 'غيار ومتابعة ثقوب عملية منظار استئصال المرارة',
    category: 'surgical',
    categoryLabel: 'جروح العمليات والقيصرية',
    location: 'دمياط — الأعصر',
    visitNumber: 'الزيارة الأولى بعد الخروج',
    woundStage: 'جفاف فتحات المنظار الأربعة والتئام حواف الجلد بنجاح',
    healingStatus: 'تم الالتئام التام بنجاح 🟢',
    suppliesUsed: [
      'مطهر كلورهيكسيدين جراحي معقم',
      'ضمادات لاصقة معقمة نفاذة للهواء ومقاومة للماء',
      'مسحات كحولية معقمة لمحيط الجلد',
      'شاش طبي قطني معقم',
    ],
    nursingNotes:
      'تقييم علامات الالتهاب الموضعي (لا يوجد أي سخونة أو احمرار)، تعقيم كل ثقب على حدة لمنع نقل أي بكتيريا، ووضع ضمادات مريحة تتيح للمريض التحرك بسهولة.',
    patientAgeGroup: 'بالغ (45 عاماً)',
    beforeImage: '/images/wound-placeholder-before.svg',
    afterImage: '/images/wound-placeholder-after.svg',
    hasRealPhotos: false,
    dateAdded: '2026-09',
  },
  {
    id: 'case-burn-superficial',
    title: 'غيار حرق ماء ساخن سطحي من الدرجة الثانية على الساعد',
    category: 'burns',
    categoryLabel: 'الحروق والتسلخات',
    location: 'دمياط — شطا',
    visitNumber: 'الزيارة الخامسة',
    woundStage: 'تجدد طبقة البشرة بالكامل دون تكوّن ندبات سميكة',
    healingStatus: 'تم الالتئام التام بنجاح 🟢',
    suppliesUsed: [
      'ميبو مرهم حروق عشبي (MEBO B-Sitosterol)',
      'شاش فازلين معقم خالي من الالتصاق لمنع نزع الجلد المتجدد',
      'محلول سالاين ملح دافئ',
      'رباط شاش مطاطي ناعم بدون ضغط زائد',
    ],
    nursingNotes:
      'تم التعامل مع الفقاقيع الجلدية بطريقة معقمة بدون تفريغ عنيف، وتطبيق مرهم الميبو والشاش الفازليني لضمان التئام ناعم وسريع للجلد دون ألم أثناء تغيير الضمادة.',
    patientAgeGroup: 'شابة (28 عاماً)',
    beforeImage: '/images/wound-placeholder-before.svg',
    afterImage: '/images/wound-placeholder-after.svg',
    hasRealPhotos: false,
    dateAdded: '2026-09',
  },
  {
    id: 'case-abscess-drainage',
    title: 'غيار وفتيل جراحي معقم لخُراج سطحي بعد الفتح والتصريف',
    category: 'deep-wounds',
    categoryLabel: 'الجروح العميقة والخراجات',
    location: 'دمياط — باب الحرس',
    visitNumber: 'الزيارة الثالثة',
    woundStage: 'نظافة تجويف الجرح وانحسار الإفرازات بنسبة 90%',
    healingStatus: 'تحسن كبير في الأنسجة 🟡',
    suppliesUsed: [
      'شريط فتيل شاش معقم مع بيتادين (Iodoform / Sterile Gauze Ribbon)',
      'محلول ملح معقم لغسيل التجويف بالسرنجة المعقمة',
      'محلول مطهر بيروكسيد الهيدروجين المخفف إن لزم',
      'ضمادة ماصة للغيار الخارجي وبلاستر طبي ناعم',
    ],
    nursingNotes:
      'غسيل تجويف الجرح من الداخل بالكامل بمحلول الملح لإخراج أي صديد متبقٍ، ووضع فتيل جديد معقم لدعم التئام الجرح من القاع للسطح ومنع انغلاقه المبكر.',
    patientAgeGroup: 'بالغ (38 عاماً)',
    beforeImage: '/images/wound-placeholder-before.svg',
    afterImage: '/images/wound-placeholder-after.svg',
    hasRealPhotos: false,
    dateAdded: '2026-09',
  },
]
