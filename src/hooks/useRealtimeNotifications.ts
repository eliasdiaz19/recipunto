// src/hooks/useRealtimeNotifications.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Box } from '@/lib/types'

export interface RealtimeNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  action?: {
    label: string
    onClick: () => void
  }
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const [isEnabled, setIsEnabled] = useState(true)

  const addNotification = useCallback((notification: Omit<RealtimeNotification, 'id' | 'timestamp'>) => {
    if (!isEnabled) return

    const newNotification: RealtimeNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]) // Mantener solo las últimas 5

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }, [isEnabled])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const toggleNotifications = useCallback(() => {
    setIsEnabled(prev => !prev)
  }, [])

  // Notificaciones para diferentes tipos de cambios
  const notifyBoxAdded = useCallback((box: Box) => {
    addNotification({
      type: 'success',
      title: 'Nueva caja agregada',
      message: `Se agregó una nueva caja en ${box.location.lat.toFixed(4)}, ${box.location.lng.toFixed(4)}`,
      action: {
        label: 'Ver',
        onClick: () => {
          // Aquí podrías implementar scroll o focus al marcador
          console.log('Focus en caja:', box.id)
        }
      }
    })
  }, [addNotification])

  const notifyBoxUpdated = useCallback((box: Box, changes: string[]) => {
    addNotification({
      type: 'info',
      title: 'Caja actualizada',
      message: `Se actualizó: ${changes.join(', ')}`,
      action: {
        label: 'Ver cambios',
        onClick: () => {
          console.log('Ver cambios en caja:', box.id)
        }
      }
    })
  }, [addNotification])

  const notifyBoxDeleted = useCallback((boxId: string) => {
    addNotification({
      type: 'warning',
      title: 'Caja eliminada',
      message: 'Una caja fue eliminada del mapa',
    })
  }, [addNotification])

  const notifyRealtimeConnected = useCallback(() => {
    addNotification({
      type: 'success',
      title: 'Conectado en tiempo real',
      message: 'Los cambios se sincronizarán automáticamente',
    })
  }, [addNotification])

  const notifyRealtimeDisconnected = useCallback(() => {
    addNotification({
      type: 'error',
      title: 'Desconectado del tiempo real',
      message: 'Los cambios no se sincronizarán automáticamente',
    })
  }, [addNotification])

  return {
    notifications,
    isEnabled,
    addNotification,
    removeNotification,
    clearNotifications,
    toggleNotifications,
    notifyBoxAdded,
    notifyBoxUpdated,
    notifyBoxDeleted,
    notifyRealtimeConnected,
    notifyRealtimeDisconnected
  }
}
