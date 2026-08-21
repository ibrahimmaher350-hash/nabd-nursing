/**
 * app/api/bookings/route.ts — نبض للتمريض المنزلي
 * POST /api/bookings — Create a new booking in Firestore.
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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

export async function POST(request: NextRequest) {
  try {
    // Parse body
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

    // Check if Firebase is configured
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    if (!projectId || projectId === 'your_project_id_here') {
      // Firebase not configured yet — return mock success for development
      const mockId = `NB-${Date.now().toString(36).toUpperCase()}`
      console.log('[Booking API] Firebase not configured. Mock booking:', mockId)
      return NextResponse.json({
        success: true,
        bookingId: mockId,
        message: 'تم استلام الطلب (وضع التطوير)',
      })
    }

    // Dynamic import Firebase Admin (server-side only)
    const { initializeApp, getApps, cert } = await import('firebase-admin/app')
    const { getFirestore, FieldValue } = await import('firebase-admin/firestore')

    // Init admin
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

    // Generate booking ID
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    const bookingId = `NB-${timestamp}${random}`

    // Save to Firestore
    await db.collection('bookings').add({
      bookingId,
      ...data,
      status: 'pending',
      source: 'website',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'تم استلام طلب الحجز. سيتم التواصل معك لتأكيد الموعد.',
    })
  } catch (error) {
    console.error('[Booking API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'تعذر إرسال الطلب حالياً. حاول مرة أخرى أو تواصل معنا عبر واتساب.',
      },
      { status: 500 }
    )
  }
}
