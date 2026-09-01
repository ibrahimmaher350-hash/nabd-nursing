/**
 * lib/analytics.ts — نبض للتمريض المنزلي
 * Unified Analytics: Google Analytics 4 & Meta (Facebook) Pixel Commerce Events.
 */

import { fbTrack, fbTrackCustom } from '@/lib/metaPixel'

type AnalyticsEventName =
  | 'view_service'
  | 'view_product'
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
  | 'share_click'
  | 'search'

interface EventParams {
  service_name?: string
  service_id?: string
  product_name?: string
  product_id?: string
  price?: number
  booking_id?: string
  source?: string
  query?: string
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

  // 1. Google Analytics 4
  if (window.gtag) {
    window.gtag('event', eventName, params)
  }

  // 2. Meta (Facebook) Pixel Standard & Commerce Events
  try {
    switch (eventName) {
      case 'view_service':
        fbTrack('ViewContent', {
          content_name: params?.service_name || 'خدمة تمريضية',
          content_ids: params?.service_id ? [params.service_id] : undefined,
          content_type: 'service',
        })
        break

      case 'view_product':
        fbTrack('ViewContent', {
          content_name: params?.product_name || 'مستلزم طبي',
          content_ids: params?.product_id ? [params.product_id] : undefined,
          content_type: 'product',
          value: params?.price,
        })
        break

      case 'start_booking':
        fbTrack('InitiateCheckout', {
          content_name: params?.service_name || 'حجز خدمة',
          content_ids: params?.service_id ? [params.service_id] : undefined,
          content_type: 'service',
        })
        break

      case 'submit_booking':
        fbTrack('Lead', {
          content_name: params?.service_name || 'طلب حجز خدمة',
          content_ids: params?.service_id ? [params.service_id] : undefined,
          content_category: 'Booking Request',
        })
        break

      case 'booking_success':
        fbTrack('Purchase', {
          content_name: params?.service_id || 'تم الحجز بنجاح',
          content_ids: params?.service_id ? [params.service_id] : undefined,
          value: params?.price || 150,
          currency: 'EGP',
        })
        break

      case 'click_whatsapp':
        fbTrack('Lead', {
          content_name: params?.service_name || 'طلب تواصل واتساب',
          content_category: params?.source || 'WhatsApp',
        })
        fbTrack('Contact', {
          content_name: 'WhatsApp',
        })
        break

      case 'click_call':
        fbTrack('Contact', {
          content_name: 'Phone Call',
          content_category: params?.source || 'Direct Call',
        })
        break

      case 'search':
        if (params?.query) {
          fbTrack('Search', {
            search_string: params.query,
          })
        }
        break

      case 'share_click':
        fbTrackCustom('ShareContent', {
          platform: params?.source,
          content_id: params?.service_id,
        })
        break

      default:
        break
    }
  } catch (err) {
    console.warn('[Meta Pixel] Event tracking failed:', err)
  }

  // 3. Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, params)
  }
}

// Convenience helpers
export const analytics = {
  viewService: (serviceId: string, serviceName: string) =>
    trackEvent('view_service', { service_id: serviceId, service_name: serviceName }),

  viewProduct: (productId: string, productName: string, price?: number) =>
    trackEvent('view_product', { product_id: productId, product_name: productName, price }),

  clickWhatsApp: (source: string, serviceName?: string) =>
    trackEvent('click_whatsapp', { source, service_name: serviceName }),

  clickCall: (source: string) =>
    trackEvent('click_call', { source }),

  startBooking: (serviceId: string, serviceName: string) =>
    trackEvent('start_booking', { service_id: serviceId, service_name: serviceName }),

  submitBooking: (serviceId: string) =>
    trackEvent('submit_booking', { service_id: serviceId }),

  bookingSuccess: (bookingId: string, serviceId: string, price?: number) =>
    trackEvent('booking_success', { booking_id: bookingId, service_id: serviceId, price }),

  search: (query: string) =>
    trackEvent('search', { query }),

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

  shareClick: (platform: string, context?: string) =>
    trackEvent('share_click', { source: platform, service_id: context }),
}
