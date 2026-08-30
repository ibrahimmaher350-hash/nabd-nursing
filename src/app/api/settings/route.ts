/**
 * app/api/settings/route.ts — إعدادات المنصة الحية
 * GET /api/settings — جلب الإعدادات المحفوظة
 * POST /api/settings — حفظ وتحديث الإعدادات (Firestore + Local Store)
 */

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { siteConfig } from '@/data/siteConfig'

// File path for local persistent storage fallback
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
      console.warn(`[Settings API] Corrupted value for "${key}", keeping default`)
    } else {
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
    // JSON.stringify produces UTF-8 safe output; write with explicit utf-8
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), { encoding: 'utf-8' })
    return true
  } catch (err) {
    console.warn('[Settings API] Error saving local file:', err)
    return false
  }
}

// In-memory module cache across serverless requests on the same instance
let inMemorySettings: Record<string, unknown> | null = null

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

export async function GET(request: NextRequest) {
  try {
    // 1. Check in-memory module cache first
    if (inMemorySettings) {
      return NextResponse.json({
        success: true,
        settings: inMemorySettings,
      })
    }

    // 2. Try reading from Firestore if configured
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    if (projectId && projectId !== 'your_project_id_here' && projectId !== 'nabd-nursing') {
      try {
        const { initializeApp, getApps, cert } = await import('firebase-admin/app')
        const { getFirestore } = await import('firebase-admin/firestore')

        if (!getApps().length) {
          initializeApp({
            credential: cert({
              projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
          })
        }

        const db = getFirestore()
        const doc = await db.collection('settings').doc('general').get()
        if (doc.exists) {
          const loaded = { ...getDefaultSettings(), ...doc.data() }
          inMemorySettings = loaded
          return NextResponse.json({
            success: true,
            settings: loaded,
          })
        }
      } catch (firestoreErr) {
        console.warn('[Settings API] Firestore fetch failed, falling back to local file:', firestoreErr)
      }
    }

    // 3. Fallback to local file
    const local = getLocalSettings()
    let finalSettings = local ? { ...getDefaultSettings(), ...local } : getDefaultSettings()

    // 4. Check for cookie sync fallback if serverless lost memory
    try {
      const syncCookie = request.cookies.get('nabd_settings_sync')?.value
      if (syncCookie) {
        const parsedCookie = JSON.parse(decodeURIComponent(syncCookie))
        if (parsedCookie && typeof parsedCookie === 'object') {
          finalSettings = {
            ...finalSettings,
            ...parsedCookie,
            servicesOverrides: {
              ...(finalSettings.servicesOverrides as Record<string, unknown> || {}),
              ...(parsedCookie.servicesOverrides || {}),
            },
            suppliesOverrides: {
              ...(finalSettings.suppliesOverrides as Record<string, unknown> || {}),
              ...(parsedCookie.suppliesOverrides || {}),
            },
          }
        }
      }
    } catch {}

    inMemorySettings = finalSettings

    return NextResponse.json({
      success: true,
      settings: finalSettings,
    })
  } catch (err) {
    console.error('[Settings API GET] Error:', err)
    return NextResponse.json({
      success: true,
      settings: getDefaultSettings(),
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'بيانات غير صالحة' }, { status: 400 })
    }

    const defaults = getDefaultSettings()
    // Sanitize: reject any corrupted (???) values and keep defaults instead
    const sanitizedBody = sanitizeSettings(body as Record<string, unknown>, defaults as Record<string, unknown>)

    const updatedSettings: Record<string, any> = {
      ...defaults,
      ...sanitizedBody,
      updatedAt: new Date().toISOString(),
    }

    // 1. Save to local storage file
    saveLocalSettings(updatedSettings)

    // 2. Save to Firestore if configured
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    if (projectId && projectId !== 'your_project_id_here' && projectId !== 'nabd-nursing') {
      try {
        const { initializeApp, getApps, cert } = await import('firebase-admin/app')
        const { getFirestore } = await import('firebase-admin/firestore')

        if (!getApps().length) {
          initializeApp({
            credential: cert({
              projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
          })
        }

        const db = getFirestore()
        await db.collection('settings').doc('general').set(updatedSettings, { merge: true })
      } catch (firestoreErr) {
        console.warn('[Settings API] Firestore save skipped or failed:', firestoreErr)
      }
    }

    // 3. Update in-memory cache
    inMemorySettings = updatedSettings

    const response = NextResponse.json({
      success: true,
      message: 'تم حفظ وتحديث الإعدادات بنجاح',
      settings: updatedSettings,
    })

    // 4. Set persistence cookie for all future requests
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
      { status: 500 }
    )
  }
}
