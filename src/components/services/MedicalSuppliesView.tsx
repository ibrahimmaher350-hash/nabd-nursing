'use client'
/**
 * components/services/MedicalSuppliesView.tsx — نبض للتمريض المنزلي
 * قالب احترافي وسلس لعرض وتوفير المستلزمات والأجهزة الطبية المنزلية
 * يبرز جهاز قياس السكر فيفا تشيك (VivaChek Ino) مع كتالوج المستلزمات الإضافية
 */

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  PhoneIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  TruckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  HeartIcon,
  CubeIcon,
} from '@heroicons/react/24/solid'
import {
  FEATURED_GLUCOSE_METER,
  ADDITIONAL_MEDICAL_SUPPLIES,
  MedicalProduct,
} from '@/data/medicalSuppliesData'
import { siteConfig } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'
import SocialShareButton from '@/components/ui/SocialShareButton'
import { useSettings } from '@/context/SettingsContext'

export default function MedicalSuppliesView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showSpecs, setShowSpecs] = useState<boolean>(false)
  const [showBoxItems, setShowBoxItems] = useState<boolean>(true)
  const { settings, getSupplyPrice, getSupplyOldPrice, getSupplyBadge, isSupplyInStock } = useSettings()

  const featured = FEATURED_GLUCOSE_METER
  const featuredPrice = getSupplyPrice('vivachek-ino', featured.price)
  const featuredOldPrice = getSupplyOldPrice('vivachek-ino', featured.oldPrice)
  const featuredBadge = getSupplyBadge('vivachek-ino', featured.badge)
  const featuredInStock = isSupplyInStock('vivachek-ino', true)

  const allSupplies = [
    ...ADDITIONAL_MEDICAL_SUPPLIES,
    ...(settings.customProducts || []).map((cp) => ({
      id: cp.id,
      name: cp.name,
      nameEnglish: cp.name,
      slug: cp.id,
      category: cp.category as any,
      categoryName: cp.categoryName,
      price: cp.price,
      priceNumber: parseInt(cp.price) || 0,
      oldPrice: cp.oldPrice,
      badge: cp.badge,
      image: cp.image || '/og-image.jpg',
      shortDesc: cp.shortDesc,
      features: [],
      specifications: [],
      inTheBox: [],
      whatsappText: `السلام عليكم، محتاج اطلب ${cp.name} من نبض بدمياط.`,
    })),
  ]

  const filteredSupplies =
    selectedCategory === 'all'
      ? allSupplies
      : allSupplies.filter((item) => item.category === selectedCategory)

  const getWhatsAppOrderUrl = (message: string) => {
    const cleanPhone = (settings.whatsapp || siteConfig.contact.whatsapp).replace(/[^0-9]/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="flex flex-col gap-10 sm:gap-14">

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 🌟 1. HERO SHOWCASE: جهاز قياس السكر فيفا تشيك (VivaChek Ino) 🌟 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section
        id="vivachek-showcase"
        className="rounded-3xl bg-gradient-to-br from-white via-emerald-50/40 to-teal-50/60 border-2 border-emerald-300/80 shadow-card-lg overflow-hidden relative"
        aria-label="عرض جهاز قياس السكر فيفا تشيك"
      >
        {/* Top Promotional Ribbon */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-navy-800 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-ping" />
            <span>عرض حصري من نبض للتمريض المنزلي بدمياط 🏷️</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
              توصيل لجميع مناطق دمياط 🚚
            </span>
            <span className="bg-gold-400 text-navy-950 px-2.5 py-0.5 rounded-full text-xs font-black">
              {featuredPrice} فقط
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ── Right Column (Desktop) / Top: Product Visual & Trust Cards ── */}
            <div className="lg:col-span-5 flex flex-col items-center gap-5">
              {/* Product Image Frame */}
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-white border border-emerald-200 shadow-md p-4 group">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    width={450}
                    height={450}
                    className="object-contain w-full h-full p-2 group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                  {/* Floating Badge */}
                  <div className="absolute top-3 start-3">
                    <span className="bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                      {featuredBadge}
                    </span>
                  </div>
                  {/* Warranty Badge */}
                  <div className="absolute bottom-3 end-3">
                    <span className="bg-navy-900/90 text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-xl shadow backdrop-blur-sm">
                      ضمان 5 سنوات 🛡️
                    </span>
                  </div>
                </div>

                {/* Price Display Strip */}
                <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-medical-muted block font-medium">سعر العرض الحصري:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                        {featuredPrice}
                      </span>
                      {featuredOldPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          {featuredOldPrice}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full inline-block">
                      مع 10 شرايط هدية 🎁
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Guarantees (دمياط) */}
              <div className="w-full max-w-sm grid grid-cols-2 gap-2.5 text-center text-xs">
                <div className="p-3 rounded-2xl bg-white border border-emerald-200/80 shadow-sm">
                  <TruckIcon className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="font-bold text-navy-800">توصيل لحد باب بيتك</p>
                  <p className="text-[10px] text-medical-muted">داخل دمياط ومحيطها</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-emerald-200/80 shadow-sm">
                  <ShieldCheckIcon className="w-5 h-5 text-gold-500 mx-auto mb-1" />
                  <p className="font-bold text-navy-800">تدريب عملي مجاني</p>
                  <p className="text-[10px] text-medical-muted">ممرض يشرحلك الاستخدام</p>
                </div>
              </div>
            </div>

            {/* ── Left Column (Desktop) / Details: Information & Fast Ordering ── */}
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Headings */}
              <div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 rounded-full px-3.5 py-1 text-xs font-bold mb-2.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>أدق وأسهل جهاز منزلي للاطمئنان على السكر</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy-900 leading-tight">
                  {featured.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {featured.nameEnglish}
                </p>
                <p className="text-sm sm:text-base text-medical-muted leading-relaxed mt-3">
                  {featured.shortDesc}
                </p>
              </div>

              {/* 6 Key Feature Cards */}
              <div>
                <h3 className="text-sm font-black text-navy-800 mb-3 flex items-center gap-1.5">
                  <span>✨</span>
                  <span>أهم ميزات جهاز فيفا تشيك إنو:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {featured.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all flex items-start gap-3 text-start"
                    >
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg shrink-0 shadow-sm">
                        {feat.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-navy-900 leading-snug">
                          {feat.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-medical-muted leading-relaxed mt-0.5">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's In The Box Accordion */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <button
                  onClick={() => setShowBoxItems(!showBoxItems)}
                  className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-navy-800"
                  aria-expanded={showBoxItems}
                >
                  <span className="flex items-center gap-2">
                    <CubeIcon className="w-4 h-4 text-emerald-600" />
                    <span>محتويات العلبة الكاملة (ماذا تستلم مع العرض؟)</span>
                  </span>
                  {showBoxItems ? (
                    <ChevronUpIcon className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                {showBoxItems && (
                  <ul className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {featured.inTheBox.map((boxItem, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{boxItem}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Technical Specifications Accordion */}
              <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <button
                  onClick={() => setShowSpecs(!showSpecs)}
                  className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-navy-800"
                  aria-expanded={showSpecs}
                >
                  <span className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-navy-600" />
                    <span>المواصفات الفنية والاعتمادات الدولية (FDA / CE)</span>
                  </span>
                  {showSpecs ? (
                    <ChevronUpIcon className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                {showSpecs && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
                    {featured.specifications.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between py-1 border-b border-slate-50">
                        <span className="text-medical-muted font-medium">{spec.label}:</span>
                        <span className="text-navy-900 font-bold">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Immediate Order Actions ── */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-md">
                <div>
                  <p className="text-sm font-black text-gold-300">
                    اطلب الجهاز الآن بسعر {featuredPrice} {featuredOldPrice ? `(بدلاً من ${featuredOldPrice})` : ''} مع 10 شرائط هدية
                  </p>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    الدفع عند الاستلام مع إمكانية تجربة وتشغيل الجهاز أمامك فوراً بدمياط.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                  <a
                    href={getWhatsAppOrderUrl(`السلام عليكم، محتاج أطلب جهاز قياس السكر فيفا تشيك بسعر ${featuredPrice} مع الـ 10 شرايط من نبض بدمياط.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp text-xs sm:text-sm py-2.5 px-4 flex-1 sm:flex-none justify-center shadow-lg"
                    onClick={() => analytics.clickWhatsApp('vivachek_order')}
                  >
                    <span>اطلب عبر واتساب 📲</span>
                  </a>

                  <a
                    href={siteConfig.contact.callUrl}
                    className="btn-call text-xs sm:text-sm py-2.5 px-3 flex-1 sm:flex-none justify-center"
                    onClick={() => analytics.clickCall('vivachek_order')}
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>01001097896</span>
                  </a>

                  <SocialShareButton
                    title="جهاز قياس السكر في الدم فيفا تشيك (VivaChek Ino)"
                    description="سهولة في الاستخدام بدون ألم 💯 ونتائج مضمونة وسريعة خلال 5 ثوانٍ فقط!"
                    url="/services/medical-supplies#vivachek-ino"
                    image="/vivachek.png"
                    variant="button"
                    buttonText="مشاركة العرض 📢"
                    className="bg-white/15 hover:bg-white/25 text-white border-white/30 text-xs sm:text-sm py-2.5 px-3 flex-1 sm:flex-none justify-center"
                    detailsList={[
                      'نتيجة سريعة ودقيقة خلال 5 ثوانٍ فقط ⏱️',
                      'بدون كود (No Coding) وبدون ألم مع أصغر نقطة دم 🩸',
                      'ذاكرة ذكية تراجع متوسطات حتى 90 يوماً 📉',
                      'تنبيهات عند انتهاء صلاحية شرائط الاختبار 📥',
                      'خاصية تصنيف الفحص قبل أو بعد الوجبات 🍽️',
                      'منامس للمنزل ولأطقم التمريض لفحص سكر الدم الطارئ 👨‍⚕️',
                      'ضمان 5 سنوات معتمد وشهادات FDA و CE 🛡️',
                    ]}
                    priceTag={`${featuredPrice} ${featuredOldPrice ? `(بدلاً من ${featuredOldPrice})` : ''} مع 10 شرائط هدية وقلم وخز متطور وإبر 🎁`}
                    deliveryNote="توصيل منزلي سريع لجميع مناطق دمياط مع شرح وتدريب عملي مجاني على الاستخدام بواسطة ممرض نبض."
                    analyticsContext="vivachek_hero_share"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* 🏥 2. MEDICAL SUPPLIES CATALOG: باقي الأجهزة والمستلزمات 🏥 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section aria-labelledby="catalog-heading">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-navy-50 border border-navy-100 rounded-full px-4 py-1 mb-2.5">
            <span className="text-xs font-bold text-navy-700">تجهيزات طبية منزلية كاملة</span>
          </div>
          <h2 id="catalog-heading" className="section-title">
            كتالوج المستلزمات والأجهزة الطبية بدمياط
          </h2>
          <p className="section-subtitle">
            نوفر لمرضانا في دمياط كافة الأجهزة الطبية المنزلية وشرائط القياس وغيارات الجروح المعقمة مع توصيل وشرح منزلي.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {[
            { id: 'all', label: 'جميع المستلزمات' },
            { id: 'glucose', label: 'شرائط وأجهزة السكر 🩸' },
            { id: 'pressure', label: 'أجهزة الضغط 💓' },
            { id: 'oximeter', label: 'أجهزة الأكسجين 🫁' },
            { id: 'wound_care', label: 'غيارات الجروح 🩹' },
            { id: 'beds', label: 'مراتب كبار السن 🛏️' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-navy-800 text-white shadow-md'
                  : 'bg-white text-navy-700 hover:bg-slate-100 border border-medical-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSupplies.map((item) => {
            const itemPrice = getSupplyPrice(item.id, item.price)
            const itemOldPrice = getSupplyOldPrice(item.id, item.oldPrice)
            const itemBadge = getSupplyBadge(item.id, item.badge)
            const inStock = isSupplyInStock(item.id, true)

            return (
              <article
                key={item.id}
                id={item.id}
                className={`nabd-card p-5 flex flex-col justify-between border border-medical-border bg-white hover:border-navy-300 transition-all group scroll-mt-24 ${
                  !inStock ? 'opacity-75 bg-slate-50' : ''
                }`}
              >
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="badge-navy text-[11px] font-bold">
                      {item.categoryName}
                    </span>
                    {itemBadge && (
                      <span className="badge-gold text-[10px] font-black">
                        {itemBadge}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-navy-800 leading-snug group-hover:text-navy-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mb-3">
                    {item.nameEnglish}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-medical-muted leading-relaxed mb-4">
                    {item.shortDesc}
                  </p>

                  {/* Features Pill */}
                  <div className="flex flex-col gap-1.5 mb-5">
                    {item.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <span className="shrink-0">{f.icon}</span>
                        <span className="font-semibold truncate">{f.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Price + Order & Share Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-medical-muted block">السعر:</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-navy-800">{itemPrice}</span>
                      {itemOldPrice && (
                        <span className="text-[10px] text-slate-400 line-through">{itemOldPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <SocialShareButton
                      title={`${item.name} — نبض للتمريض المنزلي بدمياط`}
                      description={item.shortDesc}
                      url={`/services/medical-supplies#${item.id}`}
                      image={item.image}
                      variant="icon"
                      className="w-8 h-8"
                      detailsList={item.features.map((f) => `${f.title}: ${f.desc}`)}
                      priceTag={itemPrice}
                      deliveryNote="توصيل منزلي سريع لجميع مناطق دمياط مع ممرض متخصص."
                      analyticsContext={`catalog_${item.id}`}
                    />
                    {inStock ? (
                      <a
                        href={getWhatsAppOrderUrl(item.whatsappText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp text-xs py-2 px-3 shadow-sm inline-flex items-center gap-1"
                        onClick={() => analytics.clickWhatsApp(`order_${item.id}`)}
                      >
                        <span>طلب</span>
                      </a>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                        نفد مؤقتاً
                      </span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* ── Custom Supplies Request Card ── */}
        <div className="mt-8 rounded-3xl bg-slate-900 text-white p-6 sm:p-8 text-center flex flex-col items-center gap-4">
          <HeartIcon className="w-10 h-10 text-gold-400" />
          <div className="max-w-xl">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              محتاج جهاز أو مستلزم طبي مش موجود في القائمة؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              فريق نبض بدمياط يساعدك في توفير أي مستلزم طبي أو جهاز رعاية منزلية أو غيار متخصص وتوصيله وشرحه بالمنزل.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href={getWhatsAppOrderUrl('السلام عليكم، محتاج استفسر عن توفير مستلزم أو جهاز طبي خاص بدمياط.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-xs sm:text-sm py-2.5 px-6"
            >
              استفسر عن أي مستلزم عبر واتساب 💬
            </a>
            <a
              href={siteConfig.contact.callUrl}
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-bold rounded-2xl px-5 py-2 text-xs sm:text-sm hover:bg-white/10 transition-colors"
            >
              <PhoneIcon className="w-4 h-4" />
              <span>اتصل بنا مباشرة</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
