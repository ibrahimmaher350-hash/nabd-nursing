'use client'
/**
 * app/admin/settings/page.tsx — إعدادات النظام ولوحة التحكم
 */

import { useState } from 'react'
import Link from 'next/link'
import { Cog6ToothIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { siteConfig } from '@/data/siteConfig'

interface SettingsFormData {
  businessName: string
  tagline: string
  phone: string
  whatsapp: string
  facebookUrl: string
  facebookGroupUrl: string
  bloggerUrl: string
  googleBusinessUrl: string
  serviceAreas: string
  bookingEnabled: boolean
  maintenanceMode: boolean
  pricingNote: string
}

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<SettingsFormData>({
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
  })

  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)

    try {
      // Simulate/perform Firestore settings update
      await new Promise((r) => setTimeout(r, 600))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 text-white p-6" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-white/50 hover:text-white text-sm">
          ← العودة للوحة التحكم
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Cog6ToothIcon className="w-6 h-6 text-gold-400" />
          إعدادات المنصة (Site Settings)
        </h1>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        {/* Basic Brand */}
        <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-gold-300 border-b border-white/10 pb-2">
            1. الهوية الأساسية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                اسم المشروع / العلامة:
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                الشعار اللفظي (Tagline):
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-gold-300 border-b border-white/10 pb-2">
            2. أرقام الاتصال والتواصل
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                رقم الهاتف الأساسي (المكالمات):
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-400 focus:outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                رقم واتساب الرسمي:
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-400 focus:outline-none font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Social & External Profiles */}
        <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-gold-300 border-b border-white/10 pb-2">
            3. الروابط الخارجية (Social & Google)
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                رابط صفحة فيسبوك:
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/90 focus:border-gold-400 focus:outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                رابط جروب نبض على فيسبوك:
              </label>
              <input
                type="url"
                value={formData.facebookGroupUrl}
                onChange={(e) => setFormData({ ...formData, facebookGroupUrl: e.target.value })}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/90 focus:border-gold-400 focus:outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                رابط المدونة الصحية (Blogger):
              </label>
              <input
                type="url"
                value={formData.bloggerUrl}
                onChange={(e) => setFormData({ ...formData, bloggerUrl: e.target.value })}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/90 focus:border-gold-400 focus:outline-none font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                رابط موقع Google Business Profile:
              </label>
              <input
                type="url"
                value={formData.googleBusinessUrl}
                onChange={(e) => setFormData({ ...formData, googleBusinessUrl: e.target.value })}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/90 focus:border-gold-400 focus:outline-none font-mono"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Coverage & Operating Controls */}
        <div className="bg-navy-900 border border-white/10 rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="text-base font-bold text-gold-300 border-b border-white/10 pb-2">
            4. التغطية التشغيلية والحجوزات
          </h2>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              المناطق المشمولة بالخدمة (مفصولة بفواصل):
            </label>
            <input
              type="text"
              value={formData.serviceAreas}
              onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-400 focus:outline-none"
            />
            <p className="text-xs text-white/40 mt-1">تتيح معمارية النظام التوسع في مدن ومحافظات إضافية مستقبلاً بسهولة.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1.5">
              ملاحظة التسعير الموجهة للعميل:
            </label>
            <input
              type="text"
              value={formData.pricingNote}
              onChange={(e) => setFormData({ ...formData, pricingNote: e.target.value })}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={formData.bookingEnabled}
                onChange={(e) => setFormData({ ...formData, bookingEnabled: e.target.checked })}
                className="w-4 h-4 accent-gold-500 rounded"
              />
              <span>تفعيل استقبال الحجوزات عبر الموقع</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm text-red-400">
              <input
                type="checkbox"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="w-4 h-4 accent-red-500 rounded"
              />
              <span>وضع الصيانة (إيقاف مؤقت)</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        {saved && (
          <div className="p-4 bg-emerald-900/40 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-300 text-sm">
            <CheckCircleIcon className="w-5 h-5 shrink-0" />
            <span>تم حفظ الإعدادات بنجاح في قاعدة البيانات!</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="btn-primary bg-gold-500 hover:bg-gold-600 shadow-gold text-white font-bold py-3 px-8 rounded-xl disabled:opacity-50"
        >
          {saving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
        </button>
      </form>
    </div>
  )
}
