"use client"

import { useState, useCallback } from "react"
import { MapHeader } from "./map-header"
import { InteractiveMap } from "./interactive-map"
import { AddBoxModal } from "./add-box-modal"
import { UpdateBoxModal } from "./update-box-modal"
import { ConfirmMoveModal } from "./confirm-move-modal"
import { NotificationTriggers } from "../notifications/notification-triggers"
import { useToast } from "@/hooks/use-toast"

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

export function MapInterface() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedBox, setSelectedBox] = useState<RecyclingBox | null>(null)
  const [boxUpdates, setBoxUpdates] = useState<Array<{ boxId: string; isFull: boolean; previouslyFull?: boolean }>>([])
  const [clickedCoordinates, setClickedCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isMovingBox, setIsMovingBox] = useState(false)
  const [boxToMove, setBoxToMove] = useState<RecyclingBox | null>(null)
  const [isConfirmMoveModalOpen, setIsConfirmMoveModalOpen] = useState(false)
  const [newMoveCoordinates, setNewMoveCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const { toast } = useToast()
  const [boxes, setBoxes] = useState<RecyclingBox[]>([
    {
      id: "1",
      lat: 40.4168,
      lng: -3.7038,
      currentAmount: 15,
      capacity: 50,
      isFull: false,
      createdBy: "user1",
      createdAt: new Date("2024-01-15"),
      lastUpdated: new Date("2024-01-20"),
    },
    {
      id: "2",
      lat: 40.4178,
      lng: -3.7048,
      currentAmount: 48,
      capacity: 50,
      isFull: true,
      createdBy: "user2",
      createdAt: new Date("2024-01-10"),
      lastUpdated: new Date("2024-01-22"),
    },
  ])

  const handleAddBox = (newBox: Omit<RecyclingBox, "id" | "createdAt" | "lastUpdated">) => {
    const box: RecyclingBox = {
      ...newBox,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastUpdated: new Date(),
    }
    setBoxes((prev) => [...prev, box])
    setIsAddModalOpen(false)
    setClickedCoordinates(null)
  }

  const handleUpdateBox = (updatedBox: RecyclingBox) => {
    setBoxes((prev) =>
      prev.map((box) => {
        if (box.id === updatedBox.id) {
          const wasFullBefore = box.isFull
          const isFullNow = updatedBox.isFull

          if (isFullNow && !wasFullBefore) {
            setBoxUpdates((prevUpdates) => [
              ...prevUpdates,
              { boxId: updatedBox.id, isFull: true, previouslyFull: false },
            ])
          }

          return { ...updatedBox, lastUpdated: new Date() }
        }
        return box
      }),
    )
    setSelectedBox(null)
  }

  const handleDeleteBox = useCallback(
    (boxId: string) => {
      if (window.confirm("¿Estás seguro de que quieres eliminar esta caja?")) {
        setBoxes((prev) => prev.filter((box) => box.id !== boxId))
        setSelectedBox(null)
        toast({
          title: "Caja eliminada",
          description: "La caja ha sido eliminada correctamente",
        })
      }
    },
    [toast],
  )

  const handleMoveBox = (boxId: string) => {
    const box = boxes.find((b) => b.id === boxId)
    if (box) {
      setBoxToMove(box)
      setIsMovingBox(true)
      setSelectedBox(null)
      toast({
        title: "Modo mover activado",
        description: "Haz clic en el mapa para mover la caja a una nueva ubicación",
      })
    }
  }

  const handleCancelMove = () => {
    setIsMovingBox(false)
    setBoxToMove(null)
    toast({
      title: "Movimiento cancelado",
      description: "Se ha cancelado el movimiento de la caja",
    })
  }

  const handleConfirmMove = () => {
    if (!boxToMove || !newMoveCoordinates) return

    // Move the box to the new location
    setBoxes((prev) =>
      prev.map((box) => 
        box.id === boxToMove.id 
          ? { ...box, lat: newMoveCoordinates.lat, lng: newMoveCoordinates.lng, lastUpdated: new Date() } 
          : box
      ),
    )
    
    // Reset all move-related states
    setIsMovingBox(false)
    setBoxToMove(null)
    setIsConfirmMoveModalOpen(false)
    setNewMoveCoordinates(null)
    
    toast({
      title: "Caja movida",
      description: "La caja ha sido movida a la nueva ubicación",
    })
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

  return (
    <div className="h-screen flex flex-col bg-background">
      <MapHeader />

      <div className="flex-1 relative">
        {isMovingBox && boxToMove && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
            <div className="text-sm font-medium">Moviendo caja #{boxToMove.id}</div>
            <div className="text-xs">Haz clic en el mapa para nueva ubicación</div>
            <button onClick={handleCancelMove} className="mt-1 text-xs underline hover:no-underline">
              Cancelar
            </button>
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

      <AddBoxModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setClickedCoordinates(null)
        }}
        onAdd={handleAddBox}
        initialCoordinates={clickedCoordinates}
      />

      <UpdateBoxModal
        box={selectedBox}
        isOpen={!!selectedBox}
        onClose={() => setSelectedBox(null)}
        onUpdate={handleUpdateBox}
        onDelete={handleDeleteBox}
        onMove={handleMoveBox}
      />

      <ConfirmMoveModal
        isOpen={isConfirmMoveModalOpen}
        onClose={handleCancelConfirmMove}
        onConfirm={handleConfirmMove}
        box={boxToMove}
        newCoordinates={newMoveCoordinates}
      />

      <NotificationTriggers boxUpdates={boxUpdates} />
    </div>
  )
}
