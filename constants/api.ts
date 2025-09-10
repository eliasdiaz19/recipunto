// Constantes relacionadas con la API

export const API_CONFIG = {
  // URLs base
  BASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  
  // Timeouts
  TIMEOUT: 10000, // 10 segundos
  
  // Reintentos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 segundo
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const

export const API_ENDPOINTS = {
  // Cajas
  BOXES: '/boxes',
  BOX_BY_ID: (id: string) => `/boxes/${id}`,
  
  // Usuarios
  USERS: '/users',
  USER_PROFILE: (id: string) => `/users/${id}/profile`,
  
  // Autenticación
  AUTH: {
    SIGN_IN: '/auth/signin',
    SIGN_UP: '/auth/signup',
    SIGN_OUT: '/auth/signout',
    REFRESH: '/auth/refresh',
  },
  
  // Notificaciones
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (id: string) => `/notifications/${id}`,
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  TIMEOUT_ERROR: 'La solicitud tardó demasiado. Intenta de nuevo.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  VALIDATION_ERROR: 'Los datos proporcionados no son válidos.',
  SERVER_ERROR: 'Error interno del servidor. Intenta más tarde.',
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.',
} as const
