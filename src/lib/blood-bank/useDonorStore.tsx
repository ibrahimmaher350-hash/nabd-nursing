'use client';

/**
 * lib/blood-bank/useDonorStore.tsx
 * React Context and custom hook for managing donor state with localStorage persistence.
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Donor, BloodType } from './types';
import { saveDonorToSupabase } from './supabaseService';

const STORAGE_KEY = 'nabd-blood-bank-donor';

export interface DonorState {
  donor: Donor | null;
  isLoggedIn: boolean;
  profileComplete: boolean;
  bloodType: BloodType;
  locationPermission: 'prompt' | 'granted' | 'denied';
  login: (email?: string, password?: string) => void;
  logout: () => void;
  register: (data: Partial<Donor>) => void;
  updateProfile: (partial: Partial<Donor>) => void;
  setAvailable: (available: boolean) => void;
  setLocation: (lat: number, lng: number, address: string) => void;
  setLocationPermission: (perm: 'prompt' | 'granted' | 'denied') => void;
}

const defaultDonor: Donor = {
  id: 'donor-1',
  username: 'ibrahim_maher',
  firstName: 'إبراهيم',
  lastName: 'ماهر',
  gender: 'male',
  birthDate: '1995-05-15',
  bloodType: 'A+',
  phone: '01001097896',
  email: 'ibrahim@nabd.eg',
  region: 'مصر, محافظة دمياط, CRM7+C52',
  lat: 31.4165,
  lng: 31.8133,
  availableToDonate: true,
  donationCount: 0,
  profileComplete: false, // Starts incomplete to show onboarding card
  verifiedDonations: 0,
  rating: 0.0,
};

const DonorContext = createContext<DonorState | null>(null);

export function DonorProvider({ children }: { children: React.ReactNode }) {
  const [donor, setDonor] = useState<Donor | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [locationPermission, setLocationPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Hydrate state from localStorage safely after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.donor) {
          setDonor(parsed.donor);
          setIsLoggedIn(parsed.isLoggedIn ?? true);
          setLocationPermissionState(parsed.locationPermission ?? 'prompt');
        }
      }
    } catch {
      // Ignore localStorage parse errors
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          donor,
          isLoggedIn,
          locationPermission,
        })
      );
    } catch {
      // Storage quota or private mode error
    }

    if (donor) {
      saveDonorToSupabase(donor).catch(() => {});
    }
  }, [donor, isLoggedIn, locationPermission, isInitialized]);

  const login = (email?: string) => {
    const updated = donor || { ...defaultDonor, email: email || defaultDonor.email };
    setDonor(updated);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const register = (data: Partial<Donor>) => {
    const newDonor: Donor = {
      ...defaultDonor,
      ...data,
      id: `donor-${Date.now()}`,
      profileComplete: false,
    };
    setDonor(newDonor);
    setIsLoggedIn(true);
  };

  const updateProfile = (partial: Partial<Donor>) => {
    setDonor((prev) => (prev ? { ...prev, ...partial } : { ...defaultDonor, ...partial }));
  };

  const setAvailable = (available: boolean) => {
    updateProfile({ availableToDonate: available });
  };

  const setLocation = (lat: number, lng: number, address: string) => {
    updateProfile({ lat, lng, region: address });
  };

  const setLocationPermission = (perm: 'prompt' | 'granted' | 'denied') => {
    setLocationPermissionState(perm);
  };

  const profileComplete = donor?.profileComplete ?? false;
  const bloodType = donor?.bloodType ?? 'A+';

  const value = useMemo<DonorState>(
    () => ({
      donor,
      isLoggedIn,
      profileComplete,
      bloodType,
      locationPermission,
      login,
      logout,
      register,
      updateProfile,
      setAvailable,
      setLocation,
      setLocationPermission,
    }),
    [donor, isLoggedIn, profileComplete, bloodType, locationPermission]
  );

  return <DonorContext.Provider value={value}>{children}</DonorContext.Provider>;
}

export function useDonorStore(): DonorState {
  const ctx = useContext(DonorContext);
  if (!ctx) {
    throw new Error('useDonorStore must be used within a DonorProvider');
  }
  return ctx;
}
