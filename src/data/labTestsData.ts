/**
 * data/labTestsData.ts — نبض للتمريض المنزلي
 * قائمة التحاليل والفحوصات الطبية المعتمدة للخدمات وسحب العينات المنزلية بدمياط
 */

export interface LabTestCategory {
  id: string
  name: string
  icon: string
  description?: string
}

export const LAB_TEST_CATEGORIES: LabTestCategory[] = [
  { id: 'blood-general', name: 'تحاليل الدم العامة', icon: '🩸' },
  { id: 'cbc', name: 'صورة الدم الكاملة CBC', icon: '🔬' },
  { id: 'liver-functions', name: 'تحاليل وظائف الكبد', icon: '🫁' },
  { id: 'kidney-functions', name: 'تحاليل وظائف الكلى', icon: '🩺' },
  { id: 'glucose-diabetes', name: 'تحاليل السكر والسكر التراكمي (HbA1c)', icon: '🍬' },
  { id: 'lipid-profile', name: 'تحاليل الدهون والكوليسترول', icon: '🫀' },
  { id: 'iron-ferritin', name: 'تحاليل الحديد ومخزون الحديد (Ferritin)', icon: '🩸' },
  { id: 'thyroid-gland', name: 'تحاليل الغدة الدرقية (TSH, Free T3/T4)', icon: '🦋' },
  { id: 'hormones', name: 'تحاليل الهرمونات والخصوبة', icon: '⚖️' },
  { id: 'vitamins', name: 'تحاليل الفيتامينات (فيتامين D, B12)', icon: '💊' },
  { id: 'electrolytes-minerals', name: 'تحاليل الأملاح والمعادن (كالسيوم، بوتاسيوم، ماغنسيوم)', icon: '🧂' },
  { id: 'inflammation-immunity', name: 'تحاليل الالتهابات والمناعة (CRP, ESR, RF)', icon: '🛡️' },
  { id: 'clinical-chemistry', name: 'التحاليل الكيميائية الحيوية', icon: '🧪' },
  { id: 'viruses-hepatitis', name: 'تحاليل الفيروسات والتهاب الكبد (A, B, C, HIV)', icon: '🦠' },
  { id: 'infections-culture', name: 'تحاليل العدوى والمزارع الميكروبية', icon: '🧫' },
  { id: 'tumor-markers', name: 'دلالات الأورام (Tumor Markers)', icon: '🎗️' },
  { id: 'urine-analysis', name: 'تحاليل البول الكامل ومزرعة البول', icon: '💧' },
  { id: 'stool-analysis', name: 'تحاليل البراز والدم الخفي والطفيليات', icon: '💩' },
  { id: 'microbiology', name: 'التحاليل الميكروبيولوجية', icon: '🔍' },
  { id: 'pregnancy-maternity', name: 'التحاليل الخاصة بالحمل والولادة', icon: '🤰' },
  { id: 'genetics-dna', name: 'التحاليل الوراثية وفحوصات ما قبل الزواج', icon: '🧬' },
  { id: 'xray-imaging', name: 'الأشعة والفحوصات التشخيصية المنزلية (X-Ray / Echo / ECG)', icon: '📷' },
]

export const ALL_LAB_TEST_NAMES: string[] = [
  'تحاليل الدم',
  'صورة الدم الكاملة CBC',
  'تحاليل وظائف الكبد (ALT, AST, Bilirubin, Albumin)',
  'تحاليل وظائف الكلى (Creatinine, Urea, Uric Acid)',
  'تحاليل السكر (صائم، فاطر، سكر عشوائي، سكر تراكمي HbA1c)',
  'تحاليل الدهون والكوليسترول (Lipid Profile)',
  'تحاليل الحديد ومخزون الحديد (Serum Iron, Ferritin, TIBC)',
  'تحاليل الغدة الدرقية (TSH, Free T3, Free T4)',
  'تحاليل الهرمونات (FSH, LH, Prolactin, Testosterone, Cortisol)',
  'تحاليل الفيتامينات (Vitamin D3, Vitamin B12, Folic Acid)',
  'تحاليل الأملاح والمعادن (Sodium, Potassium, Calcium, Magnesium)',
  'تحاليل الالتهابات والمناعة (CRP, ESR, ASOT, Rheumatoid Factor)',
  'التحاليل الكيميائية',
  'تحاليل الفيروسات (HCV, HBsAg, HIV, COVID-19)',
  'تحاليل العدوى والمزارع (مزرعة دم، مزرعة جرح، مزرعة بول)',
  'دلالات الأورام (PSA, CEA, CA-125, CA 19-9, AFP)',
  'تحاليل البول (Urine Analysis + Culture)',
  'تحاليل البراز (Stool Analysis, Occult Blood)',
  'التحاليل الميكروبيولوجية',
  'التحاليل الخاصة بالحمل (اختبار حمل رقمي Beta-HCG, فصيلة الدم Rh)',
  'التحاليل الوراثية عند الحاجة',
  'الأشعة والفحوصات التشخيصية (رسم قلب ECG منزلي، سونار منزلي)',
]
