"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, Award, TrendingUp, Calendar } from "lucide-react"
import { ProfileStats } from "./profile-stats"
import { RecyclingHistory } from "./recycling-history"
import { AchievementsBadges } from "./achievements-badges"
import { ProfileSettings } from "./profile-settings"
import Link from "next/link"

export interface UserData {
  id: string
  name: string
  email: string
  userType: "citizen" | "recycler"
  avatar?: string
  joinDate: Date
  stats: {
    boxesCreated: number
    containersRecycled: number
    co2Saved: number
    points: number
    level: number
    streak: number
  }
}

export function UserProfile() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock user data - in a real app this would come from authentication context
  const userData: UserData = {
    id: "current-user",
    name: "María González",
    email: "maria@example.com",
    userType: "citizen",
    joinDate: new Date("2024-01-01"),
    stats: {
      boxesCreated: 12,
      containersRecycled: 156,
      co2Saved: 23.4,
      points: 1250,
      level: 5,
      streak: 7,
    },
  }

  const getUserTypeLabel = (type: string) => {
    return type === "citizen" ? "Ciudadano" : "Reciclador"
  }

  const getUserTypeColor = (type: string) => {
    return type === "citizen" ? "secondary" : "default"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4">
          <Link href="/map">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Mi Perfil</h1>
            <p className="text-sm text-muted-foreground">Gestiona tu cuenta y revisa tu progreso</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setActiveTab("settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h2 className="text-2xl font-bold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge variant={getUserTypeColor(userData.userType)}>{getUserTypeLabel(userData.userType)}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Nivel {userData.stats.level}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Desde {userData.joinDate.toLocaleDateString()}
                  </Badge>
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{userData.stats.points}</div>
                <div className="text-sm text-muted-foreground">Puntos totales</div>
                <div className="mt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {userData.stats.streak} días seguidos
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="settings">Ajustes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ProfileStats userData={userData} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <RecyclingHistory userId={userData.id} />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <AchievementsBadges userData={userData} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ProfileSettings userData={userData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
