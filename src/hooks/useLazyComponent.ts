'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface UseLazyComponentOptions {
  threshold?: number
  rootMargin?: string
  fallback?: React.ReactNode
}

export function useLazyComponent(options: UseLazyComponentOptions = {}) {
  const { threshold = 0.1, rootMargin = '50px', fallback = null } = options
  const [isVisible, setIsVisible] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    if (entry.isIntersecting && !hasIntersected) {
      setIsVisible(true)
      setHasIntersected(true)
    }
  }, [hasIntersected])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [handleIntersection, threshold, rootMargin])

  return {
    elementRef,
    isVisible,
    fallback
  }
}
