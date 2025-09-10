'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type SetValue<T> = T | ((val: T) => T)

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string
    deserialize?: (value: string) => T
    syncAcrossTabs?: boolean
  }
) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossTabs = true
  } = options || {}

  // Estado para el valor actual
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? deserialize(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Ref para evitar loops infinitos
  const setValueRef = useRef<SetValue<T>>()

  const setValue = useCallback((value: SetValue<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      setValueRef.current = value

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serialize(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, serialize, storedValue])

  // Sincronización entre pestañas
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue)
          setStoredValue(newValue)
        } catch (error) {
          console.warn(`Error deserializing localStorage key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, deserialize, syncAcrossTabs])

  // Función para remover el item del localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}

// Hook para manejar arrays en localStorage
export function useLocalStorageArray<T>(
  key: string,
  initialValue: T[] = []
) {
  return useLocalStorage<T[]>(key, initialValue, {
    serialize: (value) => JSON.stringify(value),
    deserialize: (value) => {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : initialValue
      } catch {
        return initialValue
      }
    }
  })
}

// Hook para manejar objetos en localStorage
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  initialValue: T
) {
  return useLocalStorage<T>(key, initialValue, {
    serialize: (value) => JSON.stringify(value),
    deserialize: (value) => {
      try {
        const parsed = JSON.parse(value)
        return typeof parsed === 'object' && parsed !== null ? parsed : initialValue
      } catch {
        return initialValue
      }
    }
  })
}

// Hook para manejar booleanos en localStorage
export function useLocalStorageBoolean(
  key: string,
  initialValue: boolean = false
) {
  return useLocalStorage<boolean>(key, initialValue, {
    serialize: (value) => value.toString(),
    deserialize: (value) => value === 'true'
  })
}

// Hook para manejar números en localStorage
export function useLocalStorageNumber(
  key: string,
  initialValue: number = 0
) {
  return useLocalStorage<number>(key, initialValue, {
    serialize: (value) => value.toString(),
    deserialize: (value) => {
      const parsed = Number(value)
      return isNaN(parsed) ? initialValue : parsed
    }
  })
}

