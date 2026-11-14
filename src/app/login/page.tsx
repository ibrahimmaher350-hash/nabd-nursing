'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  LockClosedIcon,
  KeyIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
  PhoneIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import { useSettings } from '@/context/SettingsContext'
import { siteConfig } from '@/data/siteConfig'

const AUTH_STORAGE_KEY = 'nabd_admin_auth_session'

export default function StandaloneLoginPage() {
  const router = useRouter()
  const { settings } = useSettings()

  const [username, setUsername] = useState('01001097896')
  const [pinInput, setPinInput] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect to /app
  useEffect(() => {
    try {
      const auth = localStorage.getItem(AUTH_STORAGE_KEY)
      if (auth === 'authenticated') {
        router.push('/app')
      }
    } catch {
      // Continue
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(false)
    setLoading(true)

    const correctPin = settings.adminPin?.trim() || '2026'
    const entered = pinInput.trim()

    // Accept custom admin PIN or owner phone as fallback
    if (entered === correctPin || entered === '01001097896' || entered === '2026') {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated')
      } catch {
        // Continue
      }
      router.push('/app')
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 text-white flex flex-col justify-between p-4 sm:p-6 font-cairo antialiased selection:bg-gold-500 selection:text-navy-950"
      dir="rtl"
    >
      {/* Top Brand Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <Link href="/" className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1.5">
          <ArrowRightIcon className="w-3.5 h-3.5" />
          <span>العودة للموقع الرئيسي</span>
        </Link>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          نظام محمي ومستقل
        </span>
      </div>

      {/* Login Box */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-navy-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-gold-400 shadow-xl">
              <Image src="/logo.jpg" alt="نبض" fill className="object-cover" sizes="64px" priority />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">تسجيل الدخول للنظام</h1>
              <p className="text-xs text-slate-400 mt-1">
                بوابة إدارة العيادة والتمريض المنزلي · نبض دمياط
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ExclamationCircleIcon className="w-5 h-5 shrink-0 text-rose-400" />
              <span>رمز الدخول (PIN) غير صحيح. يرجى التأكد وإعادة المحاولة.</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                رقم الهاتف أو اسم المستخدم:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="01001097896"
                className="w-full bg-slate-950 border border-slate-700 focus:border-gold-400 rounded-xl px-3.5 py-3 text-white placeholder-slate-600 focus:outline-none transition"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                رمز المرور السري (PIN):
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  autoFocus
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-gold-400 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white placeholder-slate-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  aria-label={showPin ? 'إخفاء' : 'إظهار'}
                >
                  {showPin ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 text-center">
                الرمز الافتراضي: 2026 أو رقم الهاتف المسجل
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-gold-500 bg-slate-950 border-slate-700"
                />
                <span>تذكر جلستي على هذا الجهاز</span>
              </label>

              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 font-bold"
              >
                نسيت الرمز؟
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <KeyIcon className="w-4 h-4" />
              <span>{loading ? 'جاري التحقق...' : 'دخول إلى النظام (العيادة والزيارات)'}</span>
            </button>
          </form>

          {/* Privacy Note */}
          <div className="pt-2 border-t border-slate-800/80 text-center text-[10px] text-slate-500 leading-relaxed">
            🔒 نظام سحابي خاص بإدارة التمريض المنزلي ومحمي ضد الفهرسة والوصول غير المصرح.
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-md w-full mx-auto text-center pb-2 text-[10px] text-slate-600">
        © {new Date().getFullYear()} نبض للتمريض المنزلي · جميع الحقوق محفوظة
      </div>
    </div>
  )
}
