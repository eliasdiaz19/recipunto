"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Package, Award, AlertTriangle, Info, X, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface Notification {
  id: string
  type: "box_full" | "new_box" | "achievement" | "system" | "warning"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: {
    boxId?: string
    achievementId?: string
    points?: number
  }
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDeleteNotification: (id: string) => void
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "box_full":
        return <Package className="h-4 w-4 text-destructive" />
      case "new_box":
        return <Package className="h-4 w-4 text-secondary" />
      case "achievement":
        return <Award className="h-4 w-4 text-yellow-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Info className="h-4 w-4 text-primary" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "box_full":
        return "border-l-destructive"
      case "new_box":
        return "border-l-secondary"
      case "achievement":
        return "border-l-yellow-500"
      case "warning":
        return "border-l-orange-500"
      default:
        return "border-l-primary"
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }

    if (notification.actionUrl) {
      // In a real app, this would navigate to the specific page
      toast({
        title: "Navegando",
        description: `Dirigiendo a ${notification.actionUrl}`,
      })
    }
  }

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.read !== b.read) {
      return a.read ? 1 : -1 // Unread first
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notificaciones</span>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Marcar todas como leídas
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No tienes notificaciones</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="space-y-3">
                {sortedNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${getNotificationColor(
                      notification.type,
                    )} ${!notification.read ? "bg-muted/30" : ""}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between">
                            <h3 className={`font-medium text-sm ${!notification.read ? "font-semibold" : ""}`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteNotification(notification.id)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">{notification.message}</p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp.toLocaleString()}
                            </span>
                            {notification.metadata?.points && (
                              <Badge variant="outline" className="text-xs">
                                +{notification.metadata.points} puntos
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
