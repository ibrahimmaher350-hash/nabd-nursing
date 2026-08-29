'use client'
/**
 * components/ui/SocialShareButton.tsx — نبض للتمريض المنزلي
 * زر مشاركة احترافي تفاعلي مع نافذة منبثقة للمشاركة المباشرة
 * (واتساب، فيسبوك، تليجرام، إكس، نسخ الرابط، ومعاينة حية لشكل الرابط على السوشيال ميديا)
 */

import { useState } from 'react'
import Image from 'next/image'
import {
  ShareIcon,
  XMarkIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
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
}: SocialShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Construct absolute URL
  const baseUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://nabd-nursing.vercel.app'
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`

  const cleanDescription = description.replace(/\s+/g, ' ').trim().slice(0, 160)

  // Handlers for social networks
  const handleWhatsApp = () => {
    analytics.clickWhatsApp(`${analyticsContext}_whatsapp`)
    const text = `🏥 *${title}* — نبض للتمريض المنزلي بدمياط\n\n${cleanDescription}\n\n🔗 رابط التفاصيل والطلب:\n${fullUrl}\n\n📞 للاستفسار أو الحجز: ${siteConfig.contact.phone}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const handleFacebook = () => {
    analytics.shareClick('facebook', analyticsContext)
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      '_blank',
      'width=600,height=500'
    )
  }

  const handleTelegram = () => {
    analytics.shareClick('telegram', analyticsContext)
    const text = `${title}\n${cleanDescription}`
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  const handleTwitter = () => {
    analytics.shareClick('twitter', analyticsContext)
    const text = `${title} — نبض للتمريض المنزلي بدمياط`
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
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
          text: `${title} — نبض للتمريض المنزلي بدمياط`,
          url: fullUrl,
        })
        setIsOpen(false)
      } catch {
        // User cancelled or error
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
          title="مشاركة"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in no-print"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-card-lg border border-slate-200 overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-navy-100 text-navy-800 flex items-center justify-center">
                  <ShareIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="share-modal-title" className="text-sm sm:text-base font-black text-navy-900 leading-tight">
                    مشاركة المحتوى
                  </h3>
                  <p className="text-[11px] text-medical-muted">شارك مع أسرتك أو على وسائل التواصل</p>
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

            {/* Modal Body */}
            <div className="p-5 flex flex-col gap-4">

              {/* ── Live Social Preview Card (معاينة شكل الرابط على السوشيال ميديا) ── */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-gold-500" />
                  <span>معاينة الرابط عند المشاركة على فيسبوك / واتساب:</span>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden shadow-sm">
                  {/* Preview Image */}
                  <div className="relative aspect-[1.91/1] w-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src={image}
                      alt={title}
                      width={400}
                      height={210}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 start-2 bg-navy-900/85 text-white text-[9px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      نبض للتمريض المنزلي
                    </div>
                  </div>
                  {/* Preview Metadata */}
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

              {/* ── Direct Sharing Options Grid ── */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] font-bold text-xs active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>واتساب</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleFacebook}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] font-bold text-xs active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>فيسبوك</span>
                </button>

                {/* Telegram */}
                <button
                  onClick={handleTelegram}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 text-[#229ED9] font-bold text-xs active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  <span>تليجرام</span>
                </button>

                {/* Twitter / X */}
                <button
                  onClick={handleTwitter}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs active:scale-95 transition-all"
                >
                  <span className="text-sm font-black font-sans">𝕏</span>
                  <span>منصة إكس</span>
                </button>
              </div>

              {/* Copy Direct Link */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-2xl px-3 py-2 text-xs text-slate-600 truncate font-mono text-start" dir="ltr">
                    {fullUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 rounded-2xl text-xs font-black shrink-0 transition-all flex items-center gap-1.5 active:scale-95 ${
                      copied
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-navy-800 hover:bg-navy-900 text-white shadow-sm'
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-3.5 h-3.5" />
                        <span>تم النسخ! ✅</span>
                      </>
                    ) : (
                      <>
                        <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Native Web Share Option if available */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors text-center"
                >
                  📲 خيارات مشاركة أخرى عبر هاتفك
                </button>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  )
}
