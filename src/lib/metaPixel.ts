/**
 * lib/metaPixel.ts — نبض للتمريض المنزلي
 * Meta Pixel (Facebook Pixel) & Catalog Event Tracking.
 * Primary Pixel ID: 2115922919275276
 * Secondary Pixel ID: 904182142414606
 */

export const PRIMARY_FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '2115922919275276'

export const FB_PIXEL_ID = PRIMARY_FB_PIXEL_ID

export const ALL_FB_PIXEL_IDS = [
  '2115922919275276',
  '904182142414606',
]

declare global {
  interface Window {
    fbq?: {
      (command: 'init', pixelId: string, options?: Record<string, unknown>): void
      (command: 'track', eventName: string, params?: Record<string, unknown>): void
      (command: 'trackCustom', eventName: string, params?: Record<string, unknown>): void
      callMethod?: (...args: unknown[]) => void
      queue?: unknown[]
      loaded?: boolean
      version?: string
    }
    _fbq?: unknown
  }
}

/**
 * Trigger Meta Pixel PageView
 */
export const fbPageView = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

/**
 * Standard Meta Catalog & Commerce Events
 */
export interface MetaContentParams {
  content_name?: string
  content_category?: string
  content_ids?: string[]
  content_type?: 'product' | 'product_group' | 'service'
  value?: number
  currency?: string
  search_string?: string
  num_items?: number
  status?: string
  [key: string]: unknown
}

/**
 * Track standard Meta event
 */
export const fbTrack = (
  eventName:
    | 'PageView'
    | 'ViewContent'
    | 'Search'
    | 'AddToCart'
    | 'InitiateCheckout'
    | 'Lead'
    | 'Contact'
    | 'Purchase'
    | 'CustomizeProduct'
    | 'Schedule',
  params?: MetaContentParams
) => {
  if (typeof window === 'undefined') return

  if (window.fbq) {
    window.fbq('track', eventName, {
      currency: 'EGP',
      ...params,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Meta Pixel] track: ${eventName}`, params)
  }
}

/**
 * Track custom Meta event
 */
export const fbTrackCustom = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window === 'undefined') return

  if (window.fbq) {
    window.fbq('trackCustom', eventName, {
      currency: 'EGP',
      ...params,
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Meta Pixel] trackCustom: ${eventName}`, params)
  }
}
