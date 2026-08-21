'use client'
/**
 * context/SettingsContext.tsx — موفر الإعدادات الحية التفاعلية
 * يتيح تعديل أي رقم أو رابط أو معلومة من لوحة التحكم لتظهر فوراً وبشكل دائم في كامل الموقع
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { siteConfig } from '@/data/siteConfig'

export interface SiteSettings {
  businessName: string
  tagline: string
  phone: string
  whatsapp: string
  facebookUrl: string
  facebookGroupUrl: string
  bloggerUrl: string
  googleBusinessUrl: string
  serviceAreas: string
  bookingEnabled: boolean
  maintenanceMode: boolean
  pricingNote: string
}

const defaultSettings: SiteSettings = {
  businessName: siteConfig.brand.name,
  tagline: siteConfig.brand.tagline,
  phone: siteConfig.contact.phone,
  whatsapp: siteConfig.contact.whatsapp,
  facebookUrl: siteConfig.social.facebook,
  facebookGroupUrl: siteConfig.social.facebookGroup,
  bloggerUrl: siteConfig.social.blogger,
  googleBusinessUrl: siteConfig.social.googleBusiness,
  serviceAreas: siteConfig.location.serviceAreas.join('، '),
  bookingEnabled: true,
  maintenanceMode: false,
  pricingNote: siteConfig.booking.pricingNote,
}

interface SettingsContextType {
  settings: SiteSettings
  loading: boolean
  getWhatsAppUrl: (serviceName?: string) => string
  getCallUrl: () => string
  saveSettings: (newSettings: Partial<SiteSettings>) => Promise<boolean>
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  getWhatsAppUrl: () => `https://wa.me/${siteConfig.contact.whatsapp}`,
  getCallUrl: () => `tel:${siteConfig.contact.phone}`,
  saveSettings: async () => false,
})

const STORAGE_KEY = 'nabd_site_settings'
const EVENT_KEY = 'nabd_settings_updated'

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  // Load from localStorage on mount, then sync with API
  useEffect(() => {
    // 1. Quick initial load from localStorage
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        setSettings({ ...defaultSettings, ...JSON.parse(cached) })
      }
    } catch (e) {
      console.warn('Error reading cached settings:', e)
    }

    // 2. Fetch fresh from API
    async function syncSettings() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (json.settings) {
            const merged = { ...defaultSettings, ...json.settings }
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
          setSettings({ ...defaultSettings, ...JSON.parse(cached) })
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

  // Helper to generate dynamic WhatsApp URL
  const getWhatsAppUrl = useCallback(
    (serviceName?: string) => {
      // Clean number (remove any non-digits)
      const raw = settings.whatsapp || siteConfig.contact.whatsapp
      const cleanNumber = raw.startsWith('0') ? `2${raw}` : raw.startsWith('+') ? raw.replace('+', '') : raw
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

  // Helper to generate dynamic Call URL
  const getCallUrl = useCallback(() => {
    const raw = settings.phone || siteConfig.contact.phone
    const cleanNumber = raw.startsWith('0') ? `+20${raw.slice(1)}` : raw.startsWith('+') ? raw : `+20${raw}`
    return `tel:${cleanNumber}`
  }, [settings.phone])

  // Save settings through API + localStorage + Broadcast event
  const saveSettings = async (newSettings: Partial<SiteSettings>): Promise<boolean> => {
    const updated = { ...settings, ...newSettings }
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

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        getWhatsAppUrl,
        getCallUrl,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
