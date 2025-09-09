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
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Resumen de Logros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{earnedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Logros desbloqueados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{inProgressAchievements.length}</div>
              <div className="text-sm text-muted-foreground">En progreso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{lockedAchievements.length}</div>
              <div className="text-sm text-muted-foreground">Bloqueados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {earnedAchievements.reduce((sum, a) => sum + a.points, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Puntos de logros</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Logros Desbloqueados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {earnedAchievements.map((achievement) => (
                <div key={achievement.id} className="p-4 border rounded-lg bg-card">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <achievement.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {getRarityLabel(achievement.rarity)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Desbloqueado el {achievement.earnedDate?.toLocaleDateString()}
                        </span>
                        <span className="font-medium text-primary">+{achievement.points} puntos</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* In Progress Achievements */}
      {inProgressAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Logros en Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inProgressAchievements.map((achievement) => (
                <div key={achievement.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-full">
                      <achievement.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {getRarityLabel(achievement.rarity)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress
                          value={((achievement.progress || 0) / (achievement.maxProgress || 1)) * 100}
                          className="h-2"
                        />
                        <div className="text-right">
                          <span className="text-sm font-medium text-primary">+{achievement.points} puntos</span>
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

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Logros Bloqueados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lockedAchievements.map((achievement) => (
                <div key={achievement.id} className="p-4 border rounded-lg opacity-60">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-full">
                      <achievement.icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-muted-foreground">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant="outline" className="opacity-60">
                          {getRarityLabel(achievement.rarity)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">+{achievement.points} puntos</span>
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
