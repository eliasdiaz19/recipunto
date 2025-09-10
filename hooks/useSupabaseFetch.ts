import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { API_CONFIG, ERROR_MESSAGES } from '@/constants/api'
import type { ApiResponse } from '@/types/common'

/**
 * Hook personalizado para manejar operaciones de Supabase
 * Inspirado en el patrón de useFetch del proyecto uber-main
 */
export const useSupabaseFetch = <T>(
  query: () => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: result, error: fetchError } = await query()
      
      if (fetchError) {
        throw new Error(fetchError.message || ERROR_MESSAGES.SERVER_ERROR)
      }
      
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : ERROR_MESSAGES.UNKNOWN_ERROR
      setError(errorMessage)
      console.error('useSupabaseFetch error:', err)
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { 
    data, 
    loading, 
    error, 
    refetch: fetchData 
  } as ApiResponse<T> & { refetch: () => Promise<void> }
}

/**
 * Hook para operaciones de mutación (crear, actualizar, eliminar)
 */
export const useSupabaseMutation = <T, P = any>(
  mutationFn: (params: P) => Promise<{ data: T | null; error: any }>
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (params: P) => {
    setLoading(true)
    setError(null)

    try {
      const { data: result, error: mutationError } = await mutationFn(params)
      
      if (mutationError) {
        throw new Error(mutationError.message || ERROR_MESSAGES.SERVER_ERROR)
      }
      
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : ERROR_MESSAGES.UNKNOWN_ERROR
      setError(errorMessage)
      console.error('useSupabaseMutation error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [mutationFn])

  return {
    data,
    loading,
    error,
    mutate,
    reset: () => {
      setData(null)
      setError(null)
    }
  }
}

/**
 * Hook para operaciones en tiempo real con Supabase
 */
export const useSupabaseRealtime = <T>(
  table: string,
  filter?: { column: string; value: any }
) => {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    
    let query = supabase.from(table).select('*')
    
    if (filter) {
      query = query.eq(filter.column, filter.value)
    }

    // Suscripción en tiempo real
    const subscription = query
      .on('*', (payload) => {
        console.log('Realtime update:', payload)
        // Aquí puedes manejar las actualizaciones en tiempo real
        // Por ahora, solo logueamos el payload
      })
      .subscribe()

    // Carga inicial
    query.then(({ data: initialData, error: initialError }) => {
      if (initialError) {
        setError(initialError.message)
      } else {
        setData(initialData || [])
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [table, filter])

  return { data, loading, error }
}
