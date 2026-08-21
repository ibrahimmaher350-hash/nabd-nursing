/**
 * lib/firebase/config.ts — نبض للتمريض المنزلي
 * Firebase client initialization — uses env vars with build-time fallback.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAuth, type Auth } from 'firebase/auth'
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging'
import { getAnalytics, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyPlaceholderKeyForBuildTime12345',
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nabd-nursing.firebaseapp.com',
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nabd-nursing',
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'nabd-nursing.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef123456',
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Singleton pattern — prevent re-initialization on hot reload
let app: FirebaseApp
let db: Firestore
let auth: Auth

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  db = getFirestore(app)
  auth = getAuth(app)
} catch (err) {
  console.warn('[Firebase] Client initialized in fallback mode:', err)
  app = {} as FirebaseApp
  db = {} as Firestore
  auth = {} as Auth
}

// Analytics — browser only
let analytics: Analytics | null = null
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID) {
  try {
    analytics = getAnalytics(app)
  } catch {
    // Ignore analytics initialization error in unsupported environments
  }
}

// FCM — browser only, check support
let messaging: Messaging | null = null
const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') return null
  try {
    const supported = await isSupported()
    if (!supported) return null
    if (!messaging) messaging = getMessaging(app)
    return messaging
  } catch {
    return null
  }
}

export { app, db, auth, analytics, getMessagingInstance }
export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? ''
