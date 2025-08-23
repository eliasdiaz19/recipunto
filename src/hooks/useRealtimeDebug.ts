// src/hooks/useRealtimeDebug.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface RealtimeDebugInfo {
  connectionStatus: string
  pendingOperations: any[]
  boxVersions: Record<string, number>
  lastEvent: string | null
  eventCount: number
  errorCount: number
}

export function useRealtimeDebug() {
  const [debugInfo, setDebugInfo] = useState<RealtimeDebugInfo>({
    connectionStatus: 'unknown',
    pendingOperations: [],
    boxVersions: {},
    lastEvent: null,
    eventCount: 0,
    errorCount: 0
  })
  
  const [isDebugMode, setIsDebugMode] = useState(false)
  
  // Referencias para evitar dependencias circulares
  const connectionStatusRef = useRef<string>('unknown')
  const pendingOperationsRef = useRef<any[]>([])
  const boxVersionsRef = useRef<Record<string, number>>({})

  // Función para actualizar información de debug
  const updateDebugInfo = useCallback((updates: Partial<RealtimeDebugInfo>) => {
    setDebugInfo(prev => ({ ...prev, ...updates }))
  }, [])

  // Función para registrar un evento
  const logEvent = useCallback((event: string) => {
    updateDebugInfo({
      lastEvent: `${new Date().toLocaleTimeString()}: ${event}`,
      eventCount: debugInfo.eventCount + 1
    })
  }, [updateDebugInfo, debugInfo.eventCount])

  // Función para registrar un error
  const logError = useCallback((error: string) => {
    updateDebugInfo({
      lastEvent: `${new Date().toLocaleTimeString()}: ERROR - ${error}`,
      errorCount: debugInfo.errorCount + 1
    })
  }, [updateDebugInfo, debugInfo.errorCount])

  // Función para limpiar logs
  const clearLogs = useCallback(() => {
    updateDebugInfo({
      lastEvent: null,
      eventCount: 0,
      errorCount: 0
    })
  }, [updateDebugInfo])

  // Función para actualizar estado de conexión (llamada desde useRealtimeStatus)
  const updateConnectionStatus = useCallback((status: string) => {
    connectionStatusRef.current = status
    updateDebugInfo({ connectionStatus: status })
  }, [updateDebugInfo])

  // Función para actualizar operaciones pendientes (llamada desde useBoxes)
  const updatePendingOperations = useCallback((operations: any[]) => {
    pendingOperationsRef.current = operations
    updateDebugInfo({ pendingOperations: operations })
  }, [updateDebugInfo])

  // Función para actualizar versiones de cajas (llamada desde useBoxes)
  const updateBoxVersions = useCallback((versions: Record<string, number>) => {
    boxVersionsRef.current = versions
    updateDebugInfo({ boxVersions: versions })
  }, [updateDebugInfo])

  // Función para exportar logs para debugging
  const exportDebugLogs = useCallback(() => {
    const logData = {
      timestamp: new Date().toISOString(),
      debugInfo: {
        ...debugInfo,
        connectionStatus: connectionStatusRef.current,
        pendingOperations: pendingOperationsRef.current,
        boxVersions: boxVersionsRef.current
      }
    }
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `realtime-debug-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [debugInfo])

  // Función para simular eventos de prueba
  const simulateTestEvent = useCallback(() => {
    logEvent('Evento de prueba simulado')
  }, [logEvent])

  // Función para simular error de prueba
  const simulateTestError = useCallback(() => {
    logError('Error de prueba simulado')
  }, [logError])

  return {
    debugInfo,
    isDebugMode,
    setIsDebugMode,
    updateDebugInfo,
    logEvent,
    logError,
    clearLogs,
    exportDebugLogs,
    simulateTestEvent,
    simulateTestError,
    // Funciones para actualizar estado desde otros hooks
    updateConnectionStatus,
    updatePendingOperations,
    updateBoxVersions
  }
}
