'use client'

import { Suspense, ReactNode } from 'react'
import { Button } from '@/components/UI'
import { useState, useEffect } from 'react'

interface CustomSuspenseProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
  timeout?: number
  onRetry?: () => void
}

interface LoadingFallbackProps {
  message?: string
  showSpinner?: boolean
}

interface ErrorFallbackProps {
  error: Error
  retry: () => void
  reset: () => void
}

// Fallback de carga por defecto
const DefaultLoadingFallback = ({ message = 'Cargando...', showSpinner = true }: LoadingFallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      {showSpinner && (
        <div className="mx-auto mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  </div>
)

// Fallback de error por defecto
const DefaultErrorFallback = ({ _error, retry, reset }: ErrorFallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Error de carga
      </h3>
      
      <p className="text-sm text-gray-500 mb-6">
        No se pudo cargar el contenido. Verifica tu conexión e intenta de nuevo.
      </p>

      <div className="flex space-x-3">
        <Button 
          variant="primary" 
          onClick={retry}
          className="flex-1"
        >
          Reintentar
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={reset}
          className="flex-1"
        >
          Reiniciar
        </Button>
      </div>
    </div>
  </div>
)

// Hook personalizado para manejar errores de Suspense
const useSuspenseError = () => {
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error && event.error.name === 'ChunkLoadError') {
        setError(new Error('Error al cargar el módulo. Verifica tu conexión.'))
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  return error
}

const CustomSuspense = ({ 
  children, 
  fallback, 
  errorFallback,
  _timeout = 10000,
  onRetry 
}: CustomSuspenseProps) => {
  const [key, setKey] = useState(0)
  const error = useSuspenseError()

  const retry = () => {
    setKey(prev => prev + 1)
    onRetry?.()
  }

  const reset = () => {
    window.location.reload()
  }

  if (error) {
    return errorFallback || <DefaultErrorFallback error={error} retry={retry} reset={reset} />
  }

  return (
    <Suspense 
      fallback={fallback || <DefaultLoadingFallback />}
      key={key}
    >
      {children}
    </Suspense>
  )
}

export default CustomSuspense
