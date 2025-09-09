"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Trash2, Move } from "lucide-react"
import type { RecyclingBox } from "./map-interface"

interface UpdateBoxModalProps {
  box: RecyclingBox | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (box: RecyclingBox) => void
  onDelete?: (boxId: string) => void
  onMove?: (boxId: string) => void
}

export function UpdateBoxModal({ box, isOpen, onClose, onUpdate, onDelete, onMove }: UpdateBoxModalProps) {
  const [formData, setFormData] = useState({
    currentAmount: "",
    capacity: "",
    isFull: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (box) {
      setFormData({
        currentAmount: box.currentAmount.toString(),
        capacity: box.capacity.toString(),
        isFull: box.isFull,
      })
    }
  }, [box])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!box) return

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

      const updatedBox: RecyclingBox = {
        ...box,
        currentAmount,
        capacity,
        isFull: formData.isFull || currentAmount >= capacity,
      }

      onUpdate(updatedBox)

      toast({
        title: "¡Caja actualizada!",
        description: "La información de la caja ha sido actualizada",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar la caja",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    if (!box || !onDelete) return
    onDelete(box.id)
  }

  const handleMove = () => {
    if (!box || !onMove) return
    onMove(box.id)
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!box) return null

  const fillPercentage = Math.round((box.currentAmount / box.capacity) * 100)
  const isOwner = box.createdBy === "current-user" || box.createdBy === "usuario-anonimo"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Actualizar caja
            <Badge variant={box.isFull ? "destructive" : "secondary"}>{box.isFull ? "Llena" : "Disponible"}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current status */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Estado actual</span>
              <span className="text-sm font-medium">{fillPercentage}% llena</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  fillPercentage >= 90 ? "bg-destructive" : fillPercentage >= 70 ? "bg-yellow-500" : "bg-secondary"
                }`}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Cantidad actual de envases</Label>
              <Input
                id="currentAmount"
                type="number"
                min="0"
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
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 sm:flex-none bg-transparent"
                >
                  Cancelar
                </Button>
                {isOwner && (
                  <>
                    {onMove && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleMove}
                        className="px-3"
                        title="Mover caja"
                      >
                        <Move className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        className="px-3"
                        title="Eliminar caja"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Actualizando..." : "Actualizar"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
