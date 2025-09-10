"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { Badge } from "@/components/ui/badge"
import { Trash2, Move, RefreshCw } from "lucide-react"
import type { RecyclingBox } from "@/types/box"
import { validateBoxData } from "@/lib/validators"
import { formatCapacityPercentage } from "@/lib/formatters"
import { FillLevelBar } from "@/components/ui/fill-level-bar"

interface UpdateBoxModalProps {
  box: RecyclingBox | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (box: RecyclingBox) => void
  onUpdateStatus?: (id: string, currentAmount: number, isFull: boolean) => Promise<void>
  onDelete?: (boxId: string) => void
  onMove?: (boxId: string) => void
}

export function UpdateBoxModal({ box, isOpen, onClose, onUpdate, onUpdateStatus, onDelete, onMove }: UpdateBoxModalProps) {
  const [formData, setFormData] = useState({
    currentAmount: "",
    capacity: "",
    isFull: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  // Modal único: ya no usamos un modal anidado para actualizar estado
  const { toast } = useToast()
  const { user } = useAuth()

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

      const updatedBox: RecyclingBox = {
        ...box,
        currentAmount,
        capacity,
        isFull: formData.isFull || currentAmount >= capacity,
      }

      const errors = validateBoxData({
        lat: updatedBox.lat,
        lng: updatedBox.lng,
        capacity: updatedBox.capacity,
        currentAmount: updatedBox.currentAmount,
      })
      if (errors.length > 0) {
        console.warn("Validation errors:", errors)
        return
      }

      onUpdate(updatedBox)
    } catch (error) {
      console.error("Error updating box:", error)
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

  const handleNonOwnerStatusUpdate = async () => {
    if (!box || !onUpdateStatus) return
    setIsLoading(true)
    try {
      const currentAmount = Number.parseInt(formData.currentAmount)
      const capacity = box.capacity

      const errors = validateBoxData({
        currentAmount,
        capacity,
      })
      if (errors.length > 0) {
        console.warn("Validation errors:", errors)
        return
      }

      await onUpdateStatus(box.id, currentAmount, formData.isFull)
      onClose()
    } catch (error) {
      console.error("Error updating box status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!box) return null

  const fillPercentage = Math.round((box.currentAmount / box.capacity) * 100)
  const isOwner = box.createdBy === user?.id

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
              <span className="text-sm font-medium">{formatCapacityPercentage(box.currentAmount, box.capacity)} llena</span>
            </div>
            <FillLevelBar percentage={fillPercentage} />
          </div>

          {/* Info para no dueño */}
          {!isOwner && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Actualización colaborativa:</strong> Puedes actualizar la cantidad de envases de esta caja.
              </p>
            </div>
          )}

          {isOwner ? (
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
                {isOwner && (
                  <>
                    {onMove && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleMove}
                        className="flex-1 sm:flex-none"
                      >
                        <Move className="h-4 w-4 mr-2" />
                        Mover
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        className="flex-1 sm:flex-none"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
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
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleNonOwnerStatusUpdate() }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentAmountReadonly">Cantidad actual de envases</Label>
                <Input
                  id="currentAmountReadonly"
                  type="number"
                  min="0"
                  max={box.capacity}
                  value={formData.currentAmount}
                  onChange={(e) => updateFormData("currentAmount", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Capacidad máxima: {box.capacity} envases</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFullReadonly"
                  checked={formData.isFull}
                  onCheckedChange={(checked) => {
                    const isChecked = !!checked
                    updateFormData("isFull", isChecked)
                    if (isChecked) updateFormData("currentAmount", box.capacity.toString())
                  }}
                />
                <Label htmlFor="isFullReadonly" className="text-sm">Marcar como llena</Label>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? "Actualizando..." : "Actualizar estado"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </div>
      </DialogContent>

      {/* Modal único: sin modal anidado */}
    </Dialog>
  )
}

