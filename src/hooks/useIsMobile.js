import { useEffect, useState } from 'react'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const narrowScreen = window.matchMedia('(max-width: 768px)').matches
      const mobileAgent = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      setIsMobile((mobileAgent || (narrowScreen && touchDevice)))
    }

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}
