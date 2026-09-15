/**
 * app/api/bookings/route.ts — نبض للتمريض المنزلي
 * POST /api/bookings
 * 1. يُرسل بيانات الحجز لواتساب المشرف (نبض للتمريض المنزلي)
 * 2. يُسجّل في Google Sheets ويُنشئ موعد Google Calendar ويربط ملف المريض الموحد
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import { siteConfig } from '@/data/siteConfig'
import { formatTo12HourArabic, formatArabicDateWithDay, buildCustomerReminderMessage } from '@/lib/timeUtils'
import { supabase } from '@/lib/supabase/client'
import { decryptToken } from '@/lib/crypto'
import { refreshGoogleAccessToken, createCalendarEvent } from '@/lib/google/calendar-and-sheets'
import { sendEmail } from '@/lib/email/resend'

const bookingSchema = z.object({
  serviceId:         z.string().min(1),
  serviceName:       z.string().min(1),
  customServiceName: z.string().optional(),
  customerName:      z.string().min(2),
  customerPhone:     z.string().regex(/^01[0-9]{9}$/),
  whatsapp:          z.string().optional(),
  patientName:       z.string().optional(),
  governorate:       z.string().min(1),
  city:              z.string().min(2),
  address:           z.string().min(5),
  landmark:          z.string().optional(),
  preferredDate:     z.string().min(1),
  preferredTime:     z.string().min(1),
  notes:             z.string().max(500).optional(),
  labNotes:          z.string().max(500).optional(),
  selectedLabTests:  z.array(z.string()).optional(),
  followUpInterval:  z.string().optional(),
  nextFollowUpDate:  z.string().optional(),
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
  const formattedDayDate = formatArabicDateWithDay(data.preferredDate)
  const formattedTime = formatTo12HourArabic(data.preferredTime)

  const lines = [
    '🔔 *طلب حجز تمريض جديد — نبض للتمريض المنزلي*',
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
    `📅 *التاريخ واليوم:* ${formattedDayDate}`,
    `🕐 *الوقت:* ${data.preferredTime} (${formattedTime})`,
    ...(data.nextFollowUpDate
      ? [`🔄 *المتابعة القادمة المجدولة:* ${formatArabicDateWithDay(data.nextFollowUpDate)}`]
      : []),
    ...(data.selectedLabTests && data.selectedLabTests.length > 0
      ? [
          '─────────────────────',
          `🧪 *التحاليل المطلوبة:* ${data.selectedLabTests.join('، ')}`,
        ]
      : []),
    ...(data.labNotes ? [`🔬 *ملاحظات التحاليل:* ${data.labNotes}`] : []),
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
    const formattedDayDate = formatArabicDateWithDay(data.preferredDate)
    const formattedTime12 = formatTo12HourArabic(data.preferredTime)

    // Send payload using active action 'add_visit'
    const payload = {
      action: 'add_visit',
      data: {
        patient_id: bookingId,
        patient_name: data.patientName || data.customerName,
        date: data.preferredDate,
        time: formattedTime12,
        service: data.serviceName,
        nurse: 'طاقم نبض للتمريض المنزلي',
        status: 'مؤكدة ومجدولة',
        notes: `الهاتف: ${data.customerPhone} | العنوان: ${data.city} - ${data.address} | الملاحظات: ${data.notes || 'لا يوجد'} | اليوم: ${formattedDayDate}`,
      },
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.warn(`[Google Sheets] Webhook responded with status: ${res.status}`)
    }
  } catch (err) {
    console.warn('[Google Sheets] Webhook call failed:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = bookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'البيانات المدخلة غير مكتملة أو غير صحيحة',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const data = parsed.data
    const bookingId = generateBookingId()

    // 1. Save to Google Sheets
    try {
      await saveToGoogleSheets(bookingId, data)
    } catch (sheetErr) {
      console.error('[Booking API] Google Sheets sync error:', sheetErr)
    }

    // 2. Sync to Supabase & Google Calendar & Email
    // ── Convert any time format (12h AM/PM or 24h) to HH:MM 24-hour ──────────
    function parseTo24h(raw: string): string {
      const t = (raw || '10:00').trim().toUpperCase()
      // Already pure 24h like "18:00" or "08:00"
      if (!t.includes('AM') && !t.includes('PM') && !t.includes('ص') && !t.includes('م')) {
        const pure = t.replace(/[^0-9:]/g, '').substring(0, 5)
        return pure.includes(':') ? pure : '10:00'
      }
      // 12h AM/PM like "06:00 PM" or "06:00PM"
      const isPM = t.includes('PM') || t.includes('م')
      const isAM = t.includes('AM') || t.includes('ص')
      const numPart = t.replace(/[^0-9:]/g, '') // "06:00"
      const colonIdx = numPart.indexOf(':')
      const hStr = colonIdx > -1 ? numPart.substring(0, colonIdx) : numPart.substring(0, 2)
      const mStr = colonIdx > -1 ? numPart.substring(colonIdx + 1, colonIdx + 3) : '00'
      let h = parseInt(hStr, 10) || 0
      const m = mStr.padStart(2, '0')
      if (isPM && h !== 12) h += 12
      if (isAM && h === 12) h = 0
      return `${String(h).padStart(2, '0')}:${m}`
    }

    const time24h = parseTo24h(data.preferredTime)
    const startAtIso = `${data.preferredDate}T${time24h}:00+02:00`
    const startMs = new Date(startAtIso).getTime()
    const safeStartMs = isNaN(startMs) ? Date.now() + 24 * 60 * 60 * 1000 : startMs
    const endDate = new Date(safeStartMs + 60 * 60 * 1000)
    const endAtIso = endDate.toISOString()

    let calendarEventId: string | null = null
    let meetLink: string | null = null

    // Sync with Google Calendar if admin is connected
    try {
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('google_refresh_token')
        .not('google_refresh_token', 'is', null)
        .limit(1)
        .maybeSingle()

      if (adminProfile?.google_refresh_token) {
        const refreshToken = decryptToken(adminProfile.google_refresh_token)
        const accessToken = await refreshGoogleAccessToken(refreshToken)
        const calRes = await createCalendarEvent({
          accessToken,
          title: `${data.serviceName} — ${data.customerName}`,
          description: `حجز خدمة: ${data.serviceName}\nالعميل: ${data.customerName}\nالهاتف: ${data.customerPhone}\nالعنوان: ${data.city} - ${data.address}\nملاحظات: ${data.notes || 'لا يوجد'}`,
          startAt: startAtIso,
          endAt: endAtIso,
          patientEmail: `${data.customerPhone}@nabd.eg`,
          patientName: data.customerName,
        })
        calendarEventId = calRes.eventId
        meetLink = calRes.meetLink || null
      }
    } catch (gErr) {
      console.warn('[Booking API] Google Calendar sync note:', gErr)
    }

    // Save to Supabase appointments table
    try {
      await supabase.from('appointments').insert([
        {
          title: data.serviceName,
          notes: `العميل: ${data.customerName} | هاتف: ${data.customerPhone} | ${data.notes || ''}`,
          start_at: startAtIso,
          end_at: endAtIso,
          location: `${data.city} - ${data.address}`,
          status: 'scheduled',
          meet_link: meetLink,
          google_event_id: calendarEventId,
        },
      ])
    } catch (sbErr) {
      console.warn('[Booking API] Supabase insert note:', sbErr)
    }

    // Send immediate email notification to clinic owner via Resend
    try {
      const ownerEmail = process.env.OWNER_EMAIL || 'ibrahim.maher350@gmail.com'
      await sendEmail({
        to: ownerEmail,
        subject: `🩺 حجز تمريض جديد: ${data.serviceName} — ${data.customerName}`,
        html: `<div dir="rtl" style="font-family:sans-serif;padding:20px;background:#f8fafc;border-radius:12px;">
          <h2 style="color:#07132B;">🔔 طلب حجز تمريض جديد — نبض للتمريض المنزلي</h2>
          <p><strong>رقم الحجز:</strong> ${bookingId}</p>
          <p><strong>الخدمة:</strong> ${data.serviceName}</p>
          <p><strong>اسم العميل:</strong> ${data.customerName}</p>
          <p><strong>الهاتف:</strong> ${data.customerPhone}</p>
          <p><strong>المكان:</strong> ${data.city} - ${data.address}</p>
          <p><strong>الموعد:</strong> ${formatArabicDateWithDay(data.preferredDate)} الساعة ${formatTo12HourArabic(data.preferredTime)}</p>
          ${data.notes ? `<p><strong>الملاحظات:</strong> ${data.notes}</p>` : ''}
          ${meetLink ? `<p><a href="${meetLink}" style="display:inline-block;padding:8px 16px;background:#07132B;color:white;text-decoration:none;border-radius:8px;">رابط Google Meet</a></p>` : ''}
        </div>`,
      })
    } catch (emailErr) {
      console.warn('[Booking API] Resend email note:', emailErr)
    }

    // 2. Build WhatsApp URL
    const adminPhone = getAdminWhatsAppNumber()
    const message = buildAdminWhatsAppMessage(bookingId, data)
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`

    // 3. Pre-generate Customer Reminder Message
    const customerReminderMessage = buildCustomerReminderMessage({
      customerName: data.customerName,
      serviceName: data.serviceName,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      address: `${data.city} - ${data.address}`,
    })

    return NextResponse.json({
      success: true,
      bookingId,
      whatsappUrl,
      customerReminderMessage,
      serviceName: data.serviceName,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      formattedTime12: formatTo12HourArabic(data.preferredTime),
      dayName: formatArabicDateWithDay(data.preferredDate),
      nextFollowUpDate: data.nextFollowUpDate,
      message: 'تم استلام طلب الحجز بنجاح',
    })
  } catch (error) {
    console.error('[Booking API] Server Error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في الخادم أثناء معالجة الحجز' },
      { status: 500 }
    )
  }
}
