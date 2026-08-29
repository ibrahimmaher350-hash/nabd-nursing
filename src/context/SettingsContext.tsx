'use client'
/**
 * context/SettingsContext.tsx — نبض للتمريض المنزلي
 * موفر الإعدادات الحية التفاعلية ولوحة التحكم الشاملة
 * يتيح التحكم المباشر والآمن في:
 * - أسعار وحالة جميع الخدمات التمريضية
 * - أسعار ومخزون الأجهزة والمستلزمات الطبية (بما فيها جهاز السكر فيفا تشيك)
 * - أرقام التواصل وروابط السوشيال ميديا
 * - رمز PIN السري للوحة التحكم
 * - الشريط الإعلاني العلوي ووضع الصيانة
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { siteConfig } from '@/data/siteConfig'

export interface ServiceOverride {
  price?: string
  priceNote?: string
  active?: boolean
  bookingEnabled?: boolean
  badge?: string
}

export interface SupplyOverride {
  price?: string
  oldPrice?: string
  priceNumber?: number
  badge?: string
  inStock?: boolean
  giftStrips?: string
  warranty?: string
  customTitle?: string
}

export interface CustomProduct {
  id: string
  name: string
  category: string
  categoryName: string
  price: string
  oldPrice?: string
  badge?: string
  image: string
  shortDesc: string
  inStock: boolean
}

export interface SiteSettings {
  businessName: string
  tagline: string
  phone: string
  whatsapp: string
  telegramUrl?: string
  facebookUrl: string
  facebookProfileUrl?: string
  facebookGroupUrl: string
  bloggerUrl: string
  googleBusinessUrl: string
  googleReviewsUrl?: string
  cezmaStoreUrl?: string
  serviceAreas: string
  bookingEnabled: boolean
  maintenanceMode: boolean
  pricingNote: string

  // ── Admin Security & Overrides ──
  adminPin?: string
  announcement?: string
  announcementActive?: boolean
  servicesOverrides?: Record<string, ServiceOverride>
  suppliesOverrides?: Record<string, SupplyOverride>
  customProducts?: CustomProduct[]
}

const defaultSettings: SiteSettings = {
  businessName: siteConfig.brand.name,
  tagline: siteConfig.brand.tagline,
  phone: siteConfig.contact.phone,
  whatsapp: siteConfig.contact.whatsapp,
  telegramUrl: siteConfig.contact.telegram,
  facebookUrl: siteConfig.social.facebook,
  facebookProfileUrl: siteConfig.social.facebookProfile,
  facebookGroupUrl: siteConfig.social.facebookGroup,
  bloggerUrl: siteConfig.social.blogger,
  googleBusinessUrl: siteConfig.social.googleBusiness,
  googleReviewsUrl: siteConfig.social.googleReviews,
  cezmaStoreUrl: siteConfig.social.cezmaStore,
  serviceAreas: siteConfig.location.serviceAreas.join('، '),
  bookingEnabled: true,
  maintenanceMode: false,
  pricingNote: siteConfig.booking.pricingNote,

  // Admin Defaults
  adminPin: '2026',
  announcement: '',
  announcementActive: false,
  servicesOverrides: {},
  suppliesOverrides: {},
  customProducts: [],
}

interface SettingsContextType {
  settings: SiteSettings
  loading: boolean
  getWhatsAppUrl: (serviceName?: string) => string
  getCallUrl: () => string
  saveSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>

  // Helper getters for dynamic overrides
  getServicePrice: (serviceId: string, defaultPrice?: string) => string
  isServiceActive: (serviceId: string, defaultVal?: boolean) => boolean
  isServiceBookingEnabled: (serviceId: string, defaultVal?: boolean) => boolean
  getServiceBadge: (serviceId: string, defaultVal?: string) => string | undefined
  getSupplyPrice: (supplyId: string, defaultPrice?: string) => string
  getSupplyOldPrice: (supplyId: string, defaultOldPrice?: string) => string | undefined
  getSupplyBadge: (supplyId: string, defaultBadge?: string) => string | undefined
  isSupplyInStock: (supplyId: string, defaultStock?: boolean) => boolean
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  getWhatsAppUrl: () => `https://wa.me/${siteConfig.contact.whatsapp}`,
  getCallUrl: () => `tel:${siteConfig.contact.phone}`,
  saveSettings: async () => false,

  getServicePrice: (_id, def = 'حسب الحالة') => def,
  isServiceActive: (_id, def = true) => def,
  isServiceBookingEnabled: (_id, def = true) => def,
  getServiceBadge: (_id, def) => def,
  getSupplyPrice: (_id, def = '') => def,
  getSupplyOldPrice: (_id, def) => def,
  getSupplyBadge: (_id, def) => def,
  isSupplyInStock: (_id, def = true) => def,
})

const STORAGE_KEY = 'nabd_site_settings'
const EVENT_KEY = 'nabd_settings_updated'

function isValidSettings(s: Partial<SiteSettings>): boolean {
  if (!s || typeof s !== 'object') return false
  const name = s.businessName ?? ''
  if (name && /^[\?]+(\s+[\?]+)*$/.test(name.trim())) return false
  return true
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  // Load from localStorage on mount, then sync with API
  useEffect(() => {
    // 1. Quick initial load from localStorage
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        const parsed = JSON.parse(cached)
        if (isValidSettings(parsed)) {
          setSettings({ ...defaultSettings, ...parsed })
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }

    // 2. Fetch fresh from API
    async function syncSettings() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (json.settings && isValidSettings(json.settings)) {
            const merged: SiteSettings = {
              ...defaultSettings,
              ...json.settings,
              servicesOverrides: json.settings.servicesOverrides || {},
              suppliesOverrides: json.settings.suppliesOverrides || {},
              customProducts: json.settings.customProducts || [],
            }
            setSettings(merged)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
          }
        }
      } catch (err) {
        console.warn('Error syncing settings from server:', err)
      } finally {
        setLoading(false)
      }
    }

    syncSettings()

    // 3. Listen for updates across components or tabs
    const handleUpdate = () => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (isValidSettings(parsed)) {
            setSettings((prev) => ({ ...prev, ...parsed }))
          }
        }
      } catch (e) {
        console.warn(e)
      }
    }

    window.addEventListener(EVENT_KEY, handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener(EVENT_KEY, handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Dynamic WhatsApp URL
  const getWhatsAppUrl = useCallback(
    (serviceName?: string) => {
      const raw = settings.whatsapp || siteConfig.contact.whatsapp
      const cleanNumber = raw.startsWith('0')
        ? `2${raw}`
        : raw.startsWith('+')
        ? raw.replace('+', '')
        : raw
      const base = `https://wa.me/${cleanNumber}`

      if (!serviceName) {
        const msg = encodeURIComponent('مرحبًا، أريد الاستفسار عن خدمات نبض للتمريض المنزلي.')
        return `${base}?text=${msg}`
      }
      const msg = encodeURIComponent(`مرحبًا، أريد حجز خدمة ${serviceName} من نبض للتمريض المنزلي.`)
      return `${base}?text=${msg}`
    },
    [settings.whatsapp]
  )

  // Dynamic Call URL
  const getCallUrl = useCallback(() => {
    const raw = settings.phone || siteConfig.contact.phone
    const cleanNumber = raw.startsWith('0')
      ? `+20${raw.slice(1)}`
      : raw.startsWith('+')
      ? raw
      : `+20${raw}`
    return `tel:${cleanNumber}`
  }, [settings.phone])

  // Save settings through API + localStorage + broadcast
  const saveSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    const updated: SiteSettings = { ...settings, ...newSettings }
    setSettings(updated)

    // Save to local cache immediately
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event(EVENT_KEY))
    } catch (e) {
      console.warn(e)
    }

    // Save to backend API
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      const data = await res.json()
      return data.success
    } catch (err) {
      console.error('Error saving settings to API:', err)
      return false
    }
  }

  // ── Helper Getters for Services ──
  const getServicePrice = useCallback(
    (serviceId: string, defaultPrice = 'حسب الحالة'): string => {
      const override = settings.servicesOverrides?.[serviceId]
      return override?.price?.trim() ? override.price : defaultPrice
    },
    [settings.servicesOverrides]
  )

  const isServiceActive = useCallback(
    (serviceId: string, defaultVal = true): boolean => {
      const override = settings.servicesOverrides?.[serviceId]
      return override?.active !== undefined ? override.active : defaultVal
    },
    [settings.servicesOverrides]
  )

  const isServiceBookingEnabled = useCallback(
    (serviceId: string, defaultVal = true): boolean => {
      const override = settings.servicesOverrides?.[serviceId]
      return override?.bookingEnabled !== undefined ? override.bookingEnabled : defaultVal
    },
    [settings.servicesOverrides]
  )

  const getServiceBadge = useCallback(
    (serviceId: string, defaultVal?: string): string | undefined => {
      const override = settings.servicesOverrides?.[serviceId]
      return override?.badge?.trim() ? override.badge : defaultVal
    },
    [settings.servicesOverrides]
  )

  // ── Helper Getters for Supplies ──
  const getSupplyPrice = useCallback(
    (supplyId: string, defaultPrice = ''): string => {
      const override = settings.suppliesOverrides?.[supplyId]
      return override?.price?.trim() ? override.price : defaultPrice
    },
    [settings.suppliesOverrides]
  )

  const getSupplyOldPrice = useCallback(
    (supplyId: string, defaultOldPrice?: string): string | undefined => {
      const override = settings.suppliesOverrides?.[supplyId]
      return override?.oldPrice?.trim() ? override.oldPrice : defaultOldPrice
    },
    [settings.suppliesOverrides]
  )

  const getSupplyBadge = useCallback(
    (supplyId: string, defaultBadge?: string): string | undefined => {
      const override = settings.suppliesOverrides?.[supplyId]
      return override?.badge !== undefined ? override.badge : defaultBadge
    },
    [settings.suppliesOverrides]
  )

  const isSupplyInStock = useCallback(
    (supplyId: string, defaultStock = true): boolean => {
      const override = settings.suppliesOverrides?.[supplyId]
      return override?.inStock !== undefined ? override.inStock : defaultStock
    },
    [settings.suppliesOverrides]
  )

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        getWhatsAppUrl,
        getCallUrl,
        saveSettings,
        getServicePrice,
        isServiceActive,
        isServiceBookingEnabled,
        getServiceBadge,
        getSupplyPrice,
        getSupplyOldPrice,
        getSupplyBadge,
        isSupplyInStock,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
