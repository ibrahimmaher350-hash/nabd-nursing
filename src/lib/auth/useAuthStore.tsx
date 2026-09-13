'use client';

/**
 * src/lib/auth/useAuthStore.ts
 * Unified Supabase Auth context and custom hook for patients, clinic staff, and the owner.
 * Bridges Supabase Auth with public.profiles table.
 */

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  role: 'patient' | 'admin' | 'nurse';
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  phone_verified?: boolean;
  google_refresh_token?: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback default profile
        setProfile({
          id: userId,
          role: 'patient',
          full_name: 'مريض نبض',
        });
      }
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // 1. Initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // 2. Auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    } catch (e: any) {
      return { error: e.message || 'فشل تسجيل الدخول' };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, phone = '') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: 'patient',
          },
        },
      });

      if (error) return { error: error.message };
      if (data?.user) {
        await fetchProfile(data.user.id);
      }
      return {};
    } catch (e: any) {
      return { error: e.message || 'فشل إنشاء الحساب' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  const isAdmin = profile?.role === 'admin';
  const isLoggedIn = Boolean(user);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      profile,
      isLoading,
      isAdmin,
      isLoggedIn,
      signInWithEmail,
      signUpWithEmail,
      signOut,
      refreshProfile,
    }),
    [user, profile, isLoading, isAdmin, isLoggedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
