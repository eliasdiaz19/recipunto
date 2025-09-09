"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bell, Filter, Package, Award, AlertTriangle, Info } from "lucide-react"
import { useNotifications } from "./notification-provider"
import Link from "next/link"

export function NotificationHistory() {
  const { notifications, markAsRead, deleteNotification } = useNotifications()
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredNotifications = notifications
    .filter((notification) => {
      if (filter === "all") return true
      if (filter === "unread") return !notification.read
      return notification.type === filter
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
      if (sortBy === "oldest") {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      }
      if (sortBy === "unread") {
        if (a.read !== b.read) {
          return a.read ? 1 : -1
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      }
      return 0
    })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "box_full":
        return <Package className="h-5 w-5 text-destructive" />
      case "new_box":
        return <Package className="h-5 w-5 text-secondary" />
      case "achievement":
        return <Award className="h-5 w-5 text-yellow-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      default:
        return <Info className="h-5 w-5 text-primary" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "box_full":
        return "Caja llena"
      case "new_box":
        return "Nueva caja"
      case "achievement":
        return "Logro"
      case "warning":
        return "Advertencia"
      default:
        return "Sistema"
    }
  }

  const stats = {
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    achievements: notifications.filter((n) => n.type === "achievement").length,
    boxAlerts: notifications.filter((n) => n.type === "box_full").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/map">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Historial de Notificaciones</h1>
            <p className="text-sm text-muted-foreground">Revisa todas tus notificaciones</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-destructive">{stats.unread}</div>
              <div className="text-xs text-muted-foreground">Sin leer</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-yellow-600">{stats.achievements}</div>
              <div className="text-xs text-muted-foreground">Logros</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-orange-500">{stats.boxAlerts}</div>
              <div className="text-xs text-muted-foreground">Alertas</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="unread">Sin leer</SelectItem>
              <SelectItem value="box_full">Cajas llenas</SelectItem>
              <SelectItem value="achievement">Logros</SelectItem>
              <SelectItem value="new_box">Nuevas cajas</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguas</SelectItem>
              <SelectItem value="unread">Sin leer primero</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Notifications List */}
      <div className="p-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground">
                {filter === "all"
                  ? "No tienes notificaciones"
                  : "No se encontraron notificaciones con los filtros aplicados"}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? "bg-muted/30 border-l-4 border-l-primary" : ""
                }`}
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{getTypeLabel(notification.type)}</Badge>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{notification.timestamp.toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                          {notification.metadata?.points && (
                            <Badge variant="secondary" className="text-xs">
                              +{notification.metadata.points} puntos
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
