/**
 * app/api/bookings/route.ts — نبض للتمريض المنزلي
 * POST /api/bookings
 * 1. يُرسل بيانات الحجز لواتساب صاحب العمل (رقم نبض)
 * 2. يُسجّل في Google Sheets إذا تم ضبط GOOGLE_SHEETS_WEBHOOK_URL
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { siteConfig } from '@/data/siteConfig'

const bookingSchema = z.object({
  serviceId:     z.string().min(1),
  serviceName:   z.string().min(1),
  customerName:  z.string().min(2),
  customerPhone: z.string().regex(/^01[0-9]{9}$/),
  whatsapp:      z.string().optional(),
  patientName:   z.string().optional(),
  governorate:   z.string().min(1),
  city:          z.string().min(2),
  address:       z.string().min(5),
  landmark:      z.string().optional(),
  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1),
  notes:         z.string().max(500).optional(),
})

/** Get dynamic admin WhatsApp number */
function getAdminWhatsAppNumber(): string {
  try {
    const SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'dynamicSettings.json')
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'))
      if (data.whatsapp) {
        const raw = String(data.whatsapp).trim()
        return raw.startsWith('0') ? `2${raw}` : raw.startsWith('+') ? raw.replace('+', '') : raw
      }
    }
  } catch {
    // ignore
  }
  const defaultNum = process.env.ADMIN_WHATSAPP_NUMBER || siteConfig.contact.whatsapp || '201099667065'
  return defaultNum.startsWith('0') ? `2${defaultNum}` : defaultNum.startsWith('+') ? defaultNum.replace('+', '') : defaultNum
}

/** Generate booking ID like NB-XXXXXX */
function generateBookingId(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rnd = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `NB-${ts}${rnd}`
}

/** Build the WhatsApp message body sent to the admin */
function buildAdminWhatsAppMessage(bookingId: string, data: z.infer<typeof bookingSchema>): string {
  const lines = [
    '🔔 *طلب حجز جديد — نبض للتمريض المنزلي*',
    '─────────────────────',
    `🆔 *رقم الحجز:* ${bookingId}`,
    `🏥 *الخدمة:* ${data.serviceName}`,
    '─────────────────────',
    `👤 *اسم العميل:* ${data.customerName}`,
    ...(data.patientName ? [`🤒 *اسم المريض:* ${data.patientName}`] : []),
    `📞 *الهاتف:* ${data.customerPhone}`,
    ...(data.whatsapp ? [`💬 *واتساب:* ${data.whatsapp}`] : []),
    '─────────────────────',
    `📍 *المحافظة:* ${data.governorate}`,
    `🏙️ *المدينة/المنطقة:* ${data.city}`,
    `🏠 *العنوان:* ${data.address}`,
    ...(data.landmark ? [`📌 *علامة مميزة:* ${data.landmark}`] : []),
    '─────────────────────',
    `📅 *التاريخ المطلوب:* ${data.preferredDate}`,
    `🕐 *الوقت المطلوب:* ${data.preferredTime}`,
    ...(data.notes ? ['─────────────────────', `📝 *ملاحظات:* ${data.notes}`] : []),
    '─────────────────────',
    `⏰ *وقت الطلب:* ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}`,
  ]
  return lines.join('\n')
}

/** Save booking to Google Sheets via Apps Script webhook */
async function saveToGoogleSheets(bookingId: string, data: z.infer<typeof bookingSchema>): Promise<void> {
  const DEFAULT_SHEETS_URL =
    'https://script.google.com/macros/s/AKfycbxBR6fJaq5_9yOGh7ISdEOL1tQNvmyf6R0HQ6m2cIU4mlQjNUoLYNxs2QPjCeoRamJSpg/exec'
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_SHEETS_URL

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      body: JSON.stringify({
        bookingId,
        timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
        serviceName:   data.serviceName,
        customerName:  data.customerName,
        customerPhone: data.customerPhone,
        whatsapp:      data.whatsapp ?? '',
        patientName:   data.patientName ?? '',
        governorate:   data.governorate,
        city:          data.city,
        address:       data.address,
        landmark:      data.landmark ?? '',
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes:         data.notes ?? '',
        status:        'قيد الانتظار',
      }),
    })
    console.log('[Booking API] Saved to Google Sheets ✓ Status:', res.status)
  } catch (err) {
    // Don't fail the booking if Sheets is down — just log
    console.warn('[Booking API] Google Sheets save failed:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صحيحة. تحقق من الحقول المطلوبة.' },
        { status: 400 }
      )
    }

    const data = parsed.data
    const bookingId = generateBookingId()

    // ── 1. Build WhatsApp URL for admin notification ──────────
    const adminPhone = getAdminWhatsAppNumber()
    const msg = buildAdminWhatsAppMessage(bookingId, data)
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(msg)}`

    // ── 2. Save to Google Sheets (non-blocking) ───────────────
    await saveToGoogleSheets(bookingId, data)

    // ── 3. Try Firestore if configured ────────────────────────
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    if (projectId && projectId !== 'your_project_id_here' && projectId !== 'nabd-nursing') {
      try {
        const { initializeApp, getApps, cert } = await import('firebase-admin/app')
        const { getFirestore, FieldValue } = await import('firebase-admin/firestore')

        if (!getApps().length) {
          initializeApp({
            credential: cert({
              projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
              clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
              privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
          })
        }

        const db = getFirestore()
        await db.collection('bookings').add({
          bookingId,
          ...data,
          status:    'pending',
          source:    'website',
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        })
      } catch (firestoreErr) {
        console.warn('[Booking API] Firestore save failed (non-critical):', firestoreErr)
      }
    }

    // Return success with whatsappUrl for client to open
    return NextResponse.json({
      success: true,
      bookingId,
      whatsappUrl,    // Client opens this to notify admin
      message: 'تم استلام طلب الحجز. سيتم التواصل معك لتأكيد الموعد.',
    })
  } catch (error) {
    console.error('[Booking API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'تعذر إرسال الطلب حالياً. حاول مرة أخرى أو تواصل معنا عبر واتساب.' },
      { status: 500 }
    )
  }
}
