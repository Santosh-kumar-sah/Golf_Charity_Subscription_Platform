import { useEffect, useState } from 'react'

export default function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handle = () => setPrefersReduced(mq.matches)
    handle()
    mq.addEventListener ? mq.addEventListener('change', handle) : mq.addListener(handle)
    return () => mq.removeEventListener ? mq.removeEventListener('change', handle) : mq.removeListener(handle)
  }, [])

  return prefersReduced
}
