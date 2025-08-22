'use client'

import { useState } from 'react'
import { Box } from '@/lib/types'

interface MoveBoxFormProps {
  box: Box
  onMove: (boxId: string, newLocation: { lat: number; lng: number }) => Promise<void>
  onCancel: () => void
}

export default function MoveBoxForm({ box, onMove, onCancel }: MoveBoxFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [newLocation, setNewLocation] = useState<{ lat: number; lng: number } | null>(null)

  const handleMapClick = (e: any) => {
    // Obtener las coordenadas del clic en el mapa
    const { lat, lng } = e.latlng
    setNewLocation({ lat, lng })
  }

  const handleConfirmMove = async () => {
    if (!newLocation) return
    
    setIsLoading(true)
    try {
      await onMove(box.id, newLocation)
    } catch (error) {
      console.error('Error moving box:', error)
      alert('Error al mover la caja. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-64">
      <h3 className="font-bold mb-2">Mover Caja</h3>
      
      <div className="mb-3">
        <p className="text-sm text-gray-600">
          Haz clic en el mapa para seleccionar la nueva ubicación para la caja.
        </p>
        {newLocation && (
          <p className="text-xs mt-1">
            Nueva ubicación: {newLocation.lat.toFixed(4)}, {newLocation.lng.toFixed(4)}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <button
          onClick={handleConfirmMove}
          disabled={!newLocation || isLoading}
          className="bg-blue-500 text-white py-2 rounded disabled:bg-blue-300"
        >
          {isLoading ? 'Moviendo...' : 'Confirmar ubicación'}
        </button>
        
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 py-2 rounded"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}