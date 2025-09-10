// Tipos principales del sistema
export * from './box'
export * from './user'
export * from './common'

// Re-exportar tipos existentes para compatibilidad
export type { RecyclingBox } from './box'
export type { User, UserProfile } from './user'
export type { DatabaseBox, CreateBoxData, UpdateBoxData } from './box'
