'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocalStorageObject } from './useLocalStorage'

export interface CacheConfig {
  ttl: number // Time to live in milliseconds
  maxSize: number // Maximum number of items to cache
  strategy: 'lru' | 'fifo' | 'ttl' // Cache eviction strategy
}

export interface CacheItem<T> {
  data: T
  timestamp: number
  accessCount: number
  lastAccessed: number
}

export interface SmartCacheOptions {
  config: CacheConfig
  onCacheHit?: (key: string) => void
  onCacheMiss?: (key: string) => void
  onCacheEvict?: (key: string) => void
}

const defaultConfig: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100,
  strategy: 'lru'
}

export function useSmartCache<T>(
  cacheKey: string,
  options: SmartCacheOptions = { config: defaultConfig }
) {
  const { config, onCacheHit, onCacheMiss, onCacheEvict } = options
  const [cache, setCache] = useLocalStorageObject<Record<string, CacheItem<T>>>(`cache_${cacheKey}`, {})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchFunctionsRef = useRef<Map<string, () => Promise<T>>>(new Map())

  // Registrar función de fetch para una clave
  const registerFetcher = useCallback((key: string, fetcher: () => Promise<T>) => {
    fetchFunctionsRef.current.set(key, fetcher)
  }, [])

  // Verificar si un item está en caché y es válido
  const isCached = useCallback((key: string): boolean => {
    const item = cache[key]
    if (!item) return false

    const now = Date.now()
    const isExpired = now - item.timestamp > config.ttl
    return !isExpired
  }, [cache, config.ttl])

  // Obtener item del caché
  const getCached = useCallback((key: string): T | null => {
    const item = cache[key]
    if (!item) return null

    const now = Date.now()
    const isExpired = now - item.timestamp > config.ttl

    if (isExpired) {
      // Remover item expirado
      setCache(prev => {
        const newCache = { ...prev }
        delete newCache[key]
        return newCache
      })
      onCacheEvict?.(key)
      return null
    }

    // Actualizar estadísticas de acceso
    setCache(prev => ({
      ...prev,
      [key]: {
        ...item,
        accessCount: item.accessCount + 1,
        lastAccessed: now
      }
    }))

    onCacheHit?.(key)
    return item.data
  }, [cache, config.ttl, setCache, onCacheHit, onCacheEvict])

  // Guardar item en caché
  const setCached = useCallback((key: string, data: T) => {
    const now = Date.now()
    const newItem: CacheItem<T> = {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now
    }

    setCache(prev => {
      const newCache = { ...prev, [key]: newItem }
      
      // Aplicar estrategia de evicción si es necesario
      const keys = Object.keys(newCache)
      if (keys.length > config.maxSize) {
        return evictItems(newCache, config.strategy)
      }
      
      return newCache
    })
  }, [setCache, config.maxSize, config.strategy])

  // Estrategias de evicción
  const evictItems = useCallback((cache: Record<string, CacheItem<T>>, strategy: string) => {
    const keys = Object.keys(cache)
    const itemsToEvict = keys.length - config.maxSize

    if (itemsToEvict <= 0) return cache

    const sortedKeys = keys.sort((a, b) => {
      const itemA = cache[a]
      const itemB = cache[b]

      switch (strategy) {
        case 'lru':
          return itemA.lastAccessed - itemB.lastAccessed
        case 'fifo':
          return itemA.timestamp - itemB.timestamp
        case 'ttl':
          return itemA.timestamp - itemB.timestamp
        default:
          return 0
      }
    })

    const newCache = { ...cache }
    for (let i = 0; i < itemsToEvict; i++) {
      const keyToEvict = sortedKeys[i]
      delete newCache[keyToEvict]
      onCacheEvict?.(keyToEvict)
    }

    return newCache
  }, [config.maxSize, onCacheEvict])

  // Obtener datos (del caché o fetch)
  const get = useCallback(async (key: string): Promise<T | null> => {
    // Verificar caché primero
    const cached = getCached(key)
    if (cached !== null) {
      return cached
    }

    // Si no está en caché, hacer fetch
    const fetcher = fetchFunctionsRef.current.get(key)
    if (!fetcher) {
      onCacheMiss?.(key)
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetcher()
      setCached(key, data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching data'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [getCached, setCached, onCacheMiss])

  // Invalidar caché
  const invalidate = useCallback((key?: string) => {
    if (key) {
      setCache(prev => {
        const newCache = { ...prev }
        delete newCache[key]
        return newCache
      })
      onCacheEvict?.(key)
    } else {
      setCache({})
    }
  }, [setCache, onCacheEvict])

  // Limpiar caché expirado
  const cleanup = useCallback(() => {
    const now = Date.now()
    setCache(prev => {
      const newCache = { ...prev }
      Object.keys(newCache).forEach(key => {
        const item = newCache[key]
        if (now - item.timestamp > config.ttl) {
          delete newCache[key]
          onCacheEvict?.(key)
        }
      })
      return newCache
    })
  }, [setCache, config.ttl, onCacheEvict])

  // Estadísticas del caché
  const stats = useCallback(() => {
    const items = Object.values(cache)
    const now = Date.now()
    
    return {
      totalItems: items.length,
      expiredItems: items.filter(item => now - item.timestamp > config.ttl).length,
      totalAccesses: items.reduce((sum, item) => sum + item.accessCount, 0),
      averageAccessCount: items.length > 0 ? items.reduce((sum, item) => sum + item.accessCount, 0) / items.length : 0,
      oldestItem: items.length > 0 ? Math.min(...items.map(item => item.timestamp)) : null,
      newestItem: items.length > 0 ? Math.max(...items.map(item => item.timestamp)) : null
    }
  }, [cache, config.ttl])

  // Cleanup automático
  useEffect(() => {
    const interval = setInterval(cleanup, config.ttl)
    return () => clearInterval(interval)
  }, [cleanup, config.ttl])

  return {
    get,
    setCached,
    getCached,
    isCached,
    invalidate,
    cleanup,
    registerFetcher,
    stats,
    isLoading,
    error
  }
}

// Hook específico para caché de cajas de reciclaje
export function useBoxCache() {
  const cache = useSmartCache<RecyclingBox[]>('recycling-boxes', {
    config: {
      ttl: 2 * 60 * 1000, // 2 minutos
      maxSize: 50,
      strategy: 'lru'
    },
    onCacheHit: (key) => console.log(`Cache hit for ${key}`),
    onCacheMiss: (key) => console.log(`Cache miss for ${key}`),
    onCacheEvict: (key) => console.log(`Cache evicted ${key}`)
  })

  return cache
}

// Hook para caché de datos de usuario
export function useUserCache() {
  const cache = useSmartCache<any>('user-data', {
    config: {
      ttl: 10 * 60 * 1000, // 10 minutos
      maxSize: 20,
      strategy: 'lru'
    }
  })

  return cache
}

