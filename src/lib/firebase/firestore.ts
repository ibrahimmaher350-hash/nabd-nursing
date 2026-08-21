/**
 * lib/firebase/firestore.ts — نبض للتمريض المنزلي
 * Firestore CRUD helpers for all collections with safe error handling.
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from './config'
import type { Booking, BookingStatus } from '@/types/booking'
import { generateBookingId } from '@/data/siteConfig'

// ── Collection names ──────────────────────────────────────────
export const COLLECTIONS = {
  bookings: 'bookings',
  services: 'services',
  appointments: 'appointments',
  notifications: 'notifications',
  adminUsers: 'admin_users',
  settings: 'settings',
  blogPosts: 'blog_posts',
  contactRequests: 'contact_requests',
  analyticsEvents: 'analytics_events',
} as const

// ── Bookings ─────────────────────────────────────────────────

export async function createBooking(
  data: Omit<Booking, 'bookingId' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<{ bookingId: string; docId: string }> {
  const bookingId = generateBookingId()
  const now = serverTimestamp()

  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.bookings), {
      ...data,
      bookingId,
      status: 'pending' as BookingStatus,
      source: 'website',
      createdAt: now,
      updatedAt: now,
    })
    return { bookingId, docId: docRef.id }
  } catch (err) {
    console.warn('[Firestore] Fallback booking creation:', err)
    return { bookingId, docId: `mock-${Date.now()}` }
  }
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  try {
    const q = query(
      collection(db, COLLECTIONS.bookings),
      where('bookingId', '==', bookingId),
      limit(1)
    )
    const snap = await getDocs(q)
    if (snap.empty) return null

    const docSnap = snap.docs[0]
    return { ...(docSnap.data() as Booking) }
  } catch {
    return null
  }
}

export async function updateBookingStatus(
  docId: string,
  status: BookingStatus,
  extra?: Record<string, unknown>
): Promise<void> {
  try {
    const ref = doc(db, COLLECTIONS.bookings, docId)
    const now = serverTimestamp()
    await updateDoc(ref, {
      status,
      updatedAt: now,
      ...extra,
      ...(status === 'confirmed'  && { confirmedAt: now }),
      ...(status === 'completed'  && { completedAt: now }),
      ...(status === 'cancelled'  && { cancelledAt: now }),
      ...(status === 'rescheduled' && { rescheduledAt: now }),
    })
  } catch (err) {
    console.error('[Firestore] Error updating status:', err)
  }
}

export async function getAllBookings(
  filters: { status?: BookingStatus } = {}
): Promise<Array<Booking & { docId: string }>> {
  try {
    const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]
    if (filters.status) {
      constraints.unshift(where('status', '==', filters.status))
    }
    const q = query(collection(db, COLLECTIONS.bookings), ...constraints)
    const snap = await getDocs(q)

    return snap.docs.map((d) => ({
      ...(d.data() as Booking),
      docId: d.id,
      // Convert Firestore Timestamps to ISO strings
      createdAt: (d.data().createdAt as Timestamp)?.toDate?.().toISOString() ?? '',
      updatedAt: (d.data().updatedAt as Timestamp)?.toDate?.().toISOString() ?? '',
    }))
  } catch (err) {
    console.warn('[Firestore] Error fetching bookings, returning empty list:', err)
    return []
  }
}

// ── Settings ─────────────────────────────────────────────────
export async function getSetting(key: string): Promise<unknown> {
  try {
    const ref = doc(db, COLLECTIONS.settings, key)
    const snap = await getDoc(ref)
    return snap.exists() ? snap.data()?.value : null
  } catch {
    return null
  }
}

// ── Contact Requests ─────────────────────────────────────────
export interface ContactRequest {
  name: string
  phone: string
  message: string
  createdAt?: unknown
}

export async function createContactRequest(data: ContactRequest): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.contactRequests), {
      ...data,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch {
    return `mock-${Date.now()}`
  }
}
