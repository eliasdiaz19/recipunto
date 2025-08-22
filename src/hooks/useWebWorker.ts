'use client'

import { useEffect, useRef, useCallback, useState } from 'react'

interface WorkerMessage {
  id: string
  type: string
  data?: any
}

interface WorkerResponse {
  id: string
  type: 'SUCCESS' | 'ERROR'
  result?: any
  error?: string
}

interface UseWebWorkerOptions {
  workerPath?: string
  onMessage?: (response: WorkerResponse) => void
  onError?: (error: Error) => void
  onReady?: () => void
}

export function useWebWorker(options: UseWebWorkerOptions = {}) {
  const { 
    workerPath = '/worker.js', 
    onMessage, 
    onError, 
    onReady 
  } = options
  
  const workerRef = useRef<Worker | null>(null)
  const messageQueueRef = useRef<Map<string, (response: WorkerResponse) => void>>(new Map())
  const [isReady, setIsReady] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Inicializar el worker
  const initializeWorker = useCallback(() => {
    if (typeof Window === 'undefined') return

    try {
      workerRef.current = new Worker(workerPath)
      
      workerRef.current.onmessage = (event) => {
        const { type, id, result, error } = event.data
        
        if (type === 'WORKER_READY') {
          setIsReady(true)
          onReady?.()
          return
        }
        
        if (type === 'SUCCESS' || type === 'ERROR') {
          const response: WorkerResponse = { id, type, result, error }
          
          // Ejecutar callback del mensaje
          const callback = messageQueueRef.current.get(id)
          if (callback) {
            callback(response)
            messageQueueRef.current.delete(id)
          }
          
          // Callback general
          onMessage?.(response)
          
          setIsProcessing(false)
        }
      }
      
      workerRef.current.onerror = (error) => {
        console.error('Error en Web Worker:', error)
        onError?.(new Error('Error en Web Worker'))
        setIsProcessing(false)
      }
      
    } catch (error) {
      console.error('Error inicializando Web Worker:', error)
      onError?.(error as Error)
    }
  }, [workerPath, onMessage, onError, onReady])

  // Enviar mensaje al worker
  const postMessage = useCallback(<T = any>(
    type: string, 
    data?: any
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current || !isReady) {
        reject(new Error('Worker no está listo'))
        return
      }

      const messageId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Guardar callback para cuando llegue la respuesta
      messageQueueRef.current.set(messageId, (response: WorkerResponse) => {
        if (response.type === 'SUCCESS') {
          resolve(response.result)
        } else {
          reject(new Error(response.error || 'Error desconocido en worker'))
        }
      })
      
      // Enviar mensaje al worker
      workerRef.current.postMessage({
        id: messageId,
        type,
        data
      })
      
      setIsProcessing(true)
    })
  }, [isReady])

  // Operaciones específicas del worker
  const processBoxData = useCallback((boxes: any[]) => {
    return postMessage('PROCESS_BOX_DATA', { boxes })
  }, [postMessage])

  const calculateEfficiency = useCallback((box: any) => {
    return postMessage('CALCULATE_EFFICIENCY', { box })
  }, [postMessage])

  const optimizeRoutes = useCallback((boxes: any[]) => {
    return postMessage('OPTIMIZE_ROUTES', { boxes })
  }, [postMessage])

  // Terminar el worker
  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
      setIsReady(false)
      setIsProcessing(false)
      messageQueueRef.current.clear()
    }
  }, [])

  // Limpiar al desmontar
  useEffect(() => {
    initializeWorker()
    
    return () => {
      terminate()
    }
  }, [initializeWorker, terminate])

  return {
    isReady,
    isProcessing,
    postMessage,
    processBoxData,
    calculateEfficiency,
    optimizeRoutes,
    terminate
  }
}
