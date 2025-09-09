"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { RecyclingBox } from "./map-interface"

interface AddBoxModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (box: Omit<RecyclingBox, "id" | "createdAt" | "lastUpdated">) => void
  initialCoordinates?: { lat: number; lng: number } | null
}

export function AddBoxModal({ isOpen, onClose, onAdd, initialCoordinates }: AddBoxModalProps) {
  const [formData, setFormData] = useState({
    currentAmount: "",
    capacity: "",
    isFull: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const currentAmount = Number.parseInt(formData.currentAmount)
      const capacity = Number.parseInt(formData.capacity)

      if (currentAmount < 0 || capacity <= 0) {
        throw new Error("Los valores deben ser positivos")
      }

      if (currentAmount > capacity) {
        throw new Error("La cantidad actual no puede ser mayor que la capacidad")
      }

      const location = initialCoordinates || {
        lat: 40.4168 + Math.random() * 0.01,
        lng: -3.7038 + Math.random() * 0.01,
      }

      onAdd({
        ...location,
        currentAmount,
        capacity,
        isFull: formData.isFull || currentAmount >= capacity,
        createdBy: "usuario-anonimo",
      })

      toast({
        title: "¡Caja creada!",
        description: initialCoordinates
          ? "La nueva caja de reciclaje ha sido añadida en la ubicación seleccionada"
          : "La nueva caja de reciclaje ha sido añadida al mapa",
      })

      // Reset form
      setFormData({
        currentAmount: "",
        capacity: "",
        isFull: false,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la caja",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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

          <div className="space-y-2">
            <Label htmlFor="currentAmount">Cantidad actual de envases</Label>
            <Input
              id="currentAmount"
              type="number"
              min="0"
              placeholder="0"
              value={formData.currentAmount}
              onChange={(e) => updateFormData("currentAmount", e.target.value)}
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
              onChange={(e) => updateFormData("capacity", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFull"
              checked={formData.isFull}
              onCheckedChange={(checked) => updateFormData("isFull", !!checked)}
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
