import React from 'react'
import { motion } from 'framer-motion'
import HeroSection from './HeroSection'
import GlassCard from './GlassCard'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } }
}

const LandingPage: React.FC = () => {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <motion.div initial={reduceMotion ? undefined : 'hidden'} animate={reduceMotion ? undefined : 'visible'} variants={reduceMotion ? undefined : pageVariants} className="min-h-screen bg-gradient-to-b from-[#071a14] to-[#04180f]">
      <HeroSection />

      <main id="features" className="container mx-auto px-6 sm:px-8 lg:px-12 -mt-32 relative z-20">
        <section className="mb-12">
          <motion.h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Featured Draws</motion.h2>
          <p className="text-white/80 max-w-2xl">Explore the latest premium charity draws — curated for impact and experience.</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard title="VIP Course Experience" subtitle="Win a day with a pro"> 
            <p>Play at an exclusive course, receive coaching, and enjoy VIP hospitality.</p>
          </GlassCard>

          <GlassCard title="Custom Clubs Set" subtitle="Premium gear prize">
            <p>Win a full set of custom-fit clubs from leading brands.</p>
          </GlassCard>

          <GlassCard title="Charity Gala Tickets" subtitle="Red carpet experience">
            <p>Attend a gala supporting the causes behind the platform.</p>
          </GlassCard>
        </section>

        <section className="mt-12">
          <motion.h3 className="text-2xl font-bold text-white mb-4">Why Choose Us</motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard title="Transparent Impact">We show exactly how funds are used.</GlassCard>
            <GlassCard title="Premium Experiences">Curated golf prizes and VIP access.</GlassCard>
            <GlassCard title="Community & Trust">Verified charities and secure payments.</GlassCard>
          </div>
        </section>
      </main>
    </motion.div>
  )
}

export default LandingPage
