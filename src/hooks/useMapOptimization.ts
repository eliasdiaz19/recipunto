'use client'

import { useCallback, useRef } from 'react'

interface UseMapOptimizationOptions {
  debounceDelay?: number
  throttleDelay?: number
}

export function useMapOptimization(options: UseMapOptimizationOptions = {}) {
  const { debounceDelay = 300, throttleDelay = 100 } = options
  
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const throttleTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lastThrottleCallRef = useRef<number>(0)

  // Debounce para eventos que no necesitan ser inmediatos (ej: búsqueda)
  const debounce = useCallback((callback: () => void) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    
    debounceTimeoutRef.current = setTimeout(callback, debounceDelay)
  }, [debounceDelay])

  // Throttle para eventos que necesitan ser limitados (ej: scroll, resize)
  const throttle = useCallback((callback: () => void) => {
    const now = Date.now()
    
    if (now - lastThrottleCallRef.current >= throttleDelay) {
      callback()
      lastThrottleCallRef.current = now
    } else if (!throttleTimeoutRef.current) {
      throttleTimeoutRef.current = setTimeout(() => {
        callback()
        lastThrottleCallRef.current = Date.now()
        throttleTimeoutRef.current = undefined
      }, throttleDelay - (now - lastThrottleCallRef.current))
    }
  }, [throttleDelay])

  // Cleanup para evitar memory leaks
  const cleanup = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    if (throttleTimeoutRef.current) {
      clearTimeout(throttleTimeoutRef.current)
    }
  }, [])

  return {
    debounce,
    throttle,
    cleanup
  }
}
