"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Plus, MapPin, ArrowLeft, Settings } from "lucide-react"
import { BoxCard } from "./box-card"
import { AddBoxModal } from "../map/add-box-modal"
import { UpdateBoxModal } from "../map/update-box-modal"
import type { RecyclingBox } from "@/types/box"
import { useBoxes } from "@/hooks/useBoxes"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { useMapToggles } from "@/hooks/useUIToggles"
import { useLocalStorage, useLocalStorageObject } from "@/hooks/useLocalStorage"
import { useBoxConversion, convertLegacyBoxToDatabase } from "@/hooks/useBoxConversion"
import { useBoxContext, useSelectedBoxSync } from "@/contexts/BoxContext"
import Link from "next/link"
import { FillLevelBar } from "@/components/ui/fill-level-bar"

export function BoxManagement() {
  // Persistir filtros y configuraciones en localStorage
  const [searchTerm, setSearchTerm] = useLocalStorage("box-search-term", "")
  const [statusFilter, setStatusFilter] = useLocalStorage("box-status-filter", "all")
  const [sortBy, setSortBy] = useLocalStorage("box-sort-by", "lastUpdated")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const { toast } = useToast()
  
  // Use real-time boxes hook
  const { boxes: dbBoxes, loading, error, createBox, updateBox, updateBoxStatus, deleteBox } = useBoxes()
  const { user } = useAuth()
  
  // UI toggles para el mapa
  const mapToggles = useMapToggles()
  
  // Convert database boxes to legacy format for existing components
  const boxes = useBoxConversion(dbBoxes)

  // Use shared selectedBox state from Context
  const { selectedBox, setSelectedBox, clearSelectedBox } = useBoxContext()
  
  // Keep selectedBox in sync with real-time data
  useSelectedBoxSync(boxes)

  const filteredBoxes = useMemo(() => {
    const list = boxes
      .filter((box) => {
        const matchesSearch = box.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "full" && box.isFull) ||
          (statusFilter === "available" && !box.isFull) ||
          (statusFilter === "mine" && box.createdBy === user?.id)
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "lastUpdated":
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
          case "capacity":
            return b.capacity - a.capacity
          case "fillLevel":
            return b.currentAmount / b.capacity - a.currentAmount / a.capacity
          default:
            return 0
        }
      })
    return list
  }, [boxes, searchTerm, statusFilter, sortBy, user?.id])

  const handleAddBox = async (newBox: Omit<RecyclingBox, "id" | "createdAt" | "lastUpdated">) => {
    try {
      await createBox(convertLegacyBoxToDatabase(newBox))
      setIsAddModalOpen(false)
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
      await updateBox(updatedBox.id, convertLegacyBoxToDatabase(updatedBox))
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

  const handleDeleteBox = async (boxId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta caja?")) {
      try {
        await deleteBox(boxId)
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
  }


  const stats = useMemo(() => ({
    total: boxes.length,
    full: boxes.filter((box) => box.isFull).length,
    mine: boxes.filter((box) => box.createdBy === user?.id).length,
    totalCapacity: boxes.reduce((sum, box) => sum + box.capacity, 0),
    totalCurrent: boxes.reduce((sum, box) => sum + box.currentAmount, 0),
  }), [boxes, user?.id])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/map">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al mapa
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Gestión de Cajas</h1>
              <p className="text-sm text-muted-foreground">Cargando cajas de reciclaje...</p>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
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
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/map">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al mapa
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Gestión de Cajas</h1>
              <p className="text-sm text-muted-foreground">Error al cargar las cajas</p>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-destructive mb-4">Error: {error}</p>
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/map">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al mapa
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Gestión de Cajas</h1>
            <p className="text-sm text-muted-foreground">Administra todas las cajas de reciclaje</p>
          </div>
          <Link href="/map">
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-2" />
              Ver mapa
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total cajas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-destructive">{stats.full}</div>
              <div className="text-xs text-muted-foreground">Cajas llenas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-secondary">{stats.mine}</div>
              <div className="text-xs text-muted-foreground">Mis cajas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 space-y-2">
              <div className="text-xs text-muted-foreground">Ocupación total</div>
              <FillLevelBar percentage={Math.round((stats.totalCurrent / stats.totalCapacity) * 100) || 0} />
              <div className="text-xs text-muted-foreground">
                {stats.totalCurrent}/{stats.totalCapacity} envases
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID de caja..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="available">Disponibles</SelectItem>
              <SelectItem value="full">Llenas</SelectItem>
              <SelectItem value="mine">Mis cajas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastUpdated">Última actualización</SelectItem>
              <SelectItem value="capacity">Capacidad</SelectItem>
              <SelectItem value="fillLevel">Nivel de llenado</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva caja
          </Button>
        </div>

        {/* UI Controls */}
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Controles de UI:</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={mapToggles.showStats}
                onChange={(e) => mapToggles.setStats(e.target.checked)}
                className="rounded"
              />
              Mostrar estadísticas
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={mapToggles.showFilters}
                onChange={(e) => mapToggles.setFilters(e.target.checked)}
                className="rounded"
              />
              Mostrar filtros
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={mapToggles.autoRefresh}
                onChange={(e) => mapToggles.setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto actualizar
            </label>
          </div>
        </div>
      </header>

      {/* Box List */}
      <div className="p-4">
        {filteredBoxes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "No se encontraron cajas con los filtros aplicados"
                  : "No hay cajas disponibles"}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBoxes.map((box) => (
              <BoxCard
                key={box.id}
                box={box}
                onEdit={setSelectedBox}
                onDelete={handleDeleteBox}
                isOwner={box.createdBy === user?.id}
              />
            ))}
          </div>
        )}
      </div>

      <AddBoxModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddBox} />

      <UpdateBoxModal
        box={selectedBox}
        isOpen={!!selectedBox}
        onClose={clearSelectedBox}
        onUpdate={handleUpdateBox}
        onUpdateStatus={handleUpdateBoxStatus}
        onDelete={handleDeleteBox}
        onMove={(boxId) => {
          // For box management, we'll redirect to the map with the box selected
          toast({
            title: "Mover caja",
            description: "Redirigiendo al mapa para mover la caja...",
          })
          // You could implement navigation to map with box pre-selected
          // router.push(`/map?moveBox=${boxId}`)
        }}
      />
    </div>
  )
}