// src/components/UI/RealtimeIndicator.tsx
'use client'

import { useRealtimeStatus } from '@/hooks/useRealtimeStatus'
import Badge from './Badge'

export function RealtimeIndicator() {
  const {
    isConnected,
    isConnecting,
    hasError,
    lastUpdate,
    reconnect
  } = useRealtimeStatus()

  const getStatusColor = () => {
    if (isConnected) return 'success'
    if (isConnecting) return 'warning'
    if (hasError) return 'danger'
    return 'default'
  }

  const getStatusText = () => {
    if (isConnected) return 'En tiempo real'
    if (isConnecting) return 'Conectando...'
    if (hasError) return 'Error de conexión'
    return 'Desconectado'
  }

  const getStatusIcon = () => {
    if (isConnected) return '🟢'
    if (isConnecting) return '🟡'
    if (hasError) return '🔴'
    return '⚪'
  }

  return (
    <div className="flex items-center gap-2">
      {hasError ? (
        <button
          onClick={reconnect}
          title="Hacer clic para reconectar"
          className="cursor-pointer"
        >
          <Badge 
            variant={getStatusColor()}
            className="flex items-center gap-1"
          >
            <span className="text-xs">{getStatusIcon()}</span>
            <span className="text-xs font-medium">{getStatusText()}</span>
          </Badge>
        </button>
      ) : (
        <Badge 
          variant={getStatusColor()}
          className="flex items-center gap-1"
        >
          <span className="text-xs">{getStatusIcon()}</span>
          <span className="text-xs font-medium">{getStatusText()}</span>
        </Badge>
      )}
      
      {isConnected && lastUpdate && (
        <span className="text-xs text-gray-500">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}
