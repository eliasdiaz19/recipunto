"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Recycle, Package, Leaf, Trophy, TrendingUp, Target } from "lucide-react"
import type { UserData } from "./user-profile"

interface ProfileStatsProps {
  userData: UserData
}

export function ProfileStats({ userData }: ProfileStatsProps) {
  const nextLevelPoints = userData.stats.level * 300
  const currentLevelProgress = ((userData.stats.points % 300) / 300) * 100

  const impactStats = [
    {
      icon: Package,
      label: "Cajas creadas",
      value: userData.stats.boxesCreated,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Recycle,
      label: "Envases reciclados",
      value: userData.stats.containersRecycled,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Leaf,
      label: "CO₂ ahorrado (kg)",
      value: userData.stats.co2Saved,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      icon: Trophy,
      label: "Puntos totales",
      value: userData.stats.points,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progreso de Nivel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Nivel {userData.stats.level}</span>
            <span className="text-sm text-muted-foreground">Nivel {userData.stats.level + 1}</span>
          </div>
          <Progress value={currentLevelProgress} className="h-3" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {Math.round(300 - (userData.stats.points % 300))} puntos para el siguiente nivel
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Impact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {impactStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Objetivos Semanales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Crear 2 cajas nuevas</span>
                <span className="text-sm text-muted-foreground">1/2</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Reciclar 20 envases</span>
                <span className="text-sm text-muted-foreground">15/20</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Mantener racha de 7 días</span>
                <span className="text-sm text-muted-foreground">{userData.stats.streak}/7</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Impacto Ambiental
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{userData.stats.co2Saved} kg</div>
              <div className="text-sm text-green-700">CO₂ evitado</div>
              <div className="text-xs text-muted-foreground mt-1">
                Equivale a plantar {Math.round(userData.stats.co2Saved / 2.3)} árboles
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(userData.stats.containersRecycled * 0.15)} L
              </div>
              <div className="text-sm text-blue-700">Agua ahorrada</div>
              <div className="text-xs text-muted-foreground mt-1">En el proceso de reciclaje</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(userData.stats.containersRecycled * 0.08)} kWh
              </div>
              <div className="text-sm text-purple-700">Energía ahorrada</div>
              <div className="text-xs text-muted-foreground mt-1">Comparado con producción nueva</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
