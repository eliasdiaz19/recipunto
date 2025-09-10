// Tipos relacionados con usuarios

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    first_name?: string
    last_name?: string
    avatar_url?: string
  }
}

export interface UserStats {
  totalBoxes: number
  boxesCreated: number
  boxesUpdated: number
  lastActivity: Date
  joinDate: Date
}
