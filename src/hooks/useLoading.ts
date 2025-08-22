'use client'

import { useState, useCallback } from 'react'

interface UseLoadingOptions {
  initialLoading?: boolean
  onLoadingChange?: (loading: boolean) => void
}

export function useLoading(options: UseLoadingOptions = {}) {
  const { initialLoading = false, onLoadingChange } = options
  const [loading, setLoading] = useState(initialLoading)

  const startLoading = useCallback(() => {
    setLoading(true)
    onLoadingChange?.(true)
  }, [onLoadingChange])

  const stopLoading = useCallback(() => {
    setLoading(false)
    onLoadingChange?.(false)
  }, [onLoadingChange])

  const withLoading = useCallback(async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    startLoading()
    try {
      const result = await asyncFn()
      return result
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  const setLoadingState = useCallback((newLoading: boolean) => {
    setLoading(newLoading)
    onLoadingChange?.(newLoading)
  }, [onLoadingChange])

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
    setLoadingState
  }
}
