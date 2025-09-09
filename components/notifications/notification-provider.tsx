"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import type { Notification } from "./notification-center"
import { useToast } from "@/hooks/use-toast"

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "box_full",
      title: "¡Caja llena!",
      message: "La caja #2 en Plaza España está llena y necesita ser recogida",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      actionUrl: "/boxes/2",
      metadata: { boxId: "2" },
    },
    {
      id: "2",
      type: "achievement",
      title: "¡Nuevo logro desbloqueado!",
      message: "Has desbloqueado el logro 'Maestro de la Constancia'",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionUrl: "/profile?tab=achievements",
      metadata: { achievementId: "streak_master", points: 300 },
    },
    {
      id: "3",
      type: "new_box",
      title: "Nueva caja cerca",
      message: "Se ha creado una nueva caja de reciclaje a 200m de tu ubicación",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      actionUrl: "/map",
      metadata: { boxId: "3" },
    },
  ])

  const { toast } = useToast()

  const addNotification = useCallback(
    (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
      const newNotification: Notification = {
        ...notificationData,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
      }

      setNotifications((prev) => [newNotification, ...prev])

      // Show toast for real-time notification
      toast({
        title: newNotification.title,
        description: newNotification.message,
        duration: 5000,
      })
    },
    [toast]
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add notifications for demo purposes
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        const notificationTypes = [
          {
            type: "box_full" as const,
            title: "¡Caja llena!",
            message: `La caja #${Math.floor(Math.random() * 10) + 1} necesita ser recogida`,
          },
          {
            type: "new_box" as const,
            title: "Nueva caja disponible",
            message: "Se ha añadido una nueva caja en tu área",
          },
          {
            type: "system" as const,
            title: "Mantenimiento programado",
            message: "El sistema estará en mantenimiento mañana de 2-4 AM",
          },
        ]

        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
        addNotification(randomNotification)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [addNotification])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
