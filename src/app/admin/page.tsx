'use client'
/**
 * app/admin/page.tsx — لوحة التحكم الشاملة والخاصة لإدارة نبض للتمريض المنزلي
 * تتيح لمدير الموقع (إبراهيم ماهر) التحكم الكامل واللحظي في:
 * 1. أسعار وتفاصيل وحالة جميع الخدمات التمريضية الـ 15
 * 2. أسعار ومخزون الأجهزة والمستلزمات الطبية (جهاز السكر فيفا تشيك + الكتالوج الطبي)
 * 3. إضافة وتعديل المستلزمات الطبية
 * 4. أرقام الاتصال وروابط الواتساب والسوشيال ميديا
 * 5. رمز PIN السري لحماية اللوحة
 * 6. الشريط الإعلاني ووضع الصيانة
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  KeyIcon,
  MegaphoneIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid'
import { useSettings, type ServiceOverride, type SupplyOverride, type CustomProduct } from '@/context/SettingsContext'
import { services } from '@/data/services'
import { FEATURED_GLUCOSE_METER, ADDITIONAL_MEDICAL_SUPPLIES } from '@/data/medicalSuppliesData'

type AdminTab = 'services' | 'supplies' | 'bookings' | 'settings'

export default function AdminMasterPage() {
  const { settings, saveSettings, loading: settingsLoading } = useSettings()

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('services')

  // Form States
  const [servicesOverrides, setServicesOverrides] = useState<Record<string, ServiceOverride>>({})
  const [suppliesOverrides, setSuppliesOverrides] = useState<Record<string, SupplyOverride>>({})
  const [customProducts, setCustomProducts] = useState<CustomProduct[]>([])
  const [phone, setPhone] = useState(settings.phone)
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp)
  const [telegramUrl, setTelegramUrl] = useState(settings.telegramUrl || '')
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl)
  const [facebookGroupUrl, setFacebookGroupUrl] = useState(settings.facebookGroupUrl)
  const [facebookProfileUrl, setFacebookProfileUrl] = useState(settings.facebookProfileUrl || '')
  const [serviceAreas, setServiceAreas] = useState(settings.serviceAreas)
  const [adminPin, setAdminPin] = useState(settings.adminPin || '2026')
  const [announcement, setAnnouncement] = useState(settings.announcement || '')
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementActive || false)
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode)

  // Search filter for services
  const [serviceSearch, setServiceSearch] = useState('')

  // UI state
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [newProductModal, setNewProductModal] = useState(false)
  const [newProdName, setNewProdName] = useState('')
  const [newProdPrice, setNewProdPrice] = useState('')
  const [newProdDesc, setNewProdDesc] = useState('')
  const [newProdCategory, setNewProdCategory] = useState('مستلزمات طبية')

  // Sync state from settings
  useEffect(() => {
    setServicesOverrides(settings.servicesOverrides || {})
    setSuppliesOverrides(settings.suppliesOverrides || {})
    setCustomProducts(settings.customProducts || [])
    setPhone(settings.phone)
    setWhatsapp(settings.whatsapp)
    setTelegramUrl(settings.telegramUrl || '')
    setFacebookUrl(settings.facebookUrl)
    setFacebookGroupUrl(settings.facebookGroupUrl)
    setFacebookProfileUrl(settings.facebookProfileUrl || '')
    setServiceAreas(settings.serviceAreas)
    setAdminPin(settings.adminPin || '2026')
    setAnnouncement(settings.announcement || '')
    setAnnouncementActive(settings.announcementActive || false)
    setMaintenanceMode(settings.maintenanceMode)
  }, [settings])

  // Save All Changes to Server & Local Cache
  const handleSaveAll = async () => {
    setSaving(true)
    setSavedSuccess(false)
    try {
      const ok = await saveSettings({
        servicesOverrides,
        suppliesOverrides,
        customProducts,
        phone,
        whatsapp,
        telegramUrl,
        facebookUrl,
        facebookGroupUrl,
        facebookProfileUrl,
        serviceAreas,
        adminPin,
        announcement,
        announcementActive,
        maintenanceMode,
      })
      if (ok !== false) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3500)
      }
    } finally {
      setSaving(false)
    }
  }

  // Update a single service override
  const updateServiceOverride = (id: string, updates: Partial<ServiceOverride>) => {
    setServicesOverrides((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      },
    }))
  }

  // Update a single supply override
  const updateSupplyOverride = (id: string, updates: Partial<SupplyOverride>) => {
    setSuppliesOverrides((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...updates,
      },
    }))
  }

  // Add custom medical product
  const handleAddProduct = () => {
    if (!newProdName.trim() || !newProdPrice.trim()) return
    const id = `custom-${Date.now()}`
    const item: CustomProduct = {
      id,
      name: newProdName.trim(),
      category: 'custom',
      categoryName: newProdCategory,
      price: newProdPrice.trim(),
      shortDesc: newProdDesc.trim() || 'متوفر للتوصيل المنزلي بدمياط',
      image: '/og-image.jpg',
      inStock: true,
    }
    setCustomProducts((prev) => [...prev, item])
    setNewProdName('')
    setNewProdPrice('')
    setNewProdDesc('')
    setNewProductModal(false)
  }

  // Delete custom product
  const handleDeleteProduct = (id: string) => {
    setCustomProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // Filtered services
  const filteredServices = services.filter(
    (s) =>
      s.name.includes(serviceSearch) ||
      s.category.includes(serviceSearch) ||
      s.shortDescription.includes(serviceSearch)
  )

  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col" dir="rtl">
      {/* ── Top Header & Global Actions ── */}
      <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white">
                لوحة التحكم الإدارية — نبض 🩺
              </h1>
              <span className="badge bg-gold-500/20 text-gold-300 text-xs px-2.5 py-0.5">
                خاصة بالمدير
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              تعديل أسعار الخدمات والمستلزمات الطبية والتواصل المباشر لحظياً في الموقع
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-xl animate-fade-in">
                <CheckCircleIcon className="w-4 h-4" />
                تم حفظ التعديلات ونشرها فوراً! ✅
              </span>
            )}

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="btn-primary py-2 px-5 text-xs sm:text-sm font-black bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 shadow-gold rounded-2xl flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <span>💾 حفظ كافة التعديلات</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
              activeTab === 'services'
                ? 'bg-gold-500 text-navy-950 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <CurrencyDollarIcon className="w-4 h-4" />
            <span>أسعار الخدمات التمريضية ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supplies')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
              activeTab === 'supplies'
                ? 'bg-gold-500 text-navy-950 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <ArchiveBoxIcon className="w-4 h-4" />
            <span>المستلزمات والأجهزة وسعر فيفا تشيك</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
              activeTab === 'settings'
                ? 'bg-gold-500 text-navy-950 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            <Cog6ToothIcon className="w-4 h-4" />
            <span>إعدادات التواصل ورمز PIN والأمان</span>
          </button>

          <Link
            href="/admin/bookings"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 bg-white/5 hover:bg-white/10 text-slate-300 transition-all"
          >
            <ClipboardDocumentListIcon className="w-4 h-4" />
            <span>سجل الحجوزات 📋</span>
          </Link>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: SERVICES PRICING & MANAGEMENT
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fade-in">
            {/* Search and Helper Info */}
            <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/15 text-gold-400 flex items-center justify-center">
                  <CurrencyDollarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-white">
                    التحكم في أسعار وتوافر الخدمات التمريضية
                  </h2>
                  <p className="text-xs text-slate-400">
                    أي سعر أو شارة أو حالة تعدلها هنا تظهر فوراً للعميل في الموقع وصفحات الحجز
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  placeholder="بحث في الخدمات..."
                  className="w-full bg-navy-950 border border-white/15 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder:text-slate-500 focus:border-gold-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Services Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => {
                const override = servicesOverrides[service.id] || {}
                const currentPrice = override.price ?? 'حسب الحالة'
                const currentPriceNote = override.priceNote ?? ''
                const currentBadge = override.badge ?? ''
                const isBooking = override.bookingEnabled !== undefined ? override.bookingEnabled : service.bookingEnabled
                const isActive = override.active !== undefined ? override.active : service.active

                return (
                  <div
                    key={service.id}
                    className={`bg-navy-900 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                      isActive ? 'border-white/10 hover:border-gold-400/40' : 'border-red-500/30 opacity-70 bg-navy-950/60'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{service.iconEmoji}</span>
                          <div>
                            <h3 className="text-sm font-black text-white line-clamp-1">
                              {service.name}
                            </h3>
                            <span className="text-[10px] text-gold-400/80 font-bold block">
                              {service.category}
                            </span>
                          </div>
                        </div>

                        {/* Active / Inactive Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {isActive ? 'ظاهرة بالموقع' : 'مخفية مؤقتاً'}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                        {service.shortDescription}
                      </p>

                      {/* Inputs Group */}
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        {/* Price Input */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            💵 السعر المعروض للعميل:
                          </label>
                          <input
                            type="text"
                            value={currentPrice}
                            onChange={(e) => updateServiceOverride(service.id, { price: e.target.value })}
                            placeholder="مثال: 150 ج.م أو حسب الحالة"
                            className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                          />
                        </div>

                        {/* Price Note Input */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            ملاحظة السعر (تظهر تحت السعر):
                          </label>
                          <input
                            type="text"
                            value={currentPriceNote}
                            onChange={(e) => updateServiceOverride(service.id, { priceNote: e.target.value })}
                            placeholder="مثال: شامل السرنجة والمستلزمات"
                            className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                          />
                        </div>

                        {/* Custom Badge Input */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            شارة خاصة (Badge):
                          </label>
                          <input
                            type="text"
                            value={currentBadge}
                            onChange={(e) => updateServiceOverride(service.id, { badge: e.target.value })}
                            placeholder="مثال: الأكثر طلباً 🏆 أو خدمة 24 ساعة"
                            className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Toggles Footer */}
                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      {/* Booking Enabled Toggle */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isBooking}
                          onChange={(e) => updateServiceOverride(service.id, { bookingEnabled: e.target.checked })}
                          className="w-4 h-4 rounded text-gold-500 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-300 font-medium">
                          تفعيل الحجز الأونلاين
                        </span>
                      </label>

                      {/* Active Toggle */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={(e) => updateServiceOverride(service.id, { active: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-300 font-medium">
                          إظهار بالموقع
                        </span>
                      </label>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: MEDICAL SUPPLIES & VIVACHEK PRICING
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'supplies' && (
          <div className="space-y-6 animate-fade-in">

            {/* ── Spotlight: VivaChek Ino Blood Glucose Meter ── */}
            <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-teal-950 border-2 border-gold-500/50 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center text-2xl shadow-inner">
                    🩸
                  </div>
                  <div>
                    <span className="badge bg-gold-500 text-navy-950 text-xs font-black px-3 py-0.5 mb-1">
                      المنتج الرئيسي الأول
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      جهاز قياس السكر فيفا تشيك إنو (VivaChek Ino)
                    </h2>
                  </div>
                </div>

                <Link
                  href="/services/medical-supplies"
                  target="_blank"
                  className="text-xs text-gold-300 hover:text-gold-200 underline hidden sm:inline"
                >
                  معاينة صفحة الجهاز ↗
                </Link>
              </div>

              {/* VivaChek Pricing Form */}
              {(() => {
                const vivaOverride = suppliesOverrides['vivachek-ino'] || {}
                const currentPrice = vivaOverride.price ?? FEATURED_GLUCOSE_METER.price
                const currentOldPrice = vivaOverride.oldPrice ?? FEATURED_GLUCOSE_METER.oldPrice ?? '350 ج.م'
                const currentBadge = vivaOverride.badge ?? FEATURED_GLUCOSE_METER.badge ?? 'عرض خاص 250ج'
                const inStock = vivaOverride.inStock !== undefined ? vivaOverride.inStock : true
                const giftStrips = vivaOverride.giftStrips ?? '10 شرائط هدية مجانية'

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Current Price */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        🏷️ السعر الحالي للبيع:
                      </label>
                      <input
                        type="text"
                        value={currentPrice}
                        onChange={(e) => updateSupplyOverride('vivachek-ino', { price: e.target.value })}
                        placeholder="250 ج.م"
                        className="w-full bg-navy-950 border border-gold-400/40 rounded-xl px-4 py-2.5 text-sm font-bold text-gold-300 focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    {/* Old Price */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        السعر قبل الخصم (لإظهار التوفير):
                      </label>
                      <input
                        type="text"
                        value={currentOldPrice}
                        onChange={(e) => updateSupplyOverride('vivachek-ino', { oldPrice: e.target.value })}
                        placeholder="350 ج.م"
                        className="w-full bg-navy-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    {/* Badge Text */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        شارة العرض المميز:
                      </label>
                      <input
                        type="text"
                        value={currentBadge}
                        onChange={(e) => updateSupplyOverride('vivachek-ino', { badge: e.target.value })}
                        placeholder="الأكثر مبيعاً 🏆 | عرض خاص 250ج"
                        className="w-full bg-navy-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    {/* Gift Strips */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        عدد الشرائط الهدية:
                      </label>
                      <input
                        type="text"
                        value={giftStrips}
                        onChange={(e) => updateSupplyOverride('vivachek-ino', { giftStrips: e.target.value })}
                        placeholder="10 شرائط هدية مجانية"
                        className="w-full bg-navy-950 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400"
                      />
                    </div>

                    {/* Stock Status Toggle */}
                    <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-4 border-t border-white/10">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inStock}
                          onChange={(e) => updateSupplyOverride('vivachek-ino', { inStock: e.target.checked })}
                          className="w-5 h-5 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-bold text-white">
                          الجهاز متوفر حالياً في المخزن وجاهز للتوصيل الفوري بدمياط
                        </span>
                      </label>

                      <span className={`text-xs font-black px-3 py-1 rounded-full ${inStock ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {inStock ? 'جاهز للتوصيل 🛵' : 'نفد مؤقتاً ❌'}
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* ── Header for Catalog Products ── */}
            <div className="flex items-center justify-between gap-3 pt-4">
              <div>
                <h3 className="text-base font-black text-white">
                  أسعار باقي الأجهزة والمستلزمات الطبية بالكتالوج
                </h3>
                <p className="text-xs text-slate-400">
                  يمكنك تعديل سعر أي جهاز أو تحديد هل هو متوفر أم نفد مخزونه
                </p>
              </div>

              <button
                onClick={() => setNewProductModal(true)}
                className="btn-primary py-2 px-4 text-xs font-bold bg-navy-800 hover:bg-navy-700 text-gold-400 border border-gold-400/30 rounded-xl flex items-center gap-1.5"
              >
                <PlusIcon className="w-4 h-4" />
                <span>إضافة مستلزم طبي جديد</span>
              </button>
            </div>

            {/* Catalog Products Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ADDITIONAL_MEDICAL_SUPPLIES.map((item) => {
                const override = suppliesOverrides[item.id] || {}
                const currentPrice = override.price ?? item.price
                const currentOldPrice = override.oldPrice ?? item.oldPrice ?? ''
                const currentBadge = override.badge ?? item.badge ?? ''
                const inStock = override.inStock !== undefined ? override.inStock : true

                return (
                  <div
                    key={item.id}
                    className={`bg-navy-900 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                      inStock ? 'border-white/10' : 'border-red-500/30 opacity-75'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-gold-400">
                          {item.categoryName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            inStock ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {inStock ? 'متوفر' : 'نفد المخزون'}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-white mb-2">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                        {item.shortDesc}
                      </p>

                      <div className="space-y-2.5 pt-3 border-t border-white/5">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            سعر البيع:
                          </label>
                          <input
                            type="text"
                            value={currentPrice}
                            onChange={(e) => updateSupplyOverride(item.id, { price: e.target.value })}
                            placeholder="مثال: 650 ج.م"
                            className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            السعر قبل الخصم (اختياري):
                          </label>
                          <input
                            type="text"
                            value={currentOldPrice}
                            onChange={(e) => updateSupplyOverride(item.id, { oldPrice: e.target.value })}
                            placeholder="مثال: 750 ج.م"
                            className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">
                            شارة العرض (Badge):
                          </label>
                          <input
                            type="text"
                            value={currentBadge}
                            onChange={(e) => updateSupplyOverride(item.id, { badge: e.target.value })}
                            placeholder="مثال: ضمان سنتين"
                            className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={inStock}
                          onChange={(e) => updateSupplyOverride(item.id, { inStock: e.target.checked })}
                          className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-slate-300 font-medium">متوفر بالمخزن</span>
                      </label>
                    </div>
                  </div>
                )
              })}

              {/* Custom Added Products */}
              {customProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-navy-900 border border-gold-400/30 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-gold-400">{prod.categoryName}</span>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="حذف المنتج"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-sm font-black text-white mb-2">{prod.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{prod.shortDesc}</p>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">السعر:</label>
                      <input
                        type="text"
                        value={prod.price}
                        onChange={(e) => {
                          const val = e.target.value
                          setCustomProducts((prev) =>
                            prev.map((p) => (p.id === prod.id ? { ...p, price: val } : p))
                          )
                        }}
                        className="w-full bg-navy-950 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: SETTINGS, CONTACT & ADMIN PIN
        ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6 animate-fade-in">

            {/* Admin PIN Passcode Security */}
            <div className="bg-navy-900 border-2 border-gold-500/30 rounded-3xl p-6 shadow-card space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center">
                  <KeyIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    رمز PIN السري لحماية لوحة التحكم
                  </h3>
                  <p className="text-xs text-slate-400">
                    هذا الرمز هو الذي يمنع أي عميل أو زائر من الدخول إلى لوحة التحكم
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  رمز PIN السري الحالي:
                </label>
                <div className="flex items-center gap-3 max-w-sm">
                  <input
                    type="text"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="2026"
                    className="flex-1 bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-4 py-2.5 text-base font-mono tracking-widest text-white text-center focus:outline-none"
                  />
                  <span className="text-xs text-slate-400">
                    احفظ هذا الرمز ولا تشاركه مع أي شخص.
                  </span>
                </div>
              </div>
            </div>

            {/* Announcement Banner */}
            <div className="bg-navy-900 border border-white/10 rounded-3xl p-6 shadow-card space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <MegaphoneIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    شريط الإعلان العلوي في الموقع (Announcement Bar)
                  </h3>
                  <p className="text-xs text-slate-400">
                    يظهر في أعلى كل صفحات الموقع لجميع الزوار للإعلان عن عروض أو تنبيهات هامة
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-300">
                    نص الإعلان:
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementActive}
                      onChange={(e) => setAnnouncementActive(e.target.checked)}
                      className="w-4 h-4 rounded text-gold-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs text-gold-300 font-bold">تفعيل وظهور الشريط</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="مثال: عرض خاص: خصم 20% على باقات كبار السن وفحص السكر هذا الأسبوع!"
                  className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Contact Phone & WhatsApp */}
            <div className="bg-navy-900 border border-white/10 rounded-3xl p-6 shadow-card space-y-4">
              <h3 className="text-base font-black text-white border-b border-white/10 pb-3">
                أرقام الاتصال والتواصل
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    رقم هاتف الاتصال المباشر:
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none text-start"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    رقم الواتساب الرسمي:
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none text-start"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  مناطق التغطية والخدمة بدمياط:
                </label>
                <input
                  type="text"
                  value={serviceAreas}
                  onChange={(e) => setServiceAreas(e.target.value)}
                  className="w-full bg-navy-950 border border-white/15 focus:border-gold-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-navy-900 border border-white/10 rounded-3xl p-6 shadow-card space-y-4">
              <h3 className="text-base font-black text-white border-b border-white/10 pb-3">
                روابط التواصل الاجتماعي
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رابط صفحة فيسبوك:
                  </label>
                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="w-full bg-navy-950 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رابط جروب فيسبوك:
                  </label>
                  <input
                    type="text"
                    value={facebookGroupUrl}
                    onChange={(e) => setFacebookGroupUrl(e.target.value)}
                    className="w-full bg-navy-950 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رابط حساب إبراهيم ماهر الشخصي:
                  </label>
                  <input
                    type="text"
                    value={facebookProfileUrl}
                    onChange={(e) => setFacebookProfileUrl(e.target.value)}
                    className="w-full bg-navy-950 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رابط تليجرام:
                  </label>
                  <input
                    type="text"
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    className="w-full bg-navy-950 border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-navy-900 border border-white/10 rounded-3xl p-6 shadow-card flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">
                  وضع الصيانة (Maintenance Mode)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  عند تفعيله، يظهر تنبيه صيانة للزوار ولا يمكن تقديم حجوزات جديدة
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="w-5 h-5 rounded text-red-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-bold text-red-300">تفعيل الصيانة</span>
              </label>
            </div>

          </div>
        )}

      </main>

      {/* ── Modal: Add New Medical Supply Product ── */}
      {newProductModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm"
          onClick={() => setNewProductModal(false)}
        >
          <div
            className="w-full max-w-md bg-navy-900 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-black text-white">إضافة مستلزم أو جهاز طبي جديد</h3>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">اسم الجهاز / المستلزم:</label>
              <input
                type="text"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="مثال: جهاز استنشاق بخار (نيبولايزر)"
                className="w-full bg-navy-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">الفئة:</label>
              <input
                type="text"
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value)}
                placeholder="أجهزة تنفسية"
                className="w-full bg-navy-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">السعر المعروض للعميل:</label>
              <input
                type="text"
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(e.target.value)}
                placeholder="مثال: 550 ج.م"
                className="w-full bg-navy-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">وصف مختصر:</label>
              <textarea
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                placeholder="وصف الجهاز ومميزاته للتوصيل بالمنزل..."
                rows={2}
                className="w-full bg-navy-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleAddProduct}
                className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-black text-xs transition-colors"
              >
                إضافة وحفظ في الكتالوج
              </button>
              <button
                onClick={() => setNewProductModal(false)}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
