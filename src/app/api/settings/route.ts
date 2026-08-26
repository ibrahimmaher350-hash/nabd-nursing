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

// Default settings from siteConfig
function getDefaultSettings() {
  return {
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
}

export async function GET() {
  try {
    // 1. Try reading from Firestore if configured
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
          return NextResponse.json({
            success: true,
            settings: { ...getDefaultSettings(), ...doc.data() },
          })
        }
      } catch (firestoreErr) {
        console.warn('[Settings API] Firestore fetch failed, falling back to local file:', firestoreErr)
      }
    }

    // 2. Fallback to local file or defaults
    const local = getLocalSettings()
    const finalSettings = local ? { ...getDefaultSettings(), ...local } : getDefaultSettings()

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

    const updatedSettings = {
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

    return NextResponse.json({
      success: true,
      message: 'تم حفظ وتحديث الإعدادات بنجاح',
      settings: updatedSettings,
    })
  } catch (err) {
    console.error('[Settings API POST] Error:', err)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء حفظ الإعدادات' },
      { status: 500 }
    )
  }
}
