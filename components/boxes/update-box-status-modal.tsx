"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { RecyclingBox as MapRecyclingBox } from '@/types/box'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { validateBoxData } from '@/lib/validators'
import { formatCapacityPercentage } from '@/lib/formatters'
import { FillLevelBar } from '@/components/ui/fill-level-bar'

interface UpdateBoxStatusModalProps {
  box: MapRecyclingBox | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, currentAmount: number, isFull: boolean) => Promise<void>
}

export function UpdateBoxStatusModal({ 
  box, 
  isOpen, 
  onClose, 
  onUpdate 
}: UpdateBoxStatusModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentAmount: '0',
    isFull: false
  })

  // Update form when box changes
  useEffect(() => {
    if (box) {
      setFormData({
        currentAmount: box.currentAmount.toString(),
        isFull: box.isFull
      })
    }
  }, [box])

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!box) return

    setIsLoading(true)
    try {
      const currentAmount = parseInt(formData.currentAmount)
      const capacity = box.capacity

      const errors = validateBoxData({
        currentAmount,
        capacity,
      })
      if (errors.length > 0) {
        toast({
          title: 'Datos inválidos',
          description: errors.join('. '),
          variant: 'destructive',
        })
        return
      }

      await onUpdate(box.id, currentAmount, formData.isFull)
      onClose()
    } catch (error) {
      console.error('Error updating box status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!box) return null

  const fillPercentage = box.capacity > 0 ? Math.round((box.currentAmount / box.capacity) * 100) : 0
  const isOwner = box.createdBy === user?.id

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Actualizar estado de caja
            <Badge variant={box.isFull ? "destructive" : "secondary"}>
              {box.isFull ? "Llena" : "Disponible"}
            </Badge>
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

          {/* Owner info */}
          {!isOwner && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Actualización colaborativa:</strong> Puedes actualizar la cantidad de envases de esta caja.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Cantidad actual de envases</Label>
              <Input
                id="currentAmount"
                type="number"
                min="0"
                max={box.capacity}
                value={formData.currentAmount}
                onChange={(e) => updateFormData('currentAmount', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Capacidad máxima: {box.capacity} envases
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFull"
                checked={formData.isFull}
                onCheckedChange={(checked) => {
                  const isChecked = !!checked
                  updateFormData("isFull", isChecked)
                  if (isChecked) {
                    updateFormData("currentAmount", box.capacity.toString())
                  }
                }}
              />
              <Label htmlFor="isFull" className="text-sm">
                Marcar como llena
              </Label>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full sm:w-auto"
              >
                {isLoading ? "Actualizando..." : "Actualizar estado"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
