/**
 * lib/blood-bank/mockData.ts
 * Mock data for blood banks and requests
 */

import { BloodBank, BloodRequest } from './types';

export const bloodBanks: BloodBank[] = [
  {
    id: 'bank-1',
    name: 'المركز الإقليمي لنقل الدم - دمياط',
    address: 'شارع كورنيش النيل، حي الأعصر، داخل مستشفى دمياط التخصصي',
    distanceKm: 1.2,
    availableTypes: ['O+', 'B+', 'AB+'], // A+ is unavailable
  },
  {
    id: 'bank-2',
    name: 'المركز الإقليمي لنقل الدم - بورسعيد',
    address: 'شارع صفية زغلول، حي الشرق، أمام مستشفى السلام، بورسعيد',
    distanceKm: 5.4,
    availableTypes: ['O+', 'B-', 'O-'],
  },
  {
    id: 'bank-3',
    name: 'بنك الدم الإقليمي - المنصورة',
    address: 'ميدان الشيخ حسنين، المنصورة، الدقهلية',
    distanceKm: 6.1,
    availableTypes: ['B+', 'AB+', 'O+'],
  },
  {
    id: 'bank-4',
    name: 'المركز الإقليمي لنقل الدم - كفر الشيخ',
    address: 'كفر الشيخ، بجوار المستشفى العام',
    distanceKm: 90.2,
    availableTypes: ['O+', 'B+'],
  },
  {
    id: 'bank-5',
    name: 'المركز الإقليمي لنقل الدم - الزقازيق',
    address: 'داخل مستشفى الأحرار التعليمي، مدينة الزقازيق، الشرقية',
    distanceKm: 100.9,
    availableTypes: ['AB+', 'B+'],
  },
  {
    id: 'bank-6',
    name: 'بنك الدم الإقليمي - الإسماعيلية',
    address: 'ميدان المطافي، بجوار مسجد المطافي، عرايشية مصر، الإسماعيلية',
    distanceKm: 102.8,
    availableTypes: ['O+', 'AB-'],
  },
  {
    id: 'bank-7',
    name: 'بنك الدم الإقليمي - طنطا',
    address: 'امتداد شارع حافظ وهبي - سيجر، بجوار هيئة الأبنية التعليمية، طنطا',
    distanceKm: 106.6,
    availableTypes: ['B+', 'O+'],
  },
  {
    id: 'bank-8',
    name: 'المركز الإقليمي لنقل الدم - بنها',
    address: 'شارع كوبري أسنيت القديم، طريق كفر شكر، بنها، القليوبية',
    distanceKm: 113.9,
    availableTypes: ['O+', 'B-'],
  },
  {
    id: 'bank-9',
    name: 'المركز الإقليمي لنقل الدم - شبين الكوم',
    address: 'شارع جمال عبد الناصر بحري، بجوار مستشفى شبين الكوم التعليمي',
    distanceKm: 122.3,
    availableTypes: ['AB+', 'O+'],
  },
  {
    id: 'bank-10',
    name: 'بنك الدم الإقليمي - دمنهور',
    address: 'شارع الجمهورية، داخل المعهد الطبي، دمنهور، البحيرة',
    distanceKm: 134.3,
    availableTypes: ['B+', 'O-'],
  },
];

// Empty list triggers empty state as required
export const nearbyRequests: BloodRequest[] = [];

/**
 * Format Arabic-Indic numbers (e.g. 1.2 -> ١,٢)
 */
export function toArabicDigits(val: number | string): string {
  const str = String(val).replace('.', ',');
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return str.replace(/[0-9]/g, (w) => arabicDigits[+w]);
}

/**
 * Format distance with Arabic digits and comma
 */
export function formatDistance(distanceKm: number): string {
  return `${toArabicDigits(distanceKm.toFixed(1))} km`;
}
