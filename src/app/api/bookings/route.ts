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

    // Pre-calculated reminder message
    const reminderMsg = buildCustomerReminderMessage({
      customerName: data.customerName,
      serviceName: data.serviceName,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      address: `${data.city} - ${data.address}`,
    })

    const payload = {
      action: 'addBooking',
      bookingId,
      timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
      serviceName:      data.serviceName,
      customerName:     data.customerName,
      customerPhone:    data.customerPhone,
      whatsapp:         data.whatsapp ?? '',
      patientName:      data.patientName ?? '',
      governorate:      data.governorate,
      city:             data.city,
      address:          data.address,
      landmark:         data.landmark ?? '',
      preferredDate:    data.preferredDate,
      formattedDayDate: formattedDayDate,
      preferredTime:    data.preferredTime,
      formattedTime12:  formattedTime12,
      followUpInterval: data.followUpInterval ?? 'none',
      nextFollowUpDate: data.nextFollowUpDate ?? '',
      notes:            data.notes ?? '',
      selectedLabTests: data.selectedLabTests ?? [],
      labNotes:         data.labNotes ?? '',
      reminderMessage:  reminderMsg,
      status:           'قيد الانتظار',
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
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

    // 1. Save to Google Sheets & Google Calendar
    try {
      await saveToGoogleSheets(bookingId, data)
    } catch (sheetErr) {
      console.error('[Booking API] Google Sheets sync error:', sheetErr)
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
