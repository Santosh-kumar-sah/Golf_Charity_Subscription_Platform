import React from 'react'
import { motion } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

type GlassCardProps = {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

const MotionCard = motion.div as React.ComponentType<React.HTMLAttributes<HTMLDivElement> & {
  initial?: unknown
  whileInView?: unknown
  viewport?: unknown
  whileHover?: unknown
  transition?: unknown
}>

const GlassCard: React.FC<GlassCardProps> = ({ title, subtitle, children }) => {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <MotionCard
      className="relative overflow-hidden rounded-2xl bg-white/8 backdrop-blur-lg border border-white/10 p-6"
      initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={reduceMotion ? undefined : { scale: 1.04, boxShadow: '0 25px 60px rgba(2,6,23,0.45)' }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {/* gradient glow border */}
      <div className="pointer-events-none absolute -inset-0.5 rounded-2xl" style={{
        background: 'linear-gradient(120deg, rgba(250,204,21,0.12), rgba(114,200,122,0.06))',
        zIndex: 0,
        filter: 'blur(12px)'
      }} />

      <div className="relative z-10">
        {title && <h3 className="text-white font-semibold text-lg">{title}</h3>}
        {subtitle && <p className="text-white/80 text-sm mt-1">{subtitle}</p>}
        <div className="mt-4 text-white/90 text-sm">{children}</div>
      </div>
    </MotionCard>
  )
}

export default GlassCard
