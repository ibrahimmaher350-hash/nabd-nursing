/**
 * lib/firebase/fcm.ts — نبض للتمريض المنزلي
 * Firebase Cloud Messaging helpers — push notifications.
 */

import { getToken, onMessage } from 'firebase/messaging'
import { getMessagingInstance, VAPID_KEY } from './config'

/**
 * Request notification permission and get FCM token.
 * Returns null if user denies or browser doesn't support.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null

    const messaging = await getMessagingInstance()
    if (!messaging) return null

    const token = await getToken(messaging, { vapidKey: VAPID_KEY })
    return token || null
  } catch (err) {
    console.error('[FCM] Error getting token:', err)
    return null
  }
}

/**
 * Listen for foreground messages.
 */
export async function onForegroundMessage(
  callback: (payload: {
    notification?: { title?: string; body?: string }
    data?: Record<string, string>
  }) => void
): Promise<() => void> {
  const messaging = await getMessagingInstance()
  if (!messaging) return () => {}

  const unsubscribe = onMessage(messaging, callback)
  return unsubscribe
}

/**
 * Check if notifications are supported and permission granted.
 */
export function getNotificationStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (typeof window === 'undefined') return 'unsupported'
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission as 'granted' | 'denied' | 'default'
}
