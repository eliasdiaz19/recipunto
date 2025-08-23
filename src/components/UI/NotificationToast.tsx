// src/components/UI/NotificationToast.tsx
'use client'

import { useEffect, useState } from 'react'
import { RealtimeNotification } from '@/hooks/useRealtimeNotifications'

interface NotificationToastProps {
  notification: RealtimeNotification
  onRemove: (id: string) => void
}

export function NotificationToast({ notification, onRemove }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(notification.id), 300)
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅'
      case 'info': return 'ℹ️'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      default: return '💬'
    }
  }

  const getTypeColor = () => {
    switch (notification.type) {
      case 'success': return 'success'
      case 'info': return 'info'
      case 'warning': return 'warning'
      case 'error': return 'error'
      default: return 'secondary'
    }
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        bg-white border-l-4 border-${getTypeColor()}-500 shadow-lg rounded-lg p-4 mb-3
        max-w-sm w-full
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-lg">{getIcon()}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              {notification.message}
            </p>
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {notification.action.label}
              </button>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {notification.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
        >
          <span className="sr-only">Cerrar</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

interface NotificationContainerProps {
  notifications: RealtimeNotification[]
  onRemove: (id: string) => void
}

export function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-[9999] space-y-2 max-w-sm">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
