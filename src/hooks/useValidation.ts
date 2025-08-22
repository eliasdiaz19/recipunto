'use client'

import { useCallback } from 'react'

// Validaciones específicas para el dominio de la aplicación
export function useValidation() {
  // Validar email
  const validateEmail = useCallback((email: string): string | null => {
    if (!email) return 'El email es requerido'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Formato de email inválido'
    }
    
    return null
  }, [])

  // Validar contraseña
  const validatePassword = useCallback((password: string): string | null => {
    if (!password) return 'La contraseña es requerida'
    
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }
    
    return null
  }, [])

  // Validar capacidad de caja
  const validateBoxCapacity = useCallback((capacity: number): string | null => {
    if (!capacity || capacity <= 0) {
      return 'La capacidad debe ser mayor a 0'
    }
    
    if (capacity > 1000) {
      return 'La capacidad no puede superar 1000'
    }
    
    return null
  }, [])

  // Validar cantidad de envases
  const validateContainers = useCallback((containers: number, maxCapacity: number): string | null => {
    if (containers < 0) {
      return 'La cantidad no puede ser negativa'
    }
    
    if (containers > maxCapacity) {
      return `La cantidad no puede superar la capacidad máxima (${maxCapacity})`
    }
    
    return null
  }, [])

  // Validar nombre de usuario
  const validateUsername = useCallback((username: string): string | null => {
    if (!username) return 'El nombre de usuario es requerido'
    
    if (username.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres'
    }
    
    if (username.length > 20) {
      return 'El nombre no puede superar 20 caracteres'
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(username)) {
      return 'El nombre solo puede contener letras, números y guiones bajos'
    }
    
    return null
  }, [])

  // Validar número entero positivo
  const validatePositiveInteger = useCallback((value: string): string | null => {
    if (!value) return 'Este campo es requerido'
    
    const num = parseInt(value)
    if (isNaN(num)) {
      return 'Debe ser un número válido'
    }
    
    if (num < 0) {
      return 'Debe ser un número positivo'
    }
    
    return null
  }, [])

  // Validar coordenadas de ubicación
  const validateLocation = useCallback((lat: number, lng: number): string | null => {
    if (lat < -90 || lat > 90) {
      return 'Latitud inválida'
    }
    
    if (lng < -180 || lng > 180) {
      return 'Longitud inválida'
    }
    
    return null
  }, [])

  return {
    validateEmail,
    validatePassword,
    validateBoxCapacity,
    validateContainers,
    validateUsername,
    validatePositiveInteger,
    validateLocation
  }
}
