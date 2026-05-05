import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTwitch } from 'react-icons/fa'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const linkHoverVariants = {
  hover: { x: 6, color: '#facc15' }
}

const Footer: React.FC = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const reduceMotion = usePrefersReducedMotion()

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const socialIcons = [
    { Icon: FaFacebook, href: '#' },
    { Icon: FaTwitter, href: '#' },
    { Icon: FaInstagram, href: '#' },
    { Icon: FaLinkedin, href: '#' },
    { Icon: FaTwitch, href: '#' }
  ]

  const quickLinks = ['Home', 'About', 'Charities', 'Draws']
  const resources = ['FAQ', 'Privacy Policy', 'Terms', 'Support']

  return (
    <footer className="relative bg-gradient-to-b from-[#0f3d2e] via-[#09251c] to-[#040f0a] overflow-hidden">
      {/* Soft glow effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(114,200,122,0.4), transparent)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.3), transparent)' }}
        />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20 relative z-10">
        {/* Main footer content */}
        <motion.div
          initial={reduceMotion ? undefined : 'hidden'}
          whileInView={reduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
          variants={reduceMotion ? undefined : containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12"
        >
          {/* Column 1: Brand */}
          <motion.div variants={reduceMotion ? undefined : itemVariants}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#facc15] to-[#72c87a] flex items-center justify-center font-bold text-black text-lg">
                ⛳
              </div>
              <h3 className="text-xl font-extrabold text-white">Golf Charity</h3>
            </div>
            <p className="text-white/80 font-semibold mb-3">Play. Win. Give Back.</p>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Join a premium community where every swing makes an impact. Support causes you love while enjoying exclusive golf experiences.
            </p>
            {/* Social icons */}
            <div className="flex gap-4">
              {socialIcons.map(({ Icon }, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={reduceMotion ? {} : { scale: 1.15, y: -4 }}
                  whileTap={reduceMotion ? {} : { scale: 0.92 }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-yellow-300 transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={reduceMotion ? undefined : itemVariants}>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <motion.li key={i} whileHover={reduceMotion ? {} : 'hover'} variants={reduceMotion ? undefined : linkHoverVariants}>
                  <a
                    href="#"
                    className="text-white/70 hover:text-yellow-300 transition-colors inline-flex items-center"
                  >
                    <span className="mr-2 text-yellow-400">→</span>
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Resources */}
          <motion.div variants={reduceMotion ? undefined : itemVariants}>
            <h4 className="text-white font-bold text-lg mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((link, i) => (
                <motion.li key={i} whileHover={reduceMotion ? {} : 'hover'} variants={reduceMotion ? undefined : linkHoverVariants}>
                  <a
                    href="#"
                    className="text-white/70 hover:text-yellow-300 transition-colors inline-flex items-center"
                  >
                    <span className="mr-2 text-yellow-400">→</span>
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div variants={reduceMotion ? undefined : itemVariants}>
            <h4 className="text-white font-bold text-lg mb-4">Stay Updated</h4>
            <p className="text-white/60 text-sm mb-5">
              Get exclusive updates on new draws, events, and impact stories.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                  required
                />
              </div>
              <motion.button
                whileHover={reduceMotion ? {} : { scale: 1.04 }}
                whileTap={reduceMotion ? {} : { scale: 0.96 }}
                type="submit"
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-[#facc15] to-[#ffd95b] text-black font-semibold hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
                style={{
                  boxShadow: '0 4px 15px rgba(250, 204, 21, 0.1)'
                }}
              >
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 sm:mt-16 h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0"
        />

        {/* Bottom bar */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/60"
        >
          <p>© 2026 Golf Charity. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-yellow-300 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-yellow-300 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-yellow-300 transition">
              Cookie Settings
            </a>
          </div>
        </motion.div>
      </div>

      {/* Optional: decorative glass card background */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </footer>
  )
}

export default Footer