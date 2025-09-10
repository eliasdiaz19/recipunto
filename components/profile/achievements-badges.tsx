"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Award, Star, Trophy, Target, Zap, Heart } from "lucide-react"
import type { UserData } from "./user-profile"

interface Achievement {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  earned: boolean
  earnedDate?: Date
  progress?: number
  maxProgress?: number
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
}

interface AchievementsBadgesProps {
  userData: UserData
}

export function AchievementsBadges({ userData }: AchievementsBadgesProps) {
  const achievements: Achievement[] = [
    {
      id: "first_box",
      name: "Primer Paso",
      description: "Crea tu primera caja de reciclaje",
      icon: Trophy,
      earned: true,
      earnedDate: new Date("2024-01-18"),
      rarity: "common",
      points: 50,
    },
    {
      id: "eco_warrior",
      name: "Guerrero Ecológico",
      description: "Recicla 100 envases",
      icon: Award,
      earned: true,
      earnedDate: new Date("2024-01-20"),
      rarity: "rare",
      points: 200,
    },
    {
      id: "streak_master",
      name: "Maestro de la Constancia",
      description: "Mantén una racha de 7 días",
      icon: Zap,
      earned: true,
      earnedDate: new Date("2024-01-22"),
      rarity: "epic",
      points: 300,
    },
    {
      id: "community_hero",
      name: "Héroe de la Comunidad",
      description: "Crea 10 cajas de reciclaje",
      icon: Heart,
      earned: userData.stats.boxesCreated >= 10,
      progress: userData.stats.boxesCreated,
      maxProgress: 10,
      rarity: "epic",
      points: 500,
    },
    {
      id: "recycling_legend",
      name: "Leyenda del Reciclaje",
      description: "Recicla 500 envases",
      icon: Star,
      earned: false,
      progress: userData.stats.containersRecycled,
      maxProgress: 500,
      rarity: "legendary",
      points: 1000,
    },
    {
      id: "level_master",
      name: "Maestro de Niveles",
      description: "Alcanza el nivel 10",
      icon: Target,
      earned: false,
      progress: userData.stats.level,
      maxProgress: 10,
      rarity: "legendary",
      points: 750,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "Común"
      case "rare":
        return "Raro"
      case "epic":
        return "Épico"
      case "legendary":
        return "Legendario"
      default:
        return "Común"
    }
  }

  const earnedAchievements = achievements.filter((a) => a.earned)
  const inProgressAchievements = achievements.filter((a) => !a.earned && a.progress !== undefined)
  const lockedAchievements = achievements.filter((a) => !a.earned && a.progress === undefined)

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Summary */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-200/30 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl shadow-lg">
              <Award className="h-7 w-7 text-white" />
            </div>
            Resumen de Logros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-yellow-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                {earnedAchievements.length}
              </div>
              <div className="text-sm font-medium text-gray-600">Logros desbloqueados</div>
              <div className="mt-2">
                <div className="w-full bg-primary/10 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${(earnedAchievements.length / achievements.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                {inProgressAchievements.length}
              </div>
              <div className="text-sm font-medium text-gray-600">En progreso</div>
              <div className="mt-2 text-xs text-blue-600 bg-blue-100 rounded-full px-2 py-1">
                ¡Sigue así! 🚀
              </div>
            </div>
            
            <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-gray-500 mb-2 group-hover:scale-110 transition-transform">
                {lockedAchievements.length}
              </div>
              <div className="text-sm font-medium text-gray-600">Por desbloquear</div>
              <div className="mt-2 text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-1">
                🔒 Próximamente
              </div>
            </div>
            
            <div className="group text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-yellow-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-4xl font-bold text-yellow-600 mb-2 group-hover:scale-110 transition-transform">
                {earnedAchievements.reduce((sum, a) => sum + a.points, 0)}
              </div>
              <div className="text-sm font-medium text-gray-600">Puntos de logros</div>
              <div className="mt-2 text-xs text-yellow-600 bg-yellow-100 rounded-full px-2 py-1">
                ⭐ ¡Increíble!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-xl">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              Logros Desbloqueados
              <Badge variant="secondary" className="ml-auto">
                {earnedAchievements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {earnedAchievements.map((achievement) => (
                <div key={achievement.id} className="group relative p-6 border-0 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  {/* Decorative background */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
                  
                  <div className="flex items-start gap-4 relative">
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                      <achievement.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <Badge className={`${getRarityColor(achievement.rarity)} shadow-sm`}>
                          {getRarityLabel(achievement.rarity)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Desbloqueado el {achievement.earnedDate?.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                          <span className="text-xs">⭐</span>
                          <span className="text-sm font-bold text-primary">+{achievement.points}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced In Progress Achievements */}
      {inProgressAchievements.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              Logros en Progreso
              <Badge variant="secondary" className="ml-auto">
                {inProgressAchievements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {inProgressAchievements.map((achievement) => (
                <div key={achievement.id} className="group relative p-6 border-0 rounded-2xl bg-gradient-to-br from-white to-blue-50/30 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                  {/* Decorative background */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                  
                  <div className="flex items-start gap-4 relative">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl border border-blue-200 group-hover:scale-110 transition-transform duration-300">
                      <achievement.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <Badge className={`${getRarityColor(achievement.rarity)} shadow-sm`}>
                          {getRarityLabel(achievement.rarity)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Progreso actual</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <Progress
                            value={((achievement.progress || 0) / (achievement.maxProgress || 1)) * 100}
                            className="h-3 bg-gray-200"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium text-white drop-shadow-sm">
                              {Math.round(((achievement.progress || 0) / (achievement.maxProgress || 1)) * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Faltan {(achievement.maxProgress || 0) - (achievement.progress || 0)} para completar
                          </div>
                          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                            <span className="text-xs">🎯</span>
                            <span className="text-sm font-bold text-yellow-600">+{achievement.points}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gray-100 rounded-xl">
                <Trophy className="h-6 w-6 text-gray-500" />
              </div>
              Logros por Desbloquear
              <Badge variant="outline" className="ml-auto">
                {lockedAchievements.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {lockedAchievements.map((achievement) => (
                <div key={achievement.id} className="group relative p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 hover:border-gray-300 transition-all duration-300 overflow-hidden">
                  {/* Lock overlay */}
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
                  <div className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full">
                    <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="flex items-start gap-4 relative">
                    <div className="p-4 bg-gray-100 rounded-2xl border border-gray-200">
                      <achievement.icon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-500 mb-1">{achievement.name}</h3>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                        <Badge variant="outline" className="opacity-60 border-gray-300">
                          {getRarityLabel(achievement.rarity)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          🔒 Requisitos por cumplir
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                          <span className="text-xs">💎</span>
                          <span className="text-sm font-bold text-gray-500">+{achievement.points}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
