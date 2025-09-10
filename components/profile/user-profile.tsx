"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, Award, TrendingUp, Calendar, LogIn } from "lucide-react"
import { ProfileStats } from "./profile-stats"
import { RecyclingHistory } from "./recycling-history"
import { AchievementsBadges } from "./achievements-badges"
import { ProfileSettings } from "./profile-settings"
import { useAuth } from "@/hooks/useAuth"
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
  const { user, loading } = useAuth()

  // Mock user data - in a real app this would come from authentication context
  const userData: UserData = {
    id: user?.id || "guest-user",
    name: user?.email?.split('@')[0] || "Usuario Invitado",
    email: user?.email || "invitado@recipunto.com",
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

  // Si está cargando, mostrar loading mejorado
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            {/* Animated rings */}
            <div className="absolute inset-0 animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-primary"></div>
            <div className="absolute inset-2 animate-spin rounded-full h-28 w-28 border-4 border-transparent border-t-secondary" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-4 animate-spin rounded-full h-24 w-24 border-4 border-transparent border-t-primary/50" style={{ animationDuration: '2s' }}></div>
            
            {/* Center icon */}
            <div className="relative h-32 w-32 flex items-center justify-center">
              <div className="p-4 bg-white rounded-full shadow-lg">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Cargando tu perfil</h3>
            <p className="text-gray-600">Preparando tus estadísticas y logros...</p>
          </div>
          
          {/* Loading dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  // Si no está autenticado, mostrar opción de login mejorada
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 p-4">
          <div className="flex items-center gap-4 max-w-6xl mx-auto">
            <Link href="/map">
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Mi Perfil
              </h1>
              <p className="text-sm text-muted-foreground">Inicia sesión para ver tu progreso</p>
            </div>
          </div>
        </header>

        <div className="p-4 flex items-center justify-center min-h-[70vh]">
          <Card className="w-full max-w-lg border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-10 text-center space-y-6 relative">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center mx-auto shadow-lg ring-4 ring-primary/10">
                  <LogIn className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-sm">🔐</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">¡Únete a ReciPunto!</h3>
                <p className="text-gray-600 leading-relaxed">
                  Crea tu cuenta para acceder a tus estadísticas personales, historial de reciclaje 
                  y desbloquear logros increíbles mientras contribuyes al medio ambiente.
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-xs text-gray-600">Estadísticas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs text-gray-600">Logros</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-1">🌱</div>
                  <div className="text-xs text-gray-600">Impacto</div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <Link href="/login" className="w-full">
                  <Button className="w-full h-12 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                    <LogIn className="h-5 w-5 mr-2" />
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full h-12 text-lg font-medium hover:bg-primary/5 border-2">
                    Crear Cuenta Nueva
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getUserTypeLabel = (type: string) => {
    return type === "citizen" ? "Ciudadano" : "Reciclador"
  }

  const getUserTypeColor = (type: string) => {
    return type === "citizen" ? "secondary" : "default"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/map">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Mi Perfil
                </h1>
                <p className="text-sm text-muted-foreground">Tu progreso en ReciPunto</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setActiveTab("settings")}
              className="hidden sm:flex hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Enhanced Profile Header */}
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-3xl"></div>
          
          <Card className="relative border-0 shadow-xl bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Profile Image & Basic Info */}
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-4 ring-primary/10">
                      <AvatarImage src={userData.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-primary/70 text-white">
                        {userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{userData.name}</h2>
                    <p className="text-gray-600 mb-4">{userData.email}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge 
                        variant={getUserTypeColor(userData.userType)} 
                        className="px-4 py-1.5 text-sm font-medium rounded-full"
                      >
                        {getUserTypeLabel(userData.userType)}
                      </Badge>
                      <Badge variant="outline" className="px-4 py-1.5 text-sm rounded-full flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Desde {userData.joinDate.toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="group text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                        {userData.stats.points}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Puntos totales</div>
                    </div>
                    
                    <div className="group text-center p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl border border-green-500/10 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Award className="h-6 w-6 text-green-600 group-hover:rotate-12 transition-transform" />
                        <span className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform">
                          {userData.stats.level}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Nivel actual</div>
                    </div>

                    <div className="group text-center p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl border border-blue-500/10 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                        {userData.stats.boxesCreated}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Cajas creadas</div>
                    </div>

                    <div className="group text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/10 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-600 group-hover:rotate-12 transition-transform" />
                        <span className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform">
                          {userData.stats.streak}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 font-medium">Días seguidos</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modern Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl h-14 bg-white/80 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl p-2">
              <TabsTrigger 
                value="overview" 
                className="rounded-xl font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
              >
                <Award className="h-4 w-4 mr-2 sm:inline hidden" />
                Resumen
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="rounded-xl font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
              >
                <Calendar className="h-4 w-4 mr-2 sm:inline hidden" />
                Historial
              </TabsTrigger>
              <TabsTrigger 
                value="achievements" 
                className="rounded-xl font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
              >
                <Award className="h-4 w-4 mr-2 sm:inline hidden" />
                Logros
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="rounded-xl font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-2 sm:inline hidden" />
                Ajustes
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg overflow-hidden">
              <ProfileStats userData={userData} />
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg overflow-hidden">
              <RecyclingHistory userId={userData.id} />
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg overflow-hidden">
              <AchievementsBadges userData={userData} />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 animate-in fade-in-50 duration-300">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg overflow-hidden">
              <ProfileSettings userData={userData} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
