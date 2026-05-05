import { useState, useEffect } from 'react'

export default function useParticleSettings() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('particlesEnabled')
    if (saved !== null) {
      setEnabled(JSON.parse(saved))
    }
  }, [])

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev
      localStorage.setItem('particlesEnabled', JSON.stringify(next))
      return next
    })
  }

  return { enabled, toggle }
}
