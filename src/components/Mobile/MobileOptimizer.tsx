'use client'

import { useEffect } from 'react'

export default function MobileOptimizer() {
  useEffect(() => {
    // Prevenir zoom en inputs
    const preventZoom = (e: any) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        document.body.style.zoom = "100%";
      }
    }

    // Ajustar viewport para mobile
    const setViewport = () => {
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport && window.innerWidth <= 768) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no')
      }
    }

    window.addEventListener('touchstart', preventZoom)
    setViewport()

    return () => window.removeEventListener('touchstart', preventZoom)
  }, [])

  return null
}
