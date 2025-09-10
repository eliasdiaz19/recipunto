"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { RecyclingBox } from "@/types/box"

interface ConfirmMoveModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  box: RecyclingBox | null
  newCoordinates: { lat: number; lng: number } | null
}

export function ConfirmMoveModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  box, 
  newCoordinates 
}: ConfirmMoveModalProps) {
  if (!box || !newCoordinates) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Movimiento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que quieres mover esta caja a la nueva ubicación?
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Caja de Reciclaje #{box.id}</span>
              <div className={`w-3 h-3 rounded-full ${box.isFull ? 'bg-red-500' : 'bg-green-600'}`} />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Nuevas coordenadas:</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Lat: {newCoordinates.lat.toFixed(6)}</p>
                <p>Lng: {newCoordinates.lng.toFixed(6)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={onConfirm}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Confirmar Movimiento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

