"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Package, MapPin, TrendingUp, Filter } from "lucide-react"

interface HistoryItem {
  id: string
  type: "box_created" | "box_updated" | "containers_added"
  date: Date
  description: string
  location?: string
  points: number
  details?: {
    boxId?: string
    containers?: number
    previousAmount?: number
    newAmount?: number
  }
}

interface RecyclingHistoryProps {
  userId: string
}

export function RecyclingHistory({ userId }: RecyclingHistoryProps) {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  // Mock history data
  const historyItems: HistoryItem[] = [
    {
      id: "1",
      type: "box_created",
      date: new Date("2024-01-22"),
      description: "Creaste una nueva caja de reciclaje",
      location: "Calle Mayor, 123",
      points: 50,
      details: { boxId: "3" },
    },
    {
      id: "2",
      type: "containers_added",
      date: new Date("2024-01-21"),
      description: "Añadiste 15 envases a la caja #2",
      location: "Plaza España",
      points: 30,
      details: { boxId: "2", containers: 15, previousAmount: 33, newAmount: 48 },
    },
    {
      id: "3",
      type: "box_updated",
      date: new Date("2024-01-20"),
      description: "Actualizaste el estado de la caja #1",
      location: "Parque Central",
      points: 10,
      details: { boxId: "1" },
    },
    {
      id: "4",
      type: "containers_added",
      date: new Date("2024-01-19"),
      description: "Añadiste 25 envases a la caja #1",
      location: "Parque Central",
      points: 50,
      details: { boxId: "1", containers: 25, previousAmount: 0, newAmount: 25 },
    },
    {
      id: "5",
      type: "box_created",
      date: new Date("2024-01-18"),
      description: "Creaste una nueva caja de reciclaje",
      location: "Avenida Libertad, 45",
      points: 50,
      details: { boxId: "1" },
    },
  ]

  const filteredHistory = historyItems
    .filter((item) => filter === "all" || item.type === filter)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (sortBy === "points") {
        return b.points - a.points
      }
      return 0
    })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "box_created":
        return <Package className="h-4 w-4" />
      case "containers_added":
        return <TrendingUp className="h-4 w-4" />
      case "box_updated":
        return <Calendar className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "box_created":
        return "secondary"
      case "containers_added":
        return "default"
      case "box_updated":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "box_created":
        return "Caja creada"
      case "containers_added":
        return "Envases añadidos"
      case "box_updated":
        return "Caja actualizada"
      default:
        return "Actividad"
    }
  }

  const totalPoints = historyItems.reduce((sum, item) => sum + item.points, 0)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{historyItems.length}</div>
              <div className="text-sm text-muted-foreground">Actividades totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {historyItems.filter((i) => i.type === "box_created").length}
              </div>
              <div className="text-sm text-muted-foreground">Cajas creadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {historyItems
                  .filter((i) => i.type === "containers_added")
                  .reduce((sum, i) => sum + (i.details?.containers || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Envases reciclados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Puntos ganados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las actividades</SelectItem>
                <SelectItem value="box_created">Cajas creadas</SelectItem>
                <SelectItem value="containers_added">Envases añadidos</SelectItem>
                <SelectItem value="box_updated">Cajas actualizadas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Más reciente</SelectItem>
                <SelectItem value="points">Más puntos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-muted rounded-full">{getTypeIcon(item.type)}</div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      {item.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={getTypeColor(item.type)} className="mb-1">
                        {getTypeLabel(item.type)}
                      </Badge>
                      <div className="text-sm font-medium text-primary">+{item.points} puntos</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {item.date.toLocaleDateString()} a las {item.date.toLocaleTimeString()}
                    </span>
                    {item.details?.boxId && (
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-primary">
                        Ver caja #{item.details.boxId}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">No se encontraron actividades con los filtros aplicados</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
