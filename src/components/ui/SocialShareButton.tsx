'use client'
/**
 * components/ui/SocialShareButton.tsx — نبض للتمريض المنزلي
 * زر مشاركة احترافي مع كتابة التفاصيل والمميزات تلقائياً بشكل تسويقي متكامل
 * يدعم: واتساب، فيسبوك (مع نسخ البوست تلقائياً)، تليجرام، إكس، نسخ البوست الكامل، ومعاينة حية
 */

import { useState } from 'react'
import Image from 'next/image'
import {
  ShareIcon,
  XMarkIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/solid'
import { siteConfig } from '@/data/siteConfig'
import { analytics } from '@/lib/analytics'

interface SocialShareButtonProps {
  title: string
  description: string
  url: string // relative or absolute
  image?: string // e.g. '/vivachek.png' or '/og-image.jpg'
  variant?: 'button' | 'icon' | 'compact' | 'ghost'
  buttonText?: string
  className?: string
  analyticsContext?: string

  // ── Rich Automatic Details for Social Sharing ──
  detailsList?: string[] // Bullet points of features / deliverables
  priceTag?: string // e.g. "250 ج.م فقط مع 10 شرائط هدية 🎁"
  deliveryNote?: string // Delivery / home nursing notes
  fullCustomText?: string // Optional override for exact custom text
}

export default function SocialShareButton({
  title,
  description,
  url,
  image = '/og-image.jpg',
  variant = 'button',
  buttonText = 'مشاركة',
  className = '',
  analyticsContext = 'service_share',
  detailsList,
  priceTag,
  deliveryNote,
  fullCustomText,
}: SocialShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedPost, setCopiedPost] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [fbCopiedNotice, setFbCopiedNotice] = useState(false)

  // Construct absolute URL
  const baseUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://nabd-nursing.vercel.app'
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`

  const cleanDescription = description.replace(/\s+/g, ' ').trim()

  // ── Automatic Professional Marketing Post Generator ───────────
  const generateMarketingPost = (): string => {
    if (fullCustomText) return fullCustomText

    let text = `🏥 *${title}*\nنبض للتمريض المنزلي — دمياط\n`

    if (cleanDescription) {
      text += `\n${cleanDescription}\n`
    }

    if (priceTag) {
      text += `\n🏷️ *السعر والعرض:* ${priceTag}\n`
    }

    if (detailsList && detailsList.length > 0) {
      text += `\n✨ *أبرز المميزات والتفاصيل:*\n`
      detailsList.slice(0, 6).forEach((item) => {
        text += `• ${item}\n`
      })
    }

    const delivery =
      deliveryNote || 'توصيل سريع ورعاية تمريضية منزلية متخصصة لجميع مناطق دمياط.'
    text += `\n🛵 *التوصيل والرعاية المنزلية:* ${delivery}\n`

    text += `\n🔗 *رابط التفاصيل والطلب المباشر:*\n${fullUrl}\n`
    text += `\n🩺 *نبض للتمريض المنزلي — دمياط*`
    text += `\n📞 هاتف مباشر: ${siteConfig.contact.phone}`
    text += `\n💬 واتساب مباشر: https://wa.me/${siteConfig.contact.whatsapp}`

    return text
  }

  const fullPost = generateMarketingPost()

  // ── Handlers for Sharing ──────────────────────────────────────
  const handleWhatsApp = () => {
    analytics.clickWhatsApp(`${analyticsContext}_whatsapp`)
    window.open(`https://wa.me/?text=${encodeURIComponent(fullPost)}`, '_blank')
  }

  const handleFacebook = async () => {
    analytics.shareClick('facebook', analyticsContext)

    // Copy full post to clipboard automatically so user can simply paste into Facebook!
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullPost)
        setFbCopiedNotice(true)
        setTimeout(() => setFbCopiedNotice(false), 4000)
      }
    } catch {
      // Fallback
    }

    // Open Facebook Sharer
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      '_blank',
      'width=600,height=600'
    )
  }

  const handleTelegram = () => {
    analytics.shareClick('telegram', analyticsContext)
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(fullPost)}`,
      '_blank'
    )
  }

  const handleTwitter = () => {
    analytics.shareClick('twitter', analyticsContext)
    const shortText = `${title} — نبض للتمريض المنزلي بدمياط\n${cleanDescription.slice(0, 100)}...`
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shortText)}`,
      '_blank'
    )
  }

  const handleCopyPost = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullPost)
        setCopiedPost(true)
        setTimeout(() => setCopiedPost(false), 2500)
      }
    } catch {
      // Fallback
    }
  }

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2500)
      }
    } catch {
      // Fallback
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: fullPost,
          url: fullUrl,
        })
        setIsOpen(false)
      } catch {
        // User cancelled
      }
    } else {
      setIsOpen(true)
    }
  }

  return (
    <>
      {/* ── Trigger Button Variants ── */}
      {variant === 'icon' ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`w-9 h-9 rounded-full bg-white/90 hover:bg-white text-navy-700 hover:text-navy-900 border border-slate-200 shadow-sm flex items-center justify-center transition-all active:scale-95 ${className}`}
          aria-label={`مشاركة ${title}`}
          title="مشاركة التفاصيل"
        >
          <ShareIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : variant === 'compact' ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-navy-800 border border-slate-200 transition-all active:scale-95 ${className}`}
          aria-label={`مشاركة ${title}`}
        >
          <ShareIcon className="w-3.5 h-3.5 text-navy-600" aria-hidden="true" />
          <span>{buttonText}</span>
        </button>
      ) : variant === 'ghost' ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center gap-1.5 text-xs font-bold text-navy-700 hover:text-navy-950 underline decoration-dotted transition-all ${className}`}
          aria-label={`مشاركة ${title}`}
        >
          <ShareIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{buttonText}</span>
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 text-navy-800 border border-slate-300 shadow-sm active:scale-95 transition-all ${className}`}
          aria-label={`مشاركة ${title}`}
        >
          <ShareIcon className="w-4 h-4 text-navy-600" aria-hidden="true" />
          <span>{buttonText}</span>
        </button>
      )}

      {/* ── Share Modal / Dialog ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in no-print"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-card-lg border border-slate-200 overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-navy-100 text-navy-800 flex items-center justify-center shadow-xs">
                  <ShareIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="share-modal-title" className="text-sm sm:text-base font-black text-navy-900 leading-tight">
                    مشاركة المحتوى مع التفاصيل الكاملة
                  </h3>
                  <p className="text-[11px] text-medical-muted">
                    تتم كتابة التفاصيل والمميزات وروابط الطلب تلقائياً
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="إغلاق النافذة"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">

              {/* Facebook Auto-Copy Notice */}
              {fbCopiedNotice && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-bounce-in">
                  <CheckIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تم نسخ المنشور التسويقي بالتفاصيل تلقائياً! يمكنك لصقه (Paste) داخل منشور فيسبوك الآن 📋✅</span>
                </div>
              )}

              {/* ── Social Card Live Preview ── */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-gold-500" />
                  <span>معاينة الرابط عند المشاركة (Facebook / WhatsApp Preview):</span>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden shadow-sm">
                  <div className="relative aspect-[1.91/1] w-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src={image}
                      alt={title}
                      width={450}
                      height={235}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 start-2 bg-navy-900/85 text-white text-[9px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                      نبض للتمريض المنزلي
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                      nabd-nursing.vercel.app
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-navy-900 line-clamp-1 mt-0.5">
                      {title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {cleanDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Auto-Written Marketing Post Preview ── */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <span>📝</span>
                    <span>النص الكامل المكتوب تلقائياً مع المشاركة:</span>
                  </span>
                  <button
                    onClick={handleCopyPost}
                    className="text-[11px] font-black text-navy-800 hover:text-navy-950 underline flex items-center gap-1"
                  >
                    {copiedPost ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckIcon className="w-3.5 h-3.5" />
                        تم نسخ البوست!
                      </span>
                    ) : (
                      <>
                        <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                        <span>نسخ النص كاملاً</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans max-h-36 overflow-y-auto whitespace-pre-line text-start selection:bg-gold-200">
                  {fullPost}
                </div>
              </div>

              {/* ── One-Click Direct Sharing Actions ── */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 block mb-2">
                  اختر وسيلة المشاركة:
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-bold text-xs active:scale-95 transition-all shadow-xs"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>واتساب (نص كامل)</span>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={handleFacebook}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] font-bold text-xs active:scale-95 transition-all shadow-xs"
                    title="مشاركة على فيسبوك مع نسخ النص التسويقي تلقائياً للصقه"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>فيسبوك (مع نسخ النص)</span>
                  </button>

                  {/* Telegram */}
                  <button
                    onClick={handleTelegram}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] font-bold text-xs active:scale-95 transition-all shadow-xs"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                    </svg>
                    <span>تليجرام</span>
                  </button>

                  {/* Twitter / X */}
                  <button
                    onClick={handleTwitter}
                    className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs active:scale-95 transition-all shadow-xs"
                  >
                    <span className="text-sm font-black font-sans">𝕏</span>
                    <span>منصة إكس</span>
                  </button>
                </div>
              </div>

              {/* ── Copy Options ── */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handleCopyPost}
                  className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm ${
                    copiedPost
                      ? 'bg-emerald-600 text-white'
                      : 'bg-navy-900 hover:bg-navy-800 text-white'
                  }`}
                >
                  {copiedPost ? (
                    <>
                      <CheckIcon className="w-4 h-4" />
                      <span>تم نسخ البوست كاملاً! ✅</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentCheckIcon className="w-4 h-4 text-gold-400" />
                      <span>نسخ البوست التسويقي كاملاً 📋</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyLink}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                    copiedLink
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5" />
                      <span>تم نسخ الرابط!</span>
                    </>
                  ) : (
                    <>
                      <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                      <span>نسخ الرابط فقط</span>
                    </>
                  )}
                </button>
              </div>

              {/* Native Mobile Share if supported */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 transition-colors text-center"
                >
                  📲 مشاركة عبر تطبيقات الهاتف الأخرى
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  )
}
