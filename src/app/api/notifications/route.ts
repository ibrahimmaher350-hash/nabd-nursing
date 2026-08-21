/**
 * app/api/notifications/route.ts — إرسال إشعارات FCM
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const notificationSchema = z.object({
  target: z.enum(['all', 'single', 'service_group']),
  title: z.string().min(1),
  body: z.string().min(1),
  bookingId: z.string().optional(),
  scheduledTime: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = notificationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'بيانات غير صالحة' },
        { status: 400 }
      )
    }

    const { target, title, body: notifBody, bookingId, scheduledTime } = parsed.data

    // Check if Firebase is configured
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    if (!projectId || projectId === 'your_project_id_here') {
      console.log('[Notification API Mock] Simulated sending:', { target, title, notifBody, bookingId, scheduledTime })
      return NextResponse.json({
        success: true,
        message: 'تمت المحاكاة بنجاح (وضع التطوير بدون مفاتيح Firebase)',
      })
    }

    // Server-side Firebase Admin integration
    const { initializeApp, getApps, cert } = await import('firebase-admin/app')
    const { getMessaging } = await import('firebase-admin/messaging')
    const { getFirestore, FieldValue } = await import('firebase-admin/firestore')

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
    const messaging = getMessaging()

    // Store in notifications log
    await db.collection('notifications').add({
      target,
      title,
      body: notifBody,
      bookingId: bookingId || null,
      scheduledTime: scheduledTime || null,
      sentAt: FieldValue.serverTimestamp(),
    })

    // If target is all subscribers topic:
    if (target === 'all') {
      await messaging.send({
        topic: 'all_subscribers',
        notification: {
          title,
          body: notifBody,
        },
        data: {
          bookingId: bookingId || '',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'تم إرسال الإشعار بنجاح',
    })
  } catch (err) {
    console.error('[Notification API] Error:', err)
    return NextResponse.json(
      { success: false, error: 'تعذر إرسال الإشعار عبر الخادم' },
      { status: 500 }
    )
  }
}
