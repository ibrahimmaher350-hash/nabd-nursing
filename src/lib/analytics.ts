/**
 * lib/analytics.ts — نبض للتمريض المنزلي
 * Google Analytics 4 event tracking — type-safe.
 */

type AnalyticsEventName =
  | 'view_service'
  | 'click_whatsapp'
  | 'click_call'
  | 'start_booking'
  | 'submit_booking'
  | 'booking_success'
  | 'notification_permission_granted'
  | 'install_pwa'
  | 'facebook_click'
  | 'blog_click'
  | 'google_business_click'

interface EventParams {
  service_name?: string
  service_id?: string
  booking_id?: string
  source?: string
  [key: string]: string | number | boolean | undefined
}

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
    dataLayer?: unknown[]
  }
}

export function trackEvent(eventName: AnalyticsEventName, params?: EventParams): void {
  if (typeof window === 'undefined') return

  // Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, params)
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, params)
  }
}

// Convenience helpers
export const analytics = {
  viewService: (serviceId: string, serviceName: string) =>
    trackEvent('view_service', { service_id: serviceId, service_name: serviceName }),

  clickWhatsApp: (source: string, serviceName?: string) =>
    trackEvent('click_whatsapp', { source, service_name: serviceName }),

  clickCall: (source: string) =>
    trackEvent('click_call', { source }),

  startBooking: (serviceId: string, serviceName: string) =>
    trackEvent('start_booking', { service_id: serviceId, service_name: serviceName }),

  submitBooking: (serviceId: string) =>
    trackEvent('submit_booking', { service_id: serviceId }),

  bookingSuccess: (bookingId: string, serviceId: string) =>
    trackEvent('booking_success', { booking_id: bookingId, service_id: serviceId }),

  notificationGranted: () =>
    trackEvent('notification_permission_granted'),

  installPWA: () =>
    trackEvent('install_pwa'),

  facebookClick: (type: 'page' | 'group') =>
    trackEvent('facebook_click', { source: type }),

  blogClick: () =>
    trackEvent('blog_click'),

  googleBusinessClick: () =>
    trackEvent('google_business_click'),
}
