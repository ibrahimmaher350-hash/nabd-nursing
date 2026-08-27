const fs = require('fs');
const path = require('path');

const b1 = require('./batch1');
const b2 = require('./batch2');
const b3 = require('./batch3');
const b4 = require('./batch4');
const b5 = require('./batch5');
const b6 = require('./batch6');
const b7 = require('./batch7');

const allProtocols = [...b1, ...b2, ...b3, ...b4, ...b5, ...b6, ...b7];

console.log(`Loaded ${allProtocols.length} protocols across 7 batches.`);

// Check for unique IDs
const ids = new Set();
const duplicates = [];
for (const p of allProtocols) {
  if (ids.has(p.id)) {
    duplicates.push(p.id);
  }
  ids.add(p.id);
}

if (duplicates.length > 0) {
  console.error('Duplicate IDs found:', duplicates);
  process.exit(1);
}

const fileHeader = `/**
 * data/firstAidData.ts — نبض للتمريض المنزلي
 * موسوعة الإسعافات الأولية التفاعلية الشاملة (140 بروتوكولاً طبياً متكاملاً)
 * تدعم البحث الذكي بكلمات اللهجة المصرية ومراعاة الفئات العمرية (رضيع، طفل، بالغ، حامل، كبار سن)
 * متوافقة مع أحدث إرشادات جمعية القلب الأمريكية (AHA) ومجلس الإنعاش الأوروبي (ERC)
 */

export interface AgeProtocol {
  ageGroup: 'infant' | 'child' | 'adult' | 'pregnant' | 'elderly'
  label: string
  steps: string[]
  warnings?: string[]
}

export type FirstAidCategory =
  | 'cpr_breathing'
  | 'bleeding_wounds'
  | 'burns_poison'
  | 'trauma_bones'
  | 'medical_critical'
  | 'special_groups'
  | 'procedures_safety'
  | 'general_safety'

export interface FirstAidItem {
  id: string
  title: string
  category: FirstAidCategory
  categoryName: string
  severity: 'critical' | 'urgent' | 'moderate'
  egyptianKeywords: string[]
  summary: string
  generalSteps: string[]
  ageVariations?: AgeProtocol[]
  donts: string[]
  redFlags: string
}

export const FIRST_AID_CATEGORIES = [
  { id: 'all', name: 'الكل (140 بروتوكولاً)' },
  { id: 'cpr_breathing', name: 'الإنعاش والتنفس والشرقة' },
  { id: 'bleeding_wounds', name: 'النزيف والجروح والبتر' },
  { id: 'burns_poison', name: 'الحروق والتسمم واللدغات' },
  { id: 'trauma_bones', name: 'الكسور وإصابات الرأس والعظام' },
  { id: 'medical_critical', name: 'الجلطات والإغماء والسكر والتشنجات' },
  { id: 'special_groups', name: 'طوارئ الأطفال والحوامل وكبار السن' },
  { id: 'procedures_safety', name: 'الإجراءات والحوادث وحقيبة الإسعاف' },
] as const

export const firstAidDatabase: FirstAidItem[] = `;

const targetPath = path.join(__dirname, '..', 'src', 'data', 'firstAidData.ts');

const fileContent = fileHeader + JSON.stringify(allProtocols, null, 2) + ';\n';

fs.writeFileSync(targetPath, fileContent, 'utf8');

console.log(`Successfully compiled 140 protocols to: ${targetPath}`);
