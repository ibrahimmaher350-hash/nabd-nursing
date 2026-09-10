'use client'
/**
 * components/ui/SectionIndicator.tsx — نبض للتمريض المنزلي
 * CareHub-style floating vertical section navigator on the right side of the screen
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SectionItem {
  id: string
  label: string
}

const sections: SectionItem[] = [
  { id: 'hero', label: 'الرئيسية' },
  { id: 'ai-consultant', label: 'المساعد الذكي' },
  { id: 'services', label: 'خدماتنا' },
  { id: 'why-nabd', label: 'لماذا نبض' },
  { id: 'how-it-works', label: 'كيف نعمل' },
  { id: 'testimonials', label: 'آراء المرضى' },
]

export default function SectionIndicator() {
  const [activeSection, setActiveSection] = useState('hero')
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)

      const scrollPosition = window.scrollY + window.innerHeight / 3
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id)
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (!isVisible) return null

  return (
    <div
      className="hidden xl:flex fixed end-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full py-4 px-2 shadow-[0_8px_30px_rgba(11,27,61,0.12)] transition-all duration-300 no-print"
      dir="rtl"
      role="navigation"
      aria-label="مؤشر أقسام الصفحة"
    >
      {sections.map((sec, index) => {
        const isActive = activeSection === sec.id
        const isHovered = hoveredSection === sec.id

        return (
          <div
            key={sec.id}
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHoveredSection(sec.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Tooltip on hover */}
            {(isHovered || isActive) && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="absolute end-8 whitespace-nowrap bg-navy-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-md pointer-events-none z-50 flex items-center gap-1"
              >
                <span>{sec.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>}
              </motion.div>
            )}

            {/* Dot button */}
            <button
              onClick={() => scrollTo(sec.id)}
              className={`transition-all duration-300 rounded-full flex items-center justify-center ${
                isActive
                  ? 'w-4 h-4 bg-gold-500 ring-4 ring-gold-100 shadow-sm scale-110'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-navy-600 hover:scale-125'
              }`}
              aria-label={`الانتقال إلى قسم ${sec.label}`}
              title={sec.label}
            />

            {/* Connecting line */}
            {index < sections.length - 1 && (
              <div className="absolute top-full start-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-200 pointer-events-none" />
            )}
          </div>
        )
      })}
    </div>
  )
}
