// src/components/UI/RealtimeDebugPanel.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRealtimeDebug } from '@/hooks/useRealtimeDebug'
import { useRealtimeStatus } from '@/hooks/useRealtimeStatus'
import { Card } from './Card'
import { Button } from './Button'
import { Badge } from './Badge'

export function RealtimeDebugPanel() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const debug = useRealtimeDebug()
  const realtimeStatus = useRealtimeStatus()

  // Conectar debug con realtime status
  useEffect(() => {
    if (debug.updateConnectionStatus) {
      realtimeStatus.registerDebugCallback(debug.updateConnectionStatus)
    }
  }, [debug.updateConnectionStatus, realtimeStatus.registerDebugCallback])

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        title="Mostrar panel de debug"
      >
        🐛
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-96 max-h-96 overflow-hidden">
      <Card className="bg-gray-900 text-white border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <h3 className="font-mono text-sm font-bold">🐛 Debug Realtime</h3>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs px-2 py-1"
            >
              {isExpanded ? '📉' : '📈'}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsVisible(false)}
              className="text-xs px-2 py-1"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Contenido */}
        <div className={`transition-all duration-300 ${isExpanded ? 'max-h-80' : 'max-h-32'}`}>
          <div className="p-3 space-y-3">
            {/* Estado de conexión */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">Estado:</span>
              <Badge 
                variant={debug.debugInfo.connectionStatus === 'connected' ? 'success' : 'error'}
                className="text-xs"
              >
                {debug.debugInfo.connectionStatus}
              </Badge>
            </div>

            {/* Contadores */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-300">Eventos:</span>
                <span className="ml-2 text-green-400">{debug.debugInfo.eventCount}</span>
              </div>
              <div>
                <span className="text-gray-300">Errores:</span>
                <span className="ml-2 text-red-400">{debug.debugInfo.errorCount}</span>
              </div>
            </div>

            {/* Último evento */}
            {debug.debugInfo.lastEvent && (
              <div className="text-xs">
                <span className="text-gray-300">Último:</span>
                <div className="mt-1 p-2 bg-gray-800 rounded text-gray-200 font-mono break-all">
                  {debug.debugInfo.lastEvent}
                </div>
              </div>
            )}

            {/* Información expandida */}
            {isExpanded && (
              <div className="space-y-3 pt-3 border-t border-gray-700">
                {/* Estado de Realtime */}
                <div className="text-xs">
                  <span className="text-gray-300">Realtime Status:</span>
                  <div className="mt-1 p-2 bg-gray-800 rounded">
                    <div>Estado: {realtimeStatus.status}</div>
                    <div>Intentos: {realtimeStatus.connectionAttempts}</div>
                    {realtimeStatus.lastUpdate && (
                      <div>Última: {realtimeStatus.lastUpdate.toLocaleTimeString()}</div>
                    )}
                  </div>
                </div>

                {/* Operaciones pendientes */}
                {debug.debugInfo.pendingOperations.length > 0 && (
                  <div className="text-xs">
                    <span className="text-gray-300">Operaciones Pendientes:</span>
                    <div className="mt-1 p-2 bg-gray-800 rounded max-h-20 overflow-y-auto">
                      {debug.debugInfo.pendingOperations.map((op, index) => (
                        <div key={index} className="text-gray-200">
                          {op.type} - {op.id}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Versiones de cajas */}
                {Object.keys(debug.debugInfo.boxVersions).length > 0 && (
                  <div className="text-xs">
                    <span className="text-gray-300">Versiones de Cajas:</span>
                    <div className="mt-1 p-2 bg-gray-800 rounded max-h-20 overflow-y-auto">
                      {Object.entries(debug.debugInfo.boxVersions).map(([id, version]) => (
                        <div key={id} className="text-gray-200">
                          {id}: v{version}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acciones de debug */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={debug.simulateTestEvent}
                    className="text-xs px-2 py-1"
                  >
                    Test Event
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={debug.simulateTestError}
                    className="text-xs px-2 py-1"
                  >
                    Test Error
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={debug.clearLogs}
                    className="text-xs px-2 py-1"
                  >
                    Limpiar
                  </Button>
                </div>

                {/* Exportar logs */}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={debug.exportDebugLogs}
                  className="w-full text-xs px-2 py-1"
                >
                  📥 Exportar Logs
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
