"use client"

import { useState, useCallback, useEffect } from "react"
import { MapHeader } from "./map-header"
import dynamic from "next/dynamic"

const InteractiveMap = dynamic(() => import("./interactive-map").then(mod => ({ default: mod.InteractiveMap })), {
  ssr: false,
  loading: () => (
    <div className="relative h-full w-full bg-green-50 flex items-center justify-center" style={{ minHeight: "400px" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-green-700 mb-2">Cargando mapa interactivo</p>
        <p className="text-sm text-green-600">Preparando tu experiencia de reciclaje...</p>
      </div>
    </div>
  )
})
import { Suspense } from "react"
import { ModalSkeleton } from "@/components/ui/skeleton"

const AddBoxModal = dynamic(() => import("./add-box-modal").then(mod => ({ default: mod.AddBoxModal })), {
  loading: () => <ModalSkeleton />
})

const UpdateBoxModal = dynamic(() => import("./update-box-modal").then(mod => ({ default: mod.UpdateBoxModal })), {
  loading: () => <ModalSkeleton />
})

const ConfirmMoveModal = dynamic(() => import("./confirm-move-modal").then(mod => ({ default: mod.ConfirmMoveModal })), {
  loading: () => <ModalSkeleton />
})
import { NotificationTriggers } from "../notifications/notification-triggers"
import { useToast } from "@/hooks/use-toast"
import { useBoxes } from "@/hooks/useBoxes"
import { useAuth } from "@/hooks/useAuth"
import { useBoxConversion, convertLegacyBoxToDatabase } from "@/hooks/useBoxConversion"
import type { RecyclingBox } from "@/types/box"
import { useBoxContext, useSelectedBoxSync } from "@/contexts/BoxContext"
import { useBoxStore } from "@/store/boxStore"
import type { CreateBoxData, UpdateBoxData } from "@/lib/boxes"

// Re-export del tipo para compatibilidad (opcional)
export type { RecyclingBox }

export function MapInterface() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [boxUpdates, setBoxUpdates] = useState<Array<{ boxId: string; isFull: boolean; previouslyFull?: boolean }>>([])
  const [clickedCoordinates, setClickedCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isMovingBox, setIsMovingBox] = useState(false)
  const [boxToMove, setBoxToMove] = useState<RecyclingBox | null>(null)
  const [isConfirmMoveModalOpen, setIsConfirmMoveModalOpen] = useState(false)
  const [newMoveCoordinates, setNewMoveCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const { toast } = useToast()
  
  // Use real-time boxes hook
  const { boxes: dbBoxes, loading, error, createBox, updateBox, updateBoxStatus, deleteBox } = useBoxes()
  const { user } = useAuth()
  
  // Convert database boxes to legacy format for existing components
  const boxes = useBoxConversion(dbBoxes)

  // Use selectedBox desde el store (solo lectura) y acciones del contexto para mantener API
  const selectedBox = useBoxStore((s) => s.selectedBox)
  const { setSelectedBox, clearSelectedBox } = useBoxContext()
  
  // Keep selectedBox in sync with real-time data
  useSelectedBoxSync(boxes)

  const handleAddBox = async (newBox: Omit<RecyclingBox, "id" | "createdAt" | "lastUpdated">) => {
    try {
      const boxData: CreateBoxData = convertLegacyBoxToDatabase(newBox)
      
      await createBox(boxData)
      setIsAddModalOpen(false)
      setClickedCoordinates(null)
      
      toast({
        title: "¡Caja creada!",
        description: "La caja de reciclaje ha sido creada exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la caja. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBox = async (updatedBox: RecyclingBox) => {
    try {
      const updateData: UpdateBoxData = convertLegacyBoxToDatabase(updatedBox)
      
      await updateBox(updatedBox.id, updateData)
      // No cerrar el modal automáticamente para que el usuario pueda ver los cambios en tiempo real
      
      toast({
        title: "¡Caja actualizada!",
        description: "La información de la caja ha sido actualizada",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la caja. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateBoxStatus = async (boxId: string, currentAmount: number, isFull: boolean) => {
    try {
      await updateBoxStatus(boxId, { current_amount: currentAmount, is_full: isFull })
      // No cerrar el modal automáticamente para que el usuario pueda ver los cambios en tiempo real
      
      toast({
        title: "¡Estado actualizado!",
        description: "La cantidad de envases ha sido actualizada",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la caja. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBox = useCallback(
    async (boxId: string) => {
      if (window.confirm("¿Estás seguro de que quieres eliminar esta caja?")) {
        try {
          await deleteBox(boxId)
          setSelectedBox(null)
          toast({
            title: "Caja eliminada",
            description: "La caja ha sido eliminada correctamente",
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo eliminar la caja. Inténtalo de nuevo.",
            variant: "destructive",
          })
        }
      }
    },
    [deleteBox, toast],
  )

  const handleMoveBox = (boxId: string) => {
    const box = boxes.find((b) => b.id === boxId)
    if (box) {
      setBoxToMove(box)
      setIsMovingBox(true)
      clearSelectedBox()
    }
  }

  const handleCancelMove = () => {
    setIsMovingBox(false)
    setBoxToMove(null)
  }

  const handleConfirmMove = async () => {
    if (!boxToMove || !newMoveCoordinates) return

    try {
      // Update the box location in the database
      await updateBox(boxToMove.id, {
        lat: newMoveCoordinates.lat,
        lng: newMoveCoordinates.lng,
      })
      
      // Reset all move-related states
      setIsMovingBox(false)
      setBoxToMove(null)
      setIsConfirmMoveModalOpen(false)
      setNewMoveCoordinates(null)
      
    } catch (error) {
      console.error("Error moving box:", error)
    }
  }

  const handleCancelConfirmMove = () => {
    setIsConfirmMoveModalOpen(false)
    setNewMoveCoordinates(null)
    // Keep the move mode active so user can try again
  }

  // Use useCallback for handleMapClick to prevent recreation
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      console.log(
        "[v0] MapInterface handleMapClick called with:",
        lat,
        lng,
        "isMovingBox:",
        isMovingBox,
        "boxToMove:",
        boxToMove?.id,
      )

      if (isMovingBox && boxToMove) {
        console.log("[v0] Showing confirm move modal for box", boxToMove.id, "at new location:", lat, lng)
        // Show confirmation modal instead of moving directly
        setNewMoveCoordinates({ lat, lng })
        setIsConfirmMoveModalOpen(true)
      } else {
        console.log("[v0] Opening add box modal at coordinates:", lat, lng)
        // Add new box
        setClickedCoordinates({ lat, lng })
        setIsAddModalOpen(true)
      }
    },
    [isMovingBox, boxToMove, toast],
  )

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <MapHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando cajas de reciclaje...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <MapHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Error al cargar las cajas: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <MapHeader />

      <div className="flex-1 relative">
        {isMovingBox && boxToMove && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl px-6 py-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Moviendo caja</p>
                  <p className="text-xs text-gray-600">Toca el mapa para ubicar</p>
                </div>
                <button
                  onClick={handleCancelMove}
                  className="w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <InteractiveMap
          boxes={boxes}
          onBoxClick={setSelectedBox}
          onMapClick={handleMapClick}
          onDeleteBox={handleDeleteBox}
          isMovingBox={isMovingBox}
          boxToMove={boxToMove}
        />
      </div>

      <Suspense fallback={<ModalSkeleton />}>
        <AddBoxModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false)
            setClickedCoordinates(null)
          }}
          onAdd={handleAddBox}
          initialCoordinates={clickedCoordinates}
        />
      </Suspense>

      <Suspense fallback={<ModalSkeleton />}>
        <UpdateBoxModal
          box={selectedBox}
          isOpen={!!selectedBox}
          onClose={clearSelectedBox}
          onUpdate={handleUpdateBox}
          onUpdateStatus={handleUpdateBoxStatus}
          onDelete={handleDeleteBox}
          onMove={handleMoveBox}
        />
      </Suspense>

      <Suspense fallback={<ModalSkeleton />}>
        <ConfirmMoveModal
          isOpen={isConfirmMoveModalOpen}
          onClose={handleCancelConfirmMove}
          onConfirm={handleConfirmMove}
          box={boxToMove}
          newCoordinates={newMoveCoordinates}
        />
      </Suspense>

      <NotificationTriggers boxUpdates={boxUpdates} />
    </div>
  )
}