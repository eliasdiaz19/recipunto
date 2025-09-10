import { useMemo } from "react"
import type { DatabaseBox, RecyclingBox } from "@/types/box"

// Función de conversión DatabaseBox -> RecyclingBox
export function convertDatabaseBoxToLegacy(dbBox: DatabaseBox): RecyclingBox {
  return {
    id: dbBox.id,
    lat: dbBox.lat,
    lng: dbBox.lng,
    currentAmount: dbBox.current_amount,
    capacity: dbBox.capacity,
    isFull: dbBox.is_full,
    createdBy: dbBox.created_by,
    createdAt: new Date(dbBox.created_at),
    lastUpdated: new Date(dbBox.updated_at),
  }
}

// Función de conversión RecyclingBox -> DatabaseBox (para operaciones)
export function convertLegacyBoxToDatabase(legacyBox: Omit<RecyclingBox, "id" | "createdAt" | "lastUpdated"> | RecyclingBox): Omit<DatabaseBox, "id" | "created_at" | "updated_at" | "created_by"> {
  return {
    lat: legacyBox.lat,
    lng: legacyBox.lng,
    current_amount: legacyBox.currentAmount,
    capacity: legacyBox.capacity,
    is_full: legacyBox.isFull,
  }
}

// Hook para convertir array de DatabaseBox a RecyclingBox
export function useBoxConversion(dbBoxes: DatabaseBox[]): RecyclingBox[] {
  return useMemo(() => {
    return dbBoxes.map(convertDatabaseBoxToLegacy)
  }, [dbBoxes])
}
