/**
 * lib/blood-bank/types.ts
 * TypeScript interfaces and types for Nabd Blood Bank module
 */

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Donor {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  birthDate: string;
  bloodType: BloodType;
  phone: string;
  email: string;
  region: string;
  lat: number;
  lng: number;
  availableToDonate: boolean;
  donationCount: number;
  profileComplete: boolean;
  verifiedDonations: number;
  rating: number;
}

export interface BloodBank {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  availableTypes: BloodType[];
}

export interface BloodRequest {
  id: string;
  requesterName: string;
  bloodType: BloodType;
  urgency: 'urgent' | 'normal' | 'emergency';
  distanceKm: number;
  createdAt: string;
  hospital?: string;
  phone?: string;
  notes?: string;
}

export interface OnboardingData {
  bloodType: BloodType;
  hasDonatedBefore: boolean;
  donationCount: number;
  weightOver50: boolean;
  hasChronicDiseases: boolean;
  takesMedications: boolean;
  address: string;
  lat: number;
  lng: number;
}
