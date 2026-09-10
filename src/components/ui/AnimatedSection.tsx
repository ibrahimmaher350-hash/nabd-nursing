'use client'
/**
 * components/ui/AnimatedSection.tsx — نبض للتمريض المنزلي
 * Scroll-reveal wrapper — يحرك أي قسم عند الظهور في viewport
 */

import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  direction?: Direction
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
}

function getVariants(direction: Direction, duration: number): Variants {
  const initial: Record<string, string | number> = { opacity: 0 }
  if (direction === 'up')    initial.y = 32
  if (direction === 'down')  initial.y = -32
  if (direction === 'left')  initial.x = 48
  if (direction === 'right') initial.x = -48
  return {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }
}

export default function AnimatedSection({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.12,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })
  const variants = getVariants(direction, duration)

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger container + child ─────────────────────────────────
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.04 },
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
  delay?: number
  amount?: number
}

export function StaggerContainer({ children, className, delay = 0, amount = 0.1 }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount })
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ delayChildren: delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  variants = fadeInUp,
}: {
  children: React.ReactNode
  className?: string
  variants?: Variants
}) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  )
}
