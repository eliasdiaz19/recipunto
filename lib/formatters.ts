// Utilidades de formateo inspiradas en el proyecto uber-main

/**
 * Formatea una fecha en formato legible
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formatea una fecha con hora
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Formatea la capacidad de una caja
 */
export const formatCapacity = (current: number, total: number): string => {
  const percentage = Math.round((current / total) * 100)
  return `${current}/${total} (${percentage}%)`
}

/**
 * Formatea la capacidad como porcentaje
 */
export const formatCapacityPercentage = (current: number, total: number): string => {
  const percentage = Math.round((current / total) * 100)
  return `${percentage}%`
}

/**
 * Formatea la distancia en metros o kilómetros
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

/**
 * Formatea el tiempo en minutos o horas
 */
export const formatTime = (minutes: number): string => {
  const formattedMinutes = Math.round(minutes)

  if (formattedMinutes < 60) {
    return `${formattedMinutes} min`
  } else {
    const hours = Math.floor(formattedMinutes / 60)
    const remainingMinutes = formattedMinutes % 60
    return `${hours}h ${remainingMinutes}m`
  }
}

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('es-ES')
}

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`
}

/**
 * Formatea coordenadas para mostrar
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

/**
 * Formatea el estado de una caja
 */
export const formatBoxStatus = (isFull: boolean): string => {
  return isFull ? 'Llena' : 'Disponible'
}

/**
 * Formatea el estado de una caja con emoji
 */
export const formatBoxStatusWithEmoji = (isFull: boolean): string => {
  return isFull ? '📦 Llena' : '📦 Disponible'
}

/**
 * Formatea el nombre de usuario
 */
export const formatUserName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return 'Usuario'
  if (!firstName) return lastName!
  if (!lastName) return firstName
  return `${firstName} ${lastName}`
}

/**
 * Formatea el email para mostrar (oculta parte del dominio)
 */
export const formatEmail = (email: string): string => {
  const [username, domain] = email.split('@')
  if (username.length <= 3) return email
  const hiddenUsername = username.substring(0, 3) + '***'
  return `${hiddenUsername}@${domain}`
}
