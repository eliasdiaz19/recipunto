"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, MapPin, Calendar, User } from "lucide-react"
import type { RecyclingBox } from "@/types/box"
import { formatCapacityPercentage, formatDate } from "@/lib/formatters"
import { useToast } from "@/hooks/use-toast"
import { FillLevelBar } from "@/components/ui/fill-level-bar"

interface BoxCardProps {
  box: RecyclingBox
  onEdit: (box: RecyclingBox) => void
  onDelete: (boxId: string) => void
  isOwner: boolean
}

export function BoxCard({ box, onEdit, onDelete, isOwner }: BoxCardProps) {
  const { toast } = useToast()
  const fillPercentage = Math.round((box.currentAmount / box.capacity) * 100)

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta caja?")) {
      onDelete(box.id)
      toast({
        title: "Caja eliminada",
        description: "La caja ha sido eliminada correctamente",
      })
    }
  }

  const handleViewOnMap = () => {
    // In a real app, this would navigate to the map and center on this box
    toast({
      title: "Navegando al mapa",
      description: "Mostrando la ubicación de la caja en el mapa",
    })
  }

  const getStatusColor = () => {
    if (box.isFull) return "destructive"
    if (fillPercentage >= 70) return "default"
    return "secondary"
  }

  const getStatusText = () => {
    if (box.isFull) return "Llena"
    if (fillPercentage >= 70) return "Casi llena"
    return "Disponible"
  }

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Caja #{box.id}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
              {isOwner && <Badge variant="outline">Tuya</Badge>}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(box)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleViewOnMap}>
                <MapPin className="h-4 w-4 mr-2" />
                Ver en mapa
              </DropdownMenuItem>
              {isOwner && (
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Fill Level */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Nivel de llenado</span>
            <span className="text-sm font-medium">
              {box.currentAmount}/{box.capacity} ({formatCapacityPercentage(box.currentAmount, box.capacity)})
            </span>
          </div>
          <FillLevelBar percentage={fillPercentage} />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {box.lat.toFixed(4)}, {box.lng.toFixed(4)}
          </span>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{isOwner ? "Creada por ti" : `Creada por ${box.createdBy}`}</span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Actualizada {formatDate(box.lastUpdated)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(box)} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={handleViewOnMap} className="flex-1 bg-transparent">
            <MapPin className="h-4 w-4 mr-2" />
            Ver en mapa
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
