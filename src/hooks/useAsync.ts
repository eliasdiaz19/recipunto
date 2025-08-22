'use client'

import { useState, useCallback } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  onFinally?: () => void
}

export function useAsync<T = any>(options: UseAsyncOptions<T> = {}) {
  const { onSuccess, onError, onFinally } = options
  
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await asyncFn()
      setState({ data: result, loading: false, error: null })
      onSuccess?.(result)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      onError?.(errorMessage)
      throw error
    } finally {
      onFinally?.()
    }
  }, [onSuccess, onError, onFinally])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data }))
  }, [])

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  return {
    ...state,
    execute,
    reset,
    setData,
    setError
  }
}
