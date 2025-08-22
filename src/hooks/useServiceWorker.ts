'use client'

import { useEffect, useState, useCallback } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isInstalled: boolean
  isUpdating: boolean
  hasUpdate: boolean
  registration: ServiceWorkerRegistration | null
}

interface UseServiceWorkerOptions {
  onUpdate?: () => void
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useServiceWorker(options: UseServiceWorkerOptions = {}) {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isUpdating: false,
    hasUpdate: false,
    registration: null
  })

  const { onUpdate, onSuccess, onError } = options

  // Registrar el Service Worker
  const register = useCallback(async () => {
    if (!state.isSupported) {
      onError?.(new Error('Service Worker no es compatible con este navegador'))
      return
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      
      setState(prev => ({
        ...prev,
        isInstalled: true,
        registration
      }))

      onSuccess?.()

      // Escuchar actualizaciones
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setState(prev => ({ ...prev, hasUpdate: true }))
              onUpdate?.()
            }
          })
        }
      })

      // Escuchar cambios de estado
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setState(prev => ({ ...prev, hasUpdate: false }))
        window.location.reload()
      })

    } catch (error) {
      console.error('Error registrando Service Worker:', error)
      onError?.(error as Error)
    }
  }, [state.isSupported, onUpdate, onSuccess, onError])

  // Actualizar el Service Worker
  const update = useCallback(async () => {
    if (!state.registration) return

    try {
      setState(prev => ({ ...prev, isUpdating: true }))
      
      await state.registration.update()
      
      // Notificar al Service Worker que debe activarse
      if (state.registration.waiting) {
        state.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
      
    } catch (error) {
      console.error('Error actualizando Service Worker:', error)
      onError?.(error as Error)
    } finally {
      setState(prev => ({ ...prev, isUpdating: false }))
    }
  }, [state.registration, onError])

  // Verificar conectividad
  const checkConnectivity = useCallback(async () => {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      return response.ok
    } catch {
      return false
    }
  }, [])

  // Sincronizar datos offline
  const syncOfflineData = useCallback(async () => {
    const registration = state.registration as (ServiceWorkerRegistration & { sync?: { register: (tag: string) => Promise<void> } }) | null
    if (!registration || typeof registration.sync?.register !== 'function') {
      throw new Error('Background Sync no es compatible')
    }

    try {
      await registration.sync.register('background-sync')
      return true
    } catch (error) {
      console.error('Error registrando sync:', error)
      return false
    }
  }, [state.registration])

  // Registrar automáticamente al montar
  useEffect(() => {
    if (state.isSupported && !state.isInstalled) {
      register()
    }
  }, [state.isSupported, state.isInstalled, register])

  return {
    ...state,
    register,
    update,
    checkConnectivity,
    syncOfflineData
  }
}
