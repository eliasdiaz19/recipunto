"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Plus, MapPin, ArrowLeft } from "lucide-react"
import { BoxCard } from "./box-card"
import { AddBoxModal } from "../map/add-box-modal"
import { UpdateBoxModal } from "../map/update-box-modal"
import type { RecyclingBox } from "../map/map-interface"
import Link from "next/link"

export function BoxManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("lastUpdated")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedBox, setSelectedBox] = useState<RecyclingBox | null>(null)
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
    {
      id: "3",
      lat: 40.4158,
      lng: -3.7028,
      currentAmount: 25,
      capacity: 40,
      isFull: false,
      createdBy: "current-user",
      createdAt: new Date("2024-01-18"),
      lastUpdated: new Date("2024-01-21"),
    },
  ])

  const filteredBoxes = boxes
    .filter((box) => {
      const matchesSearch = box.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "full" && box.isFull) ||
        (statusFilter === "available" && !box.isFull) ||
        (statusFilter === "mine" && box.createdBy === "current-user")
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

  const handleAddBox = (newBox: Omit<RecyclingBox, "id" | "createdAt" | "lastUpdated">) => {
    const box: RecyclingBox = {
      ...newBox,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastUpdated: new Date(),
    }
    setBoxes((prev) => [...prev, box])
    setIsAddModalOpen(false)
  }

  const handleUpdateBox = (updatedBox: RecyclingBox) => {
    setBoxes((prev) => prev.map((box) => (box.id === updatedBox.id ? { ...updatedBox, lastUpdated: new Date() } : box)))
    setSelectedBox(null)
  }

  const handleDeleteBox = (boxId: string) => {
    setBoxes((prev) => prev.filter((box) => box.id !== boxId))
  }

  const stats = {
    total: boxes.length,
    full: boxes.filter((box) => box.isFull).length,
    mine: boxes.filter((box) => box.createdBy === "current-user").length,
    totalCapacity: boxes.reduce((sum, box) => sum + box.capacity, 0),
    totalCurrent: boxes.reduce((sum, box) => sum + box.currentAmount, 0),
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
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-accent">
                {Math.round((stats.totalCurrent / stats.totalCapacity) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Ocupación total</div>
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
                isOwner={box.createdBy === "current-user"}
              />
            ))}
          </div>
        )}
      </div>

      <AddBoxModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddBox} />

      <UpdateBoxModal
        box={selectedBox}
        isOpen={!!selectedBox}
        onClose={() => setSelectedBox(null)}
        onUpdate={handleUpdateBox}
      />
    </div>
  )
}
