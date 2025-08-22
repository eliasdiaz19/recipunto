// src/components/Map/MapContainer.tsx
'use client'

import { memo, useCallback, useMemo } from 'react'
import { MapContainer as LeafletMap, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Box } from '@/lib/types'
import BoxMarker from './BoxMarker'
import LeafletConfig from './LeafletConfig'
import { useMapOptimization } from '@/hooks'

interface RecipuntoMapProps {
  boxes: Box[]
  onMapClick?: (latlng: { lat: number; lng: number }) => void
  onUpdateBox: (boxId: string, updates: Partial<Box>) => Promise<void>
  onDeleteBox: (boxId: string) => Promise<void>
  onMoveBox: (boxId: string, newLocation: { lat: number; lng: number }) => Promise<void>
  movingBoxId: string | null
  tempLocation?: { lat: number; lng: number } | null
  onStartMoving: (boxId: string) => void
  onCancelMoving: () => void
  onShowUpdateForm: (box: Box) => void
}

const MapClickHandler = memo(function MapClickHandler({ 
  onMapClick
}: { 
  onMapClick?: (latlng: { lat: number; lng: number }) => void
}) {
  const { throttle } = useMapOptimization({ throttleDelay: 100 })

  const handleMapEvent = useCallback((e: any) => {
    // Verificar que el evento sea directamente en el contenedor del mapa
    if (e.originalEvent.target.classList.contains('leaflet-container')) {
      if (onMapClick) {
        throttle(() => onMapClick(e.latlng))
      }
    }
  }, [onMapClick, throttle])

  useMapEvents({
    click: (e) => handleMapEvent(e),
  })
  
  return null
})

const RecipuntoMap = memo(function RecipuntoMap({ 
  boxes, 
  onMapClick, 
  onUpdateBox, 
  onDeleteBox, 
  onMoveBox,
  movingBoxId,
  tempLocation,
  onStartMoving,
  onCancelMoving,
  onShowUpdateForm
}: RecipuntoMapProps) {
  // Memoizar las funciones de callback para evitar re-renders innecesarios
  const memoizedOnMoveBox = useCallback((boxId: string, newLocation: { lat: number; lng: number }) => {
    return onMoveBox(boxId, newLocation)
  }, [onMoveBox])
  
  const memoizedOnStartMoving = useCallback((boxId: string) => {
    return onStartMoving(boxId)
  }, [onStartMoving])
  
  const memoizedOnCancelMoving = useCallback(() => {
    return onCancelMoving()
  }, [onCancelMoving])
  
  const memoizedOnShowUpdateForm = useCallback((box: Box) => {
    return onShowUpdateForm(box)
  }, [onShowUpdateForm])

  // Memoizar los marcadores para evitar re-renders cuando no cambian
  const markers = useMemo(() => 
    boxes.map(box => (
      <BoxMarker 
        key={box.id} 
        box={box} 
        onMove={memoizedOnMoveBox}
        isMovingMode={movingBoxId === box.id}
        tempLocation={movingBoxId === box.id ? tempLocation : null}
        onStartMoving={memoizedOnStartMoving}
        onCancelMoving={memoizedOnCancelMoving}
        onShowUpdateForm={memoizedOnShowUpdateForm}
      />
    ))
  , [boxes, movingBoxId, tempLocation, memoizedOnMoveBox, memoizedOnStartMoving, memoizedOnCancelMoving, memoizedOnShowUpdateForm])

  return (
    <LeafletMap
      center={[-29.4135, -66.8568]}
      zoom={14}
      style={{ height: '100vh', width: '100%' }}
    >
      <LeafletConfig />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler 
        onMapClick={onMapClick}
      />
      {markers}
    </LeafletMap>
  )
})

export default RecipuntoMap