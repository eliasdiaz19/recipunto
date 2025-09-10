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
    <div className="space-y-8 p-6">
      {/* Enhanced Summary */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-2xl shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            Resumen de Actividad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                {historyItems.length}
              </div>
              <div className="text-sm font-medium text-gray-600">Actividades totales</div>
              <div className="mt-2 text-xs text-primary bg-primary/10 rounded-full px-2 py-1">
                📊 Total registrado
              </div>
            </div>
            
            <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-green-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">
                {historyItems.filter((i) => i.type === "box_created").length}
              </div>
              <div className="text-sm font-medium text-gray-600">Cajas creadas</div>
              <div className="mt-2 text-xs text-green-600 bg-green-100 rounded-full px-2 py-1">
                📦 Contribución
              </div>
            </div>
            
            <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                {historyItems
                  .filter((i) => i.type === "containers_added")
                  .reduce((sum, i) => sum + (i.details?.containers || 0), 0)}
              </div>
              <div className="text-sm font-medium text-gray-600">Envases reciclados</div>
              <div className="mt-2 text-xs text-blue-600 bg-blue-100 rounded-full px-2 py-1">
                ♻️ Impacto positivo
              </div>
            </div>
            
            <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-yellow-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-yellow-600 mb-2 group-hover:scale-110 transition-transform">
                {totalPoints}
              </div>
              <div className="text-sm font-medium text-gray-600">Puntos ganados</div>
              <div className="mt-2 text-xs text-yellow-600 bg-yellow-100 rounded-full px-2 py-1">
                🏆 Recompensas
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Filtrar por tipo</label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full h-12 bg-white border-gray-200 hover:border-primary transition-colors">
                  <Filter className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🔍 Todas las actividades</SelectItem>
                  <SelectItem value="box_created">📦 Cajas creadas</SelectItem>
                  <SelectItem value="containers_added">♻️ Envases añadidos</SelectItem>
                  <SelectItem value="box_updated">✏️ Cajas actualizadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full h-12 bg-white border-gray-200 hover:border-primary transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">📅 Más reciente</SelectItem>
                  <SelectItem value="points">🏆 Más puntos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced History List */}
      <div className="space-y-4">
        {filteredHistory.map((item, index) => (
          <Card key={item.id} className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className={`p-3 rounded-2xl ${
                    item.type === 'box_created' ? 'bg-green-100 border border-green-200' :
                    item.type === 'containers_added' ? 'bg-blue-100 border border-blue-200' :
                    'bg-purple-100 border border-purple-200'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    {getTypeIcon(item.type)}
                  </div>
                  {/* Timeline connector */}
                  {index < filteredHistory.length - 1 && (
                    <div className="absolute top-12 left-1/2 w-px h-8 bg-gradient-to-b from-gray-300 to-transparent transform -translate-x-1/2"></div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900 text-lg">{item.description}</p>
                      {item.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full w-fit">
                          <MapPin className="h-4 w-4 text-primary" />
                          {item.location}
                        </div>
                      )}
                    </div>
                    <div className="text-right space-y-2">
                      <Badge 
                        variant={getTypeColor(item.type)} 
                        className="shadow-sm font-medium"
                      >
                        {getTypeLabel(item.type)}
                      </Badge>
                      <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                        <span className="text-xs">⭐</span>
                        <span className="text-sm font-bold text-primary">+{item.points}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium">
                        {item.date.toLocaleDateString()} a las {item.date.toLocaleTimeString()}
                      </span>
                    </div>
                    {item.details?.boxId && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                      >
                        Ver caja #{item.details.boxId}
                        <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay actividades</h3>
                <p className="text-gray-600">No se encontraron actividades con los filtros aplicados</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setFilter("all")}
                className="mt-4"
              >
                Ver todas las actividades
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
