import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import ParticlesBackground from './ParticlesBackground'

const headingVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 }
}

const buttonVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.6 + i * 0.08 } })
}

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      el.style.setProperty('--mouse-x', `${x}%`)
      el.style.setProperty('--mouse-y', `${y}%`)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#042a1f] via-[#063525] to-[#0f3d2e]"
    >
      {/* Radial spotlight that follows mouse */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x,50%) var(--mouse-y,50%), rgba(250,204,21,0.08), transparent 15%)`,
          mixBlendMode: 'soft-light'
        }}
      />

      {/* layered background glow */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
          style={{ transform: `translateY(${scrollY * 0.03}px)` }}
        />
        <div
          className="absolute -left-32 -top-20 w-[680px] h-[680px] rounded-full bg-gradient-to-br from-[#0f3d2e] to-[#72c87a] opacity-30 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        />
      </div>

      <ParticlesBackground />


      <motion.div
        initial={reduceMotion ? undefined : 'hidden'}
        animate={reduceMotion ? undefined : 'visible'}
        variants={reduceMotion ? undefined : {
          visible: { transition: { staggerChildren: 0.08 } }
        }}
        className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center"
      >
        <motion.h1
          variants={reduceMotion ? undefined : headingVariant}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease: [0.25, 0.8, 0.25, 1] }}
          className="text-white font-extrabold leading-tight max-w-4xl mx-auto text-5xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg"
          style={{ textShadow: '0 8px 40px rgba(0,0,0,0.45)' }}
        >
          Play Golf. Change Lives.
        </motion.h1>

        <motion.p
          variants={reduceMotion ? undefined : headingVariant}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.9, delay: 0.12, ease: [0.25, 0.8, 0.25, 1] }}
          className="mt-6 text-white/85 max-w-2xl mx-auto text-lg sm:text-xl"
        >
          Join premium charity draws, support causes you love, and enjoy cinematic experiences built for golfers.
        </motion.p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <motion.a
            custom={0}
            variants={reduceMotion ? undefined : buttonVariant}
            className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#facc15] to-[#ffd95b] text-black font-semibold shadow-lg transform-gpu"
            href="#"
            style={{ boxShadow: '0 10px 30px rgba(250,204,21,0.12)' }}
            whileHover={reduceMotion ? {} : { scale: 1.05, boxShadow: '0 20px 50px rgba(250,204,21,0.18)' }}
            whileTap={reduceMotion ? {} : { scale: 0.96 }}
          >
            Enter Draws
          </motion.a>

          <motion.a
            custom={1}
            variants={reduceMotion ? undefined : buttonVariant}
            className="group inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/12"
            href="#features"
            whileHover={reduceMotion ? {} : { scale: 1.03 }}
            whileTap={reduceMotion ? {} : { scale: 0.96 }}
          >
            Learn More
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
