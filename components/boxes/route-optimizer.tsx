"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Route, Navigation, Clock, MapPin } from "lucide-react"
import type { RecyclingBox } from "@/types/box"

interface RouteOptimizerProps {
  boxes: RecyclingBox[]
}

interface OptimizedRoute {
  id: string
  boxes: RecyclingBox[]
  totalDistance: number
  estimatedTime: number
  priority: "high" | "medium" | "low"
}

export function RouteOptimizer({ boxes }: RouteOptimizerProps) {
  const [optimizedRoutes, setOptimizedRoutes] = useState<OptimizedRoute[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)

  const optimizeRoutes = async () => {
    setIsOptimizing(true)

    // Simulate route optimization algorithm
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const fullBoxes = boxes.filter((box) => box.isFull)
    const almostFullBoxes = boxes.filter((box) => !box.isFull && box.currentAmount / box.capacity >= 0.7)

    const routes: OptimizedRoute[] = []

    if (fullBoxes.length > 0) {
      routes.push({
        id: "urgent",
        boxes: fullBoxes,
        totalDistance: fullBoxes.length * 2.5,
        estimatedTime: fullBoxes.length * 15,
        priority: "high",
      })
    }

    if (almostFullBoxes.length > 0) {
      routes.push({
        id: "preventive",
        boxes: almostFullBoxes,
        totalDistance: almostFullBoxes.length * 3.2,
        estimatedTime: almostFullBoxes.length * 12,
        priority: "medium",
      })
    }

    setOptimizedRoutes(routes)
    setIsOptimizing(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Urgente"
      case "medium":
        return "Preventiva"
      default:
        return "Baja"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Optimizador de Rutas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Optimiza las rutas de recogida basándose en el estado de las cajas y la ubicación.
          </p>
          <Button onClick={optimizeRoutes} disabled={isOptimizing} className="w-full">
            {isOptimizing ? "Optimizando rutas..." : "Optimizar rutas de recogida"}
          </Button>
        </CardContent>
      </Card>

      {optimizedRoutes.map((route) => (
        <Card key={route.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ruta {getPriorityText(route.priority)}</CardTitle>
              <Badge variant={getPriorityColor(route.priority)}>{getPriorityText(route.priority)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{route.boxes.length}</div>
                  <div className="text-muted-foreground">Cajas</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{route.totalDistance.toFixed(1)} km</div>
                  <div className="text-muted-foreground">Distancia</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{route.estimatedTime} min</div>
                  <div className="text-muted-foreground">Tiempo est.</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Cajas en la ruta:</h4>
              <div className="flex flex-wrap gap-2">
                {route.boxes.map((box) => (
                  <Badge key={box.id} variant="outline">
                    #{box.id} ({Math.round((box.currentAmount / box.capacity) * 100)}%)
                  </Badge>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent">
              <Navigation className="h-4 w-4 mr-2" />
              Iniciar navegación
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
