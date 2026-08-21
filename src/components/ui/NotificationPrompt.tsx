'use client'
/**
 * components/ui/NotificationPrompt.tsx — مطالبة إذن الإشعارات السياقية
 * Follows Requirement #43: Non-intrusive, contextual prompt.
 */

import { useState, useEffect } from 'react'
import { BellIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { requestNotificationPermission, getNotificationStatus } from '@/lib/firebase/fcm'
import { analytics } from '@/lib/analytics'

export default function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Only prompt if permission is 'default' and user hasn't dismissed recently
    const status = getNotificationStatus()
    const dismissed = localStorage.getItem('nabd_notif_dismissed')

    if (status === 'default' && !dismissed) {
      // Delay prompt to not be intrusive on initial page load
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAllow = async () => {
    setLoading(true)
    try {
      const token = await requestNotificationPermission()
      if (token) {
        analytics.notificationGranted()
      }
    } finally {
      setLoading(false)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('nabd_notif_dismissed', 'true')
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <div
      className="fixed bottom-20 sm:bottom-6 end-4 sm:end-6 z-50 max-w-sm bg-white border border-medical-border rounded-2xl shadow-card-lg p-4 animate-slide-up no-print"
      role="dialog"
      aria-label="تفعيل الإشعارات"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center shrink-0">
          <BellIcon className="w-5 h-5 animate-pulse-slow" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-navy-700 text-sm">تحديثات المواعيد</h4>
            <button
              onClick={handleDismiss}
              className="text-medical-muted hover:text-navy-700 p-1"
              aria-label="إغلاق"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-medical-muted mt-1 leading-relaxed">
            فعّل الإشعارات لتصلك تذكيرات مواعيدك وتحديثات الحجز والزيارات المنزلية.
          </p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleAllow}
              disabled={loading}
              className="btn-primary text-xs py-2 px-3.5 rounded-xl flex-1 justify-center"
            >
              {loading ? 'جارٍ التفعيل...' : 'تفعيل الإشعارات'}
            </button>
            <button
              onClick={handleDismiss}
              className="btn-ghost text-xs py-2 px-3 rounded-xl text-medical-muted hover:bg-medical-gray"
            >
              ليس الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
