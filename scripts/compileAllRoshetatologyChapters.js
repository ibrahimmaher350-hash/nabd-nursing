/**
 * scripts/compileAllRoshetatologyChapters.js
 * تجميع موسوعة روشتاتولوجي الشاملة (82 روشتة في 15 باباً طبياً)
 * وكتابة الملف النهائي src/data/prescriptionsData.ts
 */

const fs = require('fs');
const path = require('path');

const ch1_5 = require('./data_chapters1_5.js');
const ch6_10 = require('./data_chapters6_10.js');
const ch11_15 = require('./data_chapters11_15.js');

const allPrescriptions = [...ch1_5, ...ch6_10, ...ch11_15];

console.log(`Loaded total: ${allPrescriptions.length} prescriptions.`);

const abdominalPainGuide = [
  {
    id: 'renal_colic_guide',
    locationName: 'وجع في أحد الجانبين (يمين أو شمال) مسمع في الظهر',
    symptomsAndColic: 'المغص الكلوي (Renal Colic): وجع انقباضي عنيف في الجنب يسمع في الظهر أو الأعضاء التناسلية مع حرقان في البول وتقطيع.',
    suspectedCause: 'حصوات في الكلى أو الحالب أو ترسبات أملاح يورات وأوكسالات مع جفاف.',
    examinationKey: 'الألم يقل ملحوظاً مع إعطاء مضاد للتقلصات ومسكن، ويؤكده سونار الكلى وتحليل البول.',
    whatToDo: 'حقن بسكوبان أو فيسرالجين وريد + مسكن كيتولاك وريد + تعليق محاليل لغسيل الحالب.',
    isSurgicalAlert: false,
  },
  {
    id: 'appendicitis_guide',
    locationName: 'وجع في الجنب اليمين بدأ حوالين السرة مع سخونية أو ترجيع',
    symptomsAndColic: 'مغص الزائدة الدودية (Appendicitis Colic): ألم متزايد في الجنب اليمين أسفل البطن.',
    suspectedCause: 'التهاب حاد في الزائدة الدودية (حالة جراحية طارئة).',
    examinationKey: 'لما نضغط بإيدنا على مكان الوجع يزيد، ولما نشيل إيدينا فجأة يزيد أكتر (Rebound Tenderness)، ويزيد لو رفع العيان رجله ناحية بطنه (Psoas Sign)، مع كرات دم بيضاء عالية في الدم.',
    whatToDo: '🚨 طوارئ فحص جراحي فوري في المستشفى! ممنوع تماماً إعطاء مسكنات قوية حتى لا تخفي انفجار الزائدة.',
    isSurgicalAlert: true,
  },
  {
    id: 'gastritis_ulcer_guide',
    locationName: 'وجع أعلى البطن وفم المعدة والصدر مع حموضة',
    symptomsAndColic: 'وجع حموضة وقرحة المعدة (Gastritis & Peptic Ulcer): حرقان شديد في فم المعدة والصدر.',
    suspectedCause: 'التهاب جدار المعدة، قرحة الاثنى عشر، أو ارتجاع المريء، ويزيد مع الأكل والنوم.',
    examinationKey: 'يرتاح المريض بعد شرب اللبن البارد أو أخذ مضادات الحموضة الفورية.',
    whatToDo: 'أمبول كونترولوك 40 مجم (Controloc) أو زانتاك حقن وريد أو عضل + شراب جافيسكون.',
    isSurgicalAlert: false,
  },
  {
    id: 'gallbladder_guide',
    locationName: 'وجع في الجانب الأيمن والصدر يسمع في الكتف والإيد',
    symptomsAndColic: 'وجع المرارة والصفراء (Gall Bladder Pain): مغص شديد بعد تناول وجبة دسمة أو مقليات.',
    suspectedCause: 'التهاب كيس المرارة أو حصوات صفراوية، غالباً في السيدات بسن الأربعينات مع وزن زائد (Fair, Fat, Female, Forty).',
    examinationKey: 'علامة ميرفي (Murphy\'s Sign): ألم مفاجئ يقطع التنفس عند الضغط أسفل الضلوع اليمنى أثناء الشهيق العميق.',
    whatToDo: 'أمبول فيسرالجين أو بسكوبان وريد + مسكن + إجراء سونار على البطن والتحضير للمنظار.',
    isSurgicalAlert: false,
  },
  {
    id: 'spastic_colon_guide',
    locationName: 'وجع ومغص في البطن مع انتفاخات وغازات',
    symptomsAndColic: 'مغص الجهاز الهضمي والقولون العصبي (GIT, Spastic Colic): وجع متقلب مع ترجيع أو إسهال أو إمساك.',
    suspectedCause: 'القولون العصبي وتراكم الغازات وله علاقة بنوعية الأكل والتوتر النفسي.',
    examinationKey: 'الألم يقل بعد التبرز أو إخراج الغازات، ولا يوجد حرارة أو تيبس بالبطن.',
    whatToDo: 'أقراص كولوفيرين د أو سبازمو ديجستين + جاست ريج لتنظيم حركة الأمعاء + أوكاربون فحم.',
    isSurgicalAlert: false,
  },
  {
    id: 'tissue_muscle_guide',
    locationName: 'وجع في الجنب بيزيد مع الحركة ويقل مع الراحة',
    symptomsAndColic: 'وجع العضلات والأربطة (Tissue Pain): ألم في جدار البطن والجنبين.',
    suspectedCause: 'شد عضلي أو التواء بالأربطة بعد مجهود بدني أو كحة شديدة.',
    examinationKey: 'يزيد بالضغط السطحي والحركة ويختفي مع سكون الجسم بدون أي أعراض معوية.',
    whatToDo: 'مسكن وخافض مجهود + أقراص باسط عضلات + فيتامين ب12 لتقوية الأعصاب وتخفيف الألم.',
    isSurgicalAlert: false,
  },
  {
    id: 'menses_pain_guide',
    locationName: 'وجع في أسفل البطن والحوض له علاقة بالدورة',
    symptomsAndColic: 'وجع الدورة الشهرية والتقلصات الرحمية (Menses Pain / Dysmenorrhea).',
    suspectedCause: 'إفراز البروستاجلاندين وانقباض عضلات الرحم قبل أو أثناء الطمث.',
    examinationKey: 'توقيت شهري متزامن مع الدورة مع غياب علامات البطن الجراحية.',
    whatToDo: 'أقراص بونستان فورت أو كيتوفان بعد الأكل + فيسرالجين أو بسكوبان + كمادات ماء دافئ.',
    isSurgicalAlert: false,
  },
];

const categories = [
  { id: 'all', name: 'جميع الأقسام (موسوعة روشتاتولوجي 82 حالة)' },
  { id: 'gastrointestinal', name: '1. روشتات الجهاز الهضمي (ص 11)' },
  { id: 'respiratory', name: '2. روشتات الجهاز التنفسي (ص 29)' },
  { id: 'cardiovascular', name: '3. روشتات القلب والأوعية (ص 37)' },
  { id: 'endocrine', name: '4. روشتات الغدد الصماء والسكر (ص 47)' },
  { id: 'cns', name: '5. روشتات الجهاز العصبي (ص 57)' },
  { id: 'infection', name: '6. روشتات العدوى والمضادات (ص 65)' },
  { id: 'analgesics', name: '7. روشتات المسكنات والعظام (ص 79)' },
  { id: 'surgery', name: '8. روشتات الجراحة والجروح (ص 87)' },
  { id: 'urology', name: '9. روشتات المسالك البولية (ص 93)' },
  { id: 'gynecology', name: '10. روشتات النساء والتوليد (ص 97)' },
  { id: 'pediatrics', name: '11. روشتات الأطفال وحديثي الولادة (ص 109)' },
  { id: 'ent', name: '12. روشتات الأنف والأذن والحنجرة (ص 121)' },
  { id: 'eye', name: '13. روشتات العيون والرمد (ص 127)' },
  { id: 'nutrition', name: '14. روشتات الفيتامينات وسوء التغذية (ص 131)' },
  { id: 'toxicology', name: '15. روشتات السموم والترياقات (ص 139)' },
];

let output = `/**
 * data/prescriptionsData.ts — نبض للتمريض المنزلي
 * دليل وموسوعة أهم الروشتات الطبية الشاملة (Roshetatology - د. أحمد عبد الله)
 * 15 باباً طبياً كاملاً تبدأ من الجهاز الهضمي (ص 11) وصولاً إلى روشتات السموم والترياقات (ص 139)
 * كل روشتة منفصلة، دقيقة، مبسطة للمريض المصري، ومربوطة بخدمات التمريض المنزلي في دمياط
 */

export interface MedicineItem {
  tradeName: string           // الاسم التجاري الشائع في الصيدليات المصرية
  genericName: string         // الاسم العلمي
  purpose: string             // الفائدة والغرض بالعربي
  dosage: string              // الجرعة وطريقة الاستخدام
  priceApprox?: string        // متوسط السعر التقريبي إن وجد
}

export type PrescriptionCategory =
  | 'gastrointestinal'
  | 'respiratory'
  | 'cardiovascular'
  | 'endocrine'
  | 'cns'
  | 'infection'
  | 'analgesics'
  | 'surgery'
  | 'urology'
  | 'gynecology'
  | 'pediatrics'
  | 'ent'
  | 'eye'
  | 'nutrition'
  | 'toxicology'
  | 'digestive'
  | 'bones_joints'
  | 'post_surgery'
  | 'chronic_critical'

export interface Prescription {
  id: string
  titleArabic: string         // اسم الحالة بالعربي
  titleEnglish: string        // اسم الحالة بالانجليزي
  category: PrescriptionCategory
  categoryName: string
  chapterNumber?: number
  pageInBook?: string
  commonComplaints: string[]  // الشكوى والأعراض باللهجة المصرية للبحث
  diagnosisSummary: string    // التشخيص والتعريف المبسط
  causes: string[]            // الأسباب الشائعة
  examinationAndWarnings: {
    surgicalWarning?: string  // تنبيه الجراحة أو علامات الخطر (Surgical Abdomen)
    dehydrationSigns?: string // علامات الجفاف أو المضاعفات
    redFlags: string          // متى يلزم الذهاب للمستشفى فوراً
  }
  medicines: MedicineItem[]   // أدوية الروشتة
  homeCareAndDiet: string[]   // نصائح التغذية والعناية المنزلية
  nursingService: {
    serviceName: string       // اسم خدمة التمريض المطلوبة
    serviceDescription: string // وصف ما يقدمه ممرض نبض في المنزل
    whatsappText: string      // نص رسالة الواتساب المجهزة
  }
}

export interface AbdominalPainGuideItem {
  id: string
  locationName: string
  symptomsAndColic: string
  suspectedCause: string
  examinationKey: string
  whatToDo: string
  isSurgicalAlert: boolean
}

// دليل تشخيص وجع البطن والمغص (مطابق لصفحات 14 و 15 و 16 من كتاب روشتاتولوجي)
export const ABDOMINAL_PAIN_DIAGNOSTIC_GUIDE: AbdominalPainGuideItem[] = ${JSON.stringify(abdominalPainGuide, null, 2)};

export const PRESCRIPTION_CATEGORIES = ${JSON.stringify(categories, null, 2)} as const;

export const prescriptionsDatabase: Prescription[] = ${JSON.stringify(allPrescriptions, null, 2)};
`;

const targetPath = path.join(__dirname, '..', 'src', 'data', 'prescriptionsData.ts');
fs.writeFileSync(targetPath, output, 'utf8');
console.log(`Successfully written prescriptionsData.ts (${output.length} bytes, ${allPrescriptions.length} prescriptions).`);
