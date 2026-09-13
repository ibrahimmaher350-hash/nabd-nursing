/**
 * lib/blood-bank/supabaseService.ts
 * Supabase backend service for Nabd Blood Bank.
 * Handles database CRUD operations for donors, blood requests, and banks,
 * with graceful fallback to mock data / local state if not yet configured.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { BloodBank, BloodRequest, BloodType, Donor } from './types';
import { bloodBanks as defaultMockBanks } from './mockData';

export interface NewBloodRequestInput {
  requesterName?: string;
  patientName: string;
  hospital: string;
  bloodType: BloodType;
  bagsCount: number;
  urgency: 'critical' | 'urgent' | 'normal';
  phone: string;
  notes?: string;
}

/**
 * Fetch list of blood banks
 */
export async function getBloodBanks(): Promise<BloodBank[]> {
  if (!isSupabaseConfigured) {
    return defaultMockBanks;
  }

  try {
    const { data, error } = await supabase
      .from('blood_banks')
      .select('*')
      .order('distance_km', { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultMockBanks;
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      address: item.address,
      distanceKm: Number(item.distance_km),
      availableTypes: (item.available_types || []) as BloodType[],
      lat: item.lat ? Number(item.lat) : undefined,
      lng: item.lng ? Number(item.lng) : undefined,
    }));
  } catch (err) {
    console.error('Error fetching blood banks from Supabase:', err);
    return defaultMockBanks;
  }
}

/**
 * Fetch recent blood requests
 */
export async function getBloodRequests(): Promise<BloodRequest[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      requesterName: item.requester_name || item.patient_name,
      bloodType: item.blood_type as BloodType,
      urgency: item.urgency as 'critical' | 'urgent' | 'normal',
      distanceKm: item.distance_km ? Number(item.distance_km) : 2.5,
      createdAt: item.created_at,
    }));
  } catch (err) {
    console.error('Error fetching blood requests from Supabase:', err);
    return [];
  }
}

/**
 * Create a new blood request
 */
export async function createBloodRequest(input: NewBloodRequestInput) {
  if (!isSupabaseConfigured) {
    // Fallback: simulate local success
    console.info('Supabase not configured, simulated local request:', input);
    return { success: true, id: `local-${Date.now()}` };
  }

  try {
    const { data, error } = await supabase
      .from('blood_requests')
      .insert([
        {
          patient_name: input.patientName,
          hospital: input.hospital,
          blood_type: input.bloodType,
          bags_count: input.bagsCount,
          urgency: input.urgency,
          phone: input.phone,
          notes: input.notes || '',
          status: 'active',
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Failed to create blood request in Supabase:', error);
      throw error;
    }

    return { success: true, id: data?.id };
  } catch (err) {
    console.error('createBloodRequest error:', err);
    throw err;
  }
}

/**
 * Upsert donor profile
 */
export async function saveDonorToSupabase(donor: Partial<Donor>) {
  if (!isSupabaseConfigured || !donor.id) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('donors').upsert({
      id: donor.id,
      username: donor.username,
      first_name: donor.firstName,
      last_name: donor.lastName,
      gender: donor.gender,
      birth_date: donor.birthDate,
      blood_type: donor.bloodType,
      phone: donor.phone,
      email: donor.email,
      region: donor.region,
      lat: donor.lat,
      lng: donor.lng,
      available_to_donate: donor.availableToDonate,
      donation_count: donor.donationCount,
      profile_complete: donor.profileComplete,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to upsert donor in Supabase:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error('saveDonorToSupabase error:', err);
    return { success: false, error: err };
  }
}
