'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/UI'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Verificar estado inicial
    checkOnlineStatus()

    // Escuchar cambios de conectividad
    window.addEventListener('online', checkOnlineStatus)
    window.addEventListener('offline', checkOnlineStatus)

    return () => {
      window.removeEventListener('online', checkOnlineStatus)
      window.removeEventListener('offline', checkOnlineStatus)
    }
  }, [])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    window.location.reload()
  }

  const handleGoHome = () => {
    // Intentar ir a la página principal
    window.location.href = '/'
  }

  if (isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            ¡Conexión restaurada!
          </h2>
          <p className="text-green-600 mb-6">
            Ya puedes volver a usar Recipunto normalmente.
          </p>
          <Button variant="success" onClick={handleGoHome}>
            Continuar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Icono offline */}
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-200 mb-6">
          <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
          </svg>
        </div>

        {/* Título y descripción */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sin conexión
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          No tienes conexión a internet en este momento. 
          Algunas funciones pueden no estar disponibles.
        </p>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
          <h3 className="font-medium text-blue-900 mb-2">
            💡 Funciones disponibles offline:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ver cajas ya cargadas</li>
            <li>• Navegar por el mapa</li>
            <li>• Datos en caché</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <Button 
            variant="primary" 
            onClick={handleRetry}
            loading={retryCount > 0}
            fullWidth
          >
            {retryCount > 0 ? 'Reintentando...' : 'Reintentar conexión'}
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleGoHome}
            fullWidth
          >
            Ir al inicio
          </Button>
        </div>

        {/* Contador de reintentos */}
        {retryCount > 0 && (
          <p className="text-sm text-gray-500 mt-4">
            Reintentos: {retryCount}
          </p>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Recipunto - Reciclaje inteligente
          </p>
        </div>
      </div>
    </div>
  )
}
