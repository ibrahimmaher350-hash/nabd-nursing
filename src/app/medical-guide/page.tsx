'use client'
/**
 * app/medical-guide/page.tsx — نبض للتمريض المنزلي
 * الدليل الطبي الموحد: يدمج دليل الإسعافات الأولية والروشتات الطبية في تبويب واحد بشكل منفصل وسلس
 */

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingActions from '@/components/layout/FloatingActions'
import FirstAidSection from '@/components/medical-guide/FirstAidSection'
import PrescriptionsSection from '@/components/medical-guide/PrescriptionsSection'
import {
  SparklesIcon,
  ArrowRightIcon,
  PhoneIcon,
} from '@heroicons/react/24/solid'
import { siteConfig } from '@/data/siteConfig'

function MedicalGuideContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'prescriptions' ? 'prescriptions' : 'first-aid'
  const [activeTab, setActiveTab] = useState<'first-aid' | 'prescriptions'>(initialTab)

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam === 'prescriptions') {
      setActiveTab('prescriptions')
    } else if (tabParam === 'first-aid') {
      setActiveTab('first-aid')
    }
  }, [searchParams])

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900 pb-28 sm:pb-20">
        {/* ── Main Unified Hero Banner ── */}
        <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-800 text-white pt-6 pb-12 sm:pt-10 sm:pb-16 px-4">
          <div className="section-container max-w-4xl text-center">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-xl transition-all group"
              >
                <ArrowRightIcon className="w-4 h-4 text-gold-400 transition-transform group-hover:translate-x-1" />
                <span>العودة للرئيسية</span>
              </Link>
              <Link
                href="/services"
                className="text-xs font-bold text-gold-300 hover:text-gold-200 hover:underline"
              >
                خدمات التمريض المنزلي 🩺
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-4 text-xs font-bold text-gold-300 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-gold-400" />
              <span>الدليل الطبي والإسعافي الشامل — نبض للتمريض المنزلي بدمياط</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
              دليل <span className="text-red-400">الإسعافات الأولية</span> و<span className="text-gold-400">الروشتات الطبية</span> 🚑💊
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto mb-8">
              مرجعك الإكلينيكي السريع: خطوات الإسعافات الأولية الطارئة لإنقاذ المريض، وأهم الروشتات الطبية للأعراض الشائعة وطرق العلاج والتمريض المنزلي.
            </p>

            {/* ── Tabs Switcher (بشكل منفصل وفاخر) ── */}
            <div className="flex justify-center">
              <div className="bg-navy-950/80 p-1.5 rounded-2xl border-2 border-white/15 shadow-2xl flex items-center gap-2 max-w-md w-full">
                <button
                  type="button"
                  onClick={() => setActiveTab('first-aid')}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'first-aid'
                      ? 'bg-red-600 text-white shadow-lg scale-100'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>🚑 الإسعافات الأولية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('prescriptions')}
                  className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'prescriptions'
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 shadow-lg scale-100 font-extrabold'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>💊 الروشتات والأدوية</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Active Tab Content ── */}
        <section className="section-container max-w-5xl -mt-6 sm:-mt-8 px-4">
          {activeTab === 'first-aid' ? (
            <FirstAidSection />
          ) : (
            <PrescriptionsSection />
          )}

          {/* Medical Disclaimer */}
          <div className="mt-12 bg-navy-50 border border-navy-100 rounded-3xl p-6 text-center text-xs text-medical-muted leading-relaxed">
            <p className="font-black text-navy-800 mb-1 text-sm">
              ⚕️ إخلاء مسؤولية طبي من فريق نبض للتمريض المنزلي
            </p>
            <p className="max-w-2xl mx-auto">
              هذا الدليل تم إعداده بهدف التوعية وتقديم الإسعافات الأولية السريعة والتعريف بالروشتات الدوائية الشائعة، ولا يُغني عن استشارة الطبيب المختص أو الاتصال بالإسعاف 123 في الحالات الحرجة والمهددة للحياة.
            </p>
            <div className="mt-3 flex items-center justify-center gap-3">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="text-navy-700 font-bold inline-flex items-center gap-1 hover:underline"
              >
                <PhoneIcon className="w-3.5 h-3.5 text-gold-600" />
                <span>طوارئ نبض: {siteConfig.contact.phone}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}

export default function MedicalGuidePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-navy-800 font-bold">جاري تحميل الدليل الطبي...</div>}>
      <MedicalGuideContent />
    </Suspense>
  )
}
