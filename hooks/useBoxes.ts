import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { BoxService, type SupabaseBox, type CreateBoxData, type UpdateBoxData, type UpdateBoxStatusData } from '@/lib/boxes'

export function useBoxes() {
  const [boxes, setBoxes] = useState<SupabaseBox[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial data
  const fetchBoxes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await BoxService.getAllBoxes()
      setBoxes(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch boxes'
      setError(errorMessage)
      console.error('Error fetching boxes:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a new box
  const createBox = useCallback(async (boxData: CreateBoxData): Promise<SupabaseBox> => {
    try {
      setError(null)
      const newBox = await BoxService.createBox(boxData)
      // The real-time subscription will automatically update the state
      return newBox
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create box'
      setError(errorMessage)
      throw err
    }
  }, [])

  // Update a box
  const updateBox = useCallback(async (id: string, updates: UpdateBoxData): Promise<SupabaseBox> => {
    try {
      setError(null)
      const updatedBox = await BoxService.updateBox(id, updates)
      // The real-time subscription will automatically update the state
      return updatedBox
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update box'
      setError(errorMessage)
      throw err
    }
  }, [])

  // Update box status (collaborative - any authenticated user can update)
  const updateBoxStatus = useCallback(async (id: string, statusData: UpdateBoxStatusData): Promise<SupabaseBox> => {
    try {
      setError(null)
      const updatedBox = await BoxService.updateBoxStatus(id, statusData)
      // The real-time subscription will automatically update the state
      return updatedBox
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update box status'
      setError(errorMessage)
      throw err
    }
  }, [])

  // Delete a box
  const deleteBox = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)
      await BoxService.deleteBox(id)
      // The real-time subscription will automatically update the state
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete box'
      setError(errorMessage)
      throw err
    }
  }, [])

  // Set up real-time subscription
  useEffect(() => {
    // Fetch initial data
    fetchBoxes()

    // Set up real-time subscription
    const channel = supabase
      .channel('recycling_boxes_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'recycling_boxes'
        },
        (payload) => {
          console.log('Real-time box update:', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              setBoxes(prev => [payload.new as RecyclingBox, ...prev])
              break
              
            case 'UPDATE':
              setBoxes(prev => 
                prev.map(box => 
                  box.id === payload.new.id 
                    ? payload.new as RecyclingBox 
                    : box
                )
              )
              break
              
            case 'DELETE':
              setBoxes(prev => 
                prev.filter(box => box.id !== payload.old.id)
              )
              break
          }
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchBoxes])

  return {
    boxes,
    loading,
    error,
    createBox,
    updateBox,
    updateBoxStatus,
    deleteBox,
    refetch: fetchBoxes
  }
}

// Hook for a single box with real-time updates
export function useBox(boxId: string) {
  const [box, setBox] = useState<SupabaseBox | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBox = useCallback(async () => {
    if (!boxId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await BoxService.getBoxById(boxId)
      setBox(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch box'
      setError(errorMessage)
      console.error('Error fetching box:', err)
    } finally {
      setLoading(false)
    }
  }, [boxId])

  useEffect(() => {
    fetchBox()

    // Set up real-time subscription for this specific box
    const channel = supabase
      .channel(`box_${boxId}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recycling_boxes',
          filter: `id=eq.${boxId}`
        },
        (payload) => {
          console.log('Real-time box update for box', boxId, ':', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
            case 'UPDATE':
              setBox(payload.new as RecyclingBox)
              break
              
            case 'DELETE':
              setBox(null)
              break
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boxId, fetchBox])

  return {
    box,
    loading,
    error,
    refetch: fetchBox
  }
}

// Hook for boxes filtered by status
export function useBoxesByStatus(status: 'all' | 'full' | 'available') {
  const { boxes, loading, error, createBox, updateBox, deleteBox, refetch } = useBoxes()
  
  const filteredBoxes = boxes.filter(box => {
    switch (status) {
      case 'full':
        return box.is_full
      case 'available':
        return !box.is_full
      case 'all':
      default:
        return true
    }
  })

  return {
    boxes: filteredBoxes,
    loading,
    error,
    createBox,
    updateBox,
    updateBoxStatus,
    deleteBox,
    refetch
  }
}
