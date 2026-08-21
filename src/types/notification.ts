/**
 * types/notification.ts — نبض للتمريض المنزلي
 */

export type NotificationType =
  // Client notifications
  | 'booking_received'
  | 'booking_confirmed'
  | 'booking_rescheduled'
  | 'booking_reminder'
  | 'booking_day_reminder'
  | 'booking_cancelled'
  | 'admin_message'
  // Admin notifications
  | 'new_booking'
  | 'booking_modified'
  | 'booking_cancelled_by_client'
  | 'upcoming_appointment'
  | 'new_contact_request'

export interface NotificationPayload {
  id: string
  type: NotificationType
  title: string
  body: string
  bookingId?: string
  fcmToken?: string          // Target token (null = broadcast)
  topic?: string             // FCM topic
  data?: Record<string, string>
  scheduledFor?: string      // ISO string for scheduled notifications
  sent: boolean
  sentAt?: string
  createdAt: string
}
