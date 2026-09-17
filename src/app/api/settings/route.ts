/**
 * app/api/settings/route.ts — إعدادات المنصة الحية
 * GET /api/settings — جلب الإعدادات الحية المحفوظة في Supabase
 * POST /api/settings — حفظ وتحديث الإعدادات في Supabase (clinic_settings)
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { siteConfig } from '@/data/siteConfig'
import { supabase } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// File path for local persistent storage fallback (for offline/dev)
const SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'dynamicSettings.json')

// Helper to detect corrupted Arabic strings (e.g. "??? ?????")
function isCorrupted(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return /^[\?]+(\s*[\?]+)*$/.test(value.trim()) && value.trim().length > 0
}

// Helper to sanitize settings — replace any corrupted field with default
function sanitizeSettings(incoming: Record<string, unknown>, defaults: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...defaults }
  for (const key of Object.keys(incoming)) {
    const val = incoming[key]
    if (isCorrupted(val)) {
      console.warn('[Settings API] Corrupted value for ' + key + ', keeping default')
    } else if (val !== undefined) {
      out[key] = val
    }
  }
  return out
}

// Helper to read local settings file safely
function getLocalSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.warn('[Settings API] Error reading local file:', err)
  }
  return null
}

// Helper to save local settings file safely (always UTF-8)
function saveLocalSettings(settings: Record<string, unknown>) {
  try {
    const dir = path.dirname(SETTINGS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), { encoding: 'utf-8' })
    return true
  } catch {
    // Vercel serverless environment has read-only filesystem, safe to ignore
    return false
  }
}

function getDefaultSettings(): Record<string, unknown> {
  return {
    businessName: siteConfig.brand.name,
    tagline: siteConfig.brand.tagline,
    phone: siteConfig.contact.phone,
    whatsapp: siteConfig.contact.whatsapp,
    telegramUrl: siteConfig.social.telegram || 'https://t.me/Ibrahim5k',
    facebookUrl: siteConfig.social.facebook,
    facebookProfileUrl: siteConfig.social.facebookProfile || 'https://www.facebook.com/share/1BDJwJeW15/',
    facebookGroupUrl: siteConfig.social.facebookGroup,
    bloggerUrl: siteConfig.social.blogger,
    googleBusinessUrl: siteConfig.social.googleBusiness,
    googleReviewsUrl: siteConfig.social.googleReviews,
    cezmaStoreUrl: siteConfig.social.cezmaStore,
    serviceAreas: siteConfig.location.serviceAreas.join('، '),
    bookingEnabled: true,
    maintenanceMode: false,
    pricingNote: siteConfig.booking.pricingNote,
    adminPin: '2026',
    announcement: '',
    announcementActive: false,
    servicesOverrides: {},
    suppliesOverrides: {
      'vivachek-ino': {
        price: '450 ج.م',
        oldPrice: '650 ج.م',
        priceNumber: 450,
        badge: 'الأكثر مبيعاً 🏆 | عرض خاص 450ج',
        inStock: true,
        giftStrips: '10 شرائط هدية مجانية',
      },
    },
    customProducts: [],
  }
}

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
}

export async function GET(request: NextRequest) {
  try {
    const defaults = getDefaultSettings()
    let settingsFromDb: Record<string, unknown> | null = null

    // 1. Primary Source of Truth: Supabase clinic_settings table
    try {
      const { data, error } = await supabase
        .from('clinic_settings')
        .select('value, updated_at')
        .eq('key', 'site_settings')
        .maybeSingle()

      if (!error && data?.value) {
        const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
        if (parsed && typeof parsed === 'object') {
          settingsFromDb = parsed as Record<string, unknown>
        }
      }
    } catch (sbErr) {
      console.warn('[Settings API GET] Supabase query failed:', sbErr)
    }

    // 2. If Supabase has settings, merge and return
    if (settingsFromDb) {
      const merged = {
        ...defaults,
        ...settingsFromDb,
        servicesOverrides: {
          ...(defaults.servicesOverrides as Record<string, unknown> || {}),
          ...(settingsFromDb.servicesOverrides as Record<string, unknown> || {}),
        },
        suppliesOverrides: {
          ...(defaults.suppliesOverrides as Record<string, unknown> || {}),
          ...(settingsFromDb.suppliesOverrides as Record<string, unknown> || {}),
        },
        customProducts: Array.isArray(settingsFromDb.customProducts)
          ? settingsFromDb.customProducts
          : (defaults.customProducts as unknown[] || []),
      }

      return NextResponse.json(
        { success: true, settings: merged, source: 'supabase' },
        { headers: NO_CACHE_HEADERS }
      )
    }

    // 3. Fallback to local file or defaults
    const local = getLocalSettings()
    const finalSettings = local ? { ...defaults, ...local } : defaults

    return NextResponse.json(
      { success: true, settings: finalSettings, source: 'fallback' },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (err) {
    console.error('[Settings API GET] Error:', err)
    return NextResponse.json(
      { success: true, settings: getDefaultSettings(), source: 'default' },
      { headers: NO_CACHE_HEADERS }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'بيانات غير صالحة' }, { status: 400 })
    }

    const defaults = getDefaultSettings()
    // Sanitize: reject corrupted strings
    const sanitizedBody = sanitizeSettings(body as Record<string, unknown>, defaults)

    const updatedSettings: Record<string, any> = {
      ...defaults,
      ...sanitizedBody,
      servicesOverrides: {
        ...(defaults.servicesOverrides as Record<string, unknown> || {}),
        ...((sanitizedBody.servicesOverrides as Record<string, unknown>) || {}),
      },
      suppliesOverrides: {
        ...(defaults.suppliesOverrides as Record<string, unknown> || {}),
        ...((sanitizedBody.suppliesOverrides as Record<string, unknown>) || {}),
      },
      customProducts: Array.isArray(sanitizedBody.customProducts)
        ? sanitizedBody.customProducts
        : (defaults.customProducts as unknown[] || []),
      updatedAt: new Date().toISOString(),
    }

    // 1. Primary Persistent Storage: Save to Supabase clinic_settings table
    let supabaseSuccess = false
    try {
      const { error: sbError } = await supabase
        .from('clinic_settings')
        .upsert({
          key: 'site_settings',
          value: JSON.stringify(updatedSettings),
          updated_at: new Date().toISOString(),
        })

      if (sbError) {
        console.error('[Settings API POST] Supabase upsert error:', sbError)
      } else {
        supabaseSuccess = true
      }
    } catch (sbErr) {
      console.error('[Settings API POST] Supabase exception:', sbErr)
    }

    // 2. Also try local storage file (for offline/dev environments)
    saveLocalSettings(updatedSettings)

    const response = NextResponse.json(
      {
        success: true,
        message: 'تم حفظ ونشر الإعدادات بنجاح في قاعدة البيانات',
        settings: updatedSettings,
        persisted: supabaseSuccess,
      },
      { headers: NO_CACHE_HEADERS }
    )

    // 3. Set sync cookie for immediate cross-page consistency
    try {
      response.cookies.set('nabd_settings_sync', encodeURIComponent(JSON.stringify({
        servicesOverrides: updatedSettings.servicesOverrides,
        suppliesOverrides: updatedSettings.suppliesOverrides,
        customProducts: updatedSettings.customProducts,
        announcement: updatedSettings.announcement,
        announcementActive: updatedSettings.announcementActive,
        updatedAt: updatedSettings.updatedAt,
      })), {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      })
    } catch {}

    return response
  } catch (err) {
    console.error('[Settings API POST] Error:', err)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حفظ الإعدادات' },
      { status: 500, headers: NO_CACHE_HEADERS }
    )
  }
}
