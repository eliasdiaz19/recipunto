// src/hooks/useBoxes.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Box } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useRealtimeNotifications } from './useRealtimeNotifications'
import { useRealtimeDebug } from './useRealtimeDebug'

// Interfaz para rastrear operaciones en progreso
interface PendingOperation {
  id: string
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  timestamp: number
  data?: any
  timeoutId?: NodeJS.Timeout
}

export function useBoxes() {
  const [boxes, setBoxes] = useState<Box[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const realtimeChannel = useRef<RealtimeChannel | null>(null)
  const notifications = useRealtimeNotifications()
  const debug = useRealtimeDebug()
  
  // Mapa de operaciones en progreso para evitar duplicados
  const pendingOperations = useRef<Map<string, PendingOperation>>(new Map())
  
  // Contador de versión para cada caja para detectar cambios
  const boxVersions = useRef<Map<string, number>>(new Map())
  
  // Tiempo de expiración para operaciones pendientes (5 segundos)
  const OPERATION_EXPIRY = 5000

  // Función para convertir datos de Supabase a formato Box
  const transformBoxData = useCallback((boxData: any): Box => {
    let lat = -29.4135
    let lng = -66.8568
    
    if (boxData.location && boxData.location.coordinates && boxData.location.coordinates.length >= 2) {
      lat = boxData.location.coordinates[1]
      lng = boxData.location.coordinates[0]
    }

    return {
      ...boxData,
      location: { lat, lng }
    }
  }, [])

  // Función para registrar una operación pendiente
  const registerPendingOperation = useCallback((operation: PendingOperation) => {
    const key = `${operation.type}_${operation.id}`
    pendingOperations.current.set(key, operation)
    
    // Log para debug
    debug.logEvent(`Operación ${operation.type} registrada para ID: ${operation.id}`)
    
    // Limpiar operaciones expiradas con timeout manejado
    const timeoutId = setTimeout(() => {
      if (pendingOperations.current.has(key)) {
        pendingOperations.current.delete(key)
        debug.logEvent(`Operación ${operation.type} expirada para ID: ${operation.id}`)
        
        // Actualizar debug con operaciones pendientes actualizadas
        const currentOperations = Array.from(pendingOperations.current.values())
        debug.updatePendingOperations(currentOperations)
      }
    }, OPERATION_EXPIRY)
    
    // Almacenar timeout ID para limpieza
    operation.timeoutId = timeoutId
  }, [debug])

  // Función para verificar si una operación está pendiente
  const isOperationPending = useCallback((type: string, id: string): boolean => {
    const key = `${type}_${id}`
    return pendingOperations.current.has(key)
  }, [])

  // Función para limpiar una operación pendiente
  const clearPendingOperation = useCallback((type: string, id: string) => {
    const key = `${type}_${id}`
    const operation = pendingOperations.current.get(key)
    
    if (operation) {
      // Limpiar timeout si existe
      if (operation.timeoutId) {
        clearTimeout(operation.timeoutId)
      }
      
      pendingOperations.current.delete(key)
      debug.logEvent(`Operación ${type} completada para ID: ${id}`)
      
      // Actualizar debug con operaciones pendientes actualizadas
      const currentOperations = Array.from(pendingOperations.current.values())
      debug.updatePendingOperations(currentOperations)
    }
  }, [debug, debug.logEvent, debug.updatePendingOperations])

  // Función para verificar si los datos han cambiado realmente
  const hasDataChanged = useCallback((boxId: string, _newData: any): boolean => {
    const currentVersion = boxVersions.current.get(boxId) || 0
    const newVersion = currentVersion + 1
    
    // Incrementar versión y actualizar
    boxVersions.current.set(boxId, newVersion)
    
    // Log para debug
    debug.logEvent(`Versión de caja ${boxId} actualizada: ${currentVersion} -> ${newVersion}`)
    
    // Actualizar debug con versiones actualizadas
    const currentVersions = Object.fromEntries(boxVersions.current)
    debug.updateBoxVersions(currentVersions)
    
    return true
  }, [debug])

  // Función para obtener todas las cajas
  const fetchBoxes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('boxes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching boxes:', error)
        setError(error.message)
        return
      }

      const boxesData: Box[] = data.map(transformBoxData)
      setBoxes(boxesData)
      
      // Inicializar versiones para todas las cajas
      boxesData.forEach(box => {
        boxVersions.current.set(box.id, Date.now())
      })
      
      // Actualizar debug con versiones iniciales
      const initialVersions = Object.fromEntries(boxVersions.current)
      debug.updateBoxVersions(initialVersions)
    } catch (err) {
      console.error('Error in fetchBoxes:', err)
      setError('Error al cargar las cajas')
    } finally {
      setIsLoading(false)
    }
  }, [transformBoxData])

  // Función para configurar Realtime con deduplicación
  const setupRealtime = useCallback(() => {
    if (realtimeChannel.current) {
      return
    }

    realtimeChannel.current = supabase
      .channel('boxes_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'boxes'
        },
        (payload) => {
          console.log('Nueva caja agregada en tiempo real:', payload)
          
          // Verificar si esta operación fue iniciada localmente
          if (isOperationPending('INSERT', payload.new.id)) {
            console.log('Ignorando evento INSERT - operación local en progreso')
            debug.logEvent(`Evento INSERT ignorado - operación local en progreso para ID: ${payload.new.id}`)
            clearPendingOperation('INSERT', payload.new.id)
            return
          }
          
          const newBox = transformBoxData(payload.new)
          setBoxes(prev => [newBox, ...prev])
          notifications.notifyBoxAdded(newBox)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'boxes'
        },
        (payload) => {
          console.log('Caja actualizada en tiempo real:', payload)
          
          // Verificar si esta operación fue iniciada localmente
          if (isOperationPending('UPDATE', payload.new.id)) {
            console.log('Ignorando evento UPDATE - operación local en progreso')
            debug.logEvent(`Evento UPDATE ignorado - operación local en progreso para ID: ${payload.new.id}`)
            clearPendingOperation('UPDATE', payload.new.id)
            return
          }
          
          const updatedBox = transformBoxData(payload.new)
          
          // Solo actualizar si los datos han cambiado realmente
          if (hasDataChanged(updatedBox.id, payload.new)) {
            setBoxes(prev => prev.map(box => 
              box.id === updatedBox.id ? updatedBox : box
            ))
            
            // Determinar qué cambió
            const changes: string[] = []
            if (payload.old.current_containers !== payload.new.current_containers) {
              changes.push('envases')
            }
            if (payload.old.status !== payload.new.status) {
              changes.push('estado')
            }
            if (payload.old.location !== payload.new.location) {
              changes.push('ubicación')
            }
            
            if (changes.length > 0) {
              notifications.notifyBoxUpdated(updatedBox, changes)
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'boxes'
        },
        (payload) => {
          console.log('Caja eliminada en tiempo real:', payload)
          
          // Verificar si esta operación fue iniciada localmente
          if (isOperationPending('DELETE', payload.old.id)) {
            console.log('Ignorando evento DELETE - operación local en progreso')
            debug.logEvent(`Evento DELETE ignorado - operación local en progreso para ID: ${payload.old.id}`)
            clearPendingOperation('DELETE', payload.old.id)
            return
          }
          
          setBoxes(prev => prev.filter(box => box.id !== payload.old.id))
          notifications.notifyBoxDeleted(payload.old.id)
        }
      )
      .subscribe((status) => {
        console.log('Estado de suscripción Realtime:', status)
        if (status === 'SUBSCRIBED') {
          console.log('✅ Suscrito exitosamente a cambios en tiempo real')
          debug.logEvent('Canal Realtime suscrito exitosamente')
          notifications.notifyRealtimeConnected()
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error en el canal Realtime')
          debug.logError('Error en el canal Realtime')
          setError('Error en la conexión en tiempo real')
          notifications.notifyRealtimeDisconnected()
        }
      })
  }, [transformBoxData, notifications, isOperationPending, clearPendingOperation, hasDataChanged, debug])

  // Función para limpiar Realtime
  const cleanupRealtime = useCallback(() => {
    if (realtimeChannel.current) {
      supabase.removeChannel(realtimeChannel.current)
      realtimeChannel.current = null
    }
  }, [])

  // Configurar Realtime al montar el componente
  useEffect(() => {
    fetchBoxes()
    setupRealtime()

    // Limpiar al desmontar
    return () => {
      cleanupRealtime()
    }
  }, [fetchBoxes, setupRealtime, cleanupRealtime])

  const addBox = async (box: Omit<Box, 'id' | 'created_at'>) => {
    try {
      setError(null)
      
      // Generar ID temporal para rastrear la operación
      const tempId = `temp_${Date.now()}`
      
      // Registrar operación pendiente
      registerPendingOperation({
        id: tempId,
        type: 'INSERT',
        timestamp: Date.now(),
        data: box
      })
      
      const { data, error } = await supabase
        .from('boxes')
        .insert([
          {
            location: `POINT(${box.location.lng} ${box.location.lat})`,
            current_containers: box.current_containers,
            max_capacity: box.max_capacity,
            status: box.status,
            creator_id: box.creator_id
          }
        ])
        .select()

      if (error) {
        console.error('Error adding box:', error)
        setError(error.message)
              // Limpiar operación pendiente en caso de error
      clearPendingOperation('INSERT', tempId)
      debug.logError(`Error al agregar caja: ${error.message}`)
      return null
      }

      // Limpiar operación pendiente
      clearPendingOperation('INSERT', tempId)
      
      // No necesitamos actualizar el estado aquí porque Realtime lo hará automáticamente
      const newBox: Box = {
        ...data[0],
        location: box.location
      }

      return newBox
    } catch (err) {
      console.error('Error in addBox:', err)
      setError('Error al agregar la caja')
      return null
    }
  }

  const updateBox = async (boxId: string, updates: Partial<Box>) => {
    try {
      setError(null)
      
      // Registrar operación pendiente
      registerPendingOperation({
        id: boxId,
        type: 'UPDATE',
        timestamp: Date.now(),
        data: updates
      })
      
      const supabaseUpdates: any = { ...updates }
      
      // Si se está actualizando la ubicación, convertir a formato PostGIS
      if (updates.location) {
        supabaseUpdates.location = `POINT(${updates.location.lng} ${updates.location.lat})`
      }

      const { data, error } = await supabase
        .from('boxes')
        .update(supabaseUpdates)
        .eq('id', boxId)
        .select()

      if (error) {
        console.error('Error updating box:', error)
        setError(error.message)
        // Limpiar operación pendiente en caso de error
        clearPendingOperation('UPDATE', boxId)
        debug.logError(`Error al actualizar caja: ${error.message}`)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from update')
      }

      // Limpiar operación pendiente
      clearPendingOperation('UPDATE', boxId)
      
      // No necesitamos actualizar el estado aquí porque Realtime lo hará automáticamente
      const updatedRow = data[0]
      
      let lat = -29.4135
      let lng = -66.8568
      
      // Si estamos actualizando la ubicación, usar la nueva ubicación directamente
      if (updates.location) {
        lat = updates.location.lat
        lng = updates.location.lng
      } else {
        // Si no estamos actualizando la ubicación, buscar la caja actual en el estado
        const currentBox = boxes.find(box => box.id === boxId)
        if (currentBox) {
          // Mantener la ubicación actual
          lat = currentBox.location.lat
          lng = currentBox.location.lng
        } else if (updatedRow.location && updatedRow.location.coordinates && updatedRow.location.coordinates.length >= 2) {
          // Solo parsear la respuesta de Supabase si no encontramos la caja actual
          lat = updatedRow.location.coordinates[1]
          lng = updatedRow.location.coordinates[0]
        }
      }

      const updatedBox: Box = {
        ...updatedRow,
        location: { lat, lng }
      }

      return updatedBox
    } catch (err) {
      console.error('Error in updateBox:', err)
      setError('Error al actualizar la caja')
      throw err
    }
  }

  const deleteBox = async (boxId: string) => {
    try {
      setError(null)
      
      // Registrar operación pendiente
      registerPendingOperation({
        id: boxId,
        type: 'DELETE',
        timestamp: Date.now()
      })
      
      const { data, error } = await supabase
        .from('boxes')
        .delete()
        .eq('id', boxId)
        .select()

      if (error) {
        console.error('Error deleting box:', error)
        setError(error.message)
        // Limpiar operación pendiente en caso de error
        clearPendingOperation('DELETE', boxId)
        debug.logError(`Error al eliminar caja: ${error.message}`)
        throw error
      }

      if (!data || data.length === 0) {
        console.warn('No se eliminó ninguna fila para id:', boxId)
        // Limpiar operación pendiente
        clearPendingOperation('DELETE', boxId)
        return false
      }

      // Limpiar operación pendiente
      clearPendingOperation('DELETE', boxId)
      
      // No necesitamos actualizar el estado aquí porque Realtime lo hará automáticamente
      return true
    } catch (err) {
      console.error('Error in deleteBox:', err)
      setError('Error al eliminar la caja')
      throw err
    }
  }

  const moveBox = async (boxId: string, newLocation: { lat: number; lng: number }) => {
    return updateBox(boxId, { location: newLocation })
  }

  return {
    boxes,
    isLoading,
    error,
    addBox,
    updateBox,
    deleteBox,
    moveBox,
    refresh: fetchBoxes,
    clearError: () => setError(null),
    notifications: notifications.notifications,
    removeNotification: notifications.removeNotification,
    clearNotifications: notifications.clearNotifications,
    toggleNotifications: notifications.toggleNotifications,
    // Funciones de debug para desarrollo
    getPendingOperations: () => Array.from(pendingOperations.current.values()),
    getBoxVersions: () => Object.fromEntries(boxVersions.current),
    debug
  }
}