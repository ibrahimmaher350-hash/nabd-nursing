/**
 * lib/blood-bank/mockData.ts
 * Mock data for blood banks and requests
 */

import { BloodBank, BloodRequest } from './types';

export const bloodBanks: BloodBank[] = [
  {
    id: 'bank-1',
    name: 'المركز الإقليمي لنقل الدم - مستشفى دمياط التخصصي',
    address: 'شارع كورنيش النيل، حي الأعصر، دمياط',
    distanceKm: 1.2,
    availableTypes: ['O+', 'B+', 'AB+', 'A+'],
    lat: 31.4165,
    lng: 31.8133,
    phone: '0572322300',
  },
  {
    id: 'bank-dm-new',
    name: 'بنك دم مستشفى الأزهر الجامعي - دمياط الجديدة',
    address: 'الحي الرابع، بالقرب من جامعة حورس، دمياط الجديدة',
    distanceKm: 14.8,
    availableTypes: ['A+', 'O+', 'B+', 'AB-'],
    lat: 31.4361,
    lng: 31.6706,
    phone: '0572403980',
  },
  {
    id: 'bank-kafr-saad',
    name: 'بنك دم مستشفى كفر سعد المركزي',
    address: 'شارع الجيش، بجوار مجلس مدينة كفر سعد، دمياط',
    distanceKm: 16.2,
    availableTypes: ['O+', 'A-', 'B+'],
    lat: 31.3533,
    lng: 31.6872,
    phone: '0573600120',
  },
  {
    id: 'bank-faraskur',
    name: 'بنك دم مستشفى فارسكور المركزي',
    address: 'شارع المحطة، مركز فارسكور، دمياط',
    distanceKm: 18.5,
    availableTypes: ['A+', 'B+', 'O-'],
    lat: 31.3325,
    lng: 31.8025,
    phone: '0573440150',
  },
  {
    id: 'bank-ras-elbar',
    name: 'بنك دم المركز الطبي الحضري برأس البر',
    address: 'شارع 109، بالقرب من الموقف العمومي، رأس البر، دمياط',
    distanceKm: 12.1,
    availableTypes: ['O+', 'A+', 'B+'],
    lat: 31.5160,
    lng: 31.8210,
    phone: '0572520300',
  },
  {
    id: 'bank-2',
    name: 'المركز الإقليمي لنقل الدم - بورسعيد',
    address: 'شارع صفية زغلول، حي الشرق، أمام مستشفى السلام، بورسعيد',
    distanceKm: 45.4,
    availableTypes: ['O+', 'B-', 'O-'],
    lat: 31.2653,
    lng: 32.3019,
    phone: '0663222123',
  },
  {
    id: 'bank-3',
    name: 'بنك الدم الإقليمي - المنصورة',
    address: 'ميدان الشيخ حسنين، المنصورة، الدقهلية',
    distanceKm: 58.1,
    availableTypes: ['B+', 'AB+', 'O+'],
    lat: 31.0409,
    lng: 31.3785,
    phone: '0502202020',
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
