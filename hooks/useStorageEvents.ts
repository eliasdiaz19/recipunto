'use client'

import { useEffect, useCallback, useRef } from 'react'

export type StorageEventType = 'set' | 'remove' | 'clear' | 'change'

export interface StorageEventData {
  key: string
  value: any
  oldValue?: any
  type: StorageEventType
  timestamp: number
}

export type StorageEventListener = (data: StorageEventData) => void

class StorageEventManager {
  private listeners: Map<string, Set<StorageEventListener>> = new Map()
  private isListening = false

  addListener(key: string, listener: StorageEventListener) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    this.listeners.get(key)!.add(listener)

    if (!this.isListening) {
      this.startListening()
    }
  }

  removeListener(key: string, listener: StorageEventListener) {
    const keyListeners = this.listeners.get(key)
    if (keyListeners) {
      keyListeners.delete(listener)
      if (keyListeners.size === 0) {
        this.listeners.delete(key)
      }
    }

    if (this.listeners.size === 0) {
      this.stopListening()
    }
  }

  private startListening() {
    if (typeof window === 'undefined' || this.isListening) return

    this.isListening = true

    // Interceptar localStorage.setItem
    const originalSetItem = localStorage.setItem
    localStorage.setItem = (key: string, value: string) => {
      const oldValue = localStorage.getItem(key)
      const result = originalSetItem.call(localStorage, key, value)
      
      this.notifyListeners(key, {
        key,
        value: this.parseValue(value),
        oldValue: oldValue ? this.parseValue(oldValue) : undefined,
        type: 'set',
        timestamp: Date.now()
      })
      
      return result
    }

    // Interceptar localStorage.removeItem
    const originalRemoveItem = localStorage.removeItem
    localStorage.removeItem = (key: string) => {
      const oldValue = localStorage.getItem(key)
      const result = originalRemoveItem.call(localStorage, key)
      
      this.notifyListeners(key, {
        key,
        value: null,
        oldValue: oldValue ? this.parseValue(oldValue) : undefined,
        type: 'remove',
        timestamp: Date.now()
      })
      
      return result
    }

    // Interceptar localStorage.clear
    const originalClear = localStorage.clear
    localStorage.clear = () => {
      const allKeys = Object.keys(localStorage)
      const result = originalClear.call(localStorage)
      
      allKeys.forEach(key => {
        this.notifyListeners(key, {
          key,
          value: null,
          oldValue: undefined,
          type: 'clear',
          timestamp: Date.now()
        })
      })
      
      return result
    }

    // Escuchar eventos de storage entre pestañas
    window.addEventListener('storage', this.handleStorageChange)
  }

  private stopListening() {
    if (!this.isListening) return

    this.isListening = false
    window.removeEventListener('storage', this.handleStorageChange)
  }

  private handleStorageChange = (e: StorageEvent) => {
    this.notifyListeners(e.key, {
      key: e.key,
      value: e.newValue ? this.parseValue(e.newValue) : null,
      oldValue: e.oldValue ? this.parseValue(e.oldValue) : undefined,
      type: 'change',
      timestamp: Date.now()
    })
  }

  private parseValue(value: string) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  private notifyListeners(key: string, data: StorageEventData) {
    const keyListeners = this.listeners.get(key)
    if (keyListeners) {
      keyListeners.forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error('Error in storage event listener:', error)
        }
      })
    }

    // Notificar a listeners globales (key = '*')
    const globalListeners = this.listeners.get('*')
    if (globalListeners) {
      globalListeners.forEach(listener => {
        try {
          listener(data)
        } catch (error) {
          console.error('Error in global storage event listener:', error)
        }
      })
    }
  }
}

const storageEventManager = new StorageEventManager()

export function useStorageEvents() {
  const listenersRef = useRef<Map<string, StorageEventListener>>(new Map())

  const addListener = useCallback((key: string, listener: StorageEventListener) => {
    storageEventManager.addListener(key, listener)
    listenersRef.current.set(key, listener)
  }, [])

  const removeListener = useCallback((key: string) => {
    const listener = listenersRef.current.get(key)
    if (listener) {
      storageEventManager.removeListener(key, listener)
      listenersRef.current.delete(key)
    }
  }, [])

  const addGlobalListener = useCallback((listener: StorageEventListener) => {
    storageEventManager.addListener('*', listener)
    listenersRef.current.set('*', listener)
  }, [])

  const removeGlobalListener = useCallback(() => {
    const listener = listenersRef.current.get('*')
    if (listener) {
      storageEventManager.removeListener('*', listener)
      listenersRef.current.delete('*')
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      listenersRef.current.forEach((listener, key) => {
        storageEventManager.removeListener(key, listener)
      })
      listenersRef.current.clear()
    }
  }, [])

  return {
    addListener,
    removeListener,
    addGlobalListener,
    removeGlobalListener
  }
}

// Hook específico para escuchar cambios en una clave específica
export function useStorageListener<T>(
  key: string,
  callback: (data: StorageEventData & { value: T }) => void,
  options: { immediate?: boolean } = {}
) {
  const { addListener, removeListener } = useStorageEvents()

  useEffect(() => {
    const listener = (data: StorageEventData) => {
      if (data.key === key) {
        callback(data as StorageEventData & { value: T })
      }
    }

    addListener(key, listener)

    // Ejecutar callback inmediatamente si se solicita
    if (options.immediate && typeof window !== 'undefined') {
      const currentValue = localStorage.getItem(key)
      if (currentValue) {
        try {
          const parsedValue = JSON.parse(currentValue)
          callback({
            key,
            value: parsedValue,
            type: 'set',
            timestamp: Date.now()
          })
        } catch {
          callback({
            key,
            value: currentValue as T,
            type: 'set',
            timestamp: Date.now()
          })
        }
      }
    }

    return () => removeListener(key)
  }, [key, callback, addListener, removeListener, options.immediate])
}

// Hook para sincronizar datos entre componentes
export function useStorageSync<T>(
  key: string,
  value: T,
  setValue: (value: T) => void
) {
  useStorageListener<T>(key, (data) => {
    if (data.value !== value) {
      setValue(data.value)
    }
  }, { immediate: true })
}

