/**
 * types/booking.ts — نبض للتمريض المنزلي
 * Booking data model — scalable and extensible.
 */

export type BookingStatus =
  | 'pending'      // جديد — منتظر التأكيد
  | 'confirmed'    // مؤكد
  | 'completed'    // مكتمل
  | 'cancelled'    // ملغي
  | 'rescheduled'  // معدّل الموعد

export type BookingSource =
  | 'website'
  | 'whatsapp'
  | 'phone'
  | 'admin'

export interface NotificationPreferences {
  whatsapp: boolean
  push: boolean
  sms: boolean
}

export interface Booking {
  bookingId: string          // NB-XXXXXX
  serviceId: string
  serviceName: string

  // Customer
  customerName: string
  customerPhone: string
  whatsapp?: string
  patientName?: string       // If different from customer

  // Location
  governorate: string        // دمياط
  city: string
  address: string
  landmark?: string

  // Appointment
  preferredDate: string      // ISO date string
  preferredTime: string      // HH:MM

  // Meta
  notes?: string
  status: BookingStatus
  source: BookingSource

  // FCM Token for notifications
  fcmToken?: string

  // Timestamps (Firestore Timestamp serialized)
  createdAt: string
  updatedAt: string
  confirmedAt?: string
  completedAt?: string
  cancelledAt?: string
  rescheduledAt?: string

  notificationPreferences?: NotificationPreferences
}

// Form data type (subset of Booking for frontend form)
export interface BookingFormData {
  serviceId: string
  serviceName: string
  customerName: string
  customerPhone: string
  whatsapp?: string
  patientName?: string
  governorate: string
  city: string
  address: string
  landmark?: string
  preferredDate: string
  preferredTime: string
  notes?: string
}

// Booking response from server
export interface BookingResponse {
  success: boolean
  bookingId?: string
  message: string
  error?: string
}
