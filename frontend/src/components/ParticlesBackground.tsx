import React, { useCallback, useMemo } from 'react'
import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import useParticleSettings from '../hooks/useParticleSettings'

const ParticlesBackground: React.FC = () => {
  const { enabled } = useParticleSettings()
  const particlesInit = useCallback(async (engine: any) => {
    await loadFull(engine)
  }, [])

  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768
  }, [])

  const options = useMemo(() => ({
    fpsLimit: 60,
    detectRetina: true,
    particles: {
      number: {
        value: isMobile ? 8 : 28,
        density: { enable: true, area: isMobile ? 1200 : 800 }
      },
      color: { value: ['#facc15', '#72c87a', '#ffffff'] },
      shape: { type: 'circle' },
      opacity: { value: isMobile ? 0.08 : 0.12, random: { enable: true, minimumValue: isMobile ? 0.04 : 0.06 } },
      size: { value: { min: isMobile ? 4 : 6, max: isMobile ? 12 : 18 }, random: true },
      move: {
        enable: true,
        speed: isMobile ? 0.12 : 0.25,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' }
      }
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: { enable: !isMobile, mode: 'attract' },
        onClick: { enable: false }
      },
      modes: {
        attract: { distance: 160, duration: 0.6, speed: 0.8 }
      }
    }
  }), [isMobile])

  return enabled ? (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="absolute inset-0 -z-20"
    />
  ) : null
}

export default ParticlesBackground
