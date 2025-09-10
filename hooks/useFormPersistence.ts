'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocalStorage, useLocalStorageObject } from './useLocalStorage'

export interface FormPersistenceOptions {
  debounceMs?: number
  autoSave?: boolean
  validateBeforeSave?: (data: any) => boolean
  onSave?: (data: any) => void
  onLoad?: (data: any) => void
}

export function useFormPersistence<T extends Record<string, any>>(
  formKey: string,
  initialData: T,
  options: FormPersistenceOptions = {}
) {
  const {
    debounceMs = 1000,
    autoSave = true,
    validateBeforeSave = () => true,
    onSave,
    onLoad
  } = options

  const [formData, setFormData] = useLocalStorageObject(formKey, initialData)
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Debounced save function
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (data: T) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(async () => {
          if (validateBeforeSave(data)) {
            setIsSaving(true)
            try {
              onSave?.(data)
              setLastSaved(new Date())
              setIsDirty(false)
            } catch (error) {
              console.error('Error saving form data:', error)
            } finally {
              setIsSaving(false)
            }
          }
        }, debounceMs)
      }
    })(),
    [debounceMs, validateBeforeSave, onSave]
  )

  // Update form data
  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      if (autoSave) {
        debouncedSave(newData)
      }
      return newData
    })
    setIsDirty(true)
  }, [setFormData, autoSave, debouncedSave])

  // Update multiple fields at once
  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates }
      if (autoSave) {
        debouncedSave(newData)
      }
      return newData
    })
    setIsDirty(true)
  }, [setFormData, autoSave, debouncedSave])

  // Manual save
  const save = useCallback(async () => {
    if (validateBeforeSave(formData)) {
      setIsSaving(true)
      try {
        onSave?.(formData)
        setLastSaved(new Date())
        setIsDirty(false)
      } catch (error) {
        console.error('Error saving form data:', error)
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  }, [formData, validateBeforeSave, onSave])

  // Reset form
  const reset = useCallback(() => {
    setFormData(initialData)
    setIsDirty(false)
    setLastSaved(null)
  }, [setFormData, initialData])

  // Clear form data from localStorage
  const clear = useCallback(() => {
    setFormData(initialData)
    setIsDirty(false)
    setLastSaved(null)
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(formKey)
    }
  }, [setFormData, initialData, formKey])

  // Load callback effect
  useEffect(() => {
    if (onLoad) {
      onLoad(formData)
    }
  }, [formData, onLoad])

  return {
    formData,
    updateField,
    updateFields,
    save,
    reset,
    clear,
    isDirty,
    isSaving,
    lastSaved
  }
}

// Hook específico para formularios de cajas de reciclaje
export function useBoxFormPersistence(initialData: any = {}) {
  const defaultBoxData = {
    lat: 0,
    lng: 0,
    currentAmount: 0,
    capacity: 50,
    isFull: false,
    notes: '',
    ...initialData
  }

  const validateBoxData = (data: any) => {
    return (
      typeof data.lat === 'number' &&
      typeof data.lng === 'number' &&
      typeof data.capacity === 'number' &&
      data.capacity > 0 &&
      typeof data.currentAmount === 'number' &&
      data.currentAmount >= 0 &&
      data.currentAmount <= data.capacity
    )
  }

  return useFormPersistence('box-form-data', defaultBoxData, {
    validateBeforeSave: validateBoxData,
    debounceMs: 2000,
    onSave: (data) => {
      console.log('Box form data saved:', data)
    }
  })
}

// Hook para formularios de usuario
export function useUserFormPersistence(initialData: any = {}) {
  const defaultUserData = {
    fullName: '',
    email: '',
    phone: '',
    preferences: {
      notifications: true,
      theme: 'system',
      language: 'es'
    },
    ...initialData
  }

  return useFormPersistence('user-form-data', defaultUserData, {
    debounceMs: 1500,
    onSave: (data) => {
      console.log('User form data saved:', data)
    }
  })
}
