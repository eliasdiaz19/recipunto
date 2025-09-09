"use client"

import { useEffect } from "react"
import { useNotifications } from "./notification-provider"

interface NotificationTriggersProps {
  boxUpdates?: Array<{
    boxId: string
    isFull: boolean
    previouslyFull?: boolean
  }>
  newAchievements?: Array<{
    id: string
    name: string
    points: number
  }>
  newBoxes?: Array<{
    id: string
    location: string
  }>
}

export function NotificationTriggers({ boxUpdates, newAchievements, newBoxes }: NotificationTriggersProps) {
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Trigger notifications for box updates
    boxUpdates?.forEach((update) => {
      if (update.isFull && !update.previouslyFull) {
        addNotification({
          type: "box_full",
          title: "¡Caja llena!",
          message: `La caja #${update.boxId} está llena y necesita ser recogida`,
          actionUrl: `/boxes/${update.boxId}`,
          metadata: { boxId: update.boxId },
        })
      }
    })
  }, [boxUpdates, addNotification])

  useEffect(() => {
    // Trigger notifications for new achievements
    newAchievements?.forEach((achievement) => {
      addNotification({
        type: "achievement",
        title: "¡Nuevo logro desbloqueado!",
        message: `Has desbloqueado el logro '${achievement.name}'`,
        actionUrl: "/profile?tab=achievements",
        metadata: { achievementId: achievement.id, points: achievement.points },
      })
    })
  }, [newAchievements, addNotification])

  useEffect(() => {
    // Trigger notifications for new boxes
    newBoxes?.forEach((box) => {
      addNotification({
        type: "new_box",
        title: "Nueva caja disponible",
        message: `Se ha creado una nueva caja en ${box.location}`,
        actionUrl: "/map",
        metadata: { boxId: box.id },
      })
    })
  }, [newBoxes, addNotification])

  return null // This component doesn't render anything
}
