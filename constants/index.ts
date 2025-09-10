// Constantes principales del sistema
export * from './map'
export * from './ui'
export * from './api'

// Constantes generales
export const APP_NAME = 'Recipunto'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Sistema de gestión de cajas de reciclaje'

// Configuración de la aplicación
export const APP_CONFIG = {
  name: APP_NAME,
  version: APP_VERSION,
  description: APP_DESCRIPTION,
  defaultLanguage: 'es',
  supportedLanguages: ['es', 'en'],
} as const

// Estados de la aplicación
export const APP_STATES = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  IDLE: 'idle',
} as const

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const
