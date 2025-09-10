"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useBoxFormPersistence } from "@/hooks/useFormPersistence"
import type { RecyclingBox } from "@/types/box"
import { validateBoxData } from "@/lib/validators"

interface AddBoxModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (box: Omit<RecyclingBox, "id" | "createdAt" | "lastUpdated">) => void
  initialCoordinates?: { lat: number; lng: number } | null
}

export function AddBoxModal({ isOpen, onClose, onAdd, initialCoordinates }: AddBoxModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  // Usar persistencia de formulario
  const {
    formData,
    updateField,
    reset,
    isDirty,
    lastSaved
  } = useBoxFormPersistence({
    lat: initialCoordinates?.lat || 40.4168,
    lng: initialCoordinates?.lng || -3.7038,
    currentAmount: '',
    capacity: '',
    isFull: false,
    notes: ''
  })

  // Resetear formulario cuando el modal se abra
  useEffect(() => {
    if (isOpen) {
      reset()
    }
  }, [isOpen]) // Remover 'reset' de las dependencias para evitar bucle infinito

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const currentAmount = Number(formData.currentAmount) || 0
      const capacity = Number(formData.capacity) || 50

      const location = initialCoordinates || {
        lat: formData.lat,
        lng: formData.lng,
      }

      const errors = validateBoxData({
        lat: location.lat,
        lng: location.lng,
        capacity,
        currentAmount,
      })
      if (errors.length > 0) {
        console.warn("Validation errors:", errors)
        return
      }

      onAdd({
        ...location,
        currentAmount,
        capacity,
        isFull: formData.isFull || currentAmount >= capacity,
        createdBy: "usuario-anonimo",
      })

      // No resetear aquí - se reseteará cuando el modal se cierre
    } catch (error) {
      console.error("Error creating box:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva caja de reciclaje</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {initialCoordinates && (
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
              📍 Ubicación seleccionada: {initialCoordinates.lat.toFixed(4)}, {initialCoordinates.lng.toFixed(4)}
            </div>
          )}

          <div className="text-sm text-muted-foreground bg-green-50 p-3 rounded-lg border border-green-200">
            💡 {initialCoordinates ? "Haz clic en el mapa para seleccionar otra ubicación o " : ""}Puedes contribuir de
            forma anónima.{" "}
            <a href="/register" className="text-green-600 hover:underline">
              Regístrate
            </a>{" "}
            para obtener puntos y seguir tu impacto ambiental.
          </div>

          {/* Indicador de persistencia */}
          {isDirty && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
              💾 Formulario guardado automáticamente
              {lastSaved && ` - ${new Date(lastSaved).toLocaleTimeString()}`}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentAmount">Cantidad actual de envases</Label>
            <Input
              id="currentAmount"
              type="number"
              min="0"
              placeholder="0"
              value={formData.currentAmount}
              onChange={(e) => updateField("currentAmount", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidad estimada</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              placeholder="50"
              value={formData.capacity}
              onChange={(e) => updateField("capacity", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFull"
              checked={formData.isFull}
              onCheckedChange={(checked) => updateField("isFull", !!checked)}
            />
            <Label htmlFor="isFull" className="text-sm">
              Marcar como llena
            </Label>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
