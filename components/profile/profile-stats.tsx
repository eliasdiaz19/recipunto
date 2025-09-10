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
    <div className="space-y-6 p-6">
      {/* Enhanced Level Progress */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-xl">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            Progreso de Nivel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{userData.stats.level}</div>
              <div className="text-sm text-muted-foreground">Nivel actual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userData.stats.level + 1}</div>
              <div className="text-sm text-muted-foreground">Siguiente nivel</div>
            </div>
          </div>
          <div className="relative">
            <Progress value={currentLevelProgress} className="h-4 bg-gray-200" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-white drop-shadow-sm">
                {Math.round(currentLevelProgress)}%
              </span>
            </div>
          </div>
          <div className="text-center bg-white/50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">
              <span className="text-primary font-bold">
                {Math.round(300 - (userData.stats.points % 300))}
              </span> puntos para el siguiente nivel
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Impact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {impactStats.map((stat, index) => (
          <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50"></div>
            <CardContent className="relative p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-gray-600">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Weekly Goals */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            Objetivos Semanales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-white/60 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-800">Crear 2 cajas nuevas</span>
                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">1/2</span>
              </div>
              <Progress value={50} className="h-3 bg-gray-200" />
            </div>

            <div className="bg-white/60 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-800">Reciclar 20 envases</span>
                <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">15/20</span>
              </div>
              <Progress value={75} className="h-3 bg-gray-200" />
            </div>

            <div className="bg-white/60 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-gray-800">Mantener racha de 7 días</span>
                <span className="text-sm font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">{userData.stats.streak}/7</span>
              </div>
              <Progress value={100} className="h-3 bg-gray-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Environmental Impact */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-green-100 rounded-xl">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            Impacto Ambiental
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-green-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">
                {userData.stats.co2Saved} kg
              </div>
              <div className="text-sm font-semibold text-green-700 mb-2">CO₂ evitado</div>
              <div className="text-xs text-gray-600 bg-green-100/50 rounded-full px-3 py-1">
                🌳 {Math.round(userData.stats.co2Saved / 2.3)} árboles plantados
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                {Math.round(userData.stats.containersRecycled * 0.15)} L
              </div>
              <div className="text-sm font-semibold text-blue-700 mb-2">Agua ahorrada</div>
              <div className="text-xs text-gray-600 bg-blue-100/50 rounded-full px-3 py-1">
                💧 En procesos de reciclaje
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                {Math.round(userData.stats.containersRecycled * 0.08)} kWh
              </div>
              <div className="text-sm font-semibold text-purple-700 mb-2">Energía ahorrada</div>
              <div className="text-xs text-gray-600 bg-purple-100/50 rounded-full px-3 py-1">
                ⚡ Vs. producción nueva
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
