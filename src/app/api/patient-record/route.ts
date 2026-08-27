/**
 * app/api/patient-record/route.ts — نبض للتمريض المنزلي
 * GET /api/patient-record?phone=...
 * استعلام المريض عن ملفه الطبي وقياساته الحيوية ومواعيده المسجلة في Google Sheets
 */

import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbxBR6fJaq5_9yOGh7ISdEOL1tQNvmyf6R0HQ6m2cIU4mlQjNUoLYNxs2QPjCeoRamJSpg/exec'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone') || ''
    const bookingId = searchParams.get('bookingId') || ''

    const cleanQuery = (phone || bookingId).trim()
    if (!cleanQuery) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال رقم الهاتف أو رقم الحجز' },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_SHEETS_URL
    const queryUrl = `${webhookUrl}?action=getPatient&phone=${encodeURIComponent(cleanQuery)}&bookingId=${encodeURIComponent(cleanQuery)}`

    try {
      const res = await fetch(queryUrl, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' },
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success && data.patient) {
          return NextResponse.json({
            success: true,
            patient: data.patient,
          })
        }
      }
    } catch (fetchErr) {
      console.warn('[Patient Record API] Fetch from Google Sheets failed:', fetchErr)
    }

    // Fallback: If not found in Google Sheets yet (or first time testing)
    // Check if it's the admin/test phone
    if (cleanQuery.includes('01001097896') || cleanQuery.includes('01099667065')) {
      return NextResponse.json({
        success: true,
        patient: {
          name: 'عميل نبض التجريبي',
          customerName: 'إبراهيم ماهر',
          phone: cleanQuery,
          city: 'دمياط',
          address: 'دمياط، مصر',
          nextVisit: '2026-09-01 10:00 صباحاً',
          nextService: 'تركيب المحاليل الوريدية',
          vitals: {
            bloodPressure: '120/80',
            bloodSugar: '115 mg/dL',
            oxygen: '98%',
            pulse: '74 bpm',
            temperature: '36.8 °C',
          },
          medicalFilesUrl: 'https://drive.google.com',
          medicalNotes: 'الحالة مستقرة تماماً، مع التوصية بالاستمرار على السوائل والتغذية السليمة.',
          visits: [
            {
              bookingId: 'NB-DEMO1',
              serviceName: 'تركيب المحاليل الوريدية',
              date: '2026-08-27',
              time: '10:00',
              status: 'مكتملة',
              city: 'دمياط',
            },
          ],
        },
      })
    }

    return NextResponse.json({
      success: false,
      message: 'لم يتم العثور على ملف طبي مسجل بهذا الرقم. تأكد من إدخال نفس الرقم المسجل بالحجز.',
    })
  } catch (error) {
    console.error('[Patient Record API] Error:', error)
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء جلب الملف الطبي' },
      { status: 500 }
    )
  }
}
