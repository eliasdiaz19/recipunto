// Utilidades de validación inspiradas en el proyecto uber-main

import type { RecyclingBox, BoxFormData } from '@/types/box'

/**
 * Valida los datos de una caja
 */
export const validateBoxData = (data: Partial<RecyclingBox>): string[] => {
  const errors: string[] = []
  
  // Validar coordenadas
  if (data.lat !== undefined) {
    if (typeof data.lat !== 'number' || data.lat < -90 || data.lat > 90) {
      errors.push('La latitud debe ser un número entre -90 y 90')
    }
  }
  
  if (data.lng !== undefined) {
    if (typeof data.lng !== 'number' || data.lng < -180 || data.lng > 180) {
      errors.push('La longitud debe ser un número entre -180 y 180')
    }
  }
  
  // Validar capacidad
  if (data.capacity !== undefined) {
    if (typeof data.capacity !== 'number' || data.capacity <= 0) {
      errors.push('La capacidad debe ser un número mayor a 0')
    }
  }
  
  // Validar cantidad actual
  if (data.currentAmount !== undefined) {
    if (typeof data.currentAmount !== 'number' || data.currentAmount < 0) {
      errors.push('La cantidad actual no puede ser negativa')
    }
    
    if (data.capacity && data.currentAmount > data.capacity) {
      errors.push('La cantidad actual no puede ser mayor que la capacidad')
    }
  }
  
  return errors
}

/**
 * Valida los datos del formulario de caja
 */
export const validateBoxFormData = (data: BoxFormData): string[] => {
  const errors: string[] = []
  
  // Validar latitud
  const lat = parseFloat(data.lat)
  if (isNaN(lat) || lat < -90 || lat > 90) {
    errors.push('La latitud debe ser un número válido entre -90 y 90')
  }
  
  // Validar longitud
  const lng = parseFloat(data.lng)
  if (isNaN(lng) || lng < -180 || lng > 180) {
    errors.push('La longitud debe ser un número válido entre -180 y 180')
  }
  
  // Validar capacidad
  const capacity = parseFloat(data.capacity)
  if (isNaN(capacity) || capacity <= 0) {
    errors.push('La capacidad debe ser un número mayor a 0')
  }
  
  // Validar cantidad actual
  const currentAmount = parseFloat(data.currentAmount)
  if (isNaN(currentAmount) || currentAmount < 0) {
    errors.push('La cantidad actual no puede ser negativa')
  }
  
  if (!isNaN(capacity) && !isNaN(currentAmount) && currentAmount > capacity) {
    errors.push('La cantidad actual no puede ser mayor que la capacidad')
  }
  
  return errors
}

/**
 * Valida un email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida una contraseña
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('La contraseña debe contener al menos un número')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Valida coordenadas de un punto
 */
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

/**
 * Valida que un string no esté vacío
 */
export const validateNotEmpty = (value: string, fieldName: string): string | null => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} es requerido`
  }
  return null
}

/**
 * Valida que un número esté en un rango
 */
export const validateRange = (
  value: number, 
  min: number, 
  max: number, 
  fieldName: string
): string | null => {
  if (value < min || value > max) {
    return `${fieldName} debe estar entre ${min} y ${max}`
  }
  return null
}

/**
 * Valida que un string tenga una longitud mínima
 */
export const validateMinLength = (
  value: string, 
  minLength: number, 
  fieldName: string
): string | null => {
  if (value.length < minLength) {
    return `${fieldName} debe tener al menos ${minLength} caracteres`
  }
  return null
}

/**
 * Valida que un string tenga una longitud máxima
 */
export const validateMaxLength = (
  value: string, 
  maxLength: number, 
  fieldName: string
): string | null => {
  if (value.length > maxLength) {
    return `${fieldName} no puede tener más de ${maxLength} caracteres`
  }
  return null
}

/**
 * Valida un número de teléfono (formato español)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+34|0034|34)?[6|7|8|9][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Valida una URL
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
