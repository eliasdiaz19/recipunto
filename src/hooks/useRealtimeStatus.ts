// src/hooks/useRealtimeStatus.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export type RealtimeStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export function useRealtimeStatus() {
  const [status, setStatus] = useState<RealtimeStatus>('connecting')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  
  // Referencia para callback de debug
  const debugCallbackRef = useRef<((status: string) => void) | null>(null)

  // Función para registrar callback de debug
  const registerDebugCallback = useCallback((callback: (status: string) => void) => {
    debugCallbackRef.current = callback
  }, [])

  const checkConnection = useCallback(async () => {
    try {
      setStatus('connecting')
      
      // Notificar a debug si está disponible
      if (debugCallbackRef.current) {
        debugCallbackRef.current('connecting')
      }
      
      // Verificar conexión básica
      const { error } = await supabase.from('boxes').select('count').limit(1)
      
      if (error) {
        console.error('Error checking connection:', error)
        setStatus('error')
        
        // Notificar a debug si está disponible
        if (debugCallbackRef.current) {
          debugCallbackRef.current('error')
        }
        
        return false
      }

      // Si llegamos aquí, la conexión está funcionando
      setStatus('connected')
      setLastUpdate(new Date())
      setConnectionAttempts(0)
      
      // Notificar a debug si está disponible
      if (debugCallbackRef.current) {
        debugCallbackRef.current('connected')
      }
      
      return true
    } catch (err) {
      console.error('Error in checkConnection:', err)
      setStatus('error')
      
      // Notificar a debug si está disponible
      if (debugCallbackRef.current) {
        debugCallbackRef.current('error')
      }
      
      return false
    }
  }, [])

  const reconnect = useCallback(async () => {
    setConnectionAttempts(prev => prev + 1)
    await checkConnection()
  }, [checkConnection])

  // Verificar conexión al montar el componente
  useEffect(() => {
    checkConnection()

    // Verificar conexión cada 30 segundos
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [checkConnection])

  // Escuchar cambios en el estado de la conexión
  useEffect(() => {
    const handleOnline = () => {
      console.log('Conexión a internet restaurada')
      checkConnection()
    }

    const handleOffline = () => {
      console.log('Conexión a internet perdida')
      setStatus('disconnected')
      
      // Notificar a debug si está disponible
      if (debugCallbackRef.current) {
        debugCallbackRef.current('disconnected')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [checkConnection])

  return {
    status,
    lastUpdate,
    connectionAttempts,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    isDisconnected: status === 'disconnected',
    hasError: status === 'error',
    reconnect,
    checkConnection,
    registerDebugCallback
  }
}
