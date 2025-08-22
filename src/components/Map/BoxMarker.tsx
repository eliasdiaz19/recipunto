// src/components/Map/BoxMarker.tsx
'use client'

import { memo, useCallback, useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { Box } from '@/lib/types'
import StatusBadge from '../BoxStatus/StatusBadge'
import ContainerCounter from '../BoxStatus/ContainerCounter'
// UpdateBoxForm se usa en el componente padre

interface BoxMarkerProps {
  box: Box
  onMove: (boxId: string, newLocation: { lat: number; lng: number }) => Promise<void>
  isMovingMode?: boolean
  tempLocation?: { lat: number; lng: number } | null
  onStartMoving: (boxId: string) => void
  onCancelMoving: () => void
  onShowUpdateForm: (box: Box) => void
}

const BoxMarker = memo(function BoxMarker({ 
  box, 
  onMove, 
  isMovingMode,
  tempLocation,
  onStartMoving,
  onCancelMoving,
  onShowUpdateForm
}: BoxMarkerProps) {
  const handleMove = useCallback(async (newLocation: { lat: number; lng: number }) => {
    await onMove(box.id, newLocation)
    onCancelMoving()
  }, [box.id, onMove, onCancelMoving])

  const handleShowUpdateForm = useCallback(() => {
    onShowUpdateForm(box)
  }, [box, onShowUpdateForm])

  const markerPosition = useMemo<LatLngExpression>(() => (
    tempLocation ? [tempLocation.lat, tempLocation.lng] : [box.location.lat, box.location.lng]
  ), [tempLocation, box.location.lat, box.location.lng])

  const createdDate = useMemo(() => 
    new Date(box.created_at).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  , [box.created_at])

  return (
    <Marker position={markerPosition}>
      <Popup className="min-w-[280px] mobile-popup">
        {isMovingMode ? (
          <div className="p-4 space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mover Caja</h3>
              {tempLocation ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Nueva ubicación seleccionada. Haz clic en &quot;Confirmar&quot; para mover la caja.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleMove(tempLocation)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 btn-mobile"
                    >
                      Confirmar movimiento
                    </button>
                    <button
                      onClick={onCancelMoving}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 btn-mobile"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Haz clic en cualquier lugar del mapa para colocar la caja en una nueva ubicación.
                  </p>
                  <button
                    onClick={onCancelMoving}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 btn-mobile"
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="text-center border-b border-gray-200 pb-3">
              <div className="text-lg font-bold text-gray-900 mb-2">Caja de reciclaje</div>
              <StatusBadge status={box.status} />
            </div>
            
            {/* Información de la caja */}
            <div className="space-y-3">
              <ContainerCounter current={box.current_containers} max={box.max_capacity} />
              <p className="text-sm text-gray-500 text-center">
                Creada el {createdDate}
              </p>
            </div>
            
            {/* Botones de acción */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleShowUpdateForm}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 btn-mobile"
              >
                Gestionar caja
              </button>

              <button
                onClick={() => onStartMoving(box.id)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 btn-mobile"
              >
                Mover caja
              </button>
            </div>
          </div>
        )}
      </Popup>
    </Marker>
  )
})

export default BoxMarker