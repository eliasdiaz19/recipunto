// Tipos relacionados con cajas de reciclaje

export interface RecyclingBox {
  id: string
  lat: number
  lng: number
  currentAmount: number
  capacity: number
  isFull: boolean
  createdBy: string
  createdAt: Date
  lastUpdated: Date
}

export interface DatabaseBox {
  id: string
  lat: number
  lng: number
  current_amount: number
  capacity: number
  is_full: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateBoxData {
  lat: number
  lng: number
  current_amount: number
  capacity: number
  is_full: boolean
}

export interface UpdateBoxData {
  lat?: number
  lng?: number
  current_amount?: number
  capacity?: number
  is_full?: boolean
}

export interface BoxFormData {
  lat: string
  lng: string
  currentAmount: string
  capacity: string
  isFull: boolean
}

export interface BoxFilters {
  isFull?: boolean
  minCapacity?: number
  maxCapacity?: number
  createdBy?: string
}

export interface BoxStats {
  total: number
  full: number
  available: number
  totalCapacity: number
  usedCapacity: number
  utilizationRate: number
}
